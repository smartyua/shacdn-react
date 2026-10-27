import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { weekDays } from './dates';
import { layoutDay, snap } from './layout';
import { ScheduleCalendar } from './ScheduleCalendar';

const event = (id: string, start: number, end: number) => ({ id, title: id, date: '2026-11-10', start, end });

describe('layoutDay', () => {
  it('gives non-overlapping events the full width', () => {
    const laid = layoutDay([event('a', 420, 540), event('b', 660, 780)]);
    expect(laid.map(item => item.columns)).toEqual([1, 1]);
  });

  it('splits overlapping events into columns', () => {
    const laid = layoutDay([event('a', 540, 660), event('b', 600, 720), event('c', 690, 750)]);
    const byId = Object.fromEntries(laid.map(item => [item.event.id, item]));
    expect(byId.a.column).toBe(0);
    expect(byId.b.column).toBe(1);
    expect(byId.c.column).toBe(0);
    expect(laid.every(item => item.columns === 2)).toBe(true);
  });

  it('snaps to 15-minute steps', () => {
    expect(snap(607)).toBe(600);
    expect(snap(608)).toBe(615);
  });
});

describe('weekDays', () => {
  it('starts the design week on Sunday 8 Nov 2026', () => {
    expect(weekDays('2026-11-10', 0)).toEqual([
      '2026-11-08',
      '2026-11-09',
      '2026-11-10',
      '2026-11-11',
      '2026-11-12',
      '2026-11-13',
      '2026-11-14',
    ]);
  });
});

const sample = [
  { id: 'ev-3', title: 'Personal appointment', date: '2026-11-10', start: 7 * 60, end: 9 * 60, color: 'orange' as const },
];

describe('ScheduleCalendar', () => {
  it('renders a timed event and reports selection', () => {
    const onEventSelect = vi.fn();
    render(
      <ScheduleCalendar
        defaultDate="2026-11-10"
        defaultView="week"
        events={sample}
        holidays={[{ id: 'ho-10', date: '2026-11-14', name: 'Diwali' }]}
        onEventSelect={onEventSelect}
      />,
    );

    expect(screen.getByText('November, 2026')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Personal appointment/ }));
    expect(onEventSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'ev-3' }));
    expect(screen.getByRole('button', { name: 'Diwali' })).toBeInTheDocument();
  });

  it('switches to the month grid', () => {
    render(<ScheduleCalendar defaultDate="2026-11-10" events={sample} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Month' }));
    expect(screen.getByRole('tab', { name: 'Month' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /Nov 10 2026/ })).toBeInTheDocument();
  });

  it('steps a week with the keyboard', () => {
    render(<ScheduleCalendar defaultDate="2026-11-10" events={sample} />);
    fireEvent.keyDown(screen.getByRole('region', { name: 'Schedule calendar' }), { key: 'ArrowRight' });
    expect(screen.getByText(/Nov 15 – 21/)).toBeInTheDocument();
  });

  it('asks for a new event when an empty month day is double-clicked', () => {
    const onSlotSelect = vi.fn();
    render(
      <ScheduleCalendar
        defaultDate="2026-11-10"
        defaultView="month"
        events={sample}
        onSlotSelect={onSlotSelect}
      />,
    );
    const day = screen.getByRole('button', { name: /Nov 12 2026/ });
    fireEvent.doubleClick(day.parentElement as HTMLElement);
    expect(onSlotSelect).toHaveBeenCalledWith({ date: '2026-11-12', start: 9 * 60, end: 10 * 60, allDay: false });
  });

  it('deletes the selected event from the header and from the time grid', () => {
    const onEventDelete = vi.fn();
    const onEventSelect = vi.fn();
    render(
      <ScheduleCalendar
        defaultDate="2026-11-10"
        events={sample}
        onEventDelete={onEventDelete}
        onEventSelect={onEventSelect}
      />,
    );

    expect(screen.queryByRole('button', { name: /Delete/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Personal appointment/ }));
    fireEvent.keyDown(screen.getByLabelText('Time grid'), { key: 'Backspace' });
    expect(onEventDelete).toHaveBeenCalledWith(expect.objectContaining({ id: 'ev-3', title: 'Personal appointment' }));
    expect(onEventSelect).toHaveBeenLastCalledWith(null);

    fireEvent.click(screen.getByRole('button', { name: /Personal appointment/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete Personal appointment' }));
    expect(onEventDelete).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'ev-3' }));
    expect(screen.queryByRole('button', { name: /Delete/ })).not.toBeInTheDocument();
  });
});
