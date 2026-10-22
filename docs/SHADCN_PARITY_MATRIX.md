# shadcn/ui parity matrix

Registry reference: [ui.shadcn.com](https://ui.shadcn.com). Status is for **this repo's SCSS implementation**, not the Tailwind registry.

| Primitive | Status | Notes |
|-----------|--------|--------|
| Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Button Group, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, Context Menu, Dialog, Drawer, Dropdown Menu, Empty, Field, Form, Hover Card, Input, Input Group, Input OTP, Item, Kbd, Label, Menubar, Native Select, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip, Typography | **Implemented** | Sheet → Drawer; Sonner → Toast; Modal → Dialog |
| Date Picker | **Implemented** (extra) | Not always a separate registry item |
| Date Range Picker | **Implemented** (extra) | Calendar `mode="range"` + popup trigger |
| Radio Cards, Checkbox Cards, Checkbox Group, Data List, Tab Nav | **Implemented** (extra) | Radix Themes patterns; not in shadcn `registry:ui` |
| Diverging bar chart, financial comparison table | **Implemented** (extra) | `DivergingBarChart`, `FinancialTable`. Signed cashflow bars and period columns use success/destructive/accent tokens |
| Dropdown Menu compound parts | **Implemented** | CheckboxItem, RadioGroup/RadioItem, Sub/SubTrigger/SubContent, Shortcut, Group, Label, Portal |
| Chat suite (Attachment, Bubble, Marker, Message, MessageScroller, ThinkingLoader, ToolCallCard) | **Implemented** (extra) | ThinkingLoader is the phase pill; ToolCallCard / ToolCallGroup is the agent tool log |
| ThemeSwitcher, Direction, Locale, SiteHeader | Extra / demo | Locale + SiteHeader are **demo-only** |
| Blocks that need Recharts / Embla / full app shells | **Compose** | Use Chart/Carousel/Sidebar here, or add those deps in the consumer app |

Aliases in this repo: `Modal` = Dialog, `Sheet` = Drawer, `Sonner` = Toast.

## shadcnspace categories

Compared with the category index on [shadcnspace.com/components](https://shadcnspace.com/components). That catalog counts visual variants (456+). This repo ships one primitive per category, themed with the SCSS tokens, and does not clone premium skins.

| shadcnspace category | Here |
|---|---|
| Animated List, Animated Text, Apple Dock, Number Ticker, Orbiting Circles, Shine Border, Spinning Text | `AnimatedList`, `AnimatedText`, `Dock`, `NumberTicker`, `OrbitingCircles`, `ShineBorder`, `SpinningText` |
| Marquee | `Marquee` |
| Code Block, File Upload, Input Mask, Questionnaire, Rating, Sortable | `CodeBlock`, `FileUpload`, `InputMask`, `Questionnaire`, `Rating`, `Sortable` |
| Autocomplete | `Combobox` |
| Navbar, Topbar | `NavigationMenu`, `SiteHeader` (demo chrome) |
| Remaining registry categories (Accordion through Tooltip) | Matching folder in `src/components/` |

When a registry component gains a variant this matrix does not list, add a row rather than silently diverging.

## uiarc.dev (Arc) free components

Compared with the free (MIT) catalog on [uiarc.dev/components](https://uiarc.dev/components/button). Arc ships Tailwind + motion. These are clean SCSS re-implementations built from the public behaviour, not ports of the source. **Arc Pro items are licensed and are not reconstructed here.**

| Arc component | Here |
|---|---|
| Copy button, hold to confirm, inline edit, password strength, number input, segmented control, time picker | `CopyButton`, `HoldToConfirm`, `InlineEdit`, `PasswordStrength`, `NumberField`, `SegmentedControl`, `TimePicker` |
| Expandable text, countdown, text shimmer | `ExpandableText`, `Countdown`, `TextShimmer` |
| Usage meter, metric / stat card, gauge, activity heatmap | `UsageMeter`, `MetricCard` (uses `Chart` Sparkline), `Gauge`, `ActivityHeatmap` |
| File tree, JSON viewer, image compare | `TreeView`, `JsonViewer`, `ImageCompare` |
| Button, input, select, dialog, tabs, accordion, toast, avatar, badge, calendar, etc. | Already covered by the shadcn primitives above |

Not implemented yet (backlog, free items only):

- **Buttons and actions:** floating/expanding button group, icon morph, confirm morph, swipe actions, reactions, user menu, eclipse/split/rise theme switch variants.
- **Inputs:** search field, expanding search, money input, phone input, scrub input, shortcut recorder, morph select, chip group, billing toggle (compose from `SegmentedControl`), elastic slider, range histogram slider, rich text editor, signature pad.
- **Surfaces:** expandable card, bottom sheet, announcement bar, cookie consent, onboarding checklist, card stack.
- **Charts:** line, streamgraph, brush, waffle, slope, ridgeline, treemap.
- **Data and collaboration:** sortable data table, filter toolbar, comment thread, chat thread.
- **Text motion:** in-view title, text morph, slot text.
