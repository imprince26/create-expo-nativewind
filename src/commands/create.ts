import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import validateNpmPackageName from "validate-npm-package-name";
import { detectPackageManager } from "../utils/packageManager";
import { runCommand, runCommandWithInput } from "../utils/command";
import { setupNativeWind } from "../utils/nativewind";
import { createGitRepository } from "../utils/git";
import { displaySuccess } from "../utils/messages";

// Helper function to create initial global.css
async function createInitialGlobalCSS(projectPath: string) {
  const css = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

  // Ensure app directory exists
  const appDir = path.join(projectPath, "app");
  await fs.ensureDir(appDir);

  await fs.writeFile(path.join(appDir, "global.css"), css);
}

interface CreateOptions {
  nativewind?: boolean;
  template?: string;
  npm?: boolean;
  yarn?: boolean;
  pnpm?: boolean;
  install?: boolean;
  git?: boolean;
}

export async function createExpoApp(
  projectName: string | undefined,
  options: CreateOptions
) {
  console.log(chalk.cyan("\n🚀 Create Expo NativeWind App\n"));

  // Get project name
  let name = projectName;
  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "What is your project name?",
        default: "my-expo-app",
        validate: (input: string) => {
          // Allow '.' for current directory
          if (input === ".") {
            return true;
          }
          const validation = validateNpmPackageName(input);
          if (!validation.validForNewPackages) {
            return validation.errors?.[0] || "Invalid project name";
          }
          return true;
        },
      },
    ]);
    name = answers.projectName;
  }

  // Ensure name is defined
  if (!name) {
    throw new Error("Project name is required");
  }

  // Handle '.' for current directory
  const isCurrentDir = name === ".";
  const projectPath = isCurrentDir
    ? process.cwd()
    : path.resolve(process.cwd(), name);
  const displayName = isCurrentDir ? path.basename(projectPath) : name;

  // Check if directory already exists (only for non-current directory)
  if (!isCurrentDir && (await fs.pathExists(projectPath))) {
    console.error(chalk.red(`\n✖ Directory "${name}" already exists!`));
    process.exit(1);
  }

  // For current directory, check if it's empty or has package.json
  if (isCurrentDir) {
    const files = await fs.readdir(projectPath);
    const hasPackageJson = files.includes("package.json");
    if (
      hasPackageJson ||
      (files.length > 0 && !files.every((f) => f.startsWith(".")))
    ) {
      const confirm = await inquirer.prompt([
        {
          type: "confirm",
          name: "continue",
          message: "Current directory is not empty. Continue anyway?",
          default: false,
        },
      ]);
      if (!confirm.continue) {
        console.log(chalk.yellow("\nOperation cancelled."));
        process.exit(0);
      }
    }
  }

  // Ask for Expo version
  const expoVersionAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "expoVersion",
      message: "Which version of Expo would you like to use?",
      default: "latest",
      validate: (input: string) => {
        if (!input.trim()) {
          return "Please enter a valid version";
        }
        return true;
      },
    },
  ]);

  const expoVersion = expoVersionAnswer.expoVersion;

  // Ask about NativeWind if not specified
  let useNativeWind = options.nativewind || false;
  if (!options.nativewind) {
    const nativewindAnswer = await inquirer.prompt([
      {
        type: "confirm",
        name: "useNativeWind",
        message:
          "Would you like to setup NativeWind (TailwindCSS for React Native)?",
        default: true,
      },
    ]);
    useNativeWind = nativewindAnswer.useNativeWind;
  }

  // Detect package manager
  const packageManager = detectPackageManager(options);

  // Select template if NativeWind is not used
  let template = options.template || "blank";
  if (!useNativeWind && !options.template) {
    const templateAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "Choose an Expo template:",
        choices: [
          { name: "Blank - A minimal app", value: "blank" },
          {
            name: "Blank (TypeScript) - Blank app with TypeScript enabled",
            value: "blank-typescript",
          },
          { name: "Tabs - Several example screens and tabs", value: "tabs" },
          {
            name: "Navigation - Includes basic navigation setup",
            value: "navigation",
          },
        ],
        default: "blank-typescript",
      },
    ]);
    template = templateAnswer.template;
  }

  console.log(chalk.gray("\nConfiguration:"));
  console.log(chalk.gray(`  Project name: ${displayName}`));
  console.log(
    chalk.gray(
      `  Location: ${isCurrentDir ? "Current directory" : projectPath}`
    )
  );
  console.log(chalk.gray(`  Package manager: ${packageManager}`));
  console.log(
    chalk.gray(
      `  Template: ${useNativeWind ? "Default Expo (with NativeWind)" : template}`
    )
  );
  console.log(chalk.gray(`  NativeWind: ${useNativeWind ? "Yes" : "No"}\n`));

  // Create Expo app
  const spinner = ora("Creating Expo app...").start();
  try {
    const expoPackage =
      expoVersion === "latest"
        ? "create-expo-app@latest"
        : `create-expo-app@${expoVersion}`;

    if (useNativeWind) {
      // For NativeWind setup, use default Expo installation (no template specified)
      await runCommand("npx", [expoPackage, name], process.cwd());
    } else {
      // For non-NativeWind setup, use specified template
      await runCommand(
        "npx",
        [expoPackage, name, "--template", template],
        process.cwd()
      );
    }
    spinner.succeed("Expo app created successfully");
  } catch (error) {
    spinner.fail("Failed to create Expo app");
    throw error;
  }

  // Run reset-project script
  const resetSpinner = ora("Running reset-project script...").start();
  try {
    // Check if reset-project script exists in package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    if (await fs.pathExists(packageJsonPath)) {
      const packageJsonContent = await fs.readJson(packageJsonPath);
      if (
        packageJsonContent.scripts &&
        packageJsonContent.scripts["reset-project"]
      ) {
        // Run the reset-project script from the project root
        // Provide 'n' as input to automatically delete old files instead of moving them
        await runCommandWithInput(
          packageManager === "npm"
            ? "npm"
            : packageManager === "yarn"
              ? "yarn"
              : "pnpm",
          packageManager === "npm"
            ? ["run", "reset-project"]
            : packageManager === "yarn"
              ? ["reset-project"]
              : ["reset-project"],
          projectPath,
          "n\n"
        );
        resetSpinner.succeed("Reset project script executed successfully");
      } else {
        resetSpinner.info("No reset-project script found, skipping...");
      }
    } else {
      resetSpinner.info("Package.json not found, skipping reset-project...");
    }
  } catch (error) {
    resetSpinner.warn("Could not run reset-project script");
    console.log(
      chalk.yellow("  You may need to run it manually: npm run reset-project")
    );
  }

  // Create global.css in app folder for NativeWind (after reset-project)
  if (useNativeWind) {
    const cssSpinner = ora("Creating global.css in app folder...").start();
    try {
      await createInitialGlobalCSS(projectPath);
      cssSpinner.succeed("Global CSS file created");
    } catch (error) {
      cssSpinner.fail("Failed to create global.css");
      throw error;
    }
  }

  // Setup NativeWind
  if (useNativeWind) {
    await setupNativeWind(projectPath, packageManager);
  }

  // Initialize git repository
  if (options.git !== false) {
    const gitSpinner = ora("Initializing git repository...").start();
    try {
      await createGitRepository(projectPath);
      gitSpinner.succeed("Git repository initialized");
    } catch (error) {
      gitSpinner.warn("Could not initialize git repository");
    }
  }

  // Display success message
  displaySuccess(isCurrentDir ? "." : name, packageManager, useNativeWind);
}
