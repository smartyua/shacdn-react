import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Check } from 'lucide-react';
import { buildEmbedUrlForLang, getEmbedContext, isEmbedLang } from '../../embed';
import { Button } from '../Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu/DropdownMenu';
import styles from './Locale.module.scss';

const LOCALES = ['en', 'ua', 'de', 'pl', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

const LOCALE_STORAGE_KEY = 'locale';

const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  ua: 'UA',
  de: 'DE',
  pl: 'PL',
  ru: 'RU',
};

const localeSwitcherLabels = {
  en: 'English',
  ua: 'Ukrainian',
  de: 'German',
  pl: 'Polish',
  ru: 'Russian',
} as const;

const MESSAGES = {
  en: {
    siteNav: {
      ariaLabel: 'Site navigation',
      backToHost: '← kylypko.com',
      home: 'Home',
      components: 'Components',
      dashboard: 'Dashboard',
      bessSolar: 'BESS Solar',
      transcoding: 'Transcoding',
      sessy: 'Sessy',
    },
    localeSwitcher: {
      ariaLabel: 'Select language',
      ...localeSwitcherLabels,
    },
    themeSwitcher: {
      toggleTheme: 'Toggle theme',
      switchToLight: 'Switch to light theme',
      switchToDark: 'Switch to dark theme',
      chooseColorScheme: 'Choose color scheme',
      colorSchemes: 'Color schemes',
      schemes: {
        default: 'Default',
        blue: 'Blue',
        green: 'Green',
        purple: 'Purple',
        orange: 'Orange',
        rose: 'Rose',
      },
    },
  },
  ua: {
    siteNav: {
      ariaLabel: 'Навігація сайтом',
      backToHost: '← kylypko.com',
      home: 'Головна',
      components: 'Компоненти',
      dashboard: 'Дашборд',
      bessSolar: 'BESS Solar',
      transcoding: 'Transcoding',
      sessy: 'Sessy',
    },
    localeSwitcher: {
      ariaLabel: 'Обрати мову',
      en: 'English',
      ua: 'Українська',
      de: 'Deutsch',
      pl: 'Polski',
      ru: 'Русский',
    },
    themeSwitcher: {
      toggleTheme: 'Перемкнути тему',
      switchToLight: 'Увімкнути світлу тему',
      switchToDark: 'Увімкнути темну тему',
      chooseColorScheme: 'Обрати колірну схему',
      colorSchemes: 'Колірні схеми',
      schemes: {
        default: 'Стандартна',
        blue: 'Синя',
        green: 'Зелена',
        purple: 'Фіолетова',
        orange: 'Помаранчева',
        rose: 'Рожева',
      },
    },
  },
  de: {
    siteNav: {
      ariaLabel: 'Website-Navigation',
      backToHost: '← kylypko.com',
      home: 'Startseite',
      components: 'Komponenten',
      dashboard: 'Dashboard',
      bessSolar: 'BESS Solar',
      transcoding: 'Transcoding',
      sessy: 'Sessy',
    },
    localeSwitcher: {
      ariaLabel: 'Sprache wählen',
      en: 'English',
      ua: 'Ukrainisch',
      de: 'Deutsch',
      pl: 'Polnisch',
      ru: 'Russisch',
    },
    themeSwitcher: {
      toggleTheme: 'Theme umschalten',
      switchToLight: 'Zum hellen Theme wechseln',
      switchToDark: 'Zum dunklen Theme wechseln',
      chooseColorScheme: 'Farbschema wählen',
      colorSchemes: 'Farbschemata',
      schemes: {
        default: 'Standard',
        blue: 'Blau',
        green: 'Grün',
        purple: 'Lila',
        orange: 'Orange',
        rose: 'Rose',
      },
    },
  },
  pl: {
    siteNav: {
      ariaLabel: 'Nawigacja witryny',
      backToHost: '← kylypko.com',
      home: 'Strona główna',
      components: 'Komponenty',
      dashboard: 'Panel',
      bessSolar: 'BESS Solar',
      transcoding: 'Transcoding',
      sessy: 'Sessy',
    },
    localeSwitcher: {
      ariaLabel: 'Wybierz język',
      en: 'English',
      ua: 'Ukraiński',
      de: 'Niemiecki',
      pl: 'Polski',
      ru: 'Rosyjski',
    },
    themeSwitcher: {
      toggleTheme: 'Przełącz motyw',
      switchToLight: 'Włącz jasny motyw',
      switchToDark: 'Włącz ciemny motyw',
      chooseColorScheme: 'Wybierz schemat kolorów',
      colorSchemes: 'Schematy kolorów',
      schemes: {
        default: 'Domyślny',
        blue: 'Niebieski',
        green: 'Zielony',
        purple: 'Fioletowy',
        orange: 'Pomarańczowy',
        rose: 'Różowy',
      },
    },
  },
  ru: {
    siteNav: {
      ariaLabel: 'Навигация по сайту',
      backToHost: '← kylypko.com',
      home: 'Главная',
      components: 'Компоненты',
      dashboard: 'Дашборд',
      bessSolar: 'BESS Solar',
      transcoding: 'Transcoding',
      sessy: 'Sessy',
    },
    localeSwitcher: {
      ariaLabel: 'Выбрать язык',
      en: 'English',
      ua: 'Украинский',
      de: 'Deutsch',
      pl: 'Polski',
      ru: 'Русский',
    },
    themeSwitcher: {
      toggleTheme: 'Переключить тему',
      switchToLight: 'Переключить на светлую тему',
      switchToDark: 'Переключить на тёмную тему',
      chooseColorScheme: 'Выбрать цветовую схему',
      colorSchemes: 'Цветовые схемы',
      schemes: {
        default: 'Стандартная',
        blue: 'Синяя',
        green: 'Зелёная',
        purple: 'Фиолетовая',
        orange: 'Оранжевая',
        rose: 'Розовая',
      },
    },
  },
} as const;

