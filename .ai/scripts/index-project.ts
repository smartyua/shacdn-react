#!/usr/bin/env tsx
import { indexProject } from '../lib/indexer.js';
import { logger } from '../lib/logger.js';
import { createRuntime } from '../lib/runtime.js';

const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const full = args.includes('--full');
  const incremental = args.includes('--incremental') || !full;
  const mode = full ? 'full' : incremental ? 'incremental' : 'incremental';

  const runtime = createRuntime();
  const result = await indexProject({
    config: runtime.config,
    store: runtime.store,
    embeddings: runtime.embeddings,
    mode,
  });

  logger.info('Index script done', {
    mode: result.mode,
    filesIndexed: result.filesIndexed,
    chunksIndexed: result.chunksIndexed,
    filesDeleted: result.filesDeleted,
    backend: result.backend,
  });
  console.log(JSON.stringify(result, null, 2));
};

void main().catch((error: unknown) => {
  logger.error('Index failed', {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
