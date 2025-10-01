import execa from 'execa';

export async function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  await execa(command, args, {
    cwd,
    stdio: 'inherit',
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
