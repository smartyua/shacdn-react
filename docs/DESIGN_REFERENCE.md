# Design reference — shadcn/ui

**Canonical visual and behavioral reference for shacdn:** [https://ui.shadcn.com](https://ui.shadcn.com)

This repository implements the [shadcn/ui](https://ui.shadcn.com) design system in **React + SCSS modules** (no Tailwind, no Radix). Every primitive is audited against the official registry and docs on that site.

---

## How to use this reference

| Goal | Where to look |
|------|----------------|
| Official component API & variants | [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) |
| Blocks (dashboard, sidebar, login) | [ui.shadcn.com/blocks](https://ui.shadcn.com/blocks) |
| Themes & CSS variables | [ui.shadcn.com/docs/theming](https://ui.shadcn.com/docs/theming) |
| Parity status per primitive | [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md) |
| Local tokens (h-8 / h-9 / h-10, colors) | [STYLE_GUIDE.md](./STYLE_GUIDE.md) · `src/styles/variables.scss` |
| MCP audit (registry source) | [MCP_SHADCN_ANALYSIS.md](./MCP_SHADCN_ANALYSIS.md) · `.cursor/rules/shadcn-mcp-reference.mdc` |

---

## Pixel-perfect workflow

When implementing or reviewing a component:

1. Open the matching page on [ui.shadcn.com](https://ui.shadcn.com) (e.g. Button, Input, Dialog).
2. Map Tailwind classes from the registry to shacdn tokens:

   | shadcn / Tailwind | shacdn SCSS |
   |-------------------|-------------|
   | `h-6` | `$control-h-xs` (24px) |
   | `h-7` | `$control-h-sm` (28px) |
   | `h-8` | `$control-h-md` (32px) — **default** input/button |
   | `h-9` | `$control-h-lg` (36px) — button lg |
   | `px-3` | `$control-px` |
   | `rounded-md` | `$radius-md` |
   | `text-sm` | `$font-size-sm` |
   | `ring-2 ring-ring` | `$focus-ring-width` + `$ring` |

3. Compare **height, padding, border, radius, font-size, focus ring** in the live demo (`npm run dev` → http://localhost:5173).
4. Optionally pull registry source via **shadcn MCP** (`view_items_in_registries`, `get_item_examples_from_registries`) — translate to SCSS; do not paste Tailwind into this repo.
5. Record result in [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md).

---

## Registry coverage (summary)

| Category | Count | Notes |
|----------|-------|--------|
| **UI primitives in @shadcn registry** | 58 | See parity matrix |
| **Implemented in shacdn** | 54+ | `src/components/` |
| **Aliases** | Modal→Dialog, Sheet→Drawer | Same API, different names |
| **Substitutes** | Toast≈sonner, Select≈native-select | Documented in matrix |
| **Blocks / heavy deps** | chart, sidebar blocks, resizable | Require Recharts, Embla, or large compositions — compose from primitives or add deps in consumer apps |

---

## Related documentation

- [COMPONENTS_AI_REFERENCE.md](./COMPONENTS_AI_REFERENCE.md) — task → component matrix
- [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) — code examples
- [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md) — agent migration workflow
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) — copy into other projects

**Live reference:** [https://ui.shadcn.com](https://ui.shadcn.com)
