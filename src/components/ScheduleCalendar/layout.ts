/** One hour of the time grid, in px — matches the source design. */
export const HOUR_HEIGHT = 64;
export const SNAP_MINUTES = 15;
export const MIN_EVENT_MINUTES = 15;

export const minutesToPx = (minutes: number) => (minutes / 60) * HOUR_HEIGHT;

export const pxToMinutes = (px: number) => (px / HOUR_HEIGHT) * 60;

export const snap = (minutes: number, step = SNAP_MINUTES) => Math.round(minutes / step) * step;

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export type PositionedEvent<T> = {
  event: T;
  column: number;
  columns: number;
};

/**
 * Lays overlapping timed events side by side.
 * Events cluster by transitive overlap, then split into the fewest columns that do not collide.
 */
export const layoutDay = <T extends { start: number; end: number }>(events: T[]): PositionedEvent<T>[] => {
  const sorted = [...events].sort((a, b) => a.start - b.start || b.end - a.end);
  const out: PositionedEvent<T>[] = [];
  let cluster: { event: T; column: number }[] = [];
  let clusterEnd = -1;
  let columnEnds: number[] = [];

  const flush = () => {
    const columns = columnEnds.length;
    for (const item of cluster) out.push({ ...item, columns });
    cluster = [];
    columnEnds = [];
  };

  for (const event of sorted) {
    if (event.start >= clusterEnd && cluster.length) flush();
    let column = columnEnds.findIndex(end => end <= event.start);
    if (column === -1) {
      column = columnEnds.length;
      columnEnds.push(event.end);
    } else {
      columnEnds[column] = event.end;
    }
    cluster.push({ event, column });
    clusterEnd = Math.max(clusterEnd, event.end);
  }
  if (cluster.length) flush();
  return out;
};
