# shacdn design

Agent contract for UI built with **shacdn**: a React 19 + TypeScript implementation of [shadcn/ui](https://ui.shadcn.com) using **SCSS modules**. No Tailwind. No Radix. No extra UI libraries.

Read this before adding a screen, a component, or styles. Token values live in `src/styles/variables.scss` and `src/styles/globals.scss`. If this file and those sources disagree, the sources win.

Copy into another app with `npm run shacdn:install -- /path/to/app`. Task-to-component map: `docs/COMPONENTS_AI_REFERENCE.md`.

## Look and feel

Neutral, dense, product UI. The default theme is achromatic (shadcn/ui v4 grayscale), not a branded color. Surfaces are flat. Edges are 1px hairlines. Type is a system sans with slight negative tracking, close to SF Pro. Motion is short and decisive. One primary action per region. Secondary actions stay quiet (`outline`, `ghost`, or `link`).

Color schemes (`blue`, `green`, `purple`, `orange`, `rose`) only recolor `--primary` and `--ring`. They do not restyle layout.

## Hard rules

1. Use tokens. Do not write hex, raw `hsl(...)`, or pixel spacing in component modules.
2. Import tokens with `@use`, never `@import`:

   ```scss
   @use '../../styles/variables.scss' as *;
   ```

3. Dark-mode `--border` and `--input` already include alpha (`0 0% 100% / 0.1`). Do not write `hsl(var(--border) / 0.5)`. Use `alpha($border, 50%)`.
4. Each component is a folder: `Name.tsx` + `Name.module.scss`. Copy the pair. Keep `forwardRef`, `displayName`, and `styles[variant]` class mapping.
5. Compose with existing primitives. Do not restyle a `Button` into a new control.
6. Focus is `:focus-visible` only: `outline: $focus-ring-width solid $ring; outline-offset: $focus-ring-offset`.
7. Disabled controls: `pointer-events: none; opacity: 0.5`. Invalid fields: `border-color: $destructive` when `aria-invalid="true"`.
8. Icons are `lucide-react`, 1rem (16px) inside controls, 1.25rem in alerts. Do not introduce another icon set.
9. External and in-app CTAs that navigate use `Button` with `href` (it renders an anchor). Do not wrap a button in an `<a>`.
10. Do not copy demo chrome (`Locale`, `SiteHeader`) into consumer apps.

## Color

Semantic roles, light theme (`:root`). Values are HSL channels stored in CSS variables; SCSS tokens wrap them as `hsl(var(--token))`.

| Role | Light | Use |
|---|---|---|
| `background` / `foreground` | `0 0% 100%` / `0 0% 3.9%` | Page |
| `card` / `card-foreground` | same as page in light | Raised panel. In dark, card is `0 0% 9%` on a `3.9%` page |
| `popover` | same as page in light; `14.9%` in dark | Menus, popovers, dialogs |
| `primary` / `primary-foreground` | `0 0% 9%` / `0 0% 98%` | The one solid action |
| `secondary` | `0 0% 96.1%` on `9%` text | Quiet filled button, chips |
| `muted` / `muted-foreground` | `96.1%` / `45.1%` | Descriptions, meta, placeholders |
| `accent` | `96.1%` | Hover wash on ghost and outline |
| `destructive` | `0 72.2% 50.6%` | Delete, irreversible, errors. Light foreground |
| `warning` | `38 92% 50%` | Caution. Dark foreground |
| `success` | `142.1 70.6% 35.3%` | Positive status. Light foreground |
| `border` / `input` | `0 0% 89.8%` | Hairline and field stroke |
| `ring` | `0 0% 63.1%` | Focus ring |

In dark mode, primary flips (light fill, dark label). Borders become translucent white. Popovers sit above cards, cards sit above the page. Do not paint a card the same color as the page in dark mode.

Charts use `$chart-1` … `$chart-5` in order. Do not invent a sixth series color.

`$solar`, `$battery`, `$grid`, `$load`, `$ev`, `$import-color`, `$export-color` are energy-domain accents for the BESS demo only. Do not use them as general status colors.

## Spacing, radius, type

Spacing scale: `xs` 4px, `sm` 8px, `md` 16px, `lg` 24px, `xl` 32px (`$spacing-*`).

Radius comes from a 0.625rem base: `xs` 0.375rem, `sm` 0.5rem, `md` 0.625rem, `lg` 0.75rem, `xl` 0.875rem. Controls use `$radius-md`. Cards and alerts use `$radius-lg`. Compact buttons (`xs`, `sm`) use `$radius-sm`.

Type:

| Token | Size | Use |
|---|---|---|
| `$font-size-xs` | 12px | Meta, eyebrows, chart labels |
| `$font-size-sm` | 14px | Controls, body in product UI, descriptions |
| `$font-size-base` | 16px | Long reading text |
| `$font-size-lg` | 18px | Card titles |
| `$font-size-xl` | 20px | Page titles in app shells |

`$font-sans` is the system stack (`-apple-system`, `SF Pro Text`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`). Body line-height is `1.47`, tracking `-0.011em`. Headings use weight 600, line-height `1.2`, `$tracking-tight` (`-0.022em`). UI labels use weight 500 and `$tracking-ui` (`-0.01em`).

Marketing headings (showcase / landing only): h1 2.25rem / 800, h2 1.875rem / 600, h3 1.5rem / 600. App pages stay at `$font-size-xl` for the title. Do not put marketing type inside a dashboard.

Monospace for code, kbd, and hex readouts: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.

## Controls

Default control height is `$control-h-md` (32px). Horizontal padding is `$control-px` (10px).

| Token | Height | Use |
|---|---|---|
| `$control-h-xs` | 24px | Rare, dense toolbars |
| `$control-h-sm` | 28px | Secondary toolbar actions |
| `$control-h-md` | 32px | Default button, input, select |
| `$control-h-lg` | 36px | Prominent page-header actions |

`Switch` is its own size: track `$switch-track-w` × `$switch-track-h` (36×20). Do not stretch it to button height.

Button variants, in order of emphasis:

| Variant | When |
|---|---|
| `default` | The single primary action. Solid `$primary`. Hover is `alpha($primary, 90%)` so the label stays full contrast |
| `secondary` | Supporting filled action |
| `outline` | Default for most buttons in a toolbar or dialog footer |
| `ghost` | Icon buttons, row actions, low-emphasis |
| `destructive` | Confirm delete or other irreversible commit |
| `link` | Inline navigation that should look like text |

Sizes: `xs`, `sm`, `md` (default), `lg`, plus square `icon`, `iconSm`, `iconLg`. Icon buttons need an accessible name (`aria-label`).

Solid hovers fade the fill, not the whole control. Ghost and outline hovers use `$accent`.

## Layout

App pages:

- Page padding: `$spacing-md` on small screens, `$spacing-lg` from 768px, `$spacing-xl` from 1024px.
- Page header is a wrapping row: title block on the left, actions on the right, `gap: $spacing-md $spacing-lg`, `align-items: flex-start`.
- Title block stacks eyebrow, title, lead with `$spacing-xs`. Lead max-width is `42rem`, `$font-size-sm`, `$muted-foreground`.
- Eyebrow (optional): `$font-size-xs`, weight 600, uppercase, tracking `0.06em`, `$muted-foreground`.
- Header actions wrap. Below 768px they go full width.
- Section gap inside a page is `$spacing-lg`, `$spacing-xl` from 768px.
- Reading measure for prose stays near `42rem`. Data pages may run wider (about `72rem`) but do not stretch a single paragraph across the viewport.

Cards: border `$border`, radius `$radius-lg`, background `$card`, padding `$spacing-lg`. Title `$font-size-lg` / 600. Description `$font-size-sm` / `$muted-foreground`. Footer is a row with `$spacing-sm` gaps. Card actions sit in the header's second column, top-aligned.

Stack related fields with `$spacing-sm` inside a group and `$spacing-md` between groups. Dialog and sheet footers align actions to the end: cancel as `outline` or `ghost`, confirm as `default` (or `destructive`).

Breakpoints used in product screens: 640px, 768px, 960px, 1024px. Prefer those. Do not add a new breakpoint for one component.

Sticky site header height is `$site-header-height` (2.75rem). Fixed side navigation must clear it.

## Choosing a component

| Job | Use |
|---|---|
| Button, CTA, link | `Button` (`href` renders `<a>`) |
| Text | `Input`, `Textarea`, `InputGroup`, `InputOTP` |
| Field chrome | `Label`, `Field`, `Form` |
| Pick one / many | `Select`, `NativeSelect`, `Combobox`, `MultiSelect` |
| Boolean | `Checkbox`, `Switch`, `Toggle` |
| One of a set | `RadioGroup` or `RadioCards` when the option needs a description |
| Many of a set, with description | `CheckboxGroup` or `CheckboxCards` |
| Key / value | `DataList` |
| Date | `DatePicker`, `DateRangePicker`, `Calendar` |
| Confirm | `AlertDialog` |
| Modal | `Dialog` (`Modal` is an alias) |
| Side panel | `Drawer` (`Sheet` is an alias) |
| Menu | `DropdownMenu`, `ContextMenu`, `Menubar` |
| Hint | `Tooltip` (needs `TooltipProvider`), `HoverCard`, `Popover` |
| Toast | `Toast` via `ToastProvider` (`Sonner` is an alias) |
| Page sections | `Card`, `Separator`, `Tabs` (panels) or `TabNav` (links) |
| Disclosure | `Accordion`, `Collapsible` |
| Status | `Badge`, `Alert`, `Banner`, `Callout` |
| Waiting | `Skeleton` for layout, `Spinner` for a known control, `Progress` for a measured task |
| Nothing here | `Empty` (title, description, one action) |
| Data | `Table`, `Pagination`, `Chart` |
| App shell | `Sidebar` |
| Theme | `ThemeSwitcher` (needs `src/styles/theme.ts`) |

`Select` and date pickers need the `Floating` helper. Do not position menus with `position: absolute` and a guessed `top`.

## Feedback and status

- `Badge` variants: `default`, `secondary`, `outline`, `destructive`, `ghost`, `success`. Use `outline` or `secondary` for neutral metadata. Reserve `destructive` and `success` for real state.
- `Alert` is inline and persistent. `Toast` is transient. Do not toast a field validation error.
- Errors sit next to the field (`FormMessage`) and set `aria-invalid`.
- Empty states: one sentence of what is missing, one sentence of what to do, one primary action. No illustration unless the screen already uses one.

## Motion and stacking

| Token | Duration | Use |
|---|---|---|
| `$transition-fast` | 120ms | Color, border, opacity on controls |
| `$transition-base` | 180ms | Larger surface changes |
| `$transition-slow` | 260ms | Rare, large layout |
| `$overlay-enter` | 150ms spring | Dialog, drawer, menu enter |
| `$overlay-exit` | 120ms standard | Overlay leave |

Easing: `$ease-standard` is `cubic-bezier(0.25, 0.1, 0.25, 1)`. Overlays use `$ease-spring` (`cubic-bezier(0.16, 1, 0.3, 1)`). Do not add bounce, long fades, or scroll-linked motion.

`prefers-reduced-motion: reduce` is already handled in `globals.scss` (durations collapse to ~0). New animations must still finish on their end keyframe so open overlays stay visible.

Stacking, low to high: `$z-docked` 10, `$z-sticky` 100, `$z-floating` 200, `$z-overlay-backdrop` 1000, `$z-overlay` 1001, `$z-toast` 1100, `$z-tooltip` 1200. Do not invent a `z-index: 9999`.

## Themes

`data-theme` on `<html>`:

- Mode: light (default) or `dark`
- Scheme, optional: `blue`, `green`, `purple`, `orange`, `rose`

Both can apply together (`data-theme="dark blue"`). Persist with the existing theme helpers in `src/styles/theme.ts`. Do not store theme in a one-off `localStorage` key.

## Accessibility

- Name every control. Icon-only buttons get `aria-label`.
- Keyboard: Tab through controls, Escape closes overlays, Arrow keys move in menus, tabs, and radio groups.
- Restore focus to the trigger when an overlay closes.
- Do not remove the focus ring. Do not replace it with a border-color change alone.
- Contrast: body text uses `$foreground` on `$background` or `$card`. Muted text is for secondary copy, not for the only instruction on the page.
- Respect `DirectionProvider` for RTL. Do not hardcode `margin-left` for logical spacing when the component already flips.

## Implementation shape

```tsx
export const Example = forwardRef<HTMLButtonElement, ExampleProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(styles.example, styles[variant], styles[size], className)}
      {...props}
    />
  )
);
Example.displayName = 'Example';
```

- Arrow functions only. No `function` declarations.
- `cn()` from `src/lib/cn.ts`.
- Controlled and uncontrolled: `value` / `defaultValue`, callbacks as `onChange?.(value)`.
- Class names in modules are camelCase (`.primaryButton`, `.sizeMd`). Variant classes stay short (`.default`, `.outline`, `.sm`).
- Do not use the `@/` import alias inside a component folder. Consumers copy that folder and need relative imports.

## Do not

- Add Tailwind, Radix, or another component library.
- Hardcode a hover color. Solid variants use `alpha($token, 90%)` or `80%`.
- Put marketing hero type, gradients, or glassmorphism on product screens.
- Open a second dialog on top of a dialog. Use a sheet, or close the first.
- Use `$destructive` as a brand color.
- Animate layout properties (`height`, `top`, `width`) when opacity or transform will do.
- Ship a new visual pattern without recording the gap in `docs/SHADCN_PARITY_MATRIX.md` when the screen is meant to match ui.shadcn.com.
