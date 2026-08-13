import { en, type LocaleMessages } from './en';
import type { Locale } from './types';

export const loadLocaleMessages = async (locale: Locale): Promise<LocaleMessages> => {
  switch (locale) {
    case 'en':
      return en;
    case 'ua':
      return (await import('./ua')).ua;
    case 'de':
      return (await import('./de')).de;
    case 'pl':
      return (await import('./pl')).pl;
    case 'ru':
      return (await import('./ru')).ru;
  }
};
