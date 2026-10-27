export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const MONTHS_SHORT = MONTHS.map(month => month.slice(0, 3));

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const WEEKDAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

const pad = (value: number) => String(value).padStart(2, '0');

export const toKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const fromKey = (key: string): Date => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const addDays = (key: string, amount: number): string => {
  const date = fromKey(key);
  date.setDate(date.getDate() + amount);
  return toKey(date);
};

export const addMonths = (key: string, amount: number): string => {
  const date = fromKey(key);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + amount);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, last));
  return toKey(date);
};

export const dayOfWeek = (key: string): number => fromKey(key).getDay();

export const startOfWeek = (key: string, weekStartsOn: 0 | 1 = 0): string => {
  const diff = (dayOfWeek(key) - weekStartsOn + 7) % 7;
  return addDays(key, -diff);
};

export const weekDays = (key: string, weekStartsOn: 0 | 1 = 0): string[] => {
  const start = startOfWeek(key, weekStartsOn);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
};

export const startOfMonth = (key: string): string => `${key.slice(0, 8)}01`;

export const daysInMonth = (key: string): number => {
  const date = fromKey(key);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/** Six rows covering the month of `key`. */
export const monthGrid = (key: string, weekStartsOn: 0 | 1 = 0): string[] => {
  const first = startOfWeek(startOfMonth(key), weekStartsOn);
  return Array.from({ length: 42 }, (_, index) => addDays(first, index));
};

/** ISO-8601 week number. */
export const isoWeek = (key: string): number => {
  const date = fromKey(key);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNumber = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = (target.getTime() - firstThursday.getTime()) / 86400000;
  return 1 + Math.round((diff - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
};

export const isWeekend = (key: string): boolean => {
  const day = dayOfWeek(key);
  return day === 0 || day === 6;
};

export const monthName = (key: string): string => MONTHS[fromKey(key).getMonth()];

export const formatShort = (key: string): string => {
  const date = fromKey(key);
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
};

export const formatWeekday = (key: string): string => WEEKDAYS[dayOfWeek(key)];

export const formatRange = (from: string, to: string): string => {
  const start = fromKey(from);
  const end = fromKey(to);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${MONTHS_SHORT[start.getMonth()]} ${start.getDate()} – ${end.getDate()}`;
  }
  return `${formatShort(from)} – ${formatShort(to)}`;
};

export const formatTime = (minutes: number, format: '24h' | '12h' = '24h'): string => {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(wrapped / 60);
  const mins = wrapped % 60;
  if (minutes === 1440) return format === '24h' ? '24:00' : '12:00 AM';
  if (format === '24h') return `${pad(hours)}:${pad(mins)}`;
  const suffix = hours < 12 ? 'AM' : 'PM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${pad(mins)} ${suffix}`;
};

export const formatTimeRange = (start: number, end: number, format: '24h' | '12h' = '24h'): string =>
  `${formatTime(start, format)} – ${formatTime(end, format)}`;

export const formatHourLabel = (hour: number, format: '24h' | '12h'): string =>
  formatTime(hour * 60, format).replace(':00 ', ' ');
