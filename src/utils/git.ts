import { runCommandSilent } from "./command";

export async function createGitRepository(projectPath: string) {
  await runCommandSilent("git", ["init"], projectPath);
}
