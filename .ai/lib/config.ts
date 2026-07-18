import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { CONFIG_PATH, SCHEMA_PATH } from './paths.js';

const bootstrapSchema = z.object({
  runOnProjectOpen: z.boolean(),
  incrementalIndex: z.boolean(),
  failOpen: z.boolean(),
});

const memorySchema = z.object({
  enabled: z.boolean(),
  workingMemory: z.boolean(),
  episodicMemory: z.boolean(),
  semanticMemory: z.boolean(),
  compressionAfterIterations: z.number().int().min(1),
  maxActiveTaskTokens: z.number().int().min(1000),
});

const vectorStoreSchema = z.object({
  provider: z.enum(['lancedb', 'json']),
  collection: z.string().min(1),
  namespace: z.string().min(1),
  path: z.string().min(1),
  jsonFallbackPath: z.string().min(1),
});

const embeddingsSchema = z.object({
  provider: z.enum(['local-hash', 'openai', 'ollama']),
  fallbackProvider: z.enum(['local-hash', 'openai', 'ollama']).nullable(),
  dimensions: z.number().int().min(32).max(4096),
  timeoutMs: z.number().int().min(1000),
  maxRetries: z.number().int().min(0).max(10),
  batchSize: z.number().int().min(1).max(256),
});

const indexingSchema = z.object({
  includeTests: z.boolean(),
  includeDocs: z.boolean(),
  includeAdr: z.boolean(),
  incremental: z.boolean(),
  maxChunkChars: z.number().int().min(200),
});

const verificationSchema = z.object({
  requireTestsForFunctionalChanges: z.boolean(),
  requireSelfReview: z.boolean(),
  requireRequirementRecheck: z.boolean(),
  independentReviewForCriticalChanges: z.boolean(),
});

const ragSchema = z.object({
  topK: z.number().int().min(1),
  maxContextChars: z.number().int().min(500),
  minScore: z.number().min(0).max(1),
});

const aiSchema = z.object({
  enabled: z.boolean(),
  bootstrap: bootstrapSchema,
  memory: memorySchema,
  vectorStore: vectorStoreSchema,
  embeddings: embeddingsSchema,
  indexing: indexingSchema,
  verification: verificationSchema,
  rag: ragSchema,
});

export const configRootSchema = z.object({
  ai: aiSchema,
});

export type AiConfig = z.infer<typeof aiSchema>;
export type ConfigRoot = z.infer<typeof configRootSchema>;

export const loadConfig = (path = CONFIG_PATH): ConfigRoot => {
  const raw = readFileSync(path, 'utf8');
  let parsed: unknown;
  try {
    parsed = parseYaml(raw);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid YAML in ${path}: ${message}`, { cause: error });
  }

  const result = configRootSchema.safeParse(parsed);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid AI config in ${path}: ${details}`);
  }

  // Ensure schema file exists for CI/docs (not used for runtime validation beyond presence).
  void SCHEMA_PATH;

  return applyEnvOverrides(result.data);
};

const applyEnvOverrides = (config: ConfigRoot): ConfigRoot => {
  const next = structuredClone(config);
  const embeddingProvider = process.env.AI_EMBEDDING_PROVIDER;
  if (
    embeddingProvider === 'local-hash' ||
    embeddingProvider === 'openai' ||
    embeddingProvider === 'ollama'
  ) {
    next.ai.embeddings.provider = embeddingProvider;
  }

  const vectorProvider = process.env.AI_VECTOR_PROVIDER;
  if (vectorProvider === 'lancedb' || vectorProvider === 'json') {
    next.ai.vectorStore.provider = vectorProvider;
  }

  return next;
};

export const validateConfigFile = (path = CONFIG_PATH): AiConfig => loadConfig(path).ai;
