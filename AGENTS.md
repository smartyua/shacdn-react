# AGENTS.md

Entry point for coding agents working in **shacdn**: a React 19 + TypeScript + Vite
implementation of [shadcn/ui](https://ui.shadcn.com) built on SCSS modules — **no Tailwind,
no Radix, no external UI libraries**.

## Setup

```bash
npm install
npm run dev            # http://localhost:5173
```

The MCP export server is a separate package and is not covered by the root install:

```bash
cd mcp/shacdn-server && npm install && npm run build
```

`npm run ai:bootstrap` does this for you, along with the rest of the `.ai/` tooling.

## Required checks

Run these before calling any task finished, and report which ones actually ran:

```bash
npm run lint           # must be clean — no new warnings either
npm test               # ui + mcp + ai projects
npm run build          # for anything beyond a trivial change
```

Behavioural changes need tests. Docs, comments and formatting are exempt.

## Where things live

| Area | Path |
|---|---|
| Components (one folder each: `Name.tsx` + `Name.module.scss`) | `src/components/` |
| Public export surface | `src/components/index.ts` |
| Design tokens | `src/styles/variables.scss`, `src/styles/globals.scss` |
| Demo screens | `src/screens/` |
| BESS Solar demo | `src/screens/Dashboard/pages/Bess/` → `/dashboard/bess` (header nav) |
| MCP export server | `mcp/shacdn-server/` |
| AI tooling, memory, skills | `.ai/` |
| Current docs | `docs/` (one-off historical reports live in `docs/archive/` — do not treat them as current) |

## Conventions that are enforced

- **Arrow functions only.** No `function` declarations; see `.cursor/rules/arrow-functions.mdc`.
- **Tokens, not literals.** Colours, spacing, radii and control heights come from
  `variables.scss`. Never hardcode hex values.
- **Design parity.** ui.shadcn.com is the reference. Record deltas in
  `docs/SHADCN_PARITY_MATRIX.md` rather than silently diverging.
- **Accessibility.** Correct roles, labels, and keyboard paths are part of "done".

## Two traps worth knowing

1. **`--border` and `--input` carry alpha in dark mode** (`0 0% 100% / 0.1`). Composing more
   alpha with `hsl(var(--border) / 0.5)` produces invalid CSS. Use
   `color-mix(in srgb, #{$border} 50%, transparent)`.
2. **jsdom performs no layout**, so floating surfaces stay `visibility: hidden` and drop out
   of the accessibility tree, breaking `getByRole`. Use `useStubbedLayout()` from
   `src/test/layout.ts` when testing anything portaled.

## Keeping the MCP catalog honest

`mcp/shacdn-server/src/catalog.ts` describes every component to other agents.
`mcp/shacdn-server/catalog.test.ts` fails if it drifts from the filesystem — if you add,
rename or re-export a component, update the catalog and the barrel in the same change.

More detail: [`docs/AI_AGENT_GUIDE.md`](./docs/AI_AGENT_GUIDE.md) and `.cursor/rules/`.
