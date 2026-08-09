# Architecture Documentation

## Component Library: shadcn/ui React Components

### Overview
Pure React implementation of shadcn/ui design system using SCSS modules.

### Design Philosophy
1. **No External UI Libraries** - Everything built from scratch
2. **SCSS Modules** - Scoped, maintainable styles
3. **Type Safety** - Full TypeScript coverage
4. **Accessibility First** - Proper ARIA and keyboard support
5. **shadcn/ui Compliance** - Exact design system implementation

### Components (23 Total)

#### Input Components
- Input, Textarea, Checkbox, Switch, Select, DatePicker
- InputGroup (with addons)

#### Action Components
- Button, Kbd

#### Feedback Components
- Alert, Toast, Progress

#### Layout Components
- Card, Tabs, Table

#### Navigation Components
- Breadcrumb, Pagination

#### Overlay Components
- Dialog, AlertDialog, Drawer, DropdownMenu

#### Display Components
- Badge

### Design System

All design tokens centralized in `src/styles/variables.scss`:

**Colors**: HSL-based shadcn/ui palette
- Primary, Secondary, Muted, Destructive
- Proper foreground/background pairs

**Spacing**: 5-level scale (xs → xl)
**Typography**: System fonts, 5 sizes
**Radii**: 5 levels (xs → xl)
**Transitions**: 3 speeds (fast, base, slow)

### Component Pattern

Standard structure for all components:
```tsx
- forwardRef for DOM access
- Extend HTML types for props
- SCSS modules for styling
- TypeScript for type safety
- displayName for debugging
```

### Key Files

- `src/styles/variables.scss` - Design tokens
- `src/styles/globals.scss` - Global resets
- `docs/COMPONENT_GUIDE.md` - Usage guide
- `docs/PROJECT_SUMMARY.md` - Project details
- `.cursor/rules/` - AI assistance rules

### Development Commands

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # ESLint check
```

### Adding New Components

1. Create folder: `src/components/ComponentName/`
2. Add `ComponentName.tsx` and `ComponentName.module.scss`
3. Follow patterns in existing components
4. Use design system variables
5. Add to App.tsx for demo
6. Verify with lint and build

See `.cursor/rules/component-creation.mdc` for detailed checklist.

### Maintenance

- Keep dependencies minimal
- Follow shadcn/ui design updates
- Maintain TypeScript strict mode
- Ensure accessibility standards
- Keep documentation updated
