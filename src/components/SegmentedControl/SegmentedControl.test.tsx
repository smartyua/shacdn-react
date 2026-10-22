import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

const OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month', disabled: true },
  { value: 'year', label: 'Year' },
];

describe('SegmentedControl', () => {
  it('selects on click and keeps a single tab stop', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="Range" options={OPTIONS} onValueChange={onValueChange} />);

    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('tabindex', '-1');

    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onValueChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('moves with arrow keys and skips disabled segments', () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="Range" options={OPTIONS} defaultValue="week" onValueChange={onValueChange} />);
    const group = screen.getByRole('radiogroup', { name: 'Range' });

    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenLastCalledWith('year');
    expect(screen.getByRole('radio', { name: 'Year' })).toHaveFocus();

    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenLastCalledWith('day');
  });
});
