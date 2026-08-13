import { describe, expect, it } from 'vitest';
import { computeFloatingPosition } from './Floating';

const rect = (top: number, left: number, width: number, height: number): DOMRectReadOnly =>
  ({
    top,
    left,
    width,
    height,
    bottom: top + height,
    right: left + width,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRectReadOnly;

describe('computeFloatingPosition', () => {
  it('places the surface below a centered anchor', () => {
    const result = computeFloatingPosition({
      anchorRect: rect(100, 100, 80, 32),
      floatingRect: rect(0, 0, 120, 40),
      side: 'bottom',
      align: 'center',
      sideOffset: 8,
    });

    expect(result.side).toBe('bottom');
    expect(result.top).toBe(140);
    expect(result.left).toBe(80);
  });
});
