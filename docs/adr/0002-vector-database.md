# Vector store: LanceDB config with JSON fallback

## Status
Accepted

## Context
No application PostgreSQL. Mandatory Docker Qdrant would violate lean goals. LanceDB native deps may fail under blocked install scripts.

## Decision
Configure `vectorStore.provider: lancedb` but treat a JSON cosine index under `.ai/data/json-index/` as the reliable source of truth. Lance upsert is best-effort. Optional Qdrant compose exists but is off by default.

## Alternatives
- PostgreSQL + pgvector (no DB in project)
- Mandatory Qdrant
- Pure ripgrep without vectors

## Consequences
- Offline RAG works without Docker
- Native Lance issues do not break bootstrap
- Future upgrade path to Qdrant remains documented

## Validation
Index + RAG unit tests; `npm run ai:index` produces searchable hits
