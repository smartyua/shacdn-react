import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COMPONENT_CATALOG, INTERNAL_DEPS } from './src/catalog.js';
import { resolveDependencyTree } from './src/lib/deps.js';

const COMPONENTS_DIR = join(import.meta.dirname, '../../src/components');

const componentFolders = readdirSync(COMPONENTS_DIR).filter(entry =>
  statSync(join(COMPONENTS_DIR, entry)).isDirectory()
);

/** Relative sibling imports (`../Other/…`) are the repo's only internal-dependency form. */
const readInternalImports = (folder: string): string[] => {
  const sources = readdirSync(join(COMPONENTS_DIR, folder)).filter(
    file => file.endsWith('.tsx') && !file.endsWith('.test.tsx')
  );

  const deps = new Set<string>();
  for (const file of sources) {
    const source = readFileSync(join(COMPONENTS_DIR, folder, file), 'utf8');
    for (const match of source.matchAll(/from '\.\.\/([A-Za-z]+)\//g)) {
      deps.add(match[1]);
    }
  }
  return [...deps].sort();
};

describe('MCP component catalog', () => {
  it('has an entry for every component folder', () => {
    const catalogued = new Set(COMPONENT_CATALOG.map(entry => entry.folder));
    const missing = componentFolders.filter(folder => !catalogued.has(folder));

    expect(missing).toEqual([]);
  });

  it('has no entries pointing at folders that do not exist', () => {
    const onDisk = new Set(componentFolders);
    const orphans = COMPONENT_CATALOG.filter(entry => !onDisk.has(entry.folder)).map(
      entry => entry.folder
    );

    expect(orphans).toEqual([]);
  });

  it('lists exports that the component module actually exports', () => {
    const mismatches: string[] = [];

    for (const entry of COMPONENT_CATALOG) {
      const files = readdirSync(join(COMPONENTS_DIR, entry.folder)).filter(
        file => file.endsWith('.tsx') && !file.endsWith('.test.tsx')
      );
      const source = files
        .map(file => readFileSync(join(COMPONENTS_DIR, entry.folder, file), 'utf8'))
        .join('\n');

      // Either a direct declaration or a name inside an `export { … }` list (alias folders
      // such as Sheet or Modal only re-export another component's bindings).
      const reExportLists = [...source.matchAll(/export\s*\{([^}]*)\}/g)]
        .map(match => match[1])
        .join(',');

      for (const exported of entry.exports) {
        const declared = new RegExp(
          `export (const|function|class|type|interface) ${exported}\\b`
        ).test(source);
        const reExported = new RegExp(`\\b${exported}\\b`).test(reExportLists);

        if (!declared && !reExported) {
          mismatches.push(`${entry.folder}: ${exported}`);
        }
      }
    }

    expect(mismatches).toEqual([]);
  });

  it('matches the internal dependency graph found in the sources', () => {
    const drift: string[] = [];

    for (const folder of componentFolders) {
      const actual = readInternalImports(folder);
      const declared = [...(INTERNAL_DEPS[folder] ?? [])].sort();

      if (actual.join(',') !== declared.join(',')) {
        drift.push(`${folder}: declared [${declared}] but imports [${actual}]`);
      }
    }

    expect(drift).toEqual([]);
  });

  it('resolves bundles without looping on cyclic dependencies', () => {
    const bundle = resolveDependencyTree(['Dialog']);

    expect(bundle).toContain('Dialog');
    expect(bundle).toContain('Modal');
    expect(new Set(bundle).size).toBe(bundle.length);
  });

  it('is fully re-exported from the components barrel', () => {
    const barrel = readFileSync(join(COMPONENTS_DIR, 'index.ts'), 'utf8');
    const missing = COMPONENT_CATALOG.filter(
      entry => !barrel.includes(`from './${entry.folder}/${entry.folder}'`)
    ).map(entry => entry.folder);

    expect(missing).toEqual([]);
  });

  it('ships Floating with every component that positions a popup', () => {
    for (const component of ['Select', 'Popover', 'Tooltip', 'DropdownMenu', 'Combobox']) {
      expect(resolveDependencyTree([component])).toContain('Floating');
    }
  });

  it('marks showcase chrome as demo-only', () => {
    expect(
      COMPONENT_CATALOG.filter(entry => entry.demoOnly)
        .map(entry => entry.folder)
        .sort()
    ).toEqual(['Locale', 'SiteHeader']);
  });
});
