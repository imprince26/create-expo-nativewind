import { runCommandSilent } from './command';

export async function createGitRepository(projectPath: string) {
  await runCommandSilent('git', ['init'], projectPath);
  await runCommandSilent('git', ['add', '.'], projectPath);
  await runCommandSilent('git', ['commit', '-m', 'Initial commit'], projectPath);
}
