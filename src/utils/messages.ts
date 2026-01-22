import chalk from "chalk";
import { PackageManager } from "./packageManager";

export function displaySuccess(
  projectName: string,
  packageManager: PackageManager,
  withNativeWind: boolean
) {
  const commands: Record<PackageManager, string> = {
    npm: "npm start",
    yarn: "yarn start",
    pnpm: "pnpm start",
    bun: "bun start",
  };

  console.log("");
  console.log(chalk.bold.green("Success! Your Expo app is ready"));
  console.log("");

  console.log(chalk.bold("Get Started"));
  console.log(chalk.dim("────────────────────────────────────────"));
  if (projectName !== ".") {
    console.log(chalk.white(`  cd ${projectName}`));
  }
  console.log(chalk.white(`  ${commands[packageManager]}`));
  console.log("");

  if (withNativeWind) {
    console.log(chalk.bold.hex("#38BDF8")("NativeWind Ready"));
    console.log(chalk.dim("────────────────────────────────────────"));
    console.log(chalk.dim("  Use Tailwind classes in your components:"));
    console.log("");
    console.log(chalk.dim('  <View className="flex-1 bg-blue-500">'));
    console.log(
      chalk.dim('    <Text className="text-white text-xl">Hello!</Text>')
    );
    console.log(chalk.dim("  </View>"));
    console.log("");
  }

  console.log(chalk.bold("Documentation"));
  console.log(chalk.dim("────────────────────────────────────────"));
  console.log(
    chalk.dim(`  Expo:       ${chalk.underline("https://docs.expo.dev")}`)
  );

  if (withNativeWind) {
    console.log(
      chalk.dim(
        `  NativeWind: ${chalk.underline("https://www.nativewind.dev")}`
      )
    );
    console.log(
      chalk.dim(
        `  Tailwind:   ${chalk.underline("https://tailwindcss.com")}`
      )
    );
  }

  console.log("");
  console.log(chalk.bold.green("Happy coding!"));
  console.log("");
}
