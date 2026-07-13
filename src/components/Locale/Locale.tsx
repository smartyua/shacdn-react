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
import { Button } from '../Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu/DropdownMenu';
import styles from './Locale.module.scss';

const LOCALES = ['en', 'ru', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

const LOCALE_STORAGE_KEY = 'locale';

const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU',
  de: 'DE',
};

const MESSAGES = {
  en: {
    siteNav: {
      ariaLabel: 'Site navigation',
      home: 'Home',
      components: 'Components',
      dashboard: 'Dashboard',
      sessy: 'Sessy',
    },
    localeSwitcher: {
      ariaLabel: 'Select language',
      en: 'English',
      ru: 'Russian',
      de: 'German',
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
  ru: {
    siteNav: {
      ariaLabel: 'Навигация по сайту',
      home: 'Главная',
      components: 'Компоненты',
      dashboard: 'Дашборд',
      sessy: 'Sessy',
    },
    localeSwitcher: {
      ariaLabel: 'Выбрать язык',
      en: 'English',
      ru: 'Русский',
      de: 'Deutsch',
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
  de: {
    siteNav: {
      ariaLabel: 'Website-Navigation',
      home: 'Startseite',
      components: 'Komponenten',
      dashboard: 'Dashboard',
      sessy: 'Sessy',
    },
    localeSwitcher: {
      ariaLabel: 'Sprache wählen',
      en: 'English',
      ru: 'Russisch',
      de: 'Deutsch',
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

const resolveInitialLocale = (): Locale => readStoredLocale() ?? readBrowserLocale();

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
  document.documentElement.lang = locale;
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
  const [locale, setLocaleState] = useState<Locale>(() => defaultLocale ?? resolveInitialLocale());

  useEffect(() => {
    syncDocumentLang(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
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
            {LOCALES.map((option) => {
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
