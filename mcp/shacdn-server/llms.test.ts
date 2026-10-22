import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COMPONENT_CATALOG } from './src/catalog.js';
import { LLMS_FILES, buildCatalogJson, buildLlmsTxt, installCommand } from './src/lib/llms.js';
import { MCP_TOOLS } from '../../src/screens/Docs/AiDocs.copy';

const PUBLIC_DIR = join(import.meta.dirname, '../../public');

describe('agent-readable files', () => {
  it.each(Object.keys(LLMS_FILES))('public/%s is up to date (run `npm run shacdn:llms`)', file => {
    const build = LLMS_FILES[file as keyof typeof LLMS_FILES];
    expect(readFileSync(join(PUBLIC_DIR, file), 'utf8')).toBe(build());
  });

  it('lists every consumer component and hides demo chrome', () => {
    const index = buildLlmsTxt();
    for (const entry of COMPONENT_CATALOG) {
      expect(index.includes(`- ${entry.name}: `)).toBe(!entry.demoOnly);
    }
  });

  it('names exactly the tools the server registers, here and on /docs/ai', () => {
    const server = readFileSync(join(import.meta.dirname, 'src/index.ts'), 'utf8');
    const registered = [...server.matchAll(/server\.tool\(\s*'([a-z_]+)'/g)].map(match => match[1]).sort();

    expect([...MCP_TOOLS].sort()).toEqual(registered);
    for (const tool of registered) {
      expect(buildLlmsTxt()).toContain(tool);
    }
  });

  it('records dependencies and providers per component', () => {
    const { components } = buildCatalogJson();
    expect(components.find(c => c.name === 'MetricCard')?.dependencies).toEqual(['Chart']);
    expect(components.find(c => c.name === 'Toast')?.providers).toEqual(['ToastProvider']);
    expect(installCommand(['Button'])).toBe('npm run shacdn:install -- /path/to/your-app --components Button');
  });
});
