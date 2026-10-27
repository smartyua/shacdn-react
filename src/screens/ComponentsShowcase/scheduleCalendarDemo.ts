import type { ScheduleEvent, ScheduleHoliday } from '../../components/ScheduleCalendar/contracts';

const hours = (value: number, minutes = 0) => value * 60 + minutes;

/** The week shown in the Kargul calendar design, plus the days around 27 Oct 2026. */
export const SCHEDULE_DEMO_EVENTS: ScheduleEvent[] = [
  { id: 'ev-1', title: 'Time off', date: '2026-11-09', allDay: true, color: 'green', locked: true },
  { id: 'ev-2', title: 'Personal matters', date: '2026-11-08', start: hours(11), end: hours(12), color: 'cyan' },
  {
    id: 'ev-3',
    title: 'Personal appointment',
    date: '2026-11-10',
    start: hours(7),
    end: hours(9),
    color: 'orange',
    note: 'Pending',
    locked: true,
  },
  { id: 'ev-4', title: 'Extra leave', date: '2026-11-10', start: hours(11), end: hours(13), color: 'pink', note: 'From carryover days' },
  { id: 'ev-5', title: 'Submit medical certificate', date: '2026-11-11', start: hours(10), end: hours(11), color: 'blue' },
  { id: 'ev-6', title: 'Update time tracking', date: '2026-11-12', start: hours(7, 30), end: hours(8), color: 'cyan' },
  { id: 'ev-7', title: 'Benefits review', date: '2026-11-12', start: hours(12), end: hours(13), color: 'blue' },
  { id: 'ev-8', title: 'Half-day leave', date: '2026-11-13', start: hours(8), end: hours(12), color: 'green', note: 'Approved', locked: true },
  { id: 'ev-9', title: 'Team sync', date: '2026-10-26', start: hours(9, 30), end: hours(10), color: 'blue' },
  { id: 'ev-10', title: 'Design review', date: '2026-10-27', start: hours(14), end: hours(15, 30), color: 'purple' },
  { id: 'ev-11', title: 'Payroll cut-off', date: '2026-10-30', allDay: true, color: 'orange' },
  { id: 'ev-12', title: '1:1 with manager', date: '2026-11-04', start: hours(11), end: hours(11, 30), color: 'cyan' },
];

export const SCHEDULE_DEMO_HOLIDAYS: ScheduleHoliday[] = [
  { id: 'ho-10', date: '2026-11-14', name: 'Diwali' },
  { id: 'ho-11', date: '2026-11-24', name: 'Guru Nanak Jayanti' },
];
