# shadcn/ui parity matrix

**Reference:** [https://ui.shadcn.com](https://ui.shadcn.com) · **Audit method:** design tokens (`variables.scss`) + live demo + shadcn MCP registry  
**Last updated:** 2026-07-12 · **Screenshot audit:** [VISUAL_AUDIT_REPORT.md](./VISUAL_AUDIT_REPORT.md)

Legend: **✓** pixel parity verified · **~** implemented, minor deltas documented · **—** not in repo (by design or external dep) · **↔** alias/substitute

---

## UI primitives (`registry:ui`)

| Registry | shacdn folder | Status | Pixel notes |
|----------|---------------|--------|-------------|
| accordion | Accordion | ✓ | Built on Collapsible; chevron, spacing |
| alert | Alert | ✓ | Icon + title/description layout; AA destructive contrast |
| alert-dialog | AlertDialog | ✓ | Portal, alertdialog semantics, cancel-first focus |
| aspect-ratio | AspectRatio | ✓ | padding-bottom ratio box |
| attachment | Attachment | ✓ | Root padding, 40/32/28px media, upload states, layered actions |
| avatar | Avatar | ✓ | Image, fallback, group |
| badge | Badge | ✓ | Variants + sizes |
| breadcrumb | Breadcrumb | ✓ | Separator, ellipsis |
| bubble | Bubble | ✓ | Chat bubble variants, reactions slot |
| button | Button | ✓ | h-7/8/9/10, variants, focus ring |
| button-group | ButtonGroup | ✓ | Shared borders |
| calendar | Calendar | ✓ | Grid, nav buttons, selected + today contrast |
| card | Card | ✓ | Header, action slot, compound data-slot contract |
| carousel | Carousel | ✓ | scroll-snap; no Embla dep |
| chart | Chart | ~ | SVG BarChart + ChartContainer (zero-dep; Recharts optional in apps) |
| checkbox | Checkbox | ✓ | 16px box, check icon |
| collapsible | Collapsible | ✓ | Accordion base |
| combobox | Combobox | ✓ | Portaled listbox, match-width collision placement, active descendant |
| command | Command | ✓ | Palette; Combobox-like filter |
| context-menu | ContextMenu | ✓ | Portaled point anchor + roving menu keyboard |
| dialog | Dialog | ✓ | Portal, inert background, labels, focus trap/restore |
| drawer | Drawer | ✓ | Portaled side sheet with modal semantics |
| dropdown-menu | DropdownMenu | ✓ | Collision-aware portal + menu keyboard |
| empty | Empty | ✓ | Icon + title + description |
| field | Field | ✓ | Label + description wrapper |
| form | Form | ✓ | Field composition |
| hover-card | HoverCard | ✓ | Delayed, collision-aware portaled panel |
| input | Input | ✓ | h-8, tokenized focus-visible, invalid state |
| input-group | InputGroup | ✓ | h-8 addons, seamless borders, group focus ring |
| input-otp | InputOTP | ✓ | Square h-8 slots + focus-visible |
| item | Item | ✓ | List row pattern |
| kbd | Kbd | ✓ | Monospace chip |
| label | Label | ✓ | text-sm font-medium |
| menubar | Menubar | ✓ | Horizontal triggers + portaled keyboard menus |
| marker | Marker | ✓ | Status / date separator chips |
| message | Message | ✓ | Row layout: avatar + bubble + meta |
| message-scroller | MessageScroller | ~ | Zero-dep engine; coalesced geometry, lazy visibility, anchors/jump buttons |
| navigation-menu | NavigationMenu | ✓ | Site nav + collision-aware portaled dropdown |
| pagination | Pagination | ✓ | h-9 controls |
| popover | Popover | ✓ | Collision-aware portal, asChild trigger, outside/Escape dismiss |
| progress | Progress | ✓ | h-2 track |
| radio-group | RadioGroup | ✓ | Circle indicator |
| resizable | Resizable | ~ | Pointer-drag panels; no react-resizable-panels |
| scroll-area | ScrollArea | ✓ | Styled overflow |
| select | Select | ↔ | Covers native-select |
| separator | Separator | ✓ | 1px hairline |
| sheet | Sheet | ↔ | Alias Drawer |
| sidebar | Sidebar | ~ | Provider + inset + menu; zero-dep layout |
| skeleton | Skeleton | ✓ | pulse animation |
| slider | Slider | ✓ | Pointer capture + complete slider keyboard semantics |
| sonner | Toast | ↔ | Stable per-provider store, live regions, isolated viewport |
| spinner | Spinner | ✓ | Circular loader |
| switch | Switch | ✓ | w-9 h-5 track |
| table | Table | ✓ | Row hover, borders |
| tabs | Tabs | ✓ | Linked ARIA tabs/panels + roving keyboard |
| textarea | Textarea | ✓ | min-height, resize |
| toggle | Toggle | ✓ | Native button + synchronized aria-pressed |
| toggle-group | ToggleGroup | ✓ | Segmented control |
| tooltip | Tooltip | ✓ | Wrapped text + collision-aware portal |
| direction | Direction | ✓ | DirectionProvider + useDirection |
| native-select | NativeSelect | ↔ | Alias of Select |
| typography | Typography | ✓ | H1–H4, P, Lead, Muted, Blockquote, List |

**Coverage:** **68** folders in `src/components/` — **61/61** registry UI items implemented locally. Extras beyond registry primaries: **DatePicker** (local date primitive), alias folders (**Modal**, **Sheet**, **NativeSelect**, **Sonner**), demo chrome (**SiteHeader**, **ThemeSwitcher**), and internal **Floating** infrastructure.

### 2026-07-12 verification scope

All 65 local showcase sections were scanned at 1280px and 390px. Contrast passed in 12 light/dark scheme combinations; reduced motion, floating-layer collision behavior, modal focus cycles, priority keyboard paths, Toast, and MessageScroller were exercised in-browser. Carousel offscreen slides, the translated Progress indicator, and Attachment's action-over-trigger layering are intentional clipped/layered geometry.

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
