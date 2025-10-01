import { runCommand } from "./command";

export type PackageManager = "npm" | "yarn" | "pnpm";

interface PackageManagerOptions {
  npm?: boolean;
  yarn?: boolean;
  pnpm?: boolean;
}

export function detectPackageManager(
  options: PackageManagerOptions
): PackageManager {
  if (options.npm) return "npm";
  if (options.yarn) return "yarn";
  if (options.pnpm) return "pnpm";

  // Auto-detect from user agent
  const userAgent = process.env.npm_config_user_agent || "";

  if (userAgent.includes("yarn")) return "yarn";
  if (userAgent.includes("pnpm")) return "pnpm";

  return "npm";
}

export async function installDependencies(
  projectPath: string,
  packageManager: PackageManager
) {
  const commands: Record<PackageManager, string[]> = {
    npm: ["install"],
    yarn: ["install"],
    pnpm: ["install"],
  };

  await runCommand(packageManager, commands[packageManager], projectPath);
}

export async function addDependencies(
  projectPath: string,
  packageManager: PackageManager,
  dependencies: string[],
  dev = false
) {
  const commands: Record<PackageManager, string[]> = {
    npm: ["install", dev ? "--save-dev" : "--save", ...dependencies],
    yarn: ["add", dev ? "--dev" : "", ...dependencies].filter(Boolean),
    pnpm: ["add", dev ? "--save-dev" : "", ...dependencies].filter(Boolean),
  };

  await runCommand(packageManager, commands[packageManager], projectPath);
}
