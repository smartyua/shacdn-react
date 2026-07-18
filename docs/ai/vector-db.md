# Vector database

## Default (lean)

- Provider config: `lancedb` with **JSON fallback** under `.ai/data/json-index/`
- Search always works via JSON cosine similarity over local-hash vectors
- LanceDB upsert is best-effort (native install scripts may be blocked)

## Optional Qdrant

```bash
AI_VECTOR_PROVIDER=qdrant npm run ai:start
docker compose -f docker-compose.ai.yml up -d
```

Not wired as the primary search backend in lean mode; reserved for future upgrade.

## Metadata

Each chunk stores path, type, language, module, symbols, contentHash, indexedAt, gitCommit, tags, version.
