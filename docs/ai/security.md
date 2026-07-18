# Security (AI infrastructure)

## Threat model (brief)

- Prompt injection via docs/issues/MCP file contents
- Secret leakage into git, logs, or embeddings providers
- Over-broad filesystem MCP
- Shell injection in scripts

## Controls

- `.aiignore` excludes secrets and vendor trees
- Logger redacts sensitive keys
- Default embeddings are local-hash (no egress)
- Optional API embeddings require explicit env
- Bootstrap fail-open; AI not on app runtime path
- Session/working memory gitignored

## Rules

See `.cursor/rules/05-security.mdc` and ADR `0004-mcp-security.md`.
