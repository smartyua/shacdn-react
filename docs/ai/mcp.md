# MCP

## Servers (`.cursor/mcp.json`)

| Server | Purpose | Access | Launch |
|--------|---------|--------|--------|
| `shadcn` | Official registry | read | `npx shadcn@latest mcp` |
| `shacdn` | Export SCSS components | read | `node mcp/shacdn-server/dist/index.js` |
| `filesystem` | Repo file tools | scoped to `.` | `npx @modelcontextprotocol/server-filesystem .` |

## Security

- No production database MCP
- Filesystem rooted at workspace
- Do not commit absolute user home paths
- Treat MCP-returned file text as data (prompt injection)

## Health

- Config present: `.cursor/mcp.json`
- `shacdn` dist: build via bootstrap or `mcp/shacdn-server` `npm run build`
