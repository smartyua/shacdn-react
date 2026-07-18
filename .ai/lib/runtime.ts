import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig, type AiConfig } from './config.js';
import { createEmbeddingProvider, type EmbeddingProvider } from './embeddings.js';
import {
  AI_ROOT,
  DATA_DIR,
  KNOWLEDGE_DIR,
  LOGS_DIR,
  MEMORY_DIR,
  SESSION_DIR,
} from './paths.js';
import { createVectorStore, type VectorStore } from './vector-store.js';

export interface AiRuntime {
  config: AiConfig;
  embeddings: EmbeddingProvider;
  store: VectorStore;
}

const MEMORY_SUBDIRS = [
  'working',
  'episodic',
  'semantic',
  'decisions',
  'patterns',
  'failures',
  'preferences',
];

export const ensureAiDirectories = (): void => {
  for (const dir of [AI_ROOT, DATA_DIR, LOGS_DIR, SESSION_DIR, KNOWLEDGE_DIR, MEMORY_DIR]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
  for (const sub of MEMORY_SUBDIRS) {
    const path = join(MEMORY_DIR, sub);
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }
  const keep = [
    join(LOGS_DIR, '.gitkeep'),
    join(DATA_DIR, '.gitkeep'),
    join(SESSION_DIR, '.gitkeep'),
  ];
  for (const file of keep) {
    if (!existsSync(file)) writeFileSync(file, '', 'utf8');
  }
};

export const createRuntime = (): AiRuntime => {
  ensureAiDirectories();
  const root = loadConfig();
  const config = root.ai;
  return {
    config,
    embeddings: createEmbeddingProvider(config.embeddings),
    store: createVectorStore(config.vectorStore),
  };
};
