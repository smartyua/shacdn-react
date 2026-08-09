import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Scrollspy, ScrollspyLink } from './Scrollspy';

type IntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;

describe('Scrollspy', () => {
  let observerCallback: IntersectionObserverCallback | null = null;

  beforeEach(() => {
    observerCallback = null;

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('marks the intersecting link as active', () => {
    render(
      <>
        <div id="section-a">A</div>
        <div id="section-b">B</div>
        <Scrollspy aria-label="On this page">
          <ScrollspyLink href="#section-a">Section A</ScrollspyLink>
          <ScrollspyLink href="#section-b">Section B</ScrollspyLink>
        </Scrollspy>
      </>
    );

    const linkA = screen.getByRole('link', { name: 'Section A' });
    const linkB = screen.getByRole('link', { name: 'Section B' });

    expect(linkA).not.toHaveAttribute('aria-current');
    expect(linkB).not.toHaveAttribute('aria-current');

    const target = document.getElementById('section-b');
    expect(target).toBeTruthy();
    expect(observerCallback).toBeTruthy();

    act(() => {
      observerCallback?.(
        [
          {
            isIntersecting: true,
            target: target!,
            boundingClientRect: { top: 10 } as DOMRectReadOnly,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    expect(linkB).toHaveAttribute('aria-current', 'location');
    expect(linkA).not.toHaveAttribute('aria-current');
  });
});
