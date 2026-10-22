export interface TimeParts {
  hour: number | null;
  minute: number | null;
}

export const padTime = (n: number): string => String(n).padStart(2, '0');

/** "HH:mm" (24-hour) → parts. Invalid or empty input yields empty parts. */
export const parseTime = (value: string | null | undefined): TimeParts => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value ?? '');
  if (!match) return { hour: null, minute: null };
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return { hour: null, minute: null };
  return { hour, minute };
};

export const formatTime = ({ hour, minute }: TimeParts): string | null =>
  hour === null || minute === null ? null : `${padTime(hour)}:${padTime(minute)}`;

export const wrap = (value: number, size: number): number => ((value % size) + size) % size;

export const to12Hour = (hour: number): number => hour % 12 || 12;

/** Convert a typed 12-hour value back to 24-hour, keeping the current AM/PM half. */
export const from12Hour = (hour12: number, pm: boolean): number => (hour12 % 12) + (pm ? 12 : 0);
