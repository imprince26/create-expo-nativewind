import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import validateNpmPackageName from 'validate-npm-package-name';
import { detectPackageManager, installDependencies } from '../utils/packageManager';
import { runCommand } from '../utils/command';
import { setupNativeWind } from '../utils/nativewind';
import { createGitRepository } from '../utils/git';
import { displaySuccess } from '../utils/messages';

interface CreateOptions {
  nativewind?: boolean;
  template?: string;
  npm?: boolean;
  yarn?: boolean;
  pnpm?: boolean;
  install?: boolean;
  git?: boolean;
}

export async function createExpoApp(projectName: string | undefined, options: CreateOptions) {
  console.log(chalk.cyan('\n🚀 Create Expo NativeWind App\n'));

  // Get project name
  let name = projectName;
  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-expo-app',
        validate: (input: string) => {
          const validation = validateNpmPackageName(input);
          if (!validation.validForNewPackages) {
            return validation.errors?.[0] || 'Invalid project name';
          }
          return true;
        },
      },
    ]);
    name = answers.projectName;
  }

  // Ensure name is defined
  if (!name) {
    throw new Error('Project name is required');
  }

  const projectPath = path.resolve(process.cwd(), name);

  // Check if directory already exists
  if (await fs.pathExists(projectPath)) {
    console.error(chalk.red(`\n✖ Directory "${name}" already exists!`));
    process.exit(1);
  }

  // Ask about Expo installation if user wants instructions
  const expoInstructions = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'showInstructions',
      message: 'Would you like to see Expo installation instructions?',
      default: false,
    },
  ]);

  if (expoInstructions.showInstructions) {
    console.log(chalk.cyan('\n📱 Expo Installation Instructions:\n'));
    console.log(chalk.yellow('1. Install Expo CLI globally:'));
    console.log(chalk.gray('   npm install -g @expo/cli\n'));
    console.log(chalk.yellow('2. Install Expo Go app on your device:'));
    console.log(chalk.gray('   - iOS: Download from App Store'));
    console.log(chalk.gray('   - Android: Download from Google Play Store\n'));
    console.log(chalk.yellow('3. After project creation, run:'));
    console.log(chalk.gray(`   cd ${name}`));
    console.log(chalk.gray('   npm start\n'));
    console.log(chalk.cyan('Press any key to continue...'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);
  }

  // Ask about NativeWind if not specified
  let useNativeWind = options.nativewind || false;
  if (!options.nativewind) {
    const nativewindAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useNativeWind',
        message: 'Would you like to setup NativeWind (TailwindCSS for React Native)?',
        default: true,
      },
    ]);
    useNativeWind = nativewindAnswer.useNativeWind;
  }

  // Detect package manager
  const packageManager = detectPackageManager(options);

  // Select template if NativeWind is not used
  let template = options.template || 'blank';
  if (!useNativeWind && !options.template) {
    const templateAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Choose an Expo template:',
        choices: [
          { name: 'Blank - A minimal app', value: 'blank' },
          { name: 'Blank (TypeScript) - Blank app with TypeScript enabled', value: 'blank-typescript' },
          { name: 'Tabs - Several example screens and tabs', value: 'tabs' },
          { name: 'Navigation - Includes basic navigation setup', value: 'navigation' },
        ],
        default: 'blank-typescript',
      },
    ]);
    template = templateAnswer.template;
  }

  console.log(chalk.gray('\nConfiguration:'));
  console.log(chalk.gray(`  Project name: ${name}`));
  console.log(chalk.gray(`  Package manager: ${packageManager}`));
  console.log(chalk.gray(`  Template: ${useNativeWind ? 'Default Expo (with NativeWind)' : template}`));
  console.log(chalk.gray(`  NativeWind: ${useNativeWind ? 'Yes' : 'No'}\n`));

  // Create Expo app
  const spinner = ora('Creating Expo app...').start();
  try {
    if (useNativeWind) {
      // For NativeWind setup, use default Expo installation (no template specified)
      await runCommand(
        'npx',
        ['create-expo-app@latest', name, '--no-install'],
        process.cwd()
      );
    } else {
      // For non-NativeWind setup, use specified template
      await runCommand(
        'npx',
        ['create-expo-app@latest', name, '--template', template, '--no-install'],
        process.cwd()
      );
    }
    spinner.succeed('Expo app created successfully');
  } catch (error) {
    spinner.fail('Failed to create Expo app');
    throw error;
  }

  // Install dependencies
  if (options.install !== false) {
    const installSpinner = ora('Installing dependencies...').start();
    try {
      await installDependencies(projectPath, packageManager);
      installSpinner.succeed('Dependencies installed successfully');
    } catch (error) {
      installSpinner.fail('Failed to install dependencies');
      throw error;
    }
  }

  // Setup NativeWind
  if (useNativeWind) {
    await setupNativeWind(projectPath, packageManager, options.install !== false);
  }

  // Initialize git repository
  if (options.git !== false) {
    const gitSpinner = ora('Initializing git repository...').start();
    try {
      await createGitRepository(projectPath);
      gitSpinner.succeed('Git repository initialized');
    } catch (error) {
      gitSpinner.warn('Could not initialize git repository');
    }
  }

  // Display success message
  displaySuccess(name, packageManager, useNativeWind);
}
