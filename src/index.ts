#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createExpoApp } from './commands/create';
import { displayBanner } from './utils/banner';

const packageJson = require('../package.json');

const program = new Command();

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
  .option('--no-install', 'Skip installing dependencies')
  .option('--no-git', 'Skip git initialization')
  .action(async (projectName: string | undefined, options: any) => {
    try {
      await createExpoApp(projectName, options);
    } catch (error) {
      console.error(
        chalk.red('\n✖ Error:'),
        error instanceof Error ? error.message : error,
      );
      process.exit(1);
    }
  });

program.parse(process.argv);
