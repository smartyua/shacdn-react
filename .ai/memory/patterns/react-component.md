# Pattern: React component (confirmed)

Source: existing `src/components/*` and `.cursor/rules/react-component-patterns.mdc`

1. Folder `src/components/Name/`
2. `Name.tsx` with `forwardRef` + arrow function implementation
3. `Name.module.scss` using tokens from `variables.scss`
4. Export named component + props type
5. Set `displayName`
6. Prefer composition subcomponents in the same file when needed (e.g. Card)
7. Run `npm run lint` after create/edit
