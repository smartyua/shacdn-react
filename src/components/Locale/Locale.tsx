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
import { en, loadLocaleMessages, LOCALES, isLocale, type Locale, type LocaleMessages } from '../../i18n';
import { cn } from '../../lib/cn';
import { Button } from '../Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu/DropdownMenu';
import styles from './Locale.module.scss';

export type { Locale, LocaleMessages };

const LOCALE_STORAGE_KEY = 'locale';

const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  ua: 'UA',
  de: 'DE',
  pl: 'PL',
  ru: 'RU',
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: LocaleMessages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const normalizeLocale = (input: string | null | undefined): Locale | null => {
  if (!input) {
    return null;
  }
  const base = input.trim().toLowerCase().split('-')[0];
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
  const [messages, setMessages] = useState<LocaleMessages>(en);

  useEffect(() => {
    syncDocumentLang(locale);
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    void loadLocaleMessages(locale).then(next => {
      if (!cancelled) {
        setMessages(next);
      }
    });
    return () => {
      cancelled = true;
    };
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
      messages,
    }),
    [locale, setLocale, messages]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

LocaleProvider.displayName = 'LocaleProvider';

export interface LocaleSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export const LocaleSwitcher = forwardRef<HTMLDivElement, LocaleSwitcherProps>(
  ({ className = '', variant = 'default' }, ref) => {
    const { locale, setLocale, messages } = useLocale();

    return (
      <div
        ref={ref}
        className={cn(styles.localeSwitcher, variant === 'compact' && styles.compact, className)}
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
                  className={cn(styles.menuItem, selected && styles.selected)}
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
