import type { ScheduleEvent, ScheduleEventColor } from './contracts';

export type NormalizedEvent = ScheduleEvent & {
  start: number;
  end: number;
  allDay: boolean;
  color: ScheduleEventColor;
  locked: boolean;
};

export const normalizeEvent = (event: ScheduleEvent): NormalizedEvent => {
  const allDay = event.allDay ?? false;
  const start = event.start ?? 0;
  const end = event.end ?? (allDay ? 1440 : start + 60);
  return {
    ...event,
    allDay,
    start: allDay ? 0 : start,
    end: allDay ? 1440 : Math.max(end, start + 15),
    color: event.color ?? 'blue',
    locked: event.locked ?? false,
  };
};
