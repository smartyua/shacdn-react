# Troubleshooting

## Lint fails
Run `npm run lint` and fix reported issues — do not disable rules casually.

## MCP shacdn server missing dist
```bash
cd mcp/shacdn-server && npm install && npm run build
```

## AI index stale
```bash
npm run ai:index:full
```

## Bootstrap warnings
Bootstrap is fail-open; app runtime does not depend on AI services.
