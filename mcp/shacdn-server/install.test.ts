import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { formatComponentBundle } from './src/guide.js';
import { listComponentRuntimeFiles, readComponentFiles, readDesignSystemFile } from './src/lib/fs.js';
import { installToProject, parseInstallArgs } from './src/lib/install.js';
import { REPO_ROOT } from './src/lib/paths.js';

const tempDirs: string[] = [];

const makeProject = (entry = 'src/main.tsx'): string => {
  const dir = mkdtempSync(join(tmpdir(), 'shacdn-install-'));
  tempDirs.push(dir);
  mkdirSync(join(dir, 'src'), { recursive: true });
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'consumer', private: true, devDependencies: { sass: '1.0.0' } }, null, 2),
  );
  writeFileSync(join(dir, entry), `import { createRoot } from 'react-dom/client';\n`);
  return dir;
};

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('design system files', () => {
  it('resolves the repo root to this workspace', () => {
    expect(existsSync(join(REPO_ROOT, 'src/components/Button/Button.tsx'))).toBe(true);
  });

  it('returns tokens, globals and theme helpers together', () => {
    const files = readDesignSystemFile('both');

    expect(Object.keys(files).sort()).toEqual([
      'src/lib/cn.ts',
      'src/styles/globals.scss',
      'src/styles/theme-init.ts',
      'src/styles/theme.ts',
      'src/styles/variables.scss',
    ]);
    expect(files['src/styles/variables.scss']).toContain('$control-h-md');
    expect(files['src/styles/globals.scss']).toContain('--background');
    expect(files['src/styles/theme.ts']).toContain('applyTheme');
  });
});

describe('component runtime files', () => {
  it('includes sibling helpers that the main module imports', () => {
    expect(listComponentRuntimeFiles('Modal')).toEqual(['Modal.tsx', 'modalLayer.tsx']);
    expect(listComponentRuntimeFiles('MentionTextarea')).toEqual([
      'MentionTextarea.module.scss',
      'MentionTextarea.tsx',
      'mentionTextareaUtils.ts',
    ]);

    const modal = readComponentFiles('Modal');
    expect(modal?.extras.map((e) => e.path)).toContain('src/components/Modal/modalLayer.tsx');
  });

  it('puts extra files into the copy bundle', () => {
    const bundle = formatComponentBundle(['Dialog']);

    expect(bundle).toContain('modalLayer.tsx');
  });
});

describe('parseInstallArgs', () => {
  it('parses a target and optional component list', () => {
    expect(parseInstallArgs(['install', '/tmp/app', '--components', 'Button,Card'])).toEqual({
      targetDir: '/tmp/app',
      components: ['Button', 'Card'],
      force: false,
      dryRun: false,
      srcDir: undefined,
    });
  });
});

describe('installToProject', () => {
  it('copies the style guide into the target src/styles folder', () => {
    const target = makeProject();
    const result = installToProject({ targetDir: target });

    expect(result.written.some((f) => f.endsWith('styles/variables.scss'))).toBe(true);
    expect(result.written.some((f) => f.endsWith('styles/globals.scss'))).toBe(true);
    expect(result.written.some((f) => f.endsWith('styles/theme.ts'))).toBe(true);
    expect(result.written.some((f) => f.endsWith('lib/cn.ts'))).toBe(true);

    const globals = readFileSync(join(target, 'src/styles/globals.scss'), 'utf-8');
    expect(globals).toContain('--primary');

    const entry = readFileSync(join(target, 'src/main.tsx'), 'utf-8');
    expect(entry).toContain("import './styles/theme-init'");
    expect(entry).toContain("import './styles/globals.scss'");
  });

  it('does not overwrite existing token files unless force is set', () => {
    const target = makeProject();
    installToProject({ targetDir: target });
    writeFileSync(join(target, 'src/styles/variables.scss'), '// custom\n');

    const skipped = installToProject({ targetDir: target });
    expect(skipped.skipped.some((f) => f.includes('variables.scss') && f.includes('exists'))).toBe(
      true,
    );
    expect(readFileSync(join(target, 'src/styles/variables.scss'), 'utf-8')).toBe('// custom\n');

    installToProject({ targetDir: target, force: true });
    expect(readFileSync(join(target, 'src/styles/variables.scss'), 'utf-8')).toContain(
      '$control-h-md',
    );
  });

  it('copies component extras such as modalLayer.tsx', () => {
    const target = makeProject();
    installToProject({ targetDir: target, components: ['Dialog'] });

    expect(readFileSync(join(target, 'src/components/Modal/modalLayer.tsx'), 'utf-8')).toContain(
      'ModalProvider',
    );
    expect(readFileSync(join(target, 'src/components/Dialog/Dialog.tsx'), 'utf-8')).toContain(
      'modalLayer',
    );
  });

  it('warns when installing demo-only showcase chrome', () => {
    const target = makeProject();
    const result = installToProject({ targetDir: target, components: ['Locale'] });

    expect(result.warnings.some((w) => w.includes('Demo-only') && w.includes('Locale'))).toBe(true);
  });

  it('refuses a missing target and unknown components', () => {
    expect(() => installToProject({ targetDir: join(tmpdir(), 'shacdn-missing-xyz') })).toThrow(
      /does not exist/,
    );

    const target = makeProject();
    expect(() => installToProject({ targetDir: target, components: ['NotAComponent'] })).toThrow(
      /Unknown component/,
    );
  });

  it('dry-run does not write files', () => {
    const target = makeProject();
    const result = installToProject({ targetDir: target, dryRun: true });

    expect(result.dryRun).toBe(true);
    expect(result.written.length).toBeGreaterThan(0);
    expect(readFileSync(join(target, 'src/main.tsx'), 'utf-8')).not.toContain('globals.scss');
  });
});
