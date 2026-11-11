import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { ScrollProgress } from './ScrollProgress';

describe('ScrollProgress', () => {
  it('exposes a reading progress bar', () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole('progressbar', { name: 'Reading progress' });
    expect(bar).toHaveAttribute('value', '0');
    expect(bar).toHaveAttribute('max', '100');
  });

  it('reads progress from a target element', () => {
    const target = createRef<HTMLDivElement>();
    const { rerender } = render(
      <div>
        <div ref={target} style={{ height: 100, overflow: 'auto' }}>
          <div style={{ height: 400 }} />
        </div>
        <ScrollProgress target={target} label="Section progress" />
      </div>
    );
    const scroller = target.current as HTMLDivElement;
    Object.defineProperty(scroller, 'scrollHeight', { configurable: true, value: 400 });
    Object.defineProperty(scroller, 'clientHeight', { configurable: true, value: 100 });
    scroller.scrollTop = 100;
    act(() => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    const bar = screen.getByRole('progressbar', { name: 'Section progress' }) as HTMLProgressElement;
    expect(bar.value).toBe(33);

    rerender(
      <div>
        <div ref={target} style={{ height: 100, overflow: 'auto' }}>
          <div style={{ height: 400 }} />
        </div>
        <ScrollProgress target={target} label="Section progress" />
      </div>
    );
    expect(
      (screen.getByRole('progressbar', { name: 'Section progress' }) as HTMLProgressElement).value
    ).toBe(33);
  });
});
