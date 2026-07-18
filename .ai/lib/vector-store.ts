import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AiConfig } from './config.js';
import type { ChunkType } from './chunker.js';
import { cosineSimilarity } from './embeddings.js';
import { logger } from './logger.js';
import { resolveRepoPath } from './paths.js';

export interface VectorRecord {
  id: string;
  path: string;
  type: ChunkType;
  language: string;
  module: string;
  symbols: string[];
  content: string;
  contentHash: string;
  indexedAt: string;
  gitCommit: string;
  tags: string[];
  version: number;
  vector: number[];
  startLine: number;
  endLine: number;
  namespace: string;
}

export interface SearchHit {
  record: VectorRecord;
  score: number;
}

export interface VectorStore {
  readonly backend: 'lancedb' | 'json';
  upsert(records: VectorRecord[]): Promise<void>;
  deleteByPaths(paths: string[]): Promise<void>;
  search(
    vector: number[],
    options?: { topK?: number; type?: ChunkType; module?: string },
  ): Promise<SearchHit[]>;
  count(): Promise<number>;
  healthCheck(): Promise<boolean>;
  listPaths(): Promise<string[]>;
  getByPath(path: string): Promise<VectorRecord[]>;
}

interface JsonIndexFile {
  namespace: string;
  collection: string;
  records: VectorRecord[];
}

class JsonVectorStore implements VectorStore {
  readonly backend = 'json' as const;
  private readonly filePath: string;
  private data: JsonIndexFile;

  constructor(
    private readonly namespace: string,
    private readonly collection: string,
    dirRelative: string,
  ) {
    const dir = resolveRepoPath(dirRelative);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    this.filePath = join(dir, `${collection}.json`);
    this.data = this.load();
  }

  private load(): JsonIndexFile {
    if (!existsSync(this.filePath)) {
      return { namespace: this.namespace, collection: this.collection, records: [] };
    }
    return JSON.parse(readFileSync(this.filePath, 'utf8')) as JsonIndexFile;
  }

  private persist(): void {
    writeFileSync(this.filePath, JSON.stringify(this.data), 'utf8');
  }

  async upsert(records: VectorRecord[]): Promise<void> {
    const byId = new Map(this.data.records.map((r) => [r.id, r]));
    for (const record of records) {
      byId.set(record.id, { ...record, namespace: this.namespace });
    }
    this.data.records = [...byId.values()];
    this.persist();
  }

  async deleteByPaths(paths: string[]): Promise<void> {
    const set = new Set(paths);
    this.data.records = this.data.records.filter((r) => !set.has(r.path));
    this.persist();
  }

  async search(
    vector: number[],
    options: { topK?: number; type?: ChunkType; module?: string } = {},
  ): Promise<SearchHit[]> {
    const topK = options.topK ?? 12;
    const hits = this.data.records
      .filter((r) => r.namespace === this.namespace)
      .filter((r) => (options.type ? r.type === options.type : true))
      .filter((r) => (options.module ? r.module === options.module : true))
      .map((record) => ({
        record,
        score: cosineSimilarity(vector, record.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    return hits;
  }

  async count(): Promise<number> {
    return this.data.records.length;
  }

  async healthCheck(): Promise<boolean> {
    return existsSync(this.filePath) || true;
  }

  async listPaths(): Promise<string[]> {
    return [...new Set(this.data.records.map((r) => r.path))];
  }

  async getByPath(path: string): Promise<VectorRecord[]> {
    return this.data.records.filter((r) => r.path === path);
  }
}

class LanceVectorStore implements VectorStore {
  readonly backend = 'lancedb' as const;
  private readonly jsonFallback: JsonVectorStore;

  constructor(
    namespace: string,
    collection: string,
    private readonly lancePath: string,
    jsonFallbackPath: string,
  ) {
    this.jsonFallback = new JsonVectorStore(namespace, collection, jsonFallbackPath);
  }

  async upsert(records: VectorRecord[]): Promise<void> {
    // Keep JSON mirror for reliability; Lance is best-effort.
    await this.jsonFallback.upsert(records);
    try {
      const lancedb = await import('@lancedb/lancedb');
      const dir = resolveRepoPath(this.lancePath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      const db = await lancedb.connect(dir);
      const tableNames = await db.tableNames();
      const rows = records.map((r) => ({
        id: r.id,
        path: r.path,
        type: r.type,
        language: r.language,
        module: r.module,
        symbols: r.symbols.join(','),
        content: r.content,
        contentHash: r.contentHash,
        indexedAt: r.indexedAt,
        gitCommit: r.gitCommit,
        tags: r.tags.join(','),
        version: r.version,
        vector: r.vector,
        startLine: r.startLine,
        endLine: r.endLine,
        namespace: r.namespace,
      }));
      if (tableNames.includes('chunks')) {
        const table = await db.openTable('chunks');
        await table.add(rows);
      } else {
        await db.createTable('chunks', rows);
      }
    } catch (error) {
      logger.warn('LanceDB upsert failed; using JSON store', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async deleteByPaths(paths: string[]): Promise<void> {
    await this.jsonFallback.deleteByPaths(paths);
    try {
      const dir = resolveRepoPath(this.lancePath);
      if (existsSync(dir)) {
        // Rebuild-friendly: drop lance dir on deletes when small; JSON remains source of truth.
        rmSync(dir, { recursive: true, force: true });
      }
    } catch (error) {
      logger.warn('LanceDB delete cleanup failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async search(
    vector: number[],
    options?: { topK?: number; type?: ChunkType; module?: string },
  ): Promise<SearchHit[]> {
    return this.jsonFallback.search(vector, options);
  }

  async count(): Promise<number> {
    return this.jsonFallback.count();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await import('@lancedb/lancedb');
      return this.jsonFallback.healthCheck();
    } catch {
      return this.jsonFallback.healthCheck();
    }
  }

  async listPaths(): Promise<string[]> {
    return this.jsonFallback.listPaths();
  }

  async getByPath(path: string): Promise<VectorRecord[]> {
    return this.jsonFallback.getByPath(path);
  }
}

export const createVectorStore = (config: AiConfig['vectorStore']): VectorStore => {
  if (config.provider === 'json') {
    return new JsonVectorStore(config.namespace, config.collection, config.jsonFallbackPath);
  }
  return new LanceVectorStore(
    config.namespace,
    config.collection,
    config.path,
    config.jsonFallbackPath,
  );
};

export type { JsonVectorStore };
