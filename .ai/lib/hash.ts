import { createHash } from 'node:crypto';

export const sha256 = (input: string): string =>
  createHash('sha256').update(input, 'utf8').digest('hex');

export const contentHash = (content: string): string => sha256(content);
