import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import {
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
  useInitialMenuFocus,
} from '../Floating/Floating';
import { useLocale } from '../Locale/Locale';
import styles from './ThemeSwitcher.module.scss';

export interface ThemeSwitcherProps {
  className?: string;
  /** Меньшие кнопки и отступы — для компактной шапки */
  variant?: 'default' | 'compact';
}

type Theme = 'light' | 'dark';
type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'rose';

const COLOR_SCHEMES: ColorScheme[] = ['default', 'blue', 'green', 'purple', 'orange', 'rose'];

const getColorSchemeColor = (scheme: ColorScheme): string => {
  const colors: Record<ColorScheme, string> = {
    default: 'hsl(222.2, 47.4%, 11.2%)',
    blue: 'hsl(221.2, 83.2%, 53.3%)',
    green: 'hsl(142.1, 76.2%, 36.3%)',
    purple: 'hsl(262.1, 83.3%, 57.8%)',
    orange: 'hsl(24.6, 95%, 53.1%)',
    rose: 'hsl(346.8, 77.2%, 49.8%)',
  };
  return colors[scheme];
};

const getEnabledMenuItems = (menu: HTMLDivElement | null): HTMLButtonElement[] => {
  if (!menu) {
    return [];
  }
  return Array.from(menu.querySelectorAll('[role="menuitem"]')) as HTMLButtonElement[];
};

const focusMenuItem = (menu: HTMLDivElement | null, index: number): void => {
  const items = getEnabledMenuItems(menu);
  if (items.length === 0) {
    return;
  }
  const normalized = ((index % items.length) + items.length) % items.length;
  items[normalized]?.focus();
};

export const ThemeSwitcher = forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  ({ className = '', variant = 'default' }, ref) => {
    const { messages } = useLocale();
    const themeMessages = messages.themeSwitcher;

    const [theme, setTheme] = useState<Theme>(() => {
      return (localStorage.getItem('theme') as Theme) || 'light';
    });
    const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
      return (localStorage.getItem('colorScheme') as ColorScheme) || 'default';
    });
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const applyTheme = (newTheme: Theme, newColor: ColorScheme) => {
      const root = document.documentElement;

      root.removeAttribute('data-theme');

      const themeClasses: string[] = [];

      if (newTheme === 'dark') {
        themeClasses.push('dark');
      }

      if (newColor !== 'default') {
        themeClasses.push(newColor);
      }

      if (themeClasses.length > 0) {
        root.setAttribute('data-theme', themeClasses.join(' '));
      }
    };

    useEffect(() => {
      applyTheme(theme, colorScheme);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeMenu = useCallback(() => {
      setIsOpen(false);
      triggerRef.current?.focus();
    }, []);

    const { style, floatingProps, isPositioned } = useFloatingPosition({
      anchorRef: triggerRef,
      floatingRef: menuRef,
      open: isOpen,
      side: 'bottom',
      align: 'end',
      sideOffset: 8,
    });

    useDismissLayer({
      open: isOpen,
      onDismiss: closeMenu,
      contentRef: menuRef,
      excludeRefs: [triggerRef],
      dismissOnEscape: true,
      dismissOnOutsidePointer: true,
    });

    const activeSchemeIndex = COLOR_SCHEMES.indexOf(colorScheme);

    useInitialMenuFocus({
      open: isOpen,
      isPositioned,
      containerRef: menuRef,
      focusIndex: activeSchemeIndex >= 0 ? activeSchemeIndex : 0,
    });

    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme, colorScheme);
    };

    const changeColorScheme = (newColor: ColorScheme) => {
      setColorScheme(newColor);
      localStorage.setItem('colorScheme', newColor);
      applyTheme(theme, newColor);
      closeMenu();
    };

    const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const items = getEnabledMenuItems(menuRef.current);
      if (items.length === 0) {
        return;
      }

      const activeIndex = items.findIndex(item => item === document.activeElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusMenuItem(menuRef.current, activeIndex + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusMenuItem(menuRef.current, activeIndex <= 0 ? items.length - 1 : activeIndex - 1);
          break;
        case 'Home':
          e.preventDefault();
          focusMenuItem(menuRef.current, 0);
          break;
        case 'End':
          e.preventDefault();
          focusMenuItem(menuRef.current, items.length - 1);
          break;
        default:
          break;
      }
    };

    const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.themeSwitcher}${variant === 'compact' ? ` ${styles.compact}` : ''} ${className}`}
      >
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={themeMessages.toggleTheme}
          title={theme === 'light' ? themeMessages.switchToDark : themeMessages.switchToLight}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>

        <div className={styles.colorSchemeWrapper}>
          <button
            ref={triggerRef}
            type="button"
            className={styles.colorSchemeToggle}
            onClick={() => setIsOpen(current => !current)}
            onKeyDown={handleTriggerKeyDown}
            aria-label={themeMessages.chooseColorScheme}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            title={themeMessages.colorSchemes}
            style={{ backgroundColor: getColorSchemeColor(colorScheme) }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
            </svg>
          </button>

          {isOpen && (
            <FloatingPortal>
              <div
                ref={menuRef}
                role="menu"
                aria-label={themeMessages.colorSchemes}
                className={styles.colorSchemeMenu}
                style={style}
                onKeyDown={handleMenuKeyDown}
                {...floatingProps}
              >
                {COLOR_SCHEMES.map(scheme => (
                  <button
                    key={scheme}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    data-scheme={scheme}
                    className={`${styles.colorOption} ${colorScheme === scheme ? styles.active : ''}`}
                    onClick={() => changeColorScheme(scheme)}
                    onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        changeColorScheme(scheme);
                      }
                    }}
                  >
                    <span
                      className={styles.colorCircle}
                      style={{ background: getColorSchemeColor(scheme) }}
                    />
                    {themeMessages.schemes[scheme]}
                    {colorScheme === scheme && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </FloatingPortal>
          )}
        </div>
      </div>
    );
  }
);

ThemeSwitcher.displayName = 'ThemeSwitcher';
