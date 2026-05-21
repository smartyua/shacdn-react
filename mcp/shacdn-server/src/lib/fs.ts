import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative } from 'node:path';
import { REPO_ROOT, paths } from './paths.js';

export interface ComponentFiles {
  name: string;
  tsxPath: string;
  scssPath: string;
  tsx: string;
  scss: string;
}

export const toRepoRelative = (absolutePath: string): string =>
  relative(REPO_ROOT, absolutePath).replace(/\\/g, '/');

export const readComponentFiles = (name: string): ComponentFiles | null => {
  const tsxPath = paths.componentTsx(name);
  const scssPath = paths.componentScss(name);

  if (!existsSync(tsxPath)) return null;

  return {
    name,
    tsxPath: toRepoRelative(tsxPath),
    scssPath: toRepoRelative(scssPath),
    tsx: readFileSync(tsxPath, 'utf-8'),
    scss: existsSync(scssPath) ? readFileSync(scssPath, 'utf-8') : '',
  };
};

export const listComponentFolders = (): string[] => {
  const dir = paths.components('');
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
};

export const readDesignSystemFile = (which: 'variables' | 'globals' | 'both'): Record<string, string> => {
  const result: Record<string, string> = {};
  if (which === 'variables' || which === 'both') {
    result['src/styles/variables.scss'] = readFileSync(paths.variables(), 'utf-8');
  }
  if (which === 'globals' || which === 'both') {
    result['src/styles/globals.scss'] = readFileSync(paths.globals(), 'utf-8');
  }
  return result;
};

export const readScreenPattern = (screenPath: string): Record<string, string> => {
  const base = paths.screen(screenPath);
  const screenName = screenPath.split('/').pop() ?? 'Screen';
  const files: Record<string, string> = {};

  const tsxFile = `${base}/${screenName}.tsx`;
  const scssFile = `${base}/${screenName}.module.scss`;

  if (existsSync(tsxFile)) {
    files[`${screenPath}/${screenName}.tsx`] = readFileSync(tsxFile, 'utf-8');
  }
  if (existsSync(scssFile)) {
    files[`${screenPath}/${screenName}.module.scss`] = readFileSync(scssFile, 'utf-8');
  }
  return files;
};
