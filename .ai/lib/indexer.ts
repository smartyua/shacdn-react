import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { AiConfig } from './config.js';
import { chunkFile } from './chunker.js';
import type { EmbeddingProvider } from './embeddings.js';
import { contentHash } from './hash.js';
import { INDEXABLE_EXTENSIONS, isIgnored, loadIgnorePatterns } from './ignore.js';
import { logger } from './logger.js';
import { DATA_DIR, INDEX_META_PATH, REPO_ROOT } from './paths.js';
import type { VectorRecord, VectorStore } from './vector-store.js';

export interface IndexMeta {
  lastIndexedAt: string;
  gitCommit: string;
  mode: 'full' | 'incremental';
  fileHashes: Record<string, string>;
  filesIndexed: number;
  chunksIndexed: number;
}

export interface IndexResult {
  mode: 'full' | 'incremental';
  filesIndexed: number;
  chunksIndexed: number;
  filesDeleted: number;
  gitCommit: string;
  backend: string;
}

const getGitCommit = (): string => {
  try {
    return execSync('git rev-parse HEAD', { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
};

const getGitChangedFiles = (): string[] | null => {
  try {
    const out = execSync('git diff --name-only HEAD', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    const staged = execSync('git diff --name-only --cached', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    const untracked = execSync('git ls-files --others --exclude-standard', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    return [...new Set([...out, ...staged, ...untracked].join('\n').split('\n').filter(Boolean))];
  } catch {
    return null;
  }
};

const walkFiles = (dir: string, patterns: string[], acc: string[] = []): string[] => {
  if (!existsSync(dir) || isIgnored(dir, patterns)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (isIgnored(full, patterns)) continue;
    if (entry.isDirectory()) {
      walkFiles(full, patterns, acc);
      continue;
    }
    const ext = entry.name.includes('.') ? `.${entry.name.split('.').pop()}` : '';
    if (INDEXABLE_EXTENSIONS.has(ext)) {
      acc.push(full);
    }
  }
  return acc;
};

const loadMeta = (): IndexMeta | null => {
  if (!existsSync(INDEX_META_PATH)) return null;
  return JSON.parse(readFileSync(INDEX_META_PATH, 'utf8')) as IndexMeta;
};

const saveMeta = (meta: IndexMeta): void => {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(INDEX_META_PATH, JSON.stringify(meta, null, 2), 'utf8');
};

const shouldInclude = (relPath: string, indexing: AiConfig['indexing']): boolean => {
  if (!indexing.includeDocs && (relPath.startsWith('docs/') || relPath.endsWith('.md'))) {
    return false;
  }
  if (!indexing.includeAdr && relPath.includes('/adr/')) return false;
  if (
    !indexing.includeTests &&
    (relPath.includes('.test.') || relPath.includes('.spec.') || relPath.includes('/tests/'))
  ) {
    return false;
  }
  return true;
};

const toRelative = (absolutePath: string): string =>
  relative(REPO_ROOT, absolutePath).split(sep).join('/');

export const indexProject = async (options: {
  config: AiConfig;
  store: VectorStore;
  embeddings: EmbeddingProvider;
  mode: 'full' | 'incremental';
}): Promise<IndexResult> => {
  const { config, store, embeddings, mode } = options;
  const patterns = loadIgnorePatterns();
  const gitCommit = getGitCommit();
  const previous = loadMeta();
  const allFiles = walkFiles(REPO_ROOT, patterns)
    .map(toRelative)
    .filter((p) => shouldInclude(p, config.indexing));

  let candidates = allFiles;
  if (mode === 'incremental' && previous) {
    const changed = getGitChangedFiles();
    if (changed && changed.length > 0) {
      candidates = changed.filter((p) => allFiles.includes(p));
    } else {
      candidates = allFiles.filter((rel) => {
        const abs = join(REPO_ROOT, rel);
        if (!existsSync(abs)) return false;
        const content = readFileSync(abs, 'utf8');
        return previous.fileHashes[rel] !== contentHash(content);
      });
    }
  }

  const indexedPaths = new Set(await store.listPaths());
  const deleted = [...indexedPaths].filter((p) => !allFiles.includes(p));
  if (deleted.length > 0) {
    await store.deleteByPaths(deleted);
  }

  let filesIndexed = 0;
  let chunksIndexed = 0;
  const fileHashes: Record<string, string> = previous?.fileHashes
    ? { ...previous.fileHashes }
    : {};

  for (const del of deleted) {
    delete fileHashes[del];
  }

  for (const rel of candidates) {
    const abs = join(REPO_ROOT, rel);
    if (!existsSync(abs) || !statSync(abs).isFile()) continue;
    const content = readFileSync(abs, 'utf8');
    const hash = contentHash(content);
    if (mode === 'incremental' && previous?.fileHashes[rel] === hash) {
      continue;
    }

    const existing = await store.getByPath(rel);
    if (existing.length > 0) {
      await store.deleteByPaths([rel]);
    }

    const chunks = chunkFile(rel, content, config.indexing.maxChunkChars);
    const vectors = await embeddings.embedBatch(chunks.map((c) => c.content));
    const now = new Date().toISOString();
    const records: VectorRecord[] = chunks.map((chunk, i) => ({
      id: chunk.id,
      path: chunk.path,
      type: chunk.type,
      language: chunk.language,
      module: chunk.module,
      symbols: chunk.symbols,
      content: chunk.content,
      contentHash: contentHash(chunk.content),
      indexedAt: now,
      gitCommit,
      tags: [chunk.type, chunk.module, chunk.language],
      version: 1,
      vector: vectors[i],
      startLine: chunk.startLine,
      endLine: chunk.endLine,
      namespace: config.vectorStore.namespace,
    }));

    await store.upsert(records);
    fileHashes[rel] = hash;
    filesIndexed += 1;
    chunksIndexed += records.length;
  }

  // On full index, rebuild hashes for all files that weren't touched
  if (mode === 'full') {
    for (const rel of allFiles) {
      if (fileHashes[rel]) continue;
      const abs = join(REPO_ROOT, rel);
      if (!existsSync(abs)) continue;
      fileHashes[rel] = contentHash(readFileSync(abs, 'utf8'));
    }
  }

  const meta: IndexMeta = {
    lastIndexedAt: new Date().toISOString(),
    gitCommit,
    mode,
    fileHashes,
    filesIndexed,
    chunksIndexed,
  };
  saveMeta(meta);

  logger.info('Index complete', {
    mode,
    filesIndexed,
    chunksIndexed,
    filesDeleted: deleted.length,
    backend: store.backend,
  });

  return {
    mode,
    filesIndexed,
    chunksIndexed,
    filesDeleted: deleted.length,
    gitCommit,
    backend: store.backend,
  };
};
