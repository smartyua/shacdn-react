export type JsonTokenKind = 'key' | 'string' | 'number' | 'literal' | 'plain';

export interface JsonToken {
  kind: JsonTokenKind;
  value: string;
}

const TOKEN = /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[\s\S]/g;

export const tokenizeJson = (source: string): JsonToken[] => {
  const tokens: JsonToken[] = [];
  for (const match of source.matchAll(TOKEN)) {
    const value = match[0];
    if (value.startsWith('"')) {
      const rest = source.slice((match.index ?? 0) + value.length);
      tokens.push({ kind: /^\s*:/.test(rest) ? 'key' : 'string', value });
      continue;
    }
    if (/^-?\d/.test(value)) {
      tokens.push({ kind: 'number', value });
      continue;
    }
    if (value === 'true' || value === 'false' || value === 'null') {
      tokens.push({ kind: 'literal', value });
      continue;
    }
    tokens.push({ kind: 'plain', value });
  }
  return tokens;
};

export interface FormattedPayload {
  text: string;
  json: boolean;
}

const prettyJson = (value: unknown): FormattedPayload => {
  try {
    return { text: JSON.stringify(value, null, 2) ?? '', json: true };
  } catch {
    return { text: String(value), json: false };
  }
};

export const formatPayload = (value: unknown): FormattedPayload => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const looksJson =
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'));
    if (!looksJson) {
      return { text: value, json: false };
    }
    try {
      return { text: JSON.stringify(JSON.parse(trimmed), null, 2), json: true };
    } catch {
      return { text: value, json: false };
    }
  }
  return prettyJson(value);
};

export const formatDuration = (ms: number): string => {
  const safe = Number.isFinite(ms) ? Math.max(0, ms) : 0;
  return `${(safe / 1000).toFixed(1)}s`;
};

export const usedToolsLabel = (count: number): string =>
  `Used ${count} ${count === 1 ? 'tool' : 'tools'}`;
