import { forwardRef, useState, useEffect } from 'react';
import styles from './ThemeSwitcher.module.scss';

export interface ThemeSwitcherProps {
  className?: string;
}

type Theme = 'light' | 'dark';
type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'rose';

export const ThemeSwitcher = forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  ({ className = '' }, ref) => {
    const [theme, setTheme] = useState<Theme>(() => {
      return (localStorage.getItem('theme') as Theme) || 'light';
    });
    const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
      return (localStorage.getItem('colorScheme') as ColorScheme) || 'default';
    });
    const [isOpen, setIsOpen] = useState(false);

    const applyTheme = (newTheme: Theme, newColor: ColorScheme) => {
      const root = document.documentElement;
      
      // Сначала очищаем все атрибуты
      root.removeAttribute('data-theme');
      
      // Собираем атрибуты для применения
      const themeClasses: string[] = [];
      
      if (newTheme === 'dark') {
        themeClasses.push('dark');
      }
      
      if (newColor !== 'default') {
        themeClasses.push(newColor);
      }
      
      // Применяем объединенный атрибут
      if (themeClasses.length > 0) {
        root.setAttribute('data-theme', themeClasses.join(' '));
      }
    };

    useEffect(() => {
      applyTheme(theme, colorScheme);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
      setIsOpen(false);
    };

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

    return (
      <div ref={ref} className={`${styles.themeSwitcher} ${className}`}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
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
            className={styles.colorSchemeToggle}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Choose color scheme"
            title="Color schemes"
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
            <div className={styles.colorSchemeMenu}>
              <button
                className={`${styles.colorOption} ${colorScheme === 'default' ? styles.active : ''}`}
                onClick={() => changeColorScheme('default')}
              >
                <span className={styles.colorCircle} style={{ background: 'hsl(222.2, 47.4%, 11.2%)' }} />
                Default
                {colorScheme === 'default' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
              <button
                className={`${styles.colorOption} ${colorScheme === 'blue' ? styles.active : ''}`}
                onClick={() => changeColorScheme('blue')}
              >
                <span className={styles.colorCircle} style={{ background: 'hsl(221.2, 83.2%, 53.3%)' }} />
                Blue
                {colorScheme === 'blue' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
              <button
                className={`${styles.colorOption} ${colorScheme === 'green' ? styles.active : ''}`}
                onClick={() => changeColorScheme('green')}
              >
                <span className={styles.colorCircle} style={{ background: 'hsl(142.1, 76.2%, 36.3%)' }} />
                Green
                {colorScheme === 'green' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
              <button
                className={`${styles.colorOption} ${colorScheme === 'purple' ? styles.active : ''}`}
                onClick={() => changeColorScheme('purple')}
              >
                <span className={styles.colorCircle} style={{ background: 'hsl(262.1, 83.3%, 57.8%)' }} />
                Purple
                {colorScheme === 'purple' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
              <button
                className={`${styles.colorOption} ${colorScheme === 'orange' ? styles.active : ''}`}
                onClick={() => changeColorScheme('orange')}
              >
                <span className={styles.colorCircle} style={{ background: 'hsl(24.6, 95%, 53.1%)' }} />
                Orange
                {colorScheme === 'orange' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
              <button
                className={`${styles.colorOption} ${colorScheme === 'rose' ? styles.active : ''}`}
                onClick={() => changeColorScheme('rose')}
              >
                <span className={styles.colorCircle} style={{ background: 'hsl(346.8, 77.2%, 49.8%)' }} />
                Rose
                {colorScheme === 'rose' && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ThemeSwitcher.displayName = 'ThemeSwitcher';
