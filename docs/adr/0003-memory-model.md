# Multi-layer memory model

## Status
Accepted

## Context
Chat history alone is lossy across sessions. Full transcript storage is noisy and risky.

## Decision
Use structured folders under `.ai/memory/` (working, episodic, semantic, decisions, patterns, failures, preferences) plus `.ai/session/current-task.md` for compression. Store facts/summaries only; gitignore working/session data.

## Alternatives
- Single NOTES.md
- External hosted memory service

## Consequences
- Agents must read/write memory intentionally
- Conflict resolution prefers executable code over memory

## Validation
Rules `06-memory.mdc` / `07-context-management.mdc`; cleanup script present
