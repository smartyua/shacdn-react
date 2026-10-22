export interface HeatmapDatum {
  /** Local calendar date, "YYYY-MM-DD". */
  date: string;
  count: number;
}

export interface HeatmapCell {
  date: string;
  count: number;
  /** 0 (none) … levels − 1. */
  level: number;
  /** Outside the requested window; rendered as an empty slot. */
  outside: boolean;
}

const DAY_MS = 86_400_000;

export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseDateKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const levelFor = (count: number, max: number, levels: number): number => {
  if (count <= 0 || max <= 0) return 0;
  return Math.min(levels - 1, Math.max(1, Math.ceil((count / max) * (levels - 1))));
};

/**
 * Weeks as columns (each 7 days, starting on `weekStart`) ending with the week that contains `end`.
 * Uses noon-local stepping so daylight-saving shifts never skip or repeat a day.
 */
export const buildHeatmapWeeks = (
  data: HeatmapDatum[],
  { end, weeks, weekStart = 0, levels = 5 }: { end: Date; weeks: number; weekStart?: 0 | 1; levels?: number }
): HeatmapCell[][] => {
  const counts = new Map<string, number>();
  for (const datum of data) counts.set(datum.date, (counts.get(datum.date) ?? 0) + datum.count);

  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 12);
  const offset = (endDay.getDay() - weekStart + 7) % 7;
  const firstDay = new Date(endDay.getTime() - (offset + (weeks - 1) * 7) * DAY_MS);
  const max = Math.max(0, ...counts.values());

  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const date = new Date(firstDay.getTime() + (week * 7 + day) * DAY_MS);
      const key = toDateKey(date);
      const count = counts.get(key) ?? 0;
      const outside = date > endDay;
      return { date: key, count, level: outside ? 0 : levelFor(count, max, levels), outside };
    })
  );
};
