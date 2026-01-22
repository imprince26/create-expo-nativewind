import execa from "execa";
import chalk from "chalk";

export async function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  await execa(command, args, {
    cwd,
    stdio: "inherit",
  });
}

export async function runCommandWithInput(
  command: string,
  args: string[],
  cwd: string,
  input: string
): Promise<void> {
  await execa(command, args, {
    cwd,
    input,
    stdio: ["pipe", "inherit", "inherit"],
  });
}

export async function runCommandSilent(
  command: string,
  args: string[],
  cwd: string
): Promise<string> {
  const { stdout } = await execa(command, args, { cwd });
  return stdout;
}

/**
 * Run a command with a descriptive message showing what is executing
 */
export async function runCommandWithMessage(
  command: string,
  args: string[],
  cwd: string,
  message: string
): Promise<void> {
  console.log(chalk.cyan(`\n  → ${message}`));
  console.log(chalk.dim(`    Running: ${command} ${args.join(" ")}\n`));
  
  await execa(command, args, {
    cwd,
    stdio: "inherit",
  });
}
