# shadcn/ui parity matrix

Registry reference: [ui.shadcn.com](https://ui.shadcn.com). Status is for **this repo's SCSS implementation**, not the Tailwind registry.

| Primitive | Status | Notes |
|-----------|--------|--------|
| Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Button Group, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, Context Menu, Dialog, Drawer, Dropdown Menu, Empty, Field, Form, Hover Card, Input, Input Group, Input OTP, Item, Kbd, Label, Menubar, Native Select, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip, Typography | **Implemented** | Sheet → Drawer; Sonner → Toast; Modal → Dialog |
| Date Picker | **Implemented** (extra) | Not always a separate registry item |
| Date Range Picker | **Implemented** (extra) | Calendar `mode="range"` + popup trigger |
| Radio Cards, Checkbox Cards, Checkbox Group, Data List, Tab Nav | **Implemented** (extra) | Radix Themes patterns; not in shadcn `registry:ui` |
| Dropdown Menu compound parts | **Implemented** | CheckboxItem, RadioGroup/RadioItem, Sub/SubTrigger/SubContent, Shortcut, Group, Label, Portal |
| Chat suite (Attachment, Bubble, Marker, Message, MessageScroller) | **Implemented** (extra) | |
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
