import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityHeatmap } from './ActivityHeatmap';
import { buildHeatmapWeeks, levelFor } from './heatmapGrid';

describe('heatmapGrid', () => {
  it('ends on the week containing the end date and hides future days', () => {
    // Wednesday 2026-10-21
    const weeks = buildHeatmapWeeks([{ date: '2026-10-21', count: 4 }], { end: new Date(2026, 9, 21), weeks: 2 });

    expect(weeks).toHaveLength(2);
    expect(weeks[0][0].date).toBe('2026-10-11');
    expect(weeks[1][3]).toMatchObject({ date: '2026-10-21', count: 4, level: 4, outside: false });
    expect(weeks[1][4].outside).toBe(true);
  });

  it('starts weeks on Monday when asked', () => {
    const weeks = buildHeatmapWeeks([], { end: new Date(2026, 9, 21), weeks: 1, weekStart: 1 });
    expect(weeks[0][0].date).toBe('2026-10-19');
  });

  it('maps counts to levels', () => {
    expect(levelFor(0, 10, 5)).toBe(0);
    expect(levelFor(1, 10, 5)).toBe(1);
    expect(levelFor(10, 10, 5)).toBe(4);
  });
});

describe('ActivityHeatmap', () => {
  it('summarises the total for assistive tech', () => {
    render(
      <ActivityHeatmap
        weeks={4}
        endDate={new Date(2026, 9, 21)}
        data={[
          { date: '2026-10-20', count: 3 },
          { date: '2026-10-01', count: 2 },
        ]}
      />
    );
    expect(screen.getByRole('img', { name: '5 contributions in the last 4 weeks' })).toBeInTheDocument();
  });
});
