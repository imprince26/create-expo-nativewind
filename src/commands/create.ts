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
  console.log(chalk.bold.hex("#4F46E5")("\nLet's create your Expo app\n"));

  // Get project name
  let name = projectName;
  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: chalk.bold("What is your project name?"),
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
    console.error(
      chalk.red.bold("\n  Error: ") +
        chalk.red(`Directory "${name}" already exists!`)
    );
    console.log(
      chalk.dim("\n  Please choose a different name or remove the existing directory.\n")
    );
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
          message: chalk.bold(
            "Current directory is not empty. Continue anyway?"
          ),
          default: false,
        },
      ]);
      if (!confirm.continue) {
        console.log(chalk.yellow("\n  Operation cancelled by user.\n"));
        process.exit(0);
      }
    }
  }

  // Ask for Expo version
  const expoVersionAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "expoVersion",
      message: chalk.bold("Which version of Expo would you like to use?"),
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
        message: chalk.bold(
          "Would you like to setup NativeWind (TailwindCSS for React Native)?"
        ),
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
        message: chalk.bold("Choose an Expo template:"),
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

  console.log("");
  console.log(chalk.dim("  Configuration"));
  console.log(chalk.dim("  ────────────────────────────────────────"));
  console.log(chalk.dim(`  Project:         ${displayName}`));
  console.log(
    chalk.dim(
      `  Location:        ${isCurrentDir ? "Current directory" : projectPath}`
    )
  );
  console.log(chalk.dim(`  Package Manager: ${packageManager}`));
  console.log(
    chalk.dim(
      `  Template:        ${useNativeWind ? "Default Expo (with NativeWind)" : template}`
    )
  );
  console.log(
    chalk.dim(`  NativeWind:      ${useNativeWind ? "Yes" : "No"}`)
  );
  console.log(chalk.dim("  ────────────────────────────────────────"));
  console.log("");

  // Create Expo app
  const spinner = ora({
    text: chalk.bold("Creating Expo project..."),
    color: "blue",
  }).start();
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
    spinner.succeed(chalk.green("Expo project created successfully"));
  } catch (error) {
    spinner.fail(chalk.red("Failed to create Expo project"));
    throw error;
  }

  // Run reset-project script
  const resetSpinner = ora({
    text: chalk.bold("Cleaning up project template..."),
    color: "blue",
  }).start();
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
              : packageManager === "bun"
                ? "bun"
                : "pnpm",
          packageManager === "npm"
            ? ["run", "reset-project"]
            : packageManager === "yarn"
              ? ["reset-project"]
              : packageManager === "bun"
                ? ["run", "reset-project"]
                : ["reset-project"],
          projectPath,
          "n\n"
        );
        resetSpinner.succeed(chalk.green("Project template cleaned up"));
      } else {
        resetSpinner.info(
          chalk.dim("No cleanup script found, continuing...")
        );
      }
    } else {
      resetSpinner.info(chalk.dim("No package.json found, skipping cleanup"));
    }
  } catch (error) {
    resetSpinner.warn(chalk.yellow("Could not run cleanup script"));
    console.log(
      chalk.dim("  You may need to run it manually: npm run reset-project")
    );
  }

  // Create global.css in app folder for NativeWind (after reset-project)
  if (useNativeWind) {
    const cssSpinner = ora({
      text: chalk.bold("Setting up global styles..."),
      color: "blue",
    }).start();
    try {
      await createInitialGlobalCSS(projectPath);
      cssSpinner.succeed(chalk.green("Global styles configured"));
    } catch (error) {
      cssSpinner.fail(chalk.red("Failed to create global styles"));
      throw error;
    }
  }

  // Setup NativeWind
  if (useNativeWind) {
    await setupNativeWind(projectPath, packageManager);
  }

  // Initialize git repository
  if (options.git !== false) {
    const gitSpinner = ora({
      text: chalk.bold("Initializing git repository..."),
      color: "blue",
    }).start();
    try {
      await createGitRepository(projectPath);
      gitSpinner.succeed(chalk.green("Git repository initialized"));
    } catch (error) {
      gitSpinner.warn(chalk.yellow("Could not initialize git repository"));
    }
  }

  // Display success message
  displaySuccess(isCurrentDir ? "." : name, packageManager, useNativeWind);
}
