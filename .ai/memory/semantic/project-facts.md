# Semantic memory — project facts

Last verified against repository structure.

- Library: shacdn — shadcn/ui design with SCSS modules (no Tailwind, no Radix)
- Stack: React 19, TypeScript, Vite, lucide-react, react-router-dom
- Tokens: `src/styles/variables.scss` (single source of truth)
- Themes: `src/styles/globals.scss`
- Components: `src/components/<Name>/<Name>.tsx` + module SCSS
- Import path: direct file path (no barrel index)
- Quality gate: `npm run lint` after every change; `npm run test` + `npm run build` for major changes
- UI tests: Vitest + Testing Library under `src/**/*.test.tsx` (`npm run test:ui`)
- Isolated stories: Ladle (`npm run ladle`)
- MCP: official `shadcn` + project `shacdn` export server
- AI infra: `.ai/` isolated from app runtime; opt-in fail-open bootstrap (`runOnProjectOpen: false`)
- No application database in this repository
