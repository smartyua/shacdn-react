#!/usr/bin/env tsx
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createEmbeddingProvider } from '../lib/embeddings.js';
import { INDEX_META_PATH, REPO_ROOT } from '../lib/paths.js';
import { createRuntime, ensureAiDirectories } from '../lib/runtime.js';
import { createVectorStore } from '../lib/vector-store.js';

type Level = 'OK' | 'WARN' | 'FAIL';

interface Check {
  level: Level;
  name: string;
  detail?: string;
}

const checks: Check[] = [];

const add = (level: Level, name: string, detail?: string): void => {
  checks.push({ level, name, detail });
  const suffix = detail ? ` — ${detail}` : '';
  console.log(`[${level}] ${name}${suffix}`);
};

const main = async (): Promise<void> => {
  ensureAiDirectories();
  let critical = false;

  try {
    const runtime = createRuntime();
    add('OK', 'Configuration');

    add('OK', 'Runtime', process.version);
    add(
      existsSync(join(REPO_ROOT, 'node_modules')) ? 'OK' : 'FAIL',
      'Dependencies',
      existsSync(join(REPO_ROOT, 'node_modules')) ? 'installed' : 'missing node_modules',
    );
    if (!existsSync(join(REPO_ROOT, 'node_modules'))) critical = true;

    const embeddings = createEmbeddingProvider(runtime.config.embeddings);
    const embOk = await embeddings.healthCheck();
    if (embOk) add('OK', 'Embeddings', runtime.config.embeddings.provider);
    else {
      add('WARN', 'Embeddings', `${runtime.config.embeddings.provider} unhealthy`);
    }

    if (runtime.config.embeddings.provider !== 'local-hash') {
      add('WARN', 'External embedding provider', 'configured (optional)');
    } else {
      add('OK', 'Local embedding provider');
    }

    const store = createVectorStore(runtime.config.vectorStore);
    const storeOk = await store.healthCheck();
    add(storeOk ? 'OK' : 'WARN', 'Vector DB', store.backend);

    add(
      existsSync(join(REPO_ROOT, '.cursor/mcp.json')) ? 'OK' : 'WARN',
      'MCP config',
      '.cursor/mcp.json',
    );
    add(
      existsSync(join(REPO_ROOT, 'mcp/shacdn-server/dist/index.js')) ? 'OK' : 'WARN',
      'MCP shacdn server',
      existsSync(join(REPO_ROOT, 'mcp/shacdn-server/dist/index.js'))
        ? 'dist ready'
        : 'build missing',
    );

    add(
      existsSync(join(REPO_ROOT, '.ai/memory')) ? 'OK' : 'WARN',
      'Memory directories',
    );
    add(
      existsSync(join(REPO_ROOT, '.ai/knowledge/project-overview.md')) ? 'OK' : 'WARN',
      'Knowledge base',
    );

    if (existsSync(INDEX_META_PATH)) {
      const meta = JSON.parse(readFileSync(INDEX_META_PATH, 'utf8')) as {
        lastIndexedAt: string;
      };
      const ageMs = Date.now() - Date.parse(meta.lastIndexedAt);
      const stale = ageMs > 1000 * 60 * 60 * 24 * 7;
      add(stale ? 'WARN' : 'OK', 'Index freshness', meta.lastIndexedAt);
    } else {
      add('WARN', 'Index freshness', 'not indexed yet');
    }

    add('OK', 'Filesystem permissions', 'writable .ai/data and .ai/logs');
  } catch (error) {
    add('FAIL', 'Configuration', error instanceof Error ? error.message : String(error));
    critical = true;
  }

  if (critical) process.exitCode = 1;
  else process.exitCode = 0;
};

void main();
