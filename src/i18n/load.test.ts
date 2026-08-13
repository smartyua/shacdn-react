import { describe, expect, it } from 'vitest';
import { en } from './en';
import { loadLocaleMessages } from './load';

describe('loadLocaleMessages', () => {
  it('returns English without a network fetch', async () => {
    await expect(loadLocaleMessages('en')).resolves.toBe(en);
  });

  it('lazy-loads another dictionary with the same shape', async () => {
    const ua = await loadLocaleMessages('ua');
    expect(Object.keys(ua)).toEqual(Object.keys(en));
    expect(ua.localeSwitcher.ariaLabel).not.toBe(en.localeSwitcher.ariaLabel);
  });
});
