export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type JsonKind = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

export const kindOf = (value: JsonValue): JsonKind => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value as Exclude<JsonKind, 'array' | 'null'>;
};

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** JavaScript accessor path: `$.users[0].name`, `$["display name"]`. */
export const childPath = (parent: string, key: string | number): string =>
  typeof key === 'number' ? `${parent}[${key}]` : IDENTIFIER.test(key) ? `${parent}.${key}` : `${parent}[${JSON.stringify(key)}]`;

export const previewOf = (value: JsonValue): string => {
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (value !== null && typeof value === 'object') {
    const count = Object.keys(value).length;
    return `{${count} ${count === 1 ? 'key' : 'keys'}}`;
  }
  return JSON.stringify(value);
};
