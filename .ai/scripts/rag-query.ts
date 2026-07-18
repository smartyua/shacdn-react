#!/usr/bin/env tsx
import { logger } from '../lib/logger.js';
import { runRag } from '../lib/rag.js';
import { createRuntime } from '../lib/runtime.js';

const main = async (): Promise<void> => {
  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    console.error('Usage: npm run ai:rag -- <query>');
    process.exitCode = 1;
    return;
  }

  const runtime = createRuntime();
  const result = await runRag({
    query,
    config: runtime.config,
    store: runtime.store,
    embeddings: runtime.embeddings,
  });

  console.log(JSON.stringify(result, null, 2));
};

void main().catch((error: unknown) => {
  logger.error('RAG failed', {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
