import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { applyTheme, readStoredTheme } from '../../styles/theme';
import { useStubbedLayout } from '../../test/layout';
import { ThemeSwitcher } from './ThemeSwitcher';

const resetThemeDom = (): void => {
  document.documentElement.removeAttribute('data-theme');
  try {
    window.localStorage?.clear();
  } catch {
    // jsdom without Storage
  }
};

describe('theme helpers', () => {
  afterEach(resetThemeDom);

  it('applies dark + scheme on the document element', () => {
    applyTheme('dark', 'blue');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark blue');
  });

  it('clears data-theme for light default', () => {
    applyTheme('dark', 'blue');
    applyTheme('light', 'default');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('reads stored theme without throwing when storage is empty', () => {
    expect(readStoredTheme()).toEqual({ theme: 'light', colorScheme: 'default' });
  });
});

describe('ThemeSwitcher', () => {
  useStubbedLayout();

  afterEach(() => {
    cleanup();
    resetThemeDom();
  });

  it('renders without LocaleProvider', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
  });

  it('toggles dark mode onto <html>', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('opens the scheme menu and selects a color', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    await user.click(screen.getByRole('button', { name: 'Choose color scheme' }));

    const menu = document.querySelector('[role="menu"]');
    expect(menu).toBeTruthy();
    const blue = menu?.querySelector('[data-scheme="blue"]');
    expect(blue).toBeTruthy();
    await user.click(blue as HTMLButtonElement);

    expect(document.documentElement.getAttribute('data-theme')).toBe('blue');
  });
});
