import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker } from './TimePicker';
import { formatTime, from12Hour, parseTime } from './timeValue';

describe('timeValue', () => {
  it('parses and formats 24-hour strings', () => {
    expect(parseTime('9:05')).toEqual({ hour: 9, minute: 5 });
    expect(parseTime('25:00')).toEqual({ hour: null, minute: null });
    expect(formatTime({ hour: 9, minute: 5 })).toBe('09:05');
    expect(formatTime({ hour: 9, minute: null })).toBeNull();
    expect(from12Hour(12, false)).toBe(0);
    expect(from12Hour(3, true)).toBe(15);
  });
});

describe('TimePicker', () => {
  it('types digits and advances between segments', () => {
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Start" onValueChange={onValueChange} />);
    const hours = screen.getByRole('spinbutton', { name: 'Hours' });
    const minutes = screen.getByRole('spinbutton', { name: 'Minutes' });

    hours.focus();
    fireEvent.keyDown(hours, { key: '1' });
    fireEvent.keyDown(hours, { key: '4' });
    expect(minutes).toHaveFocus();
    fireEvent.keyDown(minutes, { key: '7' });

    expect(onValueChange).toHaveBeenLastCalledWith('14:07');
    expect(hours).toHaveTextContent('14');
    expect(minutes).toHaveTextContent('07');
  });

  it('steps with arrows and toggles AM/PM in 12-hour mode', () => {
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Alarm" hourCycle={12} defaultValue="11:30" minuteStep={15} onValueChange={onValueChange} />);

    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'Minutes' }), { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenLastCalledWith('11:45');

    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'AM/PM' }), { key: 'p' });
    expect(onValueChange).toHaveBeenLastCalledWith('23:45');
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveTextContent('11');
    expect(screen.getByRole('spinbutton', { name: 'AM/PM' })).toHaveTextContent('PM');

    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'Hours' }), { key: 'Backspace' });
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });
});
