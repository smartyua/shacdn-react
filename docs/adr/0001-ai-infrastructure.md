# Lean AI infrastructure for Cursor

## Status
Accepted

## Context
Agents repeatedly re-discover the component library, burn tokens, and skip verification. The repo already has Cursor rules, MCP, and AI docs, but no durable memory, indexing, or bootstrap.

## Decision
Add an isolated `.ai/` toolkit (config, memory, knowledge, embeddings, index, RAG, skills, agents, scripts) that bootstraps on folder open and fails open so UI development never depends on AI services.

## Alternatives
- Do nothing (status quo)
- Heavy platform with mandatory Docker vector DB and remote embeddings

## Consequences
- Extra npm scripts and Vitest coverage for AI libs
- Agents gain reproducible context with lower re-research cost
- Operators must allow automatic tasks once in Cursor

## Validation
`npm run ai:verify`, `npm run test:ai`, `npm run lint`, `npm run build`
