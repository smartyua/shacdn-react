# Components — task → control

Use this when picking a shacdn primitive. Copy folders whole (`tsx` + `module.scss` + sibling runtime files). **Do not copy demo-only chrome** (`Locale`, `SiteHeader`) into consumer apps.

Tokens first: `npm run shacdn:install -- /path/to/app` or MCP `install_to_project`.

| Task | Component | Notes |
|------|-----------|--------|
| Button / CTA / link | `Button` | `href` → `<a>` |
| Text field | `Input`, `Textarea`, `InputGroup`, `InputOTP` | |
| Label / field chrome | `Label`, `Field`, `Form` | |
| Select | `Select`, `NativeSelect`, `Combobox`, `MultiSelect` | Select needs `Floating` |
| Checkbox / radio / switch | `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`, `Toggle`, `ToggleGroup` | |
| Choice cards | `RadioCards`, `CheckboxCards` | Radix Themes pattern; not in shadcn registry |
| Key / value rows | `DataList` | Radix Themes; definition list |
| Date | `Calendar`, `DatePicker`, `DateRangePicker` | DatePicker / DateRangePicker → Calendar + Floating |
| Modal / confirm | `Dialog`, `AlertDialog`, `Modal` (alias) | copies `Modal/modalLayer.tsx` |
| Side panel | `Drawer`, `Sheet` (alias) | |
| Menu | `DropdownMenu`, `ContextMenu`, `Menubar`, `NavigationMenu` | DropdownMenu: CheckboxItem, RadioItem, Sub, Shortcut |
| Overlay hint | `Tooltip`, `HoverCard`, `Popover` | TooltipProvider for Tooltip |
| Toast | `Toast`, `Sonner` (alias) | `ToastProvider` |
| Layout | `Card`, `Separator`, `Tabs`, `TabNav`, `Accordion`, `Collapsible`, `Resizable`, `ScrollArea`, `Sidebar` | TabNav is links, not panels |
| Feedback | `Alert`, `Banner`, `Callout`, `Progress`, `ProgressRing`, `Spinner`, `Skeleton`, `Empty` | |
| Data | `Table`, `Pagination`, `Chart` | Chart: bar, grouped bar, donut, sparkline (zero-dep SVG) |
| Chat | `Message`, `MessageScroller`, `Bubble`, `Marker`, `Attachment`, `MentionTextarea` | |
| Theme | `ThemeSwitcher` | needs `src/styles/theme.ts`; no LocaleProvider |
| Demo chrome | `Locale`, `SiteHeader` | **demo-only** |

Full export names live in `mcp/shacdn-server/src/catalog.ts` (kept honest by `catalog.test.ts`).
