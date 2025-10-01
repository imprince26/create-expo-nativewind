# Contributing to Create Expo NativeWind

First off, thank you for considering contributing to Create Expo NativeWind!

We welcome contributions from everyone, whether you're fixing bugs, adding features, improving documentation, or helping with translations.

## Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm**, **yarn**, or **pnpm**
- **Git**
- **TypeScript** knowledge

### Initial Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/yourusername/create-expo-nativewind.git
   cd create-expo-nativewind
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Link for local testing** (optional)

   ```bash
   npm link
   ```

## Development Workflow

### Running in Development

```bash
# Run with hot reload
npm run dev

# Test with specific options
npm run dev -- my-app --nativewind
npm run dev -- my-app --yarn
npm run dev -- my-app --git
```

### Building

```bash
# Build TypeScript to JavaScript
npm run build

# Test built version
node dist/index.js my-app --nativewind
```

### Local Testing

```bash
# Method 1: Using npm link
npm link
create-expo-nativewind test-app --nativewind

# Method 2: Direct execution
node dist/index.js test-app --nativewind

# Method 3: Using npx with local path
npx . test-app --nativewind
```

## Testing

### Manual Testing

Before submitting changes, test these scenarios:

```bash
# Basic functionality
npm run dev -- test-basic

# With NativeWind
npm run dev -- test-nativewind --nativewind

# Different package managers
npm run dev -- test-yarn --yarn --nativewind
npm run dev -- test-pnpm --pnpm --nativewind

# With Git initialization
npm run dev -- test-git --git --nativewind

# Help and version commands
npm run dev -- --help
npm run dev -- --version
```

### Testing Checklist

- [ ] CLI creates project successfully
- [ ] NativeWind setup works correctly
- [ ] Package manager detection works
- [ ] Git initialization works
- [ ] Error handling works properly
- [ ] Help and version commands work
- [ ] All file templates are created correctly

### Creating Test Projects

```bash
# Create temporary test directory
mkdir temp-tests
cd temp-tests

# Test different configurations
create-expo-nativewind app1 --nativewind
create-expo-nativewind app2 --yarn --nativewind --git
create-expo-nativewind app3 --pnpm

# Clean up
cd ..
rm -rf temp-tests
```

## Community Guidelines

- **Be respectful** and inclusive
- **Help others** when possible
- **Follow the code of conduct**
- **Ask questions** if unsure
- **Share knowledge** and experiences

## Getting Help

### Contact Maintainers

- **GitHub** - @imprince26

---

Thank you for contributing to Create Expo NativeWind! Your efforts help make React Native development better for everyone.

**Happy Coding!** 🎉