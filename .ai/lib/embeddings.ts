import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AiConfig } from './config.js';
import { contentHash } from './hash.js';
import { logger } from './logger.js';
import { DATA_DIR } from './paths.js';

export interface EmbeddingProvider {
  readonly name: string;
  embedText(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
  healthCheck(): Promise<boolean>;
}

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9_./+-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const hashToken = (token: string): number => {
  let h = 2166136261;
  for (let i = 0; i < token.length; i += 1) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const localHashEmbed = (text: string, dimensions: number): number[] => {
  const vector = new Array<number>(dimensions).fill(0);
  const tokens = tokenize(text);
  if (tokens.length === 0) return vector;

  for (const token of tokens) {
    const h = hashToken(token);
    const idx = h % dimensions;
    const sign = h & 1 ? 1 : -1;
    vector[idx] += sign;
  }

  let norm = 0;
  for (const v of vector) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  return vector.map((v) => v / norm);
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number,
  timeoutMs: number,
  label: string,
): Promise<T> => {
  let attempt = 0;
  let lastError: unknown;
  while (attempt <= maxRetries) {
    try {
      return await Promise.race([
        fn(),
        new Promise<T>((_, reject) => {
          setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
        }),
      ]);
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;
      const backoff = Math.min(2000 * 2 ** attempt, 8000);
      logger.warn('Embedding retry', {
        label,
        attempt: attempt + 1,
        backoff,
        error: error instanceof Error ? error.message : String(error),
      });
      await sleep(backoff);
      attempt += 1;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
};

class EmbeddingCache {
  private readonly path: string;
  private cache: Record<string, number[]>;

  constructor() {
    const dir = join(DATA_DIR, 'embedding-cache');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    this.path = join(dir, 'cache.json');
    this.cache = existsSync(this.path)
      ? (JSON.parse(readFileSync(this.path, 'utf8')) as Record<string, number[]>)
      : {};
  }

  get(hash: string): number[] | undefined {
    return this.cache[hash];
  }

  set(hash: string, vector: number[]): void {
    this.cache[hash] = vector;
    writeFileSync(this.path, JSON.stringify(this.cache), 'utf8');
  }
}

export class LocalHashEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'local-hash';

  constructor(private readonly dimensions: number) {}

  async embedText(text: string): Promise<number[]> {
    return localHashEmbed(text, this.dimensions);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embedText(t)));
  }

  async healthCheck(): Promise<boolean> {
    const v = await this.embedText('health');
    return v.length === this.dimensions;
  }
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'openai';

  constructor(
    private readonly dimensions: number,
    private readonly timeoutMs: number,
    private readonly maxRetries: number,
  ) {}

  private get apiKey(): string {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is not set');
    return key;
  }

  private get model(): string {
    return process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';
  }

  async embedText(text: string): Promise<number[]> {
    const [vector] = await this.embedBatch([text]);
    return vector;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return withRetry(
      async () => {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            input: texts,
            dimensions: this.dimensions,
          }),
        });
        if (!response.ok) {
          throw new Error(`OpenAI embeddings failed: ${response.status}`);
        }
        const json = (await response.json()) as {
          data: Array<{ embedding: number[]; index: number }>;
        };
        return json.data
          .sort((a, b) => a.index - b.index)
          .map((row) => row.embedding);
      },
      this.maxRetries,
      this.timeoutMs,
      'openai-embed',
    );
  }

  async healthCheck(): Promise<boolean> {
    if (!process.env.OPENAI_API_KEY) return false;
    try {
      const v = await this.embedText('health');
      return v.length > 0;
    } catch {
      return false;
    }
  }
}

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'ollama';

  constructor(
    private readonly dimensions: number,
    private readonly timeoutMs: number,
    private readonly maxRetries: number,
  ) {}

  private get baseUrl(): string {
    return process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  }

  private get model(): string {
    return process.env.OLLAMA_EMBEDDING_MODEL ?? 'nomic-embed-text';
  }

  async embedText(text: string): Promise<number[]> {
    return withRetry(
      async () => {
        const response = await fetch(`${this.baseUrl}/api/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: this.model, prompt: text }),
        });
        if (!response.ok) {
          throw new Error(`Ollama embeddings failed: ${response.status}`);
        }
        const json = (await response.json()) as { embedding: number[] };
        if (!Array.isArray(json.embedding) || json.embedding.length === 0) {
          throw new Error('Ollama returned empty embedding');
        }
        return json.embedding;
      },
      this.maxRetries,
      this.timeoutMs,
      'ollama-embed',
    );
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const out: number[][] = [];
    for (const text of texts) {
      out.push(await this.embedText(text));
    }
    return out;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(this.timeoutMs),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

class CachedEmbeddingProvider implements EmbeddingProvider {
  readonly name: string;
  private readonly cache = new EmbeddingCache();
  private hits = 0;
  private misses = 0;

  constructor(private readonly inner: EmbeddingProvider) {
    this.name = `${inner.name}+cache`;
  }

  get stats(): { hits: number; misses: number } {
    return { hits: this.hits, misses: this.misses };
  }

  async embedText(text: string): Promise<number[]> {
    const hash = contentHash(text);
    const cached = this.cache.get(hash);
    if (cached) {
      this.hits += 1;
      return cached;
    }
    this.misses += 1;
    const vector = await this.inner.embedText(text);
    this.cache.set(hash, vector);
    return vector;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embedText(t)));
  }

  async healthCheck(): Promise<boolean> {
    return this.inner.healthCheck();
  }
}

const createRawProvider = (config: AiConfig['embeddings']): EmbeddingProvider => {
  switch (config.provider) {
    case 'openai':
      return new OpenAIEmbeddingProvider(
        config.dimensions,
        config.timeoutMs,
        config.maxRetries,
      );
    case 'ollama':
      return new OllamaEmbeddingProvider(
        config.dimensions,
        config.timeoutMs,
        config.maxRetries,
      );
    case 'local-hash':
    default:
      return new LocalHashEmbeddingProvider(config.dimensions);
  }
};

export const createEmbeddingProvider = (
  config: AiConfig['embeddings'],
): EmbeddingProvider => new CachedEmbeddingProvider(createRawProvider(config));

export const cosineSimilarity = (a: number[], b: number[]): number => {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
};
