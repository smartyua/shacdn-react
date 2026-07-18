#!/usr/bin/env tsx
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createEmbeddingProvider } from '../lib/embeddings.js';
import { indexProject } from '../lib/indexer.js';
import { logger } from '../lib/logger.js';
import { REPO_ROOT } from '../lib/paths.js';
import { createRuntime, ensureAiDirectories } from '../lib/runtime.js';
import { createVectorStore } from '../lib/vector-store.js';

const status: Array<{ name: string; ok: boolean; detail?: string }> = [];

const record = (name: string, ok: boolean, detail?: string): void => {
  status.push({ name, ok, detail });
  if (ok) logger.info(`[OK] ${name}`, detail ? { detail } : undefined);
  else logger.warn(`[WARN] ${name}`, detail ? { detail } : undefined);
};

const main = async (): Promise<void> => {
  const started = Date.now();
  ensureAiDirectories();

  try {
    const runtime = createRuntime();
    record('Config', true, 'config.yaml valid');

    record('Runtime', true, `node ${process.version}`);
    record('Package manager', existsSync(join(REPO_ROOT, 'package-lock.json')), 'npm');

    const depsOk = existsSync(join(REPO_ROOT, 'node_modules'));
    record('Dependencies', depsOk, depsOk ? 'node_modules present' : 'run npm install');

    const embeddings = createEmbeddingProvider(runtime.config.embeddings);
    const embOk = await embeddings.healthCheck();
    record('Embeddings', embOk, runtime.config.embeddings.provider);

    const store = createVectorStore(runtime.config.vectorStore);
    const storeOk = await store.healthCheck();
    record('Vector store', storeOk, store.backend);

    const mcpDir = join(REPO_ROOT, 'mcp/shacdn-server');
    const mcpDist = join(mcpDir, 'dist/index.js');
    if (!existsSync(mcpDist)) {
      try {
        if (!existsSync(join(mcpDir, 'node_modules'))) {
          execSync('npm install', { cwd: mcpDir, stdio: 'pipe' });
        }
        execSync('npm run build', { cwd: mcpDir, stdio: 'pipe' });
        record('MCP shacdn build', existsSync(mcpDist), 'built on bootstrap');
      } catch (error) {
        record(
          'MCP shacdn build',
          false,
          error instanceof Error ? error.message : String(error),
        );
      }
    } else {
      record('MCP shacdn build', true, 'dist present');
    }

    // Docker / Qdrant are optional — do not start by default.
    if (process.env.AI_VECTOR_PROVIDER === 'qdrant') {
      record('Qdrant', false, 'set via AI_VECTOR_PROVIDER but not auto-started in lean mode');
    } else {
      record('Docker AI services', true, 'skipped (lean mode)');
    }

    const mode = runtime.config.bootstrap.incrementalIndex ? 'incremental' : 'full';
    try {
      const result = await indexProject({
        config: runtime.config,
        store,
        embeddings,
        mode,
      });
      record(
        'Indexing',
        true,
        `${result.mode}: ${result.filesIndexed} files, ${result.chunksIndexed} chunks`,
      );
    } catch (error) {
      record('Indexing', false, error instanceof Error ? error.message : String(error));
    }

    const knowledgeOk = existsSync(join(REPO_ROOT, '.ai/knowledge/project-overview.md'));
    record('Knowledge base', knowledgeOk, knowledgeOk ? 'present' : 'run ai:knowledge:update');

    const failed = status.filter((s) => !s.ok);
    const elapsed = Date.now() - started;
    logger.info('Bootstrap finished', {
      elapsedMs: elapsed,
      ok: status.length - failed.length,
      warn: failed.length,
    });

    if (failed.length > 0 && !runtime.config.bootstrap.failOpen) {
      process.exitCode = 1;
      return;
    }
    process.exitCode = 0;
  } catch (error) {
    logger.error('Bootstrap failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    // failOpen default behavior even on hard config errors for folderOpen
    process.exitCode = 0;
  }
};

void main();
