#!/usr/bin/env tsx
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../lib/logger.js';
import { REPO_ROOT } from '../lib/paths.js';
import { ensureAiDirectories } from '../lib/runtime.js';

const main = (): void => {
  ensureAiDirectories();

  if (process.env.AI_VECTOR_PROVIDER !== 'qdrant') {
    console.log(
      '[OK] Lean mode: no external AI services to start (LanceDB/JSON are embedded).',
    );
    console.log('Set AI_VECTOR_PROVIDER=qdrant to start optional docker-compose.ai.yml.');
    return;
  }

  const compose = join(REPO_ROOT, 'docker-compose.ai.yml');
  if (!existsSync(compose)) {
    logger.warn('docker-compose.ai.yml missing');
    process.exitCode = 1;
    return;
  }

  execSync('docker compose -f docker-compose.ai.yml up -d', {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  console.log('[OK] Optional Qdrant started');
};

main();
