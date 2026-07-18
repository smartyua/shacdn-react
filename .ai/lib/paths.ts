import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const libDir = dirname(fileURLToPath(import.meta.url));

export const AI_ROOT = resolve(libDir, '..');
export const REPO_ROOT = resolve(AI_ROOT, '..');

export const CONFIG_PATH = join(AI_ROOT, 'config.yaml');
export const SCHEMA_PATH = join(AI_ROOT, 'config.schema.json');
export const AIIGNORE_PATH = join(REPO_ROOT, '.aiignore');
export const LOGS_DIR = join(AI_ROOT, 'logs');
export const DATA_DIR = join(AI_ROOT, 'data');
export const SESSION_DIR = join(AI_ROOT, 'session');
export const MEMORY_DIR = join(AI_ROOT, 'memory');
export const KNOWLEDGE_DIR = join(AI_ROOT, 'knowledge');
export const TASK_STATE_PATH = join(SESSION_DIR, 'current-task.md');
export const INDEX_META_PATH = join(DATA_DIR, 'index-meta.json');

export const resolveRepoPath = (relativePath: string): string =>
  resolve(REPO_ROOT, relativePath);

export const ensureRepoRoot = (): void => {
  if (!existsSync(join(REPO_ROOT, 'package.json'))) {
    throw new Error(`Expected package.json at repo root: ${REPO_ROOT}`);
  }
};
