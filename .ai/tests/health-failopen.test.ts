import { describe, expect, it } from 'vitest';
import { loadConfig } from '../lib/config.js';
import { createEmbeddingProvider } from '../lib/embeddings.js';
import { createVectorStore } from '../lib/vector-store.js';

describe('fail-open health primitives', () => {
  it('local embeddings and json store remain healthy without lance path', async () => {
    const config = loadConfig().ai;
    const embeddings = createEmbeddingProvider({
      ...config.embeddings,
      provider: 'local-hash',
    });
    const store = createVectorStore({
      ...config.vectorStore,
      provider: 'json',
      jsonFallbackPath: '.ai/data/json-index-test',
    });
    await expect(embeddings.healthCheck()).resolves.toBe(true);
    await expect(store.healthCheck()).resolves.toBe(true);
    expect(config.bootstrap.failOpen).toBe(true);
  });
});
