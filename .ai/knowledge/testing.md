# Testing

Generated: 2026-07-18

## Commands
- `npm run test` — all Vitest projects (UI + AI)
- `npm run test:ui` — `src/**/*.test.{ts,tsx}` (jsdom + Testing Library + vitest-axe)
- `npm run test:ai` — `.ai/tests/**/*.test.ts` (node)
- `npm run lint` — ESLint including focused `jsx-a11y` rules on `src/`
- `npm run build` — TypeScript project build + Vite (route-level code splitting)

## UI coverage (smoke)
- Tabs, Dialog, Combobox, DropdownMenu under `src/components/**/**.test.tsx`
- Stories via Ladle: `npm run ladle` (`*.stories.tsx`)

## CI
- `.github/workflows/ui.yml` — lint, test, build on `src/**` changes
- `.github/workflows/ai-infra.yml` — AI scripts/config path filter

## Notes
- Floating layers may be `visibility: hidden` until measured; tests assert DOM roles accordingly
- `eslint-plugin-jsx-a11y` is installed with legacy peer deps (plugin peers eslint≤9; project uses eslint 10)
