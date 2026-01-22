import { runCommand } from "./command";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

interface PackageManagerOptions {
  npm?: boolean;
  yarn?: boolean;
  pnpm?: boolean;
  bun?: boolean;
}

export function detectPackageManager(
  options: PackageManagerOptions
): PackageManager {
  // Check explicit flags first
  if (options.npm) return "npm";
  if (options.yarn) return "yarn";
  if (options.pnpm) return "pnpm";
  if (options.bun) return "bun";

  // Auto-detect from user agent (npm_config_user_agent is set by npm, yarn, pnpm, bun)
  const userAgent = process.env.npm_config_user_agent || "";

  if (userAgent.includes("bun")) return "bun";
  if (userAgent.includes("yarn")) return "yarn";
  if (userAgent.includes("pnpm")) return "pnpm";
  if (userAgent.includes("npm")) return "npm";

  // Detect from command used to run the CLI (npx, bunx, pnpx, yarn dlx)
  const execPath = process.env._ || "";
  const argv = process.argv[1] || "";

  if (execPath.includes("bun") || argv.includes("bunx")) return "bun";
  if (execPath.includes("pnpm") || argv.includes("pnpx")) return "pnpm";
  if (execPath.includes("yarn")) return "yarn";

  // Default to npm
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
    bun: ["install"],
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
    bun: ["add", dev ? "--dev" : "", ...dependencies].filter(Boolean),
  };

  await runCommand(packageManager, commands[packageManager], projectPath);
}
