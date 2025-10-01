# Create Expo NativeWind

A CLI tool to create Expo apps with optional NativeWind (TailwindCSS) setup. Get started with a production-ready Expo + NativeWind app in seconds!

## Features

- **Optional NativeWind Setup** - Instantly set up TailwindCSS for React Native 
- **Multiple Package Managers** - Support for npm, yarn, and pnpm
- **Interactive CLI** - Beautiful, user-friendly prompts
- **Fast & Reliable** - Optimized setup process
- **Fully Configured** - Everything you need to start coding immediately
- **TypeScript Ready** - Full TypeScript support out of the box

## Quick Start

### Create a new app with NativeWind

```bash
npx create-expo-nativewind my-app --nativewind
```

### Create a new app with interactive prompts

```bash
npx create-expo-nativewind my-app
```

### Create a new app without NativeWind

```bash
npx create-expo-nativewind my-app
```

## Usage

```bash
npx create-expo-nativewind [project-name] [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--nativewind` | Setup project with NativeWind (TailwindCSS) |
| `--template <template>` | Expo template to use (default: "blank") |
| `--npm` | Use npm as package manager |
| `--yarn` | Use yarn as package manager |
| `--pnpm` | Use pnpm as package manager |
| `--no-install` | Skip installing dependencies |
| `--no-git` | Skip git initialization |
| `-v, --version` | Output the current version |
| `-h, --help` | Display help for command |

### Examples

Create app with NativeWind using yarn:

```bash
npx create-expo-nativewind my-app --nativewind --yarn
```

Create app with specific template:

```bash
npx create-expo-nativewind my-app --template tabs
```

Create app without installing dependencies:

```bash
npx create-expo-nativewind my-app --no-install
```

## What's Included with NativeWind?

When you use the `--nativewind` flag, your project will be configured with:

- **Expo Default Template** - Starts with full Expo default template (app router structure)
- **Installation Instructions** - Optional prompt showing Expo setup instructions
- **NativeWind v4** - Latest version of NativeWind with modern architecture
- **TailwindCSS 3.3.0** - Full Tailwind configuration optimized for React Native
- **Pre-configured Metro** - Metro bundler setup for NativeWind v4
- **Babel Config** - Babel plugins configured for optimal performance
- **Global Styles** - Ready-to-use global CSS file
- **Updated Components** - Home screen updated with NativeWind examples

### Using Tailwind Classes

After setup, you can use Tailwind classes directly in your components:

```tsx
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <Text className="text-white text-2xl font-bold">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

## Development

After creating your app:

```bash
cd my-app
npm start
```

Then:

- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [NativeWind Documentation](https://www.nativewind.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Native Documentation](https://reactnative.dev)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [Expo](https://expo.dev) - Amazing React Native framework
- [NativeWind](https://www.nativewind.dev) - TailwindCSS for React Native
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework

---

Made with ❤️ for the React Native community
