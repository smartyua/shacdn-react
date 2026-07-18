# Setup

## Prerequisites

- Node.js 20+ recommended
- npm
- Docker only if you opt into Qdrant

## Steps

1. `npm install`
2. Copy `.env.example` → `.env` only if using OpenAI/Ollama/Qdrant
3. **Opt-in** AI bootstrap (not run on folder open): `npm run ai:bootstrap` or VS Code task **AI: Bootstrap Project**
4. `npm run ai:health`

`ai.bootstrap.runOnProjectOpen` is `false` in `.ai/config.yaml` (lean default). Set to `true` only if you want auto-index on open.

## MCP

Ensure `.cursor/mcp.json` is loaded by Cursor. Build `mcp/shacdn-server` if the `shacdn` server fails to start.
