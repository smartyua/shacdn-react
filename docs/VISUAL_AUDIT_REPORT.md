# Visual audit report — shacdn vs [ui.shadcn.com](https://ui.shadcn.com)

**Date:** 2026-07-12 (pass 4 — full catalog geometry, state, and accessibility verification)
**Method:** Side-by-side screenshots + automated DOM geometry/contrast checks + keyboard interaction checks
**Local demo:** http://localhost:5173/components
**Reference:** https://ui.shadcn.com/docs/components/radix/

## Pass 4 results

- Scanned all **65** showcase sections at **1280px** and **390px**: no document-level horizontal overflow or unintended interactive-control intersections.
- Checked rendered text contrast in light/dark across **Default, Blue, Green, Purple, Orange, and Rose**: **0 failures** below 4.5:1 for normal text or 3:1 for large text after theme-token corrections.
- Verified collision-aware, body-portaled Popover, DropdownMenu, HoverCard, Tooltip, Combobox, DatePicker, ContextMenu, Menubar, NavigationMenu, and ThemeSwitcher surfaces.
- Verified Dialog, Drawer, and AlertDialog portal, labeling, focus trap, focus restore, body scroll lock, and outside-content inert behavior. AlertDialog overlay clicks do not dismiss it.
- Verified Slider, Tabs, Toggle, DropdownMenu, and ContextMenu keyboard paths.
- Verified reduced-motion emulation: no computed animation or transition duration above **0.02ms**.
- Verified Toast live regions/timer cleanup and MessageScroller append anchoring/jump-control states.

Intentional geometry exceptions: Carousel keeps offscreen slides inside its clipped viewport; Progress translates its indicator inside a clipped track; Attachment actions layer above its full-card trigger by design.

## Screenshots

| File | Source |
|------|--------|
| `local-button.png` | Local — Button variants + sizes |
| `ref-button-sizes.png` | Reference — Button size examples |
| `local-input-section.png` | Local — Input + Input Group |
| `ref-input-basic.png` | Reference — Input basic example |
| `local-alert.png` | Local — Alert (default / success / destructive) |
| `ref-alert-basic.png` | Reference — Alert basic + destructive |
| `local-switch.png` | Local — Switch states |
| `ref-switch.png` | Reference — Switch (Airplane Mode) |

All files live in [`docs/audit-screenshots/`](./audit-screenshots/).

---

## Test conditions

| Setting | Local (shacdn) | Reference (shadcn) |
|---------|----------------|---------------------|
| Theme | Light + dark | Matching reference theme |
| Color scheme | Default + Blue/Green/Purple/Orange/Rose | Default for screenshot comparison |
| Viewport | 1280px desktop + 390px mobile | 1280px screenshot reference |

Compare **geometry** (height, padding, radius) separately from **hue** (primary follows `data-theme` / color scheme).

---

## Measured geometry (computed styles) — pass 2

### Button sizes (after `$control-h-*` fix)

| Size | shadcn/ui (docs) | shacdn (pass 2) | Match |
|------|------------------|-----------------|-------|
| xs | 24px × 8px pad | 24px × 8px | ✓ |
| sm | 28px × 10px pad | 28px × 10px | ✓ |
| md (default) | 32px × 10px pad | 32px × 12px → **10px** after `$control-px` fix | ✓ |
| lg | 36px × 10px pad | 36px × 10px | ✓ |

Heights align with **shadcn v4** (`h-6` / `h-7` / `h-8` / `h-9`). Border radius on xs/sm in docs is **8px**; local uses **10px** (`$radius-md`) — visually negligible at this scale.

### Input (basic)

| Property | shadcn | shacdn (pass 2) | Match |
|----------|--------|-----------------|-------|
| height | 32px | 32px | ✓ |
| font-size | 14px | 14px | ✓ |
| padding-x | 10px | 12px → **10px** after `$control-px` | ✓ |
| border-radius | 10px | ~10px | ✓ |

### Switch

