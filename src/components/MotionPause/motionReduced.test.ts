import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '..');

const LOOPING = ['Aurora', 'BorderBeam', 'DotField', 'FluidOrb'] as const;

describe('reduced motion guards', () => {
  it.each(LOOPING)('%s only animates when the user allows motion', name => {
    const css = readFileSync(join(componentsDir, name, `${name}.module.scss`), 'utf8');
    expect(css).toContain('@media (prefers-reduced-motion: no-preference)');
    expect(css).toContain(':not([data-paused])');
    expect(css).not.toContain('offset-path');
    expect(css).not.toContain('@property');
  });

  it('keeps the glow card spotlight behind hover and reduced-motion', () => {
    const css = readFileSync(join(componentsDir, 'GlowCard', 'GlowCard.module.scss'), 'utf8');
    expect(css).toContain('@media (hover: hover) and (prefers-reduced-motion: no-preference)');
  });
});