export type LocaleMessages = (typeof MESSAGES)[Locale];

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: LocaleMessages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const isLocale = (value: string | null | undefined): value is Locale =>
  value !== null && value !== undefined && (LOCALES as readonly string[]).includes(value);

const normalizeLocale = (input: string | null | undefined): Locale | null => {
  if (!input) {
    return null;
  }
  const base = input.trim().toLowerCase().split('-')[0];
  // kylypko / browsers may send `uk` for Ukrainian
  if (base === 'uk') {
    return 'ua';
  }
  return isLocale(base) ? base : null;
};

const readStoredLocale = (): Locale | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
};

const readBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }
  return normalizeLocale(navigator.language) ?? 'en';
};

const readEmbedLocale = (): Locale | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const embed = getEmbedContext(window.location.pathname);
  if (!embed || !isEmbedLang(embed.lang)) {
    return null;
  }
  return isLocale(embed.lang) ? embed.lang : null;
};

const resolveInitialLocale = (defaultLocale?: Locale): Locale =>
  defaultLocale ?? readEmbedLocale() ?? readStoredLocale() ?? readBrowserLocale();

const persistLocale = (locale: Locale): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
};

const syncDocumentLang = (locale: Locale): void => {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.lang = locale === 'ua' ? 'uk' : locale;
};

const navigateEmbedLocale = (next: Locale): boolean => {
  if (typeof window === 'undefined' || !isEmbedLang(next)) {
    return false;
  }
  const url = buildEmbedUrlForLang(next);
  if (!url || url === `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    return false;
  }
  window.location.assign(url);
  return true;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};

export type LocaleProviderProps = {
  children: ReactNode;
  defaultLocale?: Locale;
};

export const LocaleProvider = ({ children, defaultLocale }: LocaleProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(() => resolveInitialLocale(defaultLocale));

  useEffect(() => {
    syncDocumentLang(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    if (navigateEmbedLocale(next)) {
      persistLocale(next);
      return;
    }
    setLocaleState(next);
    persistLocale(next);
    syncDocumentLang(next);
  }, []);

  const value = useMemo(
    (): LocaleContextValue => ({
      locale,
      setLocale,
      messages: MESSAGES[locale],
    }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

LocaleProvider.displayName = 'LocaleProvider';

export interface LocaleSwitcherProps {
  className?: string;
  /** Smaller trigger — for compact site header */
  variant?: 'default' | 'compact';
}

export const LocaleSwitcher = forwardRef<HTMLDivElement, LocaleSwitcherProps>(
  ({ className = '', variant = 'default' }, ref) => {
    const { locale, setLocale, messages } = useLocale();

    return (
      <div
        ref={ref}
        className={`${styles.localeSwitcher}${variant === 'compact' ? ` ${styles.compact}` : ''} ${className}`.trim()}
        data-slot="locale-switcher"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={variant === 'compact' ? 'xs' : 'sm'}
              className={styles.trigger}
              aria-label={messages.localeSwitcher.ariaLabel}
            >
              {LOCALE_SHORT[locale]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" aria-label={messages.localeSwitcher.ariaLabel}>
            {LOCALES.map(option => {
              const selected = locale === option;
              return (
                <DropdownMenuItem
                  key={option}
                  role="menuitemradio"
                  aria-checked={selected}
                  className={`${styles.menuItem}${selected ? ` ${styles.selected}` : ''}`}
                  onClick={() => setLocale(option)}
                >
                  <span className={styles.menuLabel}>{messages.localeSwitcher[option]}</span>
                  <span className={styles.menuCode}>{LOCALE_SHORT[option]}</span>
                  {selected ? <Check size={14} aria-hidden className={styles.checkIcon} /> : null}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

LocaleSwitcher.displayName = 'LocaleSwitcher';
