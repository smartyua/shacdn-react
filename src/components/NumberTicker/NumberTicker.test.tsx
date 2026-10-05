import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatTicker } from './formatTicker';
import { NumberTicker } from './NumberTicker';

describe('formatTicker', () => {
  it('formats decimals, prefix, suffix, and non-finite amounts', () => {
    expect(formatTicker(1200.5, 2, '$', 'k')).toMatch(/\$1,200\.50k|\$1200\.50k/);
    expect(formatTicker(Number.NaN, -3, '', '')).toMatch(/0/);
  });
});

describe('NumberTicker', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('snaps to the value when duration is zero', () => {
    render(<NumberTicker value={42} duration={0} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('snaps downward to the start value', () => {
    render(<NumberTicker value={42} start={7} direction="down" duration={0} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders a non-finite value as zero', () => {
    render(<NumberTicker value={Number.NaN} duration={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('respects reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) =>
        ({
          matches: query.includes('reduce'),
          media: query,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false,
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
        }) as MediaQueryList,
    });

    render(<NumberTicker value={19} duration={4} prefix="+" />);
    expect(screen.getByText('+19')).toBeInTheDocument();
  });
});
