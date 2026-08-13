export const en = {
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
    en: 'English',
    ua: 'Ukrainian',
    de: 'German',
    pl: 'Polish',
    ru: 'Russian',
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
} as const;

type StringLeaves<T> = {
  [K in keyof T]: T[K] extends string ? string : StringLeaves<T[K]>;
};

export type LocaleMessages = StringLeaves<typeof en>;
