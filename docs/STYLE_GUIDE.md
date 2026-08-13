# Style guide — tokens

Canonical files: `src/styles/variables.scss` (SCSS) and `src/styles/globals.scss` (CSS variables + themes).

Import into another project with `npm run shacdn:install -- /path/to/app` (see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)).

## SCSS usage

```scss
@use '../../styles/variables.scss' as *;

.button {
  height: $control-h-md;
  border-radius: $radius-md;
  background: $primary;
  color: $primary-foreground;
  font-family: $font-sans;
  font-size: $font-size-sm;
  transition: background-color $transition-fast;

  &:focus-visible {
    outline: $focus-ring-width solid $ring;
    outline-offset: $focus-ring-offset;
  }
}
```

Do not hardcode hex or `hsl(...)` in component modules. Dark-mode `--border` / `--input` already include alpha — use `alpha($border, 50%)` (defined in `variables.scss`) instead of `hsl(var(--border) / 0.5)`.

Class names in TSX: `cn(styles.button, variant && styles[variant], className)` from `src/lib/cn.ts`.

## Control heights (shadcn v4)

| Token | Size | Typical use |
|-------|------|-------------|
| `$control-h-xs` | 1.5rem (24px) | button xs |
| `$control-h-sm` | 1.75rem (28px) | button sm |
| `$control-h-md` | 2rem (32px) | default button / input |
| `$control-h-lg` | 2.25rem (36px) | button lg |
| `$control-px` | 0.625rem | horizontal padding |

## Color tokens

All colors are `hsl(var(--…))` wrappers: `$background`, `$foreground`, `$card`, `$primary`, `$secondary`, `$muted`, `$accent`, `$destructive`, `$warning`, `$success`, `$border`, `$input`, `$ring`.

Themes: light (default), `dark`, plus schemes `blue` | `green` | `purple` | `orange` | `rose` via `data-theme` on `<html>`.

## Motion

`$transition-fast` / `$transition-base` / `$transition-slow`, overlay enter/exit (`$overlay-enter`, `$content-enter`). Respect `prefers-reduced-motion` (already in `globals.scss`).

## Copy checklist

1. Copy the whole `src/styles/` directory.
2. Copy each component as a folder (tsx + module + any sibling runtime files).
3. Keep `forwardRef` and `styles[variant]` class mapping.
4. CTA to external URLs: `Button` with `href`.
