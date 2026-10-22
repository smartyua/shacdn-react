import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('shows the value with a signed, colored delta', () => {
    render(<MetricCard label="Revenue" value="$48,200" delta={12.5} deltaLabel="vs last month" trend={[1, 3, 2, 5]} />);

    expect(screen.getByText('$48,200')).toBeInTheDocument();
    const delta = screen.getByText('+12.5%');
    expect(delta).toHaveAttribute('data-sentiment', 'positive');
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('treats a drop as good news when inverted', () => {
    render(<MetricCard label="p95 latency" value="180 ms" delta={-8} invertDelta />);
    expect(screen.getByText('-8%')).toHaveAttribute('data-sentiment', 'positive');
  });
});
