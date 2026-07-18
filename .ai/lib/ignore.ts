import { existsSync, readFileSync } from 'node:fs';
import { relative, sep } from 'node:path';
import { AIIGNORE_PATH, REPO_ROOT } from './paths.js';

const DEFAULT_IGNORES = [
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.ai/data',
  '.ai/logs',
  '.ai/session',
  '.env',
];

const matchGlob = (pattern: string, relPath: string): boolean => {
  const normalized = relPath.split(sep).join('/');
  if (pattern.startsWith('!')) return false;
  if (pattern.includes('*')) {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, ':::DOUBLE:::')
      .replace(/\*/g, '[^/]*')
      .replace(/:::DOUBLE:::/g, '.*');
    return new RegExp(`^${escaped}$`).test(normalized);
  }
  if (normalized === pattern) return true;
  if (normalized.startsWith(`${pattern}/`)) return true;
  return false;
};

export const loadIgnorePatterns = (path = AIIGNORE_PATH): string[] => {
  const patterns = [...DEFAULT_IGNORES];
  if (!existsSync(path)) return patterns;
  const lines = readFileSync(path, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('!'));
  return [...new Set([...patterns, ...lines])];
};

export const isIgnored = (absolutePath: string, patterns = loadIgnorePatterns()): boolean => {
  const rel = relative(REPO_ROOT, absolutePath).split(sep).join('/');
  // Repo root itself is never ignored; only paths outside the repo are.
  if (rel.startsWith('..')) return true;
  if (!rel) return false;
  return patterns.some((pattern) => matchGlob(pattern, rel));
};

export const INDEXABLE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.scss',
  '.css',
  '.md',
  '.json',
  '.yaml',
  '.yml',
  '.html',
]);
