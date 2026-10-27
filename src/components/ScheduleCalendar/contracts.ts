import type { HTMLAttributes } from 'react';

/** Pastel event colors from the Kargul calendar design. */
export const SCHEDULE_EVENT_COLORS = ['green', 'purple', 'cyan', 'orange', 'pink', 'blue'] as const;

export type ScheduleEventColor = (typeof SCHEDULE_EVENT_COLORS)[number];

export type ScheduleView = 'day' | 'week' | 'month';

/**
 * One calendar item on one local day.
 * A multi-day item is several records that share a title, one per day.
 * Times are minutes from local midnight (0–1440). All-day items ignore them.
 */
export type ScheduleEvent = {
  id: string;
  title: string;
  /** Local calendar day, `YYYY-MM-DD`. */
  date: string;
  start?: number;
  end?: number;
  allDay?: boolean;
  color?: ScheduleEventColor;
  note?: string;
  location?: string;
  /** Stays selectable, but cannot be dragged or resized. */
  locked?: boolean;
};

export type ScheduleHoliday = {
  id: string;
  /** Local calendar day, `YYYY-MM-DD`. */
  date: string;
  name: string;
};

/** Empty space the user clicked or dragged, before an event exists. */
export type ScheduleSlot = {
  date: string;
  start: number;
  end: number;
  allDay: boolean;
};

export type ScheduleCalendarLabels = {
  today: string;
  day: string;
  week: string;
  month: string;
  allDay: string;
  calendar: string;
  views: string;
  timeGrid: string;
  previous: (unit: string) => string;
  next: (unit: string) => string;
  more: (count: number) => string;
  /** Removes the selected event. Shown only when `onEventDelete` is set. */
  delete: string;
};

export type ScheduleCalendarProps = Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'defaultValue'> & {
  events?: ScheduleEvent[];
  holidays?: ScheduleHoliday[];
  /** Controlled visible day, `YYYY-MM-DD`. */
  date?: string;
  defaultDate?: string;
  onDateChange?: (date: string) => void;
  view?: ScheduleView;
  defaultView?: ScheduleView;
  onViewChange?: (view: ScheduleView) => void;
  /** `0` Sunday, `1` Monday. */
  weekStartsOn?: 0 | 1;
  timeFormat?: '12h' | '24h';
  showWeekends?: boolean;
  /** Hour aligned to the top of the time grid when it opens. */
  dayStartHour?: number;
  selectedEventId?: string | null;
  onEventSelect?: (event: ScheduleEvent | null) => void;
  /** Fired with the full next event after a drag move or resize. */
  onEventChange?: (event: ScheduleEvent) => void;
  onEventDelete?: (event: ScheduleEvent) => void;
  onHolidaySelect?: (holiday: ScheduleHoliday) => void;
  /** Click or drag on empty time. Month view uses a double-click. */
  onSlotSelect?: (slot: ScheduleSlot) => void;
  readOnly?: boolean;
  labels?: Partial<ScheduleCalendarLabels>;
};
