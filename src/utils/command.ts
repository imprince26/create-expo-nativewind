import execa from "execa";
import chalk from "chalk";
import readline from "readline";

let isOutputCollapsed = true;
let bufferedOutput: string[] = [];

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
 * Run a command with collapsible output
 * Users can press 'v' to toggle verbose output during execution
 */
export async function runCommandWithCollapsibleOutput(
  command: string,
  args: string[],
  cwd: string,
  description: string
): Promise<void> {
  bufferedOutput = [];
  isOutputCollapsed = true;

  console.log(chalk.dim(`\n  ${description}`));
  console.log(
    chalk.dim("  Press 'v' to toggle verbose output, 'h' to hide again\n")
  );

  // Setup keyboard listener
  if (process.stdin.isTTY) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    const keypressHandler = (str: string, key: any) => {
      if (key.name === "v" || key.name === "h") {
        isOutputCollapsed = !isOutputCollapsed;
        if (isOutputCollapsed) {
          // Clear buffered output display
          console.log(chalk.dim("\n  [Output hidden - Press 'v' to show]"));
        } else {
          // Show buffered output
          console.log(chalk.dim("\n  [Showing verbose output]\n"));
          bufferedOutput.forEach((line) => console.log(line));
        }
      }
    };

    process.stdin.on("keypress", keypressHandler);

    try {
      const subprocess = execa(command, args, { cwd });

      // Capture stdout
      subprocess.stdout?.on("data", (data) => {
        const lines = data.toString().split("\n");
        lines.forEach((line: string) => {
          if (line.trim()) {
            bufferedOutput.push(chalk.dim(`    ${line}`));
            if (!isOutputCollapsed) {
              console.log(chalk.dim(`    ${line}`));
            }
          }
        });
      });

      // Capture stderr
      subprocess.stderr?.on("data", (data) => {
        const lines = data.toString().split("\n");
        lines.forEach((line: string) => {
          if (line.trim()) {
            bufferedOutput.push(chalk.yellow(`    ${line}`));
            if (!isOutputCollapsed) {
              console.log(chalk.yellow(`    ${line}`));
            }
          }
        });
      });

      await subprocess;
    } finally {
      // Cleanup
      process.stdin.removeListener("keypress", keypressHandler);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
    }
  } else {
    // Fallback for non-TTY environments (CI/CD)
    await execa(command, args, {
      cwd,
      stdio: "inherit",
    });
  }
}

/**
 * Run a command with hidden output by default
 * Output is buffered and only shown on error or if user toggles verbose
 */
export async function runCommandQuiet(
  command: string,
  args: string[],
  cwd: string,
  description: string
): Promise<void> {
  try {
    const subprocess = execa(command, args, { cwd });
    const output: string[] = [];

    subprocess.stdout?.on("data", (data) => {
      output.push(data.toString());
    });

    subprocess.stderr?.on("data", (data) => {
      output.push(data.toString());
    });

    await subprocess;
  } catch (error) {
    // On error, show the buffered output
    console.log(chalk.yellow("\n  Command output:"));
    bufferedOutput.forEach((line) => console.log(line));
    throw error;
  }
}
