export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter((part): part is string => Boolean(part && part.trim())).join(' ');
