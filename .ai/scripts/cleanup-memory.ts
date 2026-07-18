#!/usr/bin/env tsx
import { existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../lib/logger.js';
import { MEMORY_DIR, SESSION_DIR, TASK_STATE_PATH } from '../lib/paths.js';
import { ensureAiDirectories } from '../lib/runtime.js';

const main = (): void => {
  ensureAiDirectories();

  const working = join(MEMORY_DIR, 'working');
  if (existsSync(working)) {
    for (const entry of readdirSync(working)) {
      if (entry === '.gitkeep.md') continue;
      rmSync(join(working, entry), { recursive: true, force: true });
    }
  }

  if (existsSync(TASK_STATE_PATH)) {
    writeFileSync(
      TASK_STATE_PATH,
      '# Task State\n\n## Goal\n\n(cleared)\n\n## Next Step\n\nNone\n',
      'utf8',
    );
  }

  // Keep session dir, clear stale temp files except .gitkeep
  if (existsSync(SESSION_DIR)) {
    for (const entry of readdirSync(SESSION_DIR)) {
      if (entry === '.gitkeep' || entry === 'current-task.md') continue;
      rmSync(join(SESSION_DIR, entry), { recursive: true, force: true });
    }
  }

  logger.info('Memory cleanup complete');
  console.log('[OK] Working memory and ephemeral session files cleaned');
};

main();
