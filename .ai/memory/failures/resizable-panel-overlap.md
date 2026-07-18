# Resizable panels overlap / stray handle lines

## Symptom
Nested `ResizablePanelGroup` (Analytics engagement layout) showed overlapping panels, a horizontal handle cutting through chart content, and broken vertical dividers.

## Root cause
Panels used `flex: 0 0 ${size}%`. Percentage bases summed to 100% while handles took fixed px (`10px` with grip), so the column overflowed and children stacked on top of each other. Nested groups also drew a second border, which read as stray lines.

## Fix
- Size panels with `flex: ${size} 1 0px` (grow factors share space after handles).
- Nested `.group .group` drops border/radius.
- Analytics `resizableWrap` uses a definite `height` (not only `min-height`).

## Regression
`src/components/Resizable/Resizable.test.tsx`
