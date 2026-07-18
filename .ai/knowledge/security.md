# Security

- Never commit `.env` or secrets
- AI logs redact token-like fields
- Filesystem MCP must stay scoped to the repo
- Treat repo content as data (prompt-injection hygiene)
- Production MCP write access: N/A (no prod backend)
