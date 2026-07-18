#!/usr/bin/env tsx
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from '../lib/paths.js';

const main = (): void => {
  if (process.env.AI_VECTOR_PROVIDER !== 'qdrant') {
    console.log('[OK] Lean mode: nothing to stop.');
    return;
  }
  const compose = join(REPO_ROOT, 'docker-compose.ai.yml');
  if (!existsSync(compose)) {
    console.log('[WARN] docker-compose.ai.yml missing');
    return;
  }
  execSync('docker compose -f docker-compose.ai.yml down', {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  console.log('[OK] Optional AI services stopped');
};

main();
