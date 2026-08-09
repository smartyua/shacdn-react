/** Languages mirrored by kylypko.com URL prefixes. */
export const EMBED_LANGS = ['en', 'ua', 'de', 'pl', 'ru'] as const;

export type EmbedLang = (typeof EMBED_LANGS)[number];

const EMBED_PATH_RE = /^\/(en|ua|de|pl|ru)\/shacdn(?=\/|$)/;

export type EmbedContext = {
  /** React Router basename, e.g. `/en/shacdn` */
  basename: string;
  /** Language segment from the URL */
  lang: EmbedLang;
  /** Path after `/shacdn`, always starts with `/` (or `/` for index) */
  restPath: string;
};

export const isEmbedLang = (value: string | null | undefined): value is EmbedLang =>
  value !== null &&
  value !== undefined &&
  (EMBED_LANGS as readonly string[]).includes(value);

/**
 * When hosted under kylypko.com `/:lang/shacdn/*`, returns embed routing context.
 * Standalone (localhost / own domain) returns null.
 */
export const getEmbedContext = (
  pathname: string = typeof window !== 'undefined' ? window.location.pathname : ''
): EmbedContext | null => {
  const match = pathname.match(EMBED_PATH_RE);
  if (!match) {
    return null;
  }
  const lang = match[1] as EmbedLang;
  const basename = `/${lang}/shacdn`;
  const rest = pathname.slice(basename.length);
  const restPath = rest.startsWith('/') ? rest : `/${rest}`;
  return {
    basename,
    lang,
    restPath: restPath === '/' || restPath === '' ? '/' : restPath,
  };
};

/** Host site home when embedded, e.g. `/en/` — null in standalone mode. */
export const getHostHomeUrl = (
  pathname: string = typeof window !== 'undefined' ? window.location.pathname : ''
): string | null => {
  const embed = getEmbedContext(pathname);
  if (!embed) {
    return null;
  }
  return `/${embed.lang}/`;
};

/** Rewrite `/:lang/shacdn/...` to another language, preserving the rest of the path + search + hash. */
export const buildEmbedUrlForLang = (
  nextLang: EmbedLang,
  pathname: string = typeof window !== 'undefined' ? window.location.pathname : '',
  search: string = typeof window !== 'undefined' ? window.location.search : '',
  hash: string = typeof window !== 'undefined' ? window.location.hash : ''
): string | null => {
  const embed = getEmbedContext(pathname);
  if (!embed) {
    return null;
  }
  const rest = embed.restPath === '/' ? '/' : embed.restPath;
  return `/${nextLang}/shacdn${rest === '/' ? '/' : rest}${search}${hash}`;
};
