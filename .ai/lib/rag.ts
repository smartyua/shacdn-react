import type { AiConfig } from './config.js';
import type { ChunkType } from './chunker.js';
import type { EmbeddingProvider } from './embeddings.js';
import { logger } from './logger.js';
import type { SearchHit, VectorStore } from './vector-store.js';

export interface RagSource {
  path: string;
  startLine: number;
  endLine: number;
  type: ChunkType;
  score: number;
  symbols: string[];
}

export interface RagResult {
  query: string;
  context: string;
  sources: RagSource[];
  confidence: 'high' | 'medium' | 'low';
  conflicts: string[];
  usedSecondPass: boolean;
}

const dedupeHits = (hits: SearchHit[]): SearchHit[] => {
  const seen = new Set<string>();
  const out: SearchHit[] = [];
  for (const hit of hits) {
    const key = `${hit.record.path}:${hit.record.startLine}:${hit.record.contentHash}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(hit);
  }
  return out;
};

const rerank = (hits: SearchHit[], query: string): SearchHit[] => {
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2);
  return [...hits]
    .map((hit) => {
      const hay = `${hit.record.path} ${hit.record.symbols.join(' ')} ${hit.record.content}`.toLowerCase();
      const bonus = terms.reduce((acc, term) => acc + (hay.includes(term) ? 0.02 : 0), 0);
      return { ...hit, score: hit.score + bonus };
    })
    .sort((a, b) => b.score - a.score);
};

const confidenceFor = (hits: SearchHit[]): 'high' | 'medium' | 'low' => {
  if (hits.length === 0) return 'low';
  const top = hits[0].score;
  const distinctPaths = new Set(hits.slice(0, 5).map((h) => h.record.path)).size;
  if (top >= 0.35 && distinctPaths >= 2) return 'high';
  if (top >= 0.2 || distinctPaths >= 2) return 'medium';
  return 'low';
};

const detectConflicts = (hits: SearchHit[]): string[] => {
  const conflicts: string[] = [];
  const byModule = new Map<string, SearchHit[]>();
  for (const hit of hits.slice(0, 8)) {
    const list = byModule.get(hit.record.module) ?? [];
    list.push(hit);
    byModule.set(hit.record.module, list);
  }
  for (const [module, list] of byModule) {
    const types = new Set(list.map((h) => h.record.type));
    if (types.has('documentation') && types.has('source') && list.length >= 2) {
      // Prefer source over docs when both present — flag for agent awareness.
      conflicts.push(
        `Module "${module}" has both source and documentation hits; prefer executable source.`,
      );
    }
  }
  return conflicts;
};

const buildContext = (hits: SearchHit[], maxChars: number): string => {
  const parts: string[] = [];
  let size = 0;
  for (const hit of hits) {
    const block = [
      `### ${hit.record.path}:${hit.record.startLine}-${hit.record.endLine}`,
      `type=${hit.record.type} score=${hit.score.toFixed(3)}`,
      hit.record.content,
      '',
    ].join('\n');
    if (size + block.length > maxChars) break;
    parts.push(block);
    size += block.length;
  }
  return parts.join('\n');
};

const expandQuery = (query: string): string => {
  const extras: string[] = [];
  if (/component|button|input|dialog/i.test(query)) extras.push('src/components SCSS module');
  if (/theme|color|token/i.test(query)) extras.push('variables.scss globals theme');
  if (/mcp|export|bundle/i.test(query)) extras.push('mcp/shacdn-server catalog');
  if (/test|lint|verify/i.test(query)) extras.push('eslint vitest ai verification');
  return [query, ...extras].join(' ');
};

export const runRag = async (options: {
  query: string;
  config: AiConfig;
  store: VectorStore;
  embeddings: EmbeddingProvider;
  type?: ChunkType;
  module?: string;
}): Promise<RagResult> => {
  const { query, config, store, embeddings, type, module } = options;
  const vector = await embeddings.embedText(query);
  let hits = await store.search(vector, {
    topK: config.rag.topK,
    type,
    module,
  });
  hits = rerank(dedupeHits(hits), query).filter((h) => h.score >= config.rag.minScore);

  let usedSecondPass = false;
  if (hits.length < 3 || confidenceFor(hits) === 'low') {
    usedSecondPass = true;
    const secondVector = await embeddings.embedText(expandQuery(query));
    const second = await store.search(secondVector, {
      topK: config.rag.topK,
      type,
      module,
    });
    hits = rerank(dedupeHits([...hits, ...second]), query).filter(
      (h) => h.score >= config.rag.minScore,
    );
  }

  const confidence = confidenceFor(hits);
  const conflicts = detectConflicts(hits);
  const context = buildContext(hits, config.rag.maxContextChars);
  const sources: RagSource[] = hits.slice(0, config.rag.topK).map((hit) => ({
    path: hit.record.path,
    startLine: hit.record.startLine,
    endLine: hit.record.endLine,
    type: hit.record.type,
    score: hit.score,
    symbols: hit.record.symbols,
  }));

  logger.info('RAG query complete', {
    query: query.slice(0, 120),
    hits: sources.length,
    confidence,
    usedSecondPass,
  });

  return {
    query,
    context,
    sources,
    confidence,
    conflicts,
    usedSecondPass,
  };
};
