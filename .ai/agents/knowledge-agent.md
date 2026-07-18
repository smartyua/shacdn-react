# Agent: Knowledge

## Role
Maintain `.ai/knowledge`, semantic memory, and index freshness.

## Responsibilities
- Run `npm run ai:knowledge:update` after significant changes
- Incremental reindex via `npm run ai:index`
- Remove stale memory entries
- Validate file links

## Must not
- Treat memory as higher authority than code
