import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { REPO_ROOT, paths } from './paths.js';

const SKIP_RUNTIME_FILE = /\.(?:test|spec|stories)\.(?:tsx?|jsx?)$/i;

export interface ComponentExtraFile {
  path: string;
  content: string;
}

export interface ComponentFiles {
  name: string;
  tsxPath: string;
  scssPath: string;
  tsx: string;
  scss: string;
  extras: ComponentExtraFile[];
}

export const toRepoRelative = (absolutePath: string): string =>
  relative(REPO_ROOT, absolutePath).replace(/\\/g, '/');

export const isRuntimeComponentFile = (fileName: string): boolean => {
  if (fileName.startsWith('.')) return false;
  if (SKIP_RUNTIME_FILE.test(fileName)) return false;
  return /\.(?:tsx?|jsx?|scss)$/i.test(fileName);
};

export const listComponentRuntimeFiles = (name: string): string[] => {
  const dir = paths.components(name);
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => {
      if (!isRuntimeComponentFile(file)) return false;
      return statSync(join(dir, file)).isFile();
    })
    .sort();
};

export const readComponentFiles = (name: string): ComponentFiles | null => {
  const tsxPath = paths.componentTsx(name);
  const scssPath = paths.componentScss(name);

  if (!existsSync(tsxPath)) return null;

  const mainTsx = `${name}.tsx`;
  const mainScss = `${name}.module.scss`;
  const extras = listComponentRuntimeFiles(name)
    .filter((file) => file !== mainTsx && file !== mainScss)
    .map((file) => {
      const abs = join(paths.components(name), file);
      return { path: toRepoRelative(abs), content: readFileSync(abs, 'utf-8') };
    });

  return {
    name,
    tsxPath: toRepoRelative(tsxPath),
    scssPath: toRepoRelative(scssPath),
    tsx: readFileSync(tsxPath, 'utf-8'),
    scss: existsSync(scssPath) ? readFileSync(scssPath, 'utf-8') : '',
    extras,
  };
};

export const listComponentFolders = (): string[] => {
  const dir = paths.components('');
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
};

export type DesignSystemSet = 'variables' | 'globals' | 'theme' | 'both';

export const readDesignSystemFile = (which: DesignSystemSet): Record<string, string> => {
  const result: Record<string, string> = {};
  if (which === 'variables' || which === 'both') {
    result['src/styles/variables.scss'] = readFileSync(paths.variables(), 'utf-8');
  }
  if (which === 'globals' || which === 'both') {
    result['src/styles/globals.scss'] = readFileSync(paths.globals(), 'utf-8');
  }
  if (which === 'theme' || which === 'both') {
    result['src/styles/theme.ts'] = readFileSync(paths.theme(), 'utf-8');
    result['src/styles/theme-init.ts'] = readFileSync(paths.themeInit(), 'utf-8');
    result['src/lib/cn.ts'] = readFileSync(paths.cn(), 'utf-8');
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