| Property | shadcn (default track) | shacdn | Match |
|----------|------------------------|--------|-------|
| track | w-9 × h-5 (36×20px) | 36px × 20px | ✓ |
| thumb | ~16px circle | 16px | ✓ |

### Tabs (local showcase)

| Property | shadcn (typical) | shacdn | Notes |
|----------|------------------|--------|-------|
| tab height | ~28–32px | 28.5px | ✓ |
| tab padding | 6px 12px | 6px 12px | ✓ |

---

## Screenshot comparison (qualitative)

| Component | Visual match | Notes |
|-----------|--------------|-------|
| Button variants | ✓ | Default / secondary / outline / ghost / destructive / link hierarchy matches |
| Button sizes | ✓ | Row height progression matches reference screenshot |
| Input | ✓ | Border, 32px height, placeholder tone align |
| Input Group | ✓ | Prefix/suffix seams and radius on outer edges |
| Alert | ✓ | Icon + title + description layout; destructive uses red border/fill |
| Switch | ✓ | Track proportions and on/off thumb position |
| Card | ✓ | Border, padding, title scale (spot-checked in pass 1) |
| Checkbox | ✓ | 16px square, rounded-sm (pass 1) |
| Pagination | ✓ | Active pill, square controls (pass 1) |
| Progress | ✓ | Thin track (pass 1) |

---

## Minor deltas (documented)

1. **Horizontal padding** — shadcn v4 uses `px-2.5` (10px) on md controls; shacdn had `$control-px: 0.75rem` (12px). Updated to **0.625rem** in `variables.scss`.
2. **Radius on xs/sm buttons** — reference 8px vs local `$radius-md` 10px; acceptable variance.
3. **Demo copy** — local Alert titles differ from docs (“Heads up!” vs “Account updated”); layout and tokens compared, not literal strings.
4. **Color scheme picker** — screenshot comparison uses Default; pass 4 contrast checks cover all 6 schemes in both themes.

---

## Intentional differences (not bugs)

1. **No Tailwind** — spacing via SCSS tokens; target is same computed px as docs.
2. **Carousel / Command / NavigationMenu** — zero-dep implementations; structure matches docs, not Embla/cmdk internals.
3. **Substitutes** — Toast≈sonner, Select≈native-select, Modal→Dialog, Sheet→Drawer (see [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md)).

---

## Showcase coverage (all demo sections)

All **65** nav items in `/components` have a matching `#section` anchor.

| Status | Components |
|--------|------------|
| ✓ Pixel-checked (pass 2) | Button, Input, Alert, Switch, Tabs |
| ~ Zero-dep variants | Chart (SVG), Resizable (pointer), Sidebar (layout) |
| ↔ Aliases | NativeSelect→Select, Sonner→Toast, Modal→Dialog, Sheet→Drawer |
| ✓ Spot-check / structural | Remaining 50+ sections (see parity matrix) |

---

## Actions taken

- [x] Pass 2 screenshot audit (Button, Input, Alert, Switch)
- [x] Pass 3 — full showcase nav + new registry components (Chart, Resizable, Sidebar, etc.)
- [x] `getComputedStyle` on local + reference (light / default)
- [x] Confirmed `$control-h-*` v4 scale (32px default control)
- [x] Adjusted `$control-px` to 10px for button/input md padding
- [x] Saved screenshots to `docs/audit-screenshots/`
- [x] Pass 4 — 65-section desktop/mobile geometry scan
- [x] Pass 4 — 12 theme/scheme contrast combinations
- [x] Pass 4 — floating-layer, modal, keyboard, reduced-motion, Toast, and MessageScroller interaction checks

---

## How to re-run audit

```bash
npm run dev
# Open http://localhost:5173/components
# In DevTools console:
localStorage.setItem('colorScheme','default');
localStorage.setItem('theme','light');
location.reload();
```

Compare each section with the matching page under https://ui.shadcn.com/docs/components/radix/ .

Update [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md) when a component passes screenshot + computed-style check.
