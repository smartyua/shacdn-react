# shadcn/ui parity matrix

Registry reference: [ui.shadcn.com](https://ui.shadcn.com). Status is for **this repo's SCSS implementation**, not the Tailwind registry.

| Primitive | Status | Notes |
|-----------|--------|--------|
| Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Button Group, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, Context Menu, Dialog, Drawer, Dropdown Menu, Empty, Field, Form, Hover Card, Input, Input Group, Input OTP, Item, Kbd, Label, Menubar, Native Select, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip, Typography | **Implemented** | Sheet → Drawer; Sonner → Toast; Modal → Dialog |
| Date Picker | **Implemented** (extra) | Not always a separate registry item |
| Chat suite (Attachment, Bubble, Marker, Message, MessageScroller) | **Implemented** (extra) | |
| ThemeSwitcher, Direction, Locale, SiteHeader | Extra / demo | Locale + SiteHeader are **demo-only** |
| Blocks that need Recharts / Embla / full app shells | **Compose** | Use Chart/Carousel/Sidebar here, or add those deps in the consumer app |

Aliases in this repo: `Modal` = Dialog, `Sheet` = Drawer, `Sonner` = Toast.

When a registry component gains a variant this matrix does not list, add a row rather than silently diverging.
