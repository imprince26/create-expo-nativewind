export interface CreateOptions {
  nativewind?: boolean;
  template?: string;
  npm?: boolean;
  yarn?: boolean;
  pnpm?: boolean;
  install?: boolean;
  git?: boolean;
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm';
