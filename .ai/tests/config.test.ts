import { describe, expect, it } from 'vitest';
import { configRootSchema, loadConfig, validateConfigFile } from '../lib/config.js';

describe('AI config', () => {
  it('loads and validates project config.yaml', () => {
    const root = loadConfig();
    expect(root.ai.enabled).toBe(true);
    expect(root.ai.vectorStore.provider).toBe('lancedb');
    expect(root.ai.embeddings.provider).toBe('local-hash');
    expect(root.ai.bootstrap.failOpen).toBe(true);
  });

  it('rejects invalid config shapes', () => {
    const result = configRootSchema.safeParse({ ai: { enabled: true } });
    expect(result.success).toBe(false);
  });

  it('validateConfigFile returns ai section', () => {
    const ai = validateConfigFile();
    expect(ai.memory.compressionAfterIterations).toBe(4);
  });
});
