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
| `get_design_system` | `variables.scss` / `globals.scss` / `theme.ts` |
| `get_integration_guide` | Bootstrap guide for consumer project |
| `install_to_project` | **Write** tokens (+ optional components) into a target folder |
| `list_screen_patterns` | Landing/showcase patterns |
| `get_screen_pattern` | Screen source + component bundle |

## Typical agent workflow

```
search_components("login form")
  → install_to_project({ targetDir: "/path/to/app", components: ["Button","Input","Label","Card"] })
```

Or copy-only (no writes): `get_design_system` then `get_component_bundle`.

## CLI (same installer)

From the shacdn repo root:

```bash
npm run shacdn:install -- /path/to/your-app
npm run shacdn:install -- /path/to/your-app --components Button,Card --dry-run
```

## Related docs

- `docs/INTEGRATION_GUIDE.md` — main integration guide for other projects
- `docs/STYLE_GUIDE.md` — tokens & patterns
- `.cursor/rules/shacdn-mcp.mdc` — Cursor rule for agents

## vs official shadcn MCP

- **shadcn MCP** — Tailwind registry reference for parity audits
- **shacdn MCP** — actual SCSS source from this repo for copy/integration

## Development

```bash
npm run dev   # tsx watch
npm run build # tsc → dist/
```
