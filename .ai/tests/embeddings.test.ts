import { describe, expect, it } from 'vitest';
import {
  LocalHashEmbeddingProvider,
  cosineSimilarity,
  localHashEmbed,
} from '../lib/embeddings.js';

describe('local-hash embeddings', () => {
  it('is deterministic', () => {
    const a = localHashEmbed('Button component SCSS', 384);
    const b = localHashEmbed('Button component SCSS', 384);
    expect(a).toEqual(b);
    expect(a).toHaveLength(384);
  });

  it('scores related text higher than unrelated', () => {
    const query = localHashEmbed('button component styles', 384);
    const related = localHashEmbed('export const Button styles module', 384);
    const unrelated = localHashEmbed('postgresql migration schema', 384);
    expect(cosineSimilarity(query, related)).toBeGreaterThan(
      cosineSimilarity(query, unrelated),
    );
  });

  it('healthCheck passes for LocalHashEmbeddingProvider', async () => {
    const provider = new LocalHashEmbeddingProvider(384);
    await expect(provider.healthCheck()).resolves.toBe(true);
  });
});
