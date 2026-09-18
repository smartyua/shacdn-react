import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('selects a single day', async () => {
    const user = userEvent.setup();
    const selected: Date[] = [];

    render(
      <Calendar
        defaultMonth={new Date(2026, 8, 1)}
        onSelect={(date) => {
          selected.push(date);
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Friday, September 18, 2026' }));

    expect(selected).toHaveLength(1);
    expect(selected[0].getDate()).toBe(18);
  });

  it('builds a date range across two clicks', async () => {
    const user = userEvent.setup();
    const ranges: Array<{ from?: Date; to?: Date }> = [];

    render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 8, 1)}
        onSelect={(range) => {
          ranges.push(range);
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Tuesday, September 1, 2026' }));
    await user.click(screen.getByRole('button', { name: 'Friday, September 18, 2026' }));

    expect(ranges.at(-1)?.from?.getDate()).toBe(1);
    expect(ranges.at(-1)?.to?.getDate()).toBe(18);
  });
});
