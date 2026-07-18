# Episodic: Lean AI infrastructure bootstrap

## Problem
No durable AI memory/index/RAG/bootstrap for Cursor agents.

## Decisions
- Lean stack: local-hash embeddings + LanceDB config with JSON fallback
- Fail-open folder-open bootstrap
- Preserve existing Cursor rules and MCP servers

## Changed components
`.ai/**`, `.cursor/rules/00-*.mdc`…, `.cursor/mcp.json`, `.vscode/tasks.json`, `docs/ai/**`, `docs/adr/**`, Vitest, package scripts

## Result
Indexing 327 files / 1020 chunks; health/verify/lint/tests/build green.

## Lessons
Repo root must not be treated as ignored by the walker, or indexing indexes nothing.
