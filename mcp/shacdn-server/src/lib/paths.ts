import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const findRepoRoot = (startDir: string): string => {
  let dir = startDir;
  for (let i = 0; i < 10; i += 1) {
    if (
      existsSync(join(dir, 'src/styles/variables.scss')) &&
      existsSync(join(dir, 'src/components'))
    ) {
      return dir;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error(`Could not locate shacdn repo root from ${startDir}`);
};

/** Workspace root (contains `src/components` and `src/styles`). */
export const REPO_ROOT = findRepoRoot(__dirname);

export const paths = {
  components: (name: string) => join(REPO_ROOT, 'src/components', name),
  componentTsx: (name: string) => join(REPO_ROOT, 'src/components', name, `${name}.tsx`),
  componentScss: (name: string) => join(REPO_ROOT, 'src/components', name, `${name}.module.scss`),
  variables: () => join(REPO_ROOT, 'src/styles/variables.scss'),
  globals: () => join(REPO_ROOT, 'src/styles/globals.scss'),
  theme: () => join(REPO_ROOT, 'src/styles/theme.ts'),
  themeInit: () => join(REPO_ROOT, 'src/styles/theme-init.ts'),
  cn: () => join(REPO_ROOT, 'src/lib/cn.ts'),
  screen: (relativePath: string) => join(REPO_ROOT, relativePath),
  docs: (name: string) => join(REPO_ROOT, 'docs', name),
};

/** Import path from a file inside `src/` (e.g. `App.tsx`). */
export const consumerImportPath = (componentName: string): string =>
  `./components/${componentName}/${componentName}`;

export const consumerCopyPaths = (componentName: string): { tsx: string; scss: string } => ({
  tsx: `src/components/${componentName}/${componentName}.tsx`,
  scss: `src/components/${componentName}/${componentName}.module.scss`,
});
