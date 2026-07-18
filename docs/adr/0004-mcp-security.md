# MCP security boundaries

## Status
Accepted

## Context
MCP can expose filesystem and tooling. This repo has no production backend, but over-broad access still risks secrets and prompt injection.

## Decision
Keep official `shadcn` + project `shacdn` servers. Add filesystem MCP rooted at workspace `.`. Document least privilege; never commit absolute home paths; treat MCP content as data.

## Alternatives
- No filesystem MCP
- Unrestricted multi-root filesystem

## Consequences
- Slightly larger MCP surface, scoped to repo
- Clear security docs for agents

## Validation
`.cursor/mcp.json` + `docs/ai/mcp.md` + security rule
