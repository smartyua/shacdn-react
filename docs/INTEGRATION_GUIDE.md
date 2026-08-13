# Integration guide — use shacdn in another project

shacdn is **copied** into your app (shadcn-style), not installed as an npm UI kit. The design system is the `src/styles/` folder: tokens, CSS variables, and theme helpers.

## One command (recommended)

From this repository, point at the consumer project folder:

```bash
npm run shacdn:install -- /path/to/your-app
```

That copies:

| File | Role |
|------|------|
| `src/styles/variables.scss` | SCSS tokens (`$primary`, `$control-h-md`, `alpha()`, …) |
| `src/styles/globals.scss` | CSS variables, light/dark, color schemes |
| `src/styles/theme.ts` | `applyTheme` / `readStoredTheme` / `persistTheme` |
| `src/styles/theme-init.ts` | Applies stored theme on import (before first paint) |
| `src/lib/cn.ts` | `cn()` className helper |

In a **workspace / `file:` install** of this repo you can also import `@shacdn/tokens/globals.scss` and `@shacdn/tokens/variables.scss`.

and prepends these imports on `src/main.tsx` (or `app/layout.tsx` / `_app.tsx` if found):

```tsx
import './styles/theme-init';
import './styles/globals.scss';
```

### With components

```bash
npm run shacdn:install -- /path/to/your-app --components Button,Card,Input,Label
```

Dependencies (Dialog → Modal/`modalLayer.tsx`, Select → Floating, …) are copied automatically. Existing files are left alone unless you pass `--force`. Preview with `--dry-run`.

### MCP

In Cursor, the **shacdn** server tool `install_to_project` does the same thing: pass `targetDir` (and optional `components`).

## Manual copy

1. `npm install -D sass` in the consumer app (React already required).
2. Copy `src/styles/` as a whole — do not split `variables.scss` from `globals.scss`.
3. Import `theme-init` then `globals.scss` in the app entry.
4. Copy component folders **entirely** (every `.tsx` / `.ts` / `.module.scss` except tests and stories). Skip **demo-only** `Locale` and `SiteHeader`.
5. Copy `src/lib/cn.ts` if components use `cn()`.
6. In each SCSS module:

```scss
@use '../../styles/variables.scss' as *;
```

## Theming

`data-theme` on `<html>`:

- `dark`
- `blue`, `green`, `purple`, `orange`, `rose`
- combined: `dark blue`

`ThemeSwitcher` does not need `LocaleProvider`. Pass `labels` only if you want i18n.

## Checklist

- [ ] `sass` is installed
- [ ] `src/styles/` is present and imported from the entry
- [ ] Component SCSS uses `@use` (not `@import`) of `variables.scss`
- [ ] No Tailwind in copied files
- [ ] Providers added when using Toast / Tooltip
- [ ] `npm run lint` and `npm run build` pass in the consumer app

## Related

- [STYLE_GUIDE.md](./STYLE_GUIDE.md) — token reference
- [mcp/shacdn-server/README.md](../mcp/shacdn-server/README.md) — MCP tools

## MCP config note

`.cursor/mcp.json` currently starts `shadcn`, `shacdn`, and `filesystem` as local processes (not Runlayer-managed). Treat them as **shadow MCPs** for org policy: prefer a Runlayer-managed server when one exists; do not add new unmanaged servers without review.

