import { afterEach, beforeEach } from 'vitest';

/**
 * jsdom performs no layout, so every `getBoundingClientRect()` returns an all-zero rect.
 * Floating components treat a zero-sized anchor as scrolled out of the viewport and keep
 * their surface `visibility: hidden`, which removes it from the accessibility tree and
 * makes `getByRole` queries fail for reasons that never occur in a real browser.
 *
 * Call this in a `describe` block to give every element a plausible on-screen box.
 */
export const useStubbedLayout = (rect: Partial<DOMRect> = {}): void => {
  const original = Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    const { width = 200, height = 32, top = 100, left = 100 } = rect;

    Element.prototype.getBoundingClientRect = function stubbedRect(): DOMRect {
      const box = {
        x: left,
        y: top,
        width,
        height,
        top,
        left,
        right: left + width,
        bottom: top + height,
      };
      return { ...box, toJSON: () => box } as DOMRect;
    };
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = original;
  });
};
