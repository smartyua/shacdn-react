# AI infrastructure (shacdn)

Lean, fail-open tooling for Cursor agents. **Does not affect** `npm run dev` / production UI runtime.

## What was created

- `.ai/` — config, libs, scripts, memory, knowledge, skills, agents
- Cursor rules `00-*` … `20-*` (additive to existing design rules)
- Vitest suite for AI libs (`.ai/tests/`)
- Optional `docker-compose.ai.yml` (Qdrant; off by default)
- Opt-in bootstrap via `.vscode/tasks.json` / `npm run ai:bootstrap` (not auto on folder open)

## Install

```bash
npm install
```

Optional MCP server build:

```bash
cd mcp/shacdn-server && npm install && npm run build && cd ../..
```

## Run / check

```bash
npm run ai:bootstrap    # dirs, config, incremental index (fail-open)
npm run ai:health       # human-readable status
npm run ai:verify       # setup completeness
npm run test:ai         # Vitest
npm run typecheck:ai
```

## Index

```bash
npm run ai:index              # incremental (default)
npm run ai:index:incremental
npm run ai:index:full
npm run ai:rag -- "button scss tokens"
```

## Memory cleanup

```bash
npm run ai:memory:cleanup
```

## Knowledge update

```bash
npm run ai:knowledge:update
```

## Add a skill

Create `.ai/skills/<name>/SKILL.md` using the existing skill template sections (When / Inputs / Steps / Checks / Forbidden / Done).

## Add MCP

Edit `.cursor/mcp.json`. Prefer relative paths. Document in `docs/ai/mcp.md`.

## Disable a service

- AI entirely: set `ai.enabled: false` in `.ai/config.yaml` (scripts still validate config)
- External vector: keep lean defaults (no Docker). Do not set `AI_VECTOR_PROVIDER=qdrant`
- Embeddings API: leave `embeddings.provider: local-hash`

## Local / not committed

- `.ai/data/**` (index + caches)
- `.ai/logs/**`
- `.ai/session/**`
- `.ai/memory/working/**`
- `.env`

## Automatic on project open

Task **AI: Bootstrap Project** runs `npm run ai:bootstrap` manually (lean default: `runOnProjectOpen: false`).

Cursor/VS Code may ask once to allow automatic tasks — accept to enable.

## More

- [setup.md](./setup.md)
- [architecture.md](./architecture.md)
- [troubleshooting.md](./troubleshooting.md)
