# Design reference

Canonical visual source: [ui.shadcn.com](https://ui.shadcn.com).

This repo implements the same primitives with **SCSS modules** (no Tailwind, no Radix). When adding or reviewing UI:

1. Open the matching component on ui.shadcn.com (structure, variants, sizes).
2. Map Tailwind registry sizes to `src/styles/variables.scss` (`$control-h-sm/md/lg`, `$radius-md`, `$font-size-sm`, focus ring).
3. Prefer **shadcn MCP** for registry source — translate to SCSS; do not paste Tailwind.
4. Record gaps in [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md).

## Tokens

| Layer | File |
|-------|------|
| SCSS tokens + `alpha()` | `src/styles/variables.scss` |
| CSS variables, light/dark, schemes | `src/styles/globals.scss` |
| `data-theme` helpers | `src/styles/theme.ts` |
| Workspace package | `@shacdn/tokens` |

Dark-mode `--border` / `--input` already include alpha. Use `alpha($border, 50%)`, never `hsl(var(--border) / 0.5)`.

## Pixel-perfect loop

1. Implement against tokens, not hex.
2. Compare in `/components` showcase and Ladle (`npm run ladle`) where stories exist.
3. Keyboard: Tab, Escape, Arrow keys on menus; focus ring `$focus-ring-width`.
4. `npm run lint` + `npm test` + `npm run build`.
