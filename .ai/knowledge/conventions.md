# Conventions

- Arrow functions only (see `.cursor/rules/arrow-functions.mdc`)
- SCSS modules + design tokens — no hardcoded palette values
- No barrel `index.ts` for components — import from component path
- Run `npm run lint` after every code change
- Functional changes require tests (Vitest for AI infra; component tests when behavior changes)
