export const LOCALES = ['en', 'ua', 'de', 'pl', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const isLocale = (value: string | null | undefined): value is Locale =>
  value !== null && value !== undefined && (LOCALES as readonly string[]).includes(value);
