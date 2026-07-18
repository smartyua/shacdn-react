import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadConfig } from '../lib/config.js';
import { LocalHashEmbeddingProvider } from '../lib/embeddings.js';
import { runRag } from '../lib/rag.js';
import { createVectorStore } from '../lib/vector-store.js';
import type { VectorRecord } from '../lib/vector-store.js';

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('rag pipeline', () => {
  it('filters, dedupes, and returns sources', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'shacdn-ai-'));
    tempDirs.push(dir);
    const config = loadConfig().ai;
    const store = createVectorStore({
      ...config.vectorStore,
      provider: 'json',
      jsonFallbackPath: dir,
    });
    const embeddings = new LocalHashEmbeddingProvider(config.embeddings.dimensions);
    const textA = 'Button component uses SCSS modules and forwardRef';
    const textB = 'Dialog overlay accessibility focus trap';
    const vectorA = await embeddings.embedText(textA);
    const vectorB = await embeddings.embedText(textB);
    const base: Omit<VectorRecord, 'id' | 'content' | 'vector' | 'path'> = {
      type: 'source',
      language: 'tsx',
      module: 'Button',
      symbols: ['Button'],
      contentHash: 'x',
      indexedAt: new Date().toISOString(),
      gitCommit: 'test',
      tags: ['source'],
      version: 1,
      startLine: 1,
      endLine: 10,
      namespace: config.vectorStore.namespace,
    };
    await store.upsert([
      {
        ...base,
        id: 'a1',
        path: 'src/components/Button/Button.tsx',
        content: textA,
        vector: vectorA,
        contentHash: 'a',
      },
      {
        ...base,
        id: 'a1-dup',
        path: 'src/components/Button/Button.tsx',
        content: textA,
        vector: vectorA,
        contentHash: 'a',
      },
      {
        ...base,
        id: 'b1',
        path: 'src/components/Dialog/Dialog.tsx',
        module: 'Dialog',
        symbols: ['Dialog'],
        content: textB,
        vector: vectorB,
        contentHash: 'b',
      },
    ]);

    const result = await runRag({
      query: 'button scss forwardRef',
      config,
      store,
      embeddings,
    });

    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.sources[0].path).toContain('Button');
    expect(result.context).toContain('Button');
    expect(['high', 'medium', 'low']).toContain(result.confidence);
  });
});
