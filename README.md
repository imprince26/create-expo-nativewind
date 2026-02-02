# create-expo-nativewind

A powerful CLI tool to quickly scaffold Expo applications with optional NativeWind (TailwindCSS for React Native) integration. Get a production-ready setup in seconds with intelligent prompts and automatic configuration.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Command Line Options](#command-line-options)
- [Interactive Mode](#interactive-mode)
- [Package Manager Support](#package-manager-support)
- [What Gets Configured](#what-gets-configured)
- [Project Structure](#project-structure)
- [NativeWind Integration](#nativewind-integration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Interactive CLI Experience** - Beautiful prompts guide you through project setup
- **NativeWind v4 Support** - Optional TailwindCSS integration with modern architecture
- **Flexible Installation** - Create new projects or install in current directory
- **Multiple Package Managers** - Automatic detection and support for npm, yarn, pnpm, and bun
- **Smart Dependency Management** - Automatic dependency installation with `--no-install` override
- **Template Selection** - Pick from multiple Expo templates when not using NativeWind
- **Auto-Configuration** - Babel, Metro, TypeScript, and Tailwind configs set up automatically
- **Git Integration** - Automatic repository initialization with sensible defaults
- **Graceful Interruption** - Clean handling of Ctrl+C during installation
- **Current Directory Support** - Install directly into existing folders
- **TypeScript Ready** - Full TypeScript support out of the box
- **Cross-Platform** - Works on Windows, macOS, and Linux

## Prerequisites

- **Node.js** >= 18.0.0
- **Package Manager**: npm, yarn, pnpm, or bun

## Quick Start

Create a new Expo app with NativeWind in seconds:

```bash
npx create-expo-nativewind my-app
```

This will launch an interactive setup where you can choose:
- Expo version
- Whether to include NativeWind
- Automatic or manual dependency installation
- Template selection (if not using NativeWind)

## Installation

No installation required! Use `npx` to run the latest version:

```bash
npx create-expo-nativewind [project-name]
```

Or with your preferred package manager:

```bash
# Using yarn
yarn create expo-nativewind my-app

# Using pnpm
pnpm create expo-nativewind my-app

# Using bun
bunx create-expo-nativewind my-app
```

## Usage

### Basic Syntax

```bash
npx create-expo-nativewind [project-name] [options]
```

### Create New Project

```bash
npx create-expo-nativewind my-app
```

### Install in Current Directory

Use `.` as the project name to install in the current directory:

```bash
npx create-expo-nativewind .
```

### Non-Interactive Mode

Skip prompts by providing all options via flags:

```bash
npx create-expo-nativewind my-app --nativewind --npm
```

## Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--nativewind` | Set up project with NativeWind (TailwindCSS) | Prompted |
| `--template <name>` | Specify Expo template (blank, tabs, etc.) | `blank` |
| `--npm` | Use npm as package manager | Auto-detected |
| `--yarn` | Use yarn as package manager | Auto-detected |
| `--pnpm` | Use pnpm as package manager | Auto-detected |
| `--bun` | Use bun as package manager | Auto-detected |
| `--no-install` | Skip dependency installation | Prompted |
| `--no-git` | Skip Git repository initialization | Enabled |
| `-v, --version` | Display CLI version | - |
| `-h, --help` | Show help information | - |

### Available Templates

When **not** using NativeWind, you can choose from these Expo templates:

- `blank` - A minimal app with a single screen
- `blank-typescript` - Minimal app with TypeScript configured
- `tabs` - Several example screens with tab navigation
- `navigation` - Basic navigation setup included

## Interactive Mode

When you run the CLI without all required options, it enters interactive mode with intelligent prompts:

### Question Flow

1. **Project Name** (if not provided)
   - Validates against npm package naming rules
   - Supports `.` for current directory

2. **Expo Version**
   - Choose any version or use `latest`
   - Default: `latest`

3. **NativeWind Setup**
   - Would you like to set up NativeWind?
   - Default: `Yes`

4. **Template Selection** (only if not using NativeWind)
   - Pick from available Expo templates
   - Default: `blank-typescript`

## Package Manager Support

The CLI automatically detects your package manager from:

1. **Command invocation** - `npx`, `yarn create`, `pnpm create`, `bunx`
2. **Environment variables** - `npm_config_user_agent`
3. **Explicit flags** - `--npm`, `--yarn`, `--pnpm`, `--bun`

### Package Manager Differences

| Manager | Install Command | Run Scripts |
|---------|----------------|-------------|
| npm | `npm install` | `npm run start` |
| yarn | `yarn install` | `yarn start` |
| pnpm | `pnpm install` | `pnpm start` |
| bun | `bun install` | `bun run start` |

## What Gets Configured

### Base Expo Project

All projects include:
- Expo SDK with React Native
- Metro bundler configuration
- TypeScript support
- ESLint configuration
- Git repository (unless `--no-git`)
- Platform-specific configurations (iOS, Android, Web)

### With NativeWind (`--nativewind`)

Additional setup includes:

#### Dependencies Installed
- `nativewind@^4.0.1` - TailwindCSS for React Native
- `tailwindcss@^3.4.17` - Core TailwindCSS framework
- `react-native-reanimated@~3.17.4` - Animation library
- `react-native-safe-area-context@5.4.0` - Safe area handling
- `prettier-plugin-tailwindcss@^0.5.11` - Code formatting

#### Files Created/Modified

1. **`tailwind.config.js`**
   ```js
   module.exports = {
     content: [
       "./App.{js,jsx,ts,tsx}",
       "./app/**/*.{js,jsx,ts,tsx}",
       "./components/**/*.{js,jsx,ts,tsx}",
     ],
     presets: [require("nativewind/preset")],
     theme: { extend: {} },
     plugins: [],
   };
   ```

2. **`babel.config.js`**
   ```js
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: [
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
       ],
     };
   };
   ```

3. **`metro.config.js`**
   ```js
   const { getDefaultConfig } = require("expo/metro-config");
   const { withNativeWind } = require('nativewind/metro');
   
   const config = getDefaultConfig(__dirname);
   module.exports = withNativeWind(config, { input: './app/global.css' });
   ```

4. **`app/global.css`**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **`nativewind-env.d.ts`**
   ```ts
   /// <reference types="nativewind/types" />
   ```

6. **`app.json`**
   - Adds `"bundler": "metro"` to web configuration

## Project Structure

### Standard Expo Project

```
my-app/
├── app/
│   ├── (tabs)/           # Tab navigation (if using tabs template)
│   ├── _layout.tsx       # Root layout
│   └── index.tsx         # Home screen
├── assets/               # Images, fonts, etc.
├── node_modules/
├── .gitignore
├── app.json              # Expo configuration
├── babel.config.js
├── metro.config.js
├── package.json
├── tsconfig.json
└── README.md
```

### With NativeWind

```
my-app/
├── app/
│   ├── global.css        # Tailwind styles
│   ├── _layout.tsx
│   └── index.tsx         # Updated with NativeWind examples
├── assets/
├── node_modules/
├── .gitignore
├── app.json
├── babel.config.js       # NativeWind configured
├── metro.config.js       # NativeWind configured
├── nativewind-env.d.ts   # TypeScript declarations
├── package.json
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json
└── README.md
```

## NativeWind Integration

### Using Tailwind Classes

After setup, use Tailwind classes directly in your React Native components:

```tsx
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-purple-600">
        Welcome to Expo + NativeWind!
      </Text>
      <Text className="mt-4 text-lg text-gray-600">
        Start building your app with TailwindCSS
      </Text>
    </View>
  );
}
```

### Importing Global Styles

The global CSS file is automatically imported in your root component:

```tsx
import "./global.css";  // Imports Tailwind styles
```

### Responsive Design

NativeWind supports responsive modifiers:

```tsx
<View className="w-full md:w-1/2 lg:w-1/3">
  <Text className="text-sm md:text-base lg:text-lg">
    Responsive text
  </Text>
</View>
```

### Custom Theme

Extend the theme in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

## Examples

### Create App with All Options

```bash
npx create-expo-nativewind my-app --nativewind --yarn --no-git
```

### Install in Current Directory with NativeWind

```bash
npx create-expo-nativewind . --nativewind
```

### Create Without Installing Dependencies

```bash
npx create-expo-nativewind my-app --no-install
cd my-app
npm install  # Install later manually
```

### Use Specific Expo Template

```bash
npx create-expo-nativewind my-app --template tabs --pnpm
```

### Create with Bun

```bash
bunx create-expo-nativewind my-app --nativewind --bun
```

## Development Workflow

After creating your app:

```bash
# Navigate to project directory
cd my-app

# Start the development server
npm start
```

Then press:
- **`a`** - Open on Android emulator/device
- **`i`** - Open on iOS simulator
- **`w`** - Open in web browser
- **`r`** - Reload the app
- **`m`** - Toggle menu

### Running on Specific Platforms

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Troubleshooting

### Dependencies Not Installing

If automatic installation fails, install manually:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### NativeWind Styles Not Working

1. Make sure `global.css` is imported in your root component
2. Verify `metro.config.js` includes NativeWind configuration
3. Clear Metro cache: `npx expo start -c`
4. Restart the development server

### TypeScript Errors

1. Ensure `nativewind-env.d.ts` exists in project root
2. Restart TypeScript server in your editor
3. Run `npx tsc --noEmit` to check for errors

### Package Manager Issues

If the wrong package manager is detected, specify explicitly:

```bash
npx create-expo-nativewind my-app --npm
# or --yarn, --pnpm, --bun
```

### Current Directory Not Empty

The CLI will warn if installing in non-empty directory. Confirm to proceed or choose different location.

## Resources

- [Expo Documentation](https://docs.expo.dev) - Learn about Expo
- [NativeWind Documentation](https://www.nativewind.dev) - NativeWind guides and API
- [TailwindCSS Documentation](https://tailwindcss.com) - Tailwind utility classes
- [React Native Documentation](https://reactnative.dev) - React Native fundamentals
  
<!-- 
## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history and updates. -->

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Prince Patel**
- GitHub: [@imprince26](https://github.com/imprince26)

## Support

If you encounter issues or have questions:

- Open an issue on [GitHub](https://github.com/imprince26/create-expo-nativewind/issues)
- Check existing issues for solutions
- Review the [troubleshooting section](#troubleshooting)

---

Made for the React Native community
