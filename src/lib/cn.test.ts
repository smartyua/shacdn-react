import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names and drops empties', () => {
    expect(cn('btn', false, undefined, '', 'primary')).toBe('btn primary');
  });
});
