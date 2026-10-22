import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Gauge } from './Gauge';
import { arcPath, clampRatio } from './gaugeGeometry';

describe('gaugeGeometry', () => {
  it('clamps the ratio and guards a degenerate range', () => {
    expect(clampRatio(50, 0, 200)).toBe(0.25);
    expect(clampRatio(-5, 0, 10)).toBe(0);
    expect(clampRatio(15, 0, 10)).toBe(1);
    expect(clampRatio(5, 10, 10)).toBe(0);
  });

  it('uses the large-arc flag for the full sweep', () => {
    expect(arcPath(50, 50, 40, 0, 1)).toContain(' 0 1 1 ');
    expect(arcPath(50, 50, 40, 0, 0.5)).toContain(' 0 0 1 ');
  });
});

describe('Gauge', () => {
  it('exposes the value as a meter and picks the threshold tone', () => {
    render(
      <Gauge
        value={86}
        label="CPU"
        format={v => `${v}%`}
        thresholds={[
          { from: 60, tone: 'warning' },
          { from: 85, tone: 'destructive' },
        ]}
      />
    );

    const meter = screen.getByRole('meter', { name: 'CPU' });
    expect(meter).toHaveAttribute('aria-valuetext', '86%');
    expect(meter).toHaveAttribute('data-tone', 'destructive');
  });
});
