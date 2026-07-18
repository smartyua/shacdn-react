# Troubleshooting

## Bootstrap prints WARN but exits 0

Expected with `failOpen: true`. Fix the WARN when you need full AI features; app still runs.

## Index empty / RAG weak

```bash
npm run ai:index:full
npm run ai:rag -- "your query"
```

## MCP shacdn fails

```bash
cd mcp/shacdn-server && npm install && npm run build
```

## LanceDB native warnings

Safe to ignore; JSON index is the reliable store.

## Folder-open task did not run

Run `npm run ai:bootstrap` manually (bootstrap no longer auto-runs on folder open).

## Tests fail after pull

```bash
npm install
npm run test:ai
```
