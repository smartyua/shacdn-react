# Memory model

See ADR `docs/adr/0003-memory-model.md`.

| Layer | Path | Lifetime |
|-------|------|----------|
| Working | `.ai/memory/working/` | Task (gitignored) |
| Session task state | `.ai/session/current-task.md` | Task (gitignored) |
| Episodic | `.ai/memory/episodic/` | Durable summaries |
| Semantic | `.ai/memory/semantic/` | Stable facts |
| Decisions | `.ai/memory/decisions/` + `docs/adr/` | Durable |
| Patterns | `.ai/memory/patterns/` | Confirmed only |
| Failures | `.ai/memory/failures/` | Durable |
| Preferences | `.ai/memory/preferences/` | Durable |

Compress after 3–5 iterations (`07-context-management.mdc`).
