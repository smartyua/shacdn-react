import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { isIgnored, loadIgnorePatterns } from '../lib/ignore.js';
import { REPO_ROOT } from '../lib/paths.js';

describe('ignore patterns', () => {
  it('loads .aiignore patterns', () => {
    const patterns = loadIgnorePatterns();
    expect(patterns).toContain('node_modules');
    expect(patterns).toContain('.env');
  });

  it('ignores node_modules and .env', () => {
    const patterns = loadIgnorePatterns();
    expect(isIgnored(join(REPO_ROOT, 'node_modules/foo/index.js'), patterns)).toBe(true);
    expect(isIgnored(join(REPO_ROOT, '.env'), patterns)).toBe(true);
    expect(isIgnored(join(REPO_ROOT, 'src/components/Button/Button.tsx'), patterns)).toBe(
      false,
    );
  });

  it('does not ignore the repository root', () => {
    expect(isIgnored(REPO_ROOT, loadIgnorePatterns())).toBe(false);
  });
});
