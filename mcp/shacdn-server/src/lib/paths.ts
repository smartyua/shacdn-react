import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Repo root: mcp/shacdn-server/src → ../../../ */
export const REPO_ROOT = resolve(__dirname, '../../..');

export const paths = {
  components: (name: string) => join(REPO_ROOT, 'src/components', name),
  componentTsx: (name: string) => join(REPO_ROOT, 'src/components', name, `${name}.tsx`),
  componentScss: (name: string) => join(REPO_ROOT, 'src/components', name, `${name}.module.scss`),
  variables: () => join(REPO_ROOT, 'src/styles/variables.scss'),
  globals: () => join(REPO_ROOT, 'src/styles/globals.scss'),
  screen: (relativePath: string) => join(REPO_ROOT, relativePath),
  docs: (name: string) => join(REPO_ROOT, 'docs', name),
};

export const consumerImportPath = (componentName: string, fromDir = 'src'): string => {
  return `./${fromDir}/components/${componentName}/${componentName}`;
};

export const consumerCopyPaths = (componentName: string): { tsx: string; scss: string } => ({
  tsx: `src/components/${componentName}/${componentName}.tsx`,
  scss: `src/components/${componentName}/${componentName}.module.scss`,
});
