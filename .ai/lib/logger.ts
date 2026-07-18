import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { LOGS_DIR } from './paths.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogFields = Record<string, string | number | boolean | null | undefined>;

const SECRET_KEYS = /key|token|secret|password|authorization|credential/i;

const sanitize = (fields?: LogFields): LogFields | undefined => {
  if (!fields) return undefined;
  const out: LogFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (SECRET_KEYS.test(key)) {
      out[key] = '[redacted]';
      continue;
    }
    if (typeof value === 'string' && value.length > 500) {
      out[key] = `${value.slice(0, 500)}…`;
      continue;
    }
    out[key] = value;
  }
  return out;
};

const ensureLogsDir = (): void => {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
  }
};

const writeLine = (level: LogLevel, message: string, fields?: LogFields): void => {
  ensureLogsDir();
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(sanitize(fields) ?? {}),
  };
  const line = `${JSON.stringify(entry)}\n`;
  const day = entry.ts.slice(0, 10);
  appendFileSync(join(LOGS_DIR, `ai-${day}.log`), line, 'utf8');

  const prefix = `[AI ${level.toUpperCase()}]`;
  if (level === 'error') {
    console.error(prefix, message, fields ? sanitize(fields) : '');
  } else if (level === 'warn') {
    console.warn(prefix, message, fields ? sanitize(fields) : '');
  } else {
    console.log(prefix, message, fields ? sanitize(fields) : '');
  }
};

export const logger = {
  debug: (message: string, fields?: LogFields) => writeLine('debug', message, fields),
  info: (message: string, fields?: LogFields) => writeLine('info', message, fields),
  warn: (message: string, fields?: LogFields) => writeLine('warn', message, fields),
  error: (message: string, fields?: LogFields) => writeLine('error', message, fields),
};
