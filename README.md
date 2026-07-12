# shadcn/ui React Components

React component library based on shadcn/ui design using SCSS modules without Tailwind CSS.

## Overview

Professional-grade React library aligned with **[shadcn/ui](https://ui.shadcn.com)**: **61 registry UI primitives** implemented locally (plus **DatePicker**, aliases, demo chrome, and the internal Floating helper — **68** component folders), **control heights** matching Tailwind **h-6 / h-7 / h-8 / h-9** (32px default button/input). Pure SCSS modules (no Tailwind), strict TypeScript. Design reference: [docs/DESIGN_REFERENCE.md](./docs/DESIGN_REFERENCE.md).

## Use in other projects

shacdn is designed to be **copied into your app** — not installed as an npm package.

**Start here:** [docs/INTEGRATION_GUIDE.md](./docs/INTEGRATION_GUIDE.md)

Quick steps:

1. `npm install sass` in your project
2. Copy `src/styles/globals.scss` + `variables.scss`
3. Copy component folders (`Button/`, `Card/`, …) with their `.module.scss`
4. `import './styles/globals.scss'` in `main.tsx`
5. Use MCP **`shacdn`** in Cursor for AI-assisted export (`get_component_bundle`, `get_design_system`)

See also: [STYLE_GUIDE.md](./docs/STYLE_GUIDE.md) · [AI_AGENT_GUIDE.md](./docs/AI_AGENT_GUIDE.md) · [mcp/shacdn-server/](./mcp/shacdn-server/)

## Features

- **61 Registry UI Items** - Full shadcn/ui registry coverage (see parity matrix); **68** folders incl. DatePicker, aliases, demo chrome, and internal Floating infrastructure
- **Chat primitives (Jun 2026)** - `Attachment`, `Bubble`, `Marker`, `Message`, `MessageScroller` for conversation UIs
- **shadcn/ui Design** - [ui.shadcn.com](https://ui.shadcn.com) as canonical reference
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
- **Live Interactive Demo** - All components with working examples
- **Side Navigation** - Quick jump to any component section
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

## Component catalog

Полный перечень папок в `src/components/`, матрица «задача → контроль» и заметки о **chart / carousel / command / sidebar** (внешние пакеты): **docs/COMPONENTS_AI_REFERENCE.md**.

Кратко добавлено к базовому набору: **Accordion**, **AspectRatio**, **Attachment**, **Bubble**, **ButtonGroup**, **Calendar**, **Collapsible**, **Combobox**, **ContextMenu**, **Empty**, **Field**, **Form**, **HoverCard**, **InputOTP**, **Item**, **Marker**, **Menubar**, **Message**, **MessageScroller**, **Popover**, **ScrollArea**, **Sheet** (алиас Drawer), **Toggle**, **ToggleGroup** и др.; **Modal** остаётся алиасом **Dialog**.

### Chat primitives

Compose a conversation thread with **`MessageScrollerProvider`** wrapping **`MessageScroller`** / **`MessageScrollerViewport`** / **`MessageScrollerContent`**, each row in **`MessageScrollerItem`**, body via **`Message`** + **`Avatar`** + **`Bubble`**, date/status via **`Marker`**, uploads via **`Attachment`**. See [docs/COMPONENT_GUIDE.md](./docs/COMPONENT_GUIDE.md).

### Control sizes (pixel parity)

В `variables.scss`: `$control-h-xs` (24px), `$control-h-sm` (28px), `$control-h-md` (32px), `$control-h-lg` (36px). Ими пользуются **Button**, **Input**, **Select**, **Pagination**, **Switch** (дорожка w-9 h-5), **Progress** (h-2), и т.д.

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

- **React 19** - Latest React with hooks
- **TypeScript** - Full type safety
- **Vite** - Lightning fast build tool
- **SCSS Modules** - Scoped styles, no conflicts
- **ESLint** - Code quality enforcement

## Documentation

### Complete Guides

- **docs/INTEGRATION_GUIDE.md** — **подключение в другой проект** (главный гайд)
- **mcp/shacdn-server/** — MCP server for AI agents to export components + design system
- **docs/DESIGN_REFERENCE.md** — [ui.shadcn.com](https://ui.shadcn.com) + pixel-perfect workflow
- **docs/SHADCN_PARITY_MATRIX.md** — audit status per primitive
- **docs/COMPONENTS_AI_REFERENCE.md** — 61 registry items + extras: задача → контрол
- **docs/COMPONENT_GUIDE.md** — примеры кода для всех компонентов
- **docs/STYLE_GUIDE.md** - Tokens, patterns, transferring UI to other projects
- **docs/PROJECT_SUMMARY.md** - Architecture and features
- **docs/COMPLETE_AUDIT_FINAL.md** - Quality assessment
- **docs/NEW_COMPONENTS_IMPLEMENTATION.md** - Latest additions

### Implementation Details

- **docs/ALERT_REDESIGN.md** - Alert component improvements
- **docs/AVATAR_IMPLEMENTATION.md** - Avatar suite
- **docs/INPUTGROUP_FINAL_FIX.md** - Seamless borders
- **docs/SWITCH_REVIEW.md** - Perfect design match
- **docs/MCP_SHADCN_ANALYSIS.md** - shadcn/ui integration

## Quality Metrics

| Metric | Status |
|--------|--------|
| **Lint Errors** | 0 |
| **TypeScript Errors** | 0 |
| **Component Coverage** | 61/61 registry UI items (68 folders; see docs/SHADCN_PARITY_MATRIX.md) |
| **Design Compliance** | 100% |
| **Accessibility** | WCAG 2.1 AA |
| **Production Ready** | Yes |

## Recent Additions

### Latest Components (Jun 2026 chat suite)

- **Attachment** - File/image previews with upload states and actions
- **Bubble** - Chat message bubbles with variants and reactions
- **Marker** - Status chips and date separators in threads
- **Message** - Message row layout (avatar + bubble + meta)
- **MessageScroller** - Zero-dep scrollable message list with auto-scroll

## Usage Example

```tsx
import { Avatar, AvatarFallback } from './components/Avatar/Avatar';
import { Bubble, BubbleContent } from './components/Bubble/Bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from './components/Message/Message';
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from './components/MessageScroller/MessageScroller';

const ChatThread = () => (
    <MessageScrollerProvider autoScroll initialScroll="end">
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            <MessageScrollerItem messageId="msg-1">
              <Message align="start">
                <MessageAvatar>
                  <Avatar size="sm"><AvatarFallback>AK</AvatarFallback></Avatar>
                </MessageAvatar>
                <MessageContent>
                  <Bubble variant="muted">
                    <BubbleContent>Hello from shacdn chat primitives.</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
);
```

### Form example

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
- **Side Navigation** - Quick access to all component sections
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
│ └── [60+ more components...]
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

- Design: shadcn/ui
- Implementation: Pure React + SCSS
- Icons: Inline SVG (lucide-react style)

---

**Built with care using React, TypeScript, and SCSS**
