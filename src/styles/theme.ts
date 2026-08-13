export const THEME_STORAGE_KEY = 'theme';
export const COLOR_SCHEME_STORAGE_KEY = 'colorScheme';

export type Theme = 'light' | 'dark';
export type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'rose';

export const COLOR_SCHEMES: readonly ColorScheme[] = [
  'default',
  'blue',
  'green',
  'purple',
  'orange',
  'rose',
] as const;

/** Light-mode primary swatches — keep in sync with `globals.scss` scheme blocks. */
export const COLOR_SCHEME_SWATCHES: Record<ColorScheme, string> = {
  default: 'hsl(0 0% 9%)',
  blue: 'hsl(221.2 83.2% 53.3%)',
  green: 'hsl(142.4 71.8% 29.2%)',
  purple: 'hsl(262.1 83.3% 57.8%)',
  orange: 'hsl(17.5 88.3% 40.4%)',
  rose: 'hsl(345.3 82.7% 40.8%)',
};

const isTheme = (value: string | null): value is Theme => value === 'light' || value === 'dark';

const isColorScheme = (value: string | null): value is ColorScheme =>
  value !== null && (COLOR_SCHEMES as readonly string[]).includes(value);

export const applyTheme = (theme: Theme, colorScheme: ColorScheme): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.removeAttribute('data-theme');

  const parts: string[] = [];
  if (theme === 'dark') {
    parts.push('dark');
  }
  if (colorScheme !== 'default') {
    parts.push(colorScheme);
  }
  if (parts.length > 0) {
    root.setAttribute('data-theme', parts.join(' '));
  }
};

export const readStoredTheme = (): { theme: Theme; colorScheme: ColorScheme } => {
  if (typeof window === 'undefined') {
    return { theme: 'light', colorScheme: 'default' };
  }

  try {
    const themeRaw = window.localStorage.getItem(THEME_STORAGE_KEY);
    const schemeRaw = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    return {
      theme: isTheme(themeRaw) ? themeRaw : 'light',
      colorScheme: isColorScheme(schemeRaw) ? schemeRaw : 'default',
    };
  } catch {
    return { theme: 'light', colorScheme: 'default' };
  }
};

export const persistTheme = (theme: Theme, colorScheme: ColorScheme): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, colorScheme);
  } catch {
    // private mode / quota
  }
};

export const applyStoredTheme = (): void => {
  const { theme, colorScheme } = readStoredTheme();
  applyTheme(theme, colorScheme);
};
