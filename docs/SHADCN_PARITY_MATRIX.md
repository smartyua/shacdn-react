# shadcn/ui parity matrix

**Reference:** [https://ui.shadcn.com](https://ui.shadcn.com) · **Audit method:** design tokens (`variables.scss`) + live demo + shadcn MCP registry  
**Last updated:** 2026-05-21 · **Screenshot audit:** [VISUAL_AUDIT_REPORT.md](./VISUAL_AUDIT_REPORT.md)

Legend: **✓** pixel parity verified · **~** implemented, minor deltas documented · **—** not in repo (by design or external dep) · **↔** alias/substitute

---

## UI primitives (`registry:ui`)

| Registry | shacdn folder | Status | Pixel notes |
|----------|---------------|--------|-------------|
| accordion | Accordion | ✓ | Built on Collapsible; chevron, spacing |
| alert | Alert | ✓ | Icon + title/description layout |
| alert-dialog | AlertDialog | ✓ | Composes Dialog |
| aspect-ratio | AspectRatio | ✓ | padding-bottom ratio box |
| avatar | Avatar | ✓ | Image, fallback, group |
| badge | Badge | ✓ | Variants + sizes |
| breadcrumb | Breadcrumb | ✓ | Separator, ellipsis |
| button | Button | ✓ | h-7/8/9/10, variants, focus ring |
| button-group | ButtonGroup | ✓ | Shared borders |
| calendar | Calendar | ✓ | Grid, nav buttons |
| card | Card | ✓ | Header, action slot |
| carousel | Carousel | ✓ | scroll-snap; no Embla dep |
| chart | Chart | ~ | SVG BarChart + ChartContainer (zero-dep; Recharts optional in apps) |
| checkbox | Checkbox | ✓ | 16px box, check icon |
| collapsible | Collapsible | ✓ | Accordion base |
| combobox | Combobox | ✓ | Filter list + Input |
| command | Command | ✓ | Palette; Combobox-like filter |
| context-menu | ContextMenu | ✓ | Right-click menu |
| dialog | Dialog | ✓ | Overlay, focus trap |
| drawer | Drawer | ✓ | Side sheet |
| dropdown-menu | DropdownMenu | ✓ | Ghost trigger, popover surface |
| empty | Empty | ✓ | Icon + title + description |
| field | Field | ✓ | Label + description wrapper |
| form | Form | ✓ | Field composition |
| hover-card | HoverCard | ✓ | Delayed hover panel |
| input | Input | ✓ | h-9, border, invalid state |
| input-group | InputGroup | ✓ | Seamless addon borders |
| input-otp | InputOTP | ✓ | Slot grid |
| item | Item | ✓ | List row pattern |
| kbd | Kbd | ✓ | Monospace chip |
| label | Label | ✓ | text-sm font-medium |
| menubar | Menubar | ✓ | Horizontal menu bar |
| navigation-menu | NavigationMenu | ✓ | Site nav + dropdown viewport |
| pagination | Pagination | ✓ | h-9 controls |
| popover | Popover | ✓ | Floating panel |
| progress | Progress | ✓ | h-2 track |
| radio-group | RadioGroup | ✓ | Circle indicator |
| resizable | Resizable | ~ | Pointer-drag panels; no react-resizable-panels |
| scroll-area | ScrollArea | ✓ | Styled overflow |
| select | Select | ↔ | Covers native-select |
| separator | Separator | ✓ | 1px hairline |
| sheet | Sheet | ↔ | Alias Drawer |
| sidebar | Sidebar | ~ | Provider + inset + menu; zero-dep layout |
| skeleton | Skeleton | ✓ | pulse animation |
| slider | Slider | ✓ | Track + thumb |
| sonner | Toast | ↔ | ToastProvider + useToast |
| spinner | Spinner | ✓ | Circular loader |
| switch | Switch | ✓ | w-9 h-5 track |
| table | Table | ✓ | Row hover, borders |
| tabs | Tabs | ✓ | List + active indicator |
| textarea | Textarea | ✓ | min-height, resize |
| toggle | Toggle | ✓ | Pressed state |
| toggle-group | ToggleGroup | ✓ | Segmented control |
| tooltip | Tooltip | ✓ | z-tooltip, arrow |
| direction | Direction | ✓ | DirectionProvider + useDirection |
| native-select | NativeSelect | ↔ | Alias of Select |
| typography | Typography | ✓ | H1–H4, P, Lead, Muted, Blockquote, List |

**Coverage:** 60 folders in `src/components/` (incl. aliases Modal/Sheet/NativeSelect/Sonner) = **58/58** registry UI items + **Typography** demo primitive.

---

## Demo-only / app chrome

| Folder | Role |
|--------|------|
| Modal | Dialog API alias |
| SiteHeader | Demo header + ThemeSwitcher |
| ThemeSwitcher | Theme + color scheme picker |

---

## Blocks & optional packages (not copied as primitives)

| Registry | Recommendation |
|----------|----------------|
| chart-* | Add `recharts` in product; style with shacdn tokens |
| carousel (Embla examples) | shacdn `Carousel` uses CSS scroll-snap |
| command (cmdk) | shacdn `Command` is zero-dep palette |
| sidebar-01…16 | Compose Drawer + Button + ScrollArea |
| dashboard-*, login-*, signup-* | Reference blocks on ui.shadcn.com |

---

## Verification checklist (per component)

- [ ] Height matches `$control-h-*` where applicable
- [ ] `border-radius: $radius-md` on controls
- [ ] `:focus-visible` → `$focus-ring-width` + `$ring`
- [ ] `:disabled` → `opacity: 0.5`, `pointer-events: none`
- [ ] `[aria-invalid='true']` → `$destructive` border
- [ ] Popovers/menus: `$popover` background, `$z-floating`
- [ ] Compared side-by-side with [ui.shadcn.com](https://ui.shadcn.com) at 1280px width

---

## MCP audit commands

```txt
list_items_in_registries({ registries: ["@shadcn"] })
view_items_in_registries({ items: ["@shadcn/button"] })
get_item_examples_from_registries({ registries: ["@shadcn"], query: "button-demo" })
get_audit_checklist()
```

See [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md) and [MCP_SHADCN_ANALYSIS.md](./MCP_SHADCN_ANALYSIS.md).
