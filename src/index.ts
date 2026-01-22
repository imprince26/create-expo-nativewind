#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createExpoApp } from './commands/create';
import { displayBanner } from './utils/banner';

const packageJson = require('../package.json');

const program = new Command();

// Setup graceful termination handler for Ctrl+C
let isTerminating = false;
process.on('SIGINT', () => {
  if (isTerminating) {
    return;
  }
  isTerminating = true;
  
  console.log(chalk.yellow('\n\n  ⚠ Installation interrupted by user'));
  console.log(chalk.dim('  Cleaning up and exiting...\n'));
  
  process.exit(130);
});

process.on('SIGTERM', () => {
  if (isTerminating) {
    return;
  }
  isTerminating = true;
  
  console.log(chalk.yellow('\n\n  ⚠ Installation terminated'));
  console.log(chalk.dim('  Exiting...\n'));
  
  process.exit(143);
});

// Display banner
displayBanner();

program
  .name('create-expo-nativewind')
  .description('Create a new Expo app with optional NativeWind setup')
  .version(packageJson.version, '-v, --version', 'Output the current version')
  .argument('[project-name]', 'Name of the project')
  .option('--nativewind', 'Setup project with NativeWind (TailwindCSS)')
  .option('--template <template>', 'Expo template to use', 'blank')
  .option('--npm', 'Use npm as package manager')
  .option('--yarn', 'Use yarn as package manager')
  .option('--pnpm', 'Use pnpm as package manager')
  .option('--bun', 'Use bun as package manager')
  .option('--no-install', 'Skip installing dependencies')
  .option('--no-git', 'Skip git initialization')
  .action(async (projectName: string | undefined, options: any) => {
    try {
      await createExpoApp(projectName, options);
    } catch (error) {
      if (!isTerminating) {
        console.error(
          chalk.red('\n✖ Error:'),
          error instanceof Error ? error.message : error,
        );
        process.exit(1);
      }
    }
  });

program.parse(process.argv);
