# Changelog

## [1.2.3] - 2026-02-02

### Fixed

- **Package Manager Commands**: Fixed hardcoded "npx" to use correct package manager runner (npx for npm, pnpx for pnpm, yarn dlx for yarn, bunx for bun) when creating Expo projects

### Changed

- **Dependency Installation**: Removed interactive dependency installation prompt. Now automatically installs dependencies unless `--no-install` flag is explicitly passed

## [1.1.0] - 2025-10-01

### Added

- **Current Directory Installation**: Support for using `.` as project name to install Expo in the current directory
  - When using `.`, the tool checks if the directory is empty or has existing files
  - Prompts for confirmation before proceeding with non-empty directories
  - Example: `npx create-expo-nativewind . --nativewind`

- **Automatic Reset Project Script**: After Expo installation, the tool automatically runs `npm run reset-project` if available
  - Detects if the script exists in the generated `package.json`
  - Executes the script from the project root directory
  - Respects the selected package manager (npm, yarn, or pnpm)
  - Provides clear feedback if the script is not found or fails

- **Global CSS Creation**: Creates `global.css` in the `app` folder after running reset-project script
  - Ensures proper timing: Expo install → Reset project → Create global.css → Setup NativeWind
  - Global CSS includes Tailwind directives for base, components, and utilities

### Changed

- Improved project path handling to support both named directories and current directory
- Enhanced console output to show the installation location clearly
- Updated README with new features and usage examples

### Fixed

- Project name validation now correctly allows `.` as a valid input
- Display name now shows the actual directory name when using `.`

## [1.0.2] - Previous Release

Initial stable release with core functionality.
