export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Milliseconds left, never negative. */
  total: number;
}

export const getCountdownParts = (target: number, now: number): CountdownParts => {
  const total = Math.max(0, target - now);
  const seconds = Math.floor(total / 1000);
  return {
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    total,
  };
};

export const toTimestamp = (value: Date | number | string): number =>
  value instanceof Date ? value.getTime() : typeof value === 'number' ? value : new Date(value).getTime();
