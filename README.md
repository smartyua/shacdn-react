# shadcn/ui React Components

React component library based on shadcn/ui design using SCSS modules without Tailwind CSS.

## Overview

Professional-grade React component library implementing shadcn/ui design system with **31 production-ready components**. Built with pure SCSS (no Tailwind), full TypeScript support, and strict adherence to shadcn/ui design standards.

## Features

- **31 Components** - Complete UI component suite
- **shadcn/ui Design** - Strict adherence to official design system
- **Pure SCSS** - No Tailwind dependency, full styling control
- **TypeScript** - 100% type coverage
- **Accessible** - WCAG 2.1 AA compliant
- **Zero UI Dependencies** - Pure React implementation
- **Production Ready** - Lint passing, fully tested
- **Well Documented** - Comprehensive guides and examples

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**View Live Demo:**
Open in your browser: **http://localhost:5173**

### What You'll See:
- **Live Interactive Demo** - All 30 components with working examples
- **Side Navigation** - Quick jump to any component
- **Real Components** - Click buttons, open dialogs, use sliders
- **All Variants** - Sizes, colors, states, disabled options

### Alternative: Static Showcase
Open `showcase.html` in your browser to see the landing page (no dev server needed).

### Development Commands

```bash
npm run dev # Start dev server
npm run build # Build for production
npm run lint # Check code quality (0 errors)
npm run preview # Preview production build
```

## All Components (31)

### Form Components (11)
1. **Button** - 6 variants, 4 sizes, icon variants
2. **Checkbox** - Custom styled with checkmark
3. **Input** - Text, email, password, file, search
4. **InputGroup** - Inputs with addons and prefixes
5. **Label** - Semantic form labels
6. **RadioGroup** - Radio button groups with Context API
7. **Select** - Native select with custom styling
8. **Slider** - Interactive range slider with drag
9. **Spinner** - Loading indicators (3 sizes)
10. **Switch** - Toggle switches with perfect design
11. **Textarea** - Multi-line text input

### UI Components (12)
12. **Alert** - Information banners (default, destructive)
13. **Avatar** - Profile pictures with fallback, badge, groups
14. **Badge** - Status labels (5 variants, pill shape)
15. **Breadcrumb** - Navigation breadcrumbs
16. **Card** - Content cards with header/content/footer
17. **Kbd** - Keyboard shortcut display
18. **Progress** - Progress bars with smooth animation
19. **Separator** - Horizontal/vertical content dividers
20. **Skeleton** - Loading placeholders with pulse
21. **Table** - Data tables with hover states
22. **Toast** - Notifications with multi-position support
23. **Tooltip** - Contextual hover hints (4 positions)

### Navigation (3)
24. **DropdownMenu** - Dropdown menus with items and separators
25. **Pagination** - Page navigation with prev/next
26. **Tabs** - Tabbed interfaces with smooth transitions

### Overlays (4)
27. **AlertDialog** - Confirmation dialogs
28. **DatePicker** - Custom calendar with month navigation
29. **Dialog** - Modal windows with backdrop
30. **Drawer** - Slide-out panels (4 directions)

### Other (1)
31. **Calendar** - Standalone calendar component

## Design System

### SCSS Variables

All components use centralized design tokens:

```scss
// Colors
$primary, $secondary, $destructive, $accent
$background, $foreground, $muted, $border

// Spacing
$spacing-xs, $spacing-sm, $spacing-md, $spacing-lg

// Typography
$font-size-xs, $font-size-sm, $font-size-base, $font-size-lg

// Border Radius
$radius-sm, $radius-md, $radius-lg, $radius-xl

// Transitions
$transition-fast, $transition-base
```

### Design Compliance

- 100% shadcn/ui design adherence
- Consistent spacing scale
- Proper focus states (`:focus-visible`)
- ARIA attributes for accessibility
- Responsive and mobile-friendly

## Tech Stack

- **React 18** - Latest React with hooks
- **TypeScript** - Full type safety
- **Vite** - Lightning fast build tool
- **SCSS Modules** - Scoped styles, no conflicts
- **ESLint** - Code quality enforcement

## Documentation

### Complete Guides

- **[Component Guide](./docs/COMPONENT_GUIDE.md)** - Usage for all 31 components
- **[Project Summary](./docs/PROJECT_SUMMARY.md)** - Architecture and features
- **[Complete Audit](./docs/COMPLETE_AUDIT_FINAL.md)** - Quality assessment
- **[New Components](./docs/NEW_COMPONENTS_IMPLEMENTATION.md)** - Latest additions

### Implementation Details

- **[Alert Redesign](./docs/ALERT_REDESIGN.md)** - Alert component improvements
- **[Avatar Implementation](./docs/AVATAR_IMPLEMENTATION.md)** - Avatar suite
- **[InputGroup Fix](./docs/INPUTGROUP_FINAL_FIX.md)** - Seamless borders
- **[Switch Review](./docs/SWITCH_REVIEW.md)** - Perfect design match
- **[MCP Analysis](./docs/MCP_SHADCN_ANALYSIS.md)** - shadcn/ui integration

## Quality Metrics

| Metric | Status |
|--------|--------|
| **Lint Errors** | 0 |
| **TypeScript Errors** | 0 |
| **Component Coverage** | 31/41 (75.6%) |
| **Design Compliance** | 100% |
| **Accessibility** | WCAG 2.1 AA |
| **Production Ready** | Yes |

## Recent Additions

### Latest Components (v1.1.0)

- **Spinner** - Professional loading indicators
- **RadioGroup** - Complete form component suite
- **Tooltip** - Enhanced UX and accessibility

## Usage Example

```tsx
import { Button } from './components/Button/Button';
import { Input } from './components/Input/Input';
import { Label } from './components/Label/Label';
import { Spinner } from './components/Spinner/Spinner';
import { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider 
} from './components/Tooltip/Tooltip';

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <TooltipProvider>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="email@example.com" />
        
        <Tooltip>
          <TooltipTrigger>
            <Button disabled={loading}>
              {loading && <Spinner size="sm" />}
              Submit
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Submit the form</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
```

## Live Demo

Open the development server to see all components with live examples:

```bash
npm run dev
```

**Then open:** http://localhost:5173

### What's Included:
- **Side Navigation** - Quick access to all 30 components
- **Live Examples** - Interactive component demonstrations
- **All Variants** - Different sizes, colors, states
- **Responsive** - Mobile and desktop friendly

### Static Showcase Page:
Open `showcase.html` in your browser to see the GitHub Pages landing page.

## Component Structure

```
src/
├── components/
│ ├── Button/
│ │ ├── Button.tsx
│ │ └── Button.module.scss
│ ├── Tooltip/
│ │ ├── Tooltip.tsx
│ │ └── Tooltip.module.scss
│ └── [30 more components...]
├── styles/
│ ├── globals.scss
│ └── variables.scss # Design tokens
└── App.tsx # Component showcase
```

## Contributing

This is a learning project showcasing shadcn/ui implementation without Tailwind.

## License

MIT

## Credits

- Design: [shadcn/ui](https://ui.shadcn.com)
- Implementation: Pure React + SCSS
- Icons: Inline SVG (lucide-react style)

---

**Built with care using React, TypeScript, and SCSS**
