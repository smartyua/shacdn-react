# Architecture

Generated: 2026-07-18T11:24:30.321Z

## Style
- Pure React primitives — no Radix / no external UI kits
- One folder per component: `Component.tsx` + `Component.module.scss`
- Design tokens only in `src/styles/variables.scss`
- Themes via `src/styles/globals.scss`

## Layers
1. Design tokens / globals
2. UI components (`src/components`)
3. Demo screens (`src/screens`)
4. MCP export server (`mcp/shacdn-server`)
5. AI tooling (`.ai`) — isolated from app runtime

## Non-goals
- No application backend or database in this repo
