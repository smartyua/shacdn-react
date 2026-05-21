# shacdn MCP Server

MCP server for AI agents to integrate **shacdn** (React + SCSS shadcn/ui) into other projects.

**Human-readable guide:** [docs/INTEGRATION_GUIDE.md](../../docs/INTEGRATION_GUIDE.md)

## Setup in Cursor

1. Build the server:
   ```bash
   cd mcp/shacdn-server && npm install && npm run build
   ```
2. Enable **shacdn** in Cursor → Settings → MCP (configured in `.cursor/mcp.json`).

## Tools

| Tool | Description |
|------|-------------|
| `list_components` | Catalog of all components |
| `search_components` | Search by name/task |
| `get_component` | TSX + SCSS for one component |
| `get_component_bundle` | Component + dependencies (copy order) |
| `get_design_system` | `variables.scss` / `globals.scss` |
| `get_integration_guide` | Bootstrap guide for consumer project |
| `list_screen_patterns` | Landing/showcase patterns |
| `get_screen_pattern` | Screen source + component bundle |

## Typical agent workflow

```
search_components("login form")
  → get_integration_guide(["Button","Input","Label","Card"])
  → get_design_system("both")
  → get_component_bundle(["Button","Input","Label","Card"])
```

## Related docs

- `docs/INTEGRATION_GUIDE.md` — main integration guide for other projects
- `docs/AI_AGENT_GUIDE.md` — migration patterns
- `.cursor/rules/shacdn-mcp.mdc` — Cursor rule for agents

## vs official shadcn MCP

- **shadcn MCP** — Tailwind registry reference for parity audits
- **shacdn MCP** — actual SCSS source from this repo for copy/integration

## Development

```bash
npm run dev   # tsx watch
npm run build # tsc → dist/
```
