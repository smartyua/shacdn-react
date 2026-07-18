import { describe, expect, it } from 'vitest';
import { chunkFile } from '../lib/chunker.js';

describe('chunker', () => {
  it('keeps small files as one chunk', () => {
    const chunks = chunkFile(
      'src/components/Button/Button.tsx',
      'export const Button = () => null;\n',
      2400,
    );
    expect(chunks).toHaveLength(1);
    expect(chunks[0].module).toBe('Button');
    expect(chunks[0].symbols).toContain('Button');
    expect(chunks[0].type).toBe('source');
  });

  it('does not split mid-export when under limit', () => {
    const content = [
      'export const Alpha = () => 1;',
      'export const Beta = () => 2;',
      'export const Gamma = () => 3;',
    ].join('\n');
    const chunks = chunkFile('src/components/Demo/Demo.tsx', content, 2400);
    expect(chunks.length).toBe(1);
    expect(chunks[0].content).toContain('Alpha');
    expect(chunks[0].content).toContain('Gamma');
  });

  it('splits large files near symbol boundaries', () => {
    const block = (name: string) =>
      `export const ${name} = () => {\n${'  return null;\n'.repeat(80)}};\n`;
    const content = ['Alpha', 'Beta', 'Gamma'].map(block).join('\n');
    const chunks = chunkFile('src/components/Demo/Demo.tsx', content, 800);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((c) => c.content.length <= 900)).toBe(true);
  });
});
