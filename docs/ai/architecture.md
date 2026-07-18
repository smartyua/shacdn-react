# Architecture

```
Cursor rules/skills/MCP
        │
        ▼
.ai/scripts (tsx) ──► .ai/lib (config, embeddings, index, rag)
        │
        ├──► .ai/knowledge (markdown KB)
        ├──► .ai/memory (working/episodic/semantic/…)
        └──► .ai/data (gitignored LanceDB attempt + JSON index)
```

## Principles

1. Isolated from app runtime
2. Fail-open bootstrap
3. Local-hash embeddings by default (no private code leaving the machine)
4. JSON vector index as reliable source of truth; LanceDB best-effort
5. Incremental indexing on open; full index on demand
