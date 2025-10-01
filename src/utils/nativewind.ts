import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { addDependencies, PackageManager } from './packageManager';

export async function setupNativeWind(
  projectPath: string,
  packageManager: PackageManager,
  shouldInstall: boolean
) {
  console.log(chalk.cyan('\n🎨 Setting up NativeWind...\n'));

  // Install NativeWind dependencies
  if (shouldInstall) {
    const spinner = ora('Installing NativeWind v4 dependencies...').start();
    try {
      await addDependencies(
        projectPath,
        packageManager,
        ['nativewind@^4.0.1', 'react-native-reanimated'],
        false
      );
      await addDependencies(
        projectPath,
        packageManager,
        ['tailwindcss@3.3.0'],
        true
      );
      spinner.succeed('NativeWind v4 dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install NativeWind dependencies');
      throw error;
    }
  }

  // Create tailwind.config.js
  const configSpinner = ora('Creating Tailwind configuration...').start();
  try {
    await createTailwindConfig(projectPath);
    configSpinner.succeed('Tailwind configuration created');
  } catch (error) {
    configSpinner.fail('Failed to create Tailwind configuration');
    throw error;
  }

  // Update babel.config.js
  const babelSpinner = ora('Updating Babel configuration...').start();
  try {
    await updateBabelConfig(projectPath);
    babelSpinner.succeed('Babel configuration updated');
  } catch (error) {
    babelSpinner.fail('Failed to update Babel configuration');
    throw error;
  }

  // Create global.css
  const cssSpinner = ora('Creating global styles...').start();
  try {
    await createGlobalCSS(projectPath);
    cssSpinner.succeed('Global styles created');
  } catch (error) {
    cssSpinner.fail('Failed to create global styles');
    throw error;
  }

  // Update App.tsx
  const appSpinner = ora('Updating App component...').start();
  try {
    await updateAppComponent(projectPath);
    appSpinner.succeed('App component updated');
  } catch (error) {
    appSpinner.fail('Failed to update App component');
    throw error;
  }

  // Update metro.config.js
  const metroSpinner = ora('Updating Metro configuration...').start();
  try {
    await updateMetroConfig(projectPath);
    metroSpinner.succeed('Metro configuration updated');
  } catch (error) {
    metroSpinner.fail('Failed to update Metro configuration');
    throw error;
  }
}

async function createTailwindConfig(projectPath: string) {
  const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./(tabs)/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

  await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), config);
}

async function updateBabelConfig(projectPath: string) {
  const babelConfigPath = path.join(projectPath, 'babel.config.js');
  
  const config = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin"
    ],
  };
};
`;

  await fs.writeFile(babelConfigPath, config);
}

async function createGlobalCSS(projectPath: string) {
  const css = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

  await fs.writeFile(path.join(projectPath, 'global.css'), css);
}

async function updateAppComponent(projectPath: string) {
  // Check if it's the new app router structure or traditional App.tsx
  const appFolderPath = path.join(projectPath, 'app');
  const appTsxPath = path.join(projectPath, 'App.tsx');
  
  if (await fs.pathExists(appFolderPath)) {
    // New app router structure - update app/(tabs)/index.tsx or app/index.tsx
    const indexPath = path.join(appFolderPath, 'index.tsx');
    const tabsIndexPath = path.join(appFolderPath, '(tabs)', 'index.tsx');
    
    let targetPath = indexPath;
    if (await fs.pathExists(tabsIndexPath)) {
      targetPath = tabsIndexPath;
    }
    
    const appContent = `import "../../global.css";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-purple-600">
        Welcome to Expo + NativeWind! 🎨
      </Text>
      <Text className="mt-4 text-lg text-gray-600">
        Start building your app with TailwindCSS
      </Text>
    </View>
  );
}
`;
    await fs.writeFile(targetPath, appContent);
  } else {
    // Traditional App.tsx structure
    const appTsx = `import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-purple-600">
        Welcome to Expo + NativeWind! 🎨
      </Text>
      <Text className="mt-4 text-lg text-gray-600">
        Start building your app with TailwindCSS
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
`;
    await fs.writeFile(appTsxPath, appTsx);
  }
}

async function updateMetroConfig(projectPath: string) {
  const metroConfigPath = path.join(projectPath, 'metro.config.js');
  
  const config = `const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
`;

  await fs.writeFile(metroConfigPath, config);
}
