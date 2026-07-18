#!/usr/bin/env tsx
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from '../lib/config.js';
import { logger } from '../lib/logger.js';
import { REPO_ROOT } from '../lib/paths.js';
import { ensureAiDirectories } from '../lib/runtime.js';

const requiredPaths = [
  '.ai/config.yaml',
  '.ai/config.schema.json',
  '.aiignore',
  '.ai/lib/embeddings.ts',
  '.ai/lib/vector-store.ts',
  '.ai/lib/indexer.ts',
  '.ai/lib/rag.ts',
  '.ai/scripts/bootstrap.ts',
  '.ai/knowledge/project-overview.md',
  '.cursor/mcp.json',
  '.vscode/tasks.json',
  'docs/ai/README.md',
];

const main = async (): Promise<void> => {
  ensureAiDirectories();
  let failed = false;

  try {
    loadConfig();
    console.log('[OK] Config schema');
  } catch (error) {
    console.log(
      `[FAIL] Config schema — ${error instanceof Error ? error.message : String(error)}`,
    );
    failed = true;
  }

  for (const rel of requiredPaths) {
    const ok = existsSync(join(REPO_ROOT, rel));
    console.log(`[${ok ? 'OK' : 'FAIL'}] ${rel}`);
    if (!ok) failed = true;
  }

  try {
    execSync('npx tsx .ai/scripts/health-check.ts', {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    });
  } catch {
    // health-check uses non-zero only for critical; still continue
    logger.warn('health-check exited non-zero');
  }

  if (failed) {
    process.exitCode = 1;
    return;
  }
  console.log('[OK] AI setup verification passed');
};

void main();
