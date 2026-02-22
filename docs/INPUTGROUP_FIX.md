# InputGroup Component Fix

## Issues Found and Fixed

### 1. Fixed SCSS Variables (First Fix)

**Problem:** The InputGroup component was using CSS custom properties syntax (`hsl(var(--variable))`) instead of the SCSS variables defined in the project.

**Solution:** Replaced all CSS custom properties with SCSS variables from `variables.scss`.

### 2. Fixed Focus Outline on Entire Component (Second Fix)

**Problem:** When input is focused, only the input element gets the outline, not the entire InputGroup component.

**Solution:** Added `:focus-within` to the parent `.inputGroup` container.

### 3. Removed Divider Line on Focus (Third Fix)

**Problem:** When input is focused, a visible divider line appears between the input and addon due to border changes.

**Solution:** Removed the `&:focus` styles that were adding borders on focused input.

### 4. Removed Visible Dashes/Lines Between Components (Fourth Fix) 

**Problem:** Small visible dashes/lines appear at the junction between input and addon elements.

**Solution:** Removed negative margin and simplified border logic:

**Before:**
```scss
&:not(:first-child) {
 border-left: none;
 margin-left: -1px; // This was causing the dashes
}

&:not(:last-child) {
 border-right: none;
}
```

**After:**
```scss
&:first-child {
 border-right: none;
}

&:last-child {
 border-left: none;
}

&:not(:first-child):not(:last-child) {
 border-left: none;
 border-right: none;
}
```

Also removed the unnecessary `+ input { margin-left: 0; }` override from addon styles.

## Why This Works

1. **No Negative Margins**: Removed `margin-left: -1px` which was causing overlap artifacts
2. **Explicit Border Control**: Specific rules for first, last, and middle elements
3. **Clean Joins**: Borders are removed on touching sides, creating seamless appearance
4. **Unified Focus**: Single outline on parent container via `:focus-within`

## Final Result

The InputGroup component now perfectly matches shadcn/ui design:
- Muted gray background for addons
- Seamless border connection between addon and input
- Proper border radius on outer edges
- Entire group gets outline on focus
- No divider line between components on focus
- **No visible dashes or artifacts at component junctions** (new fix)
- Clean, unified visual appearance

## Component Usage

```tsx
// Prefix addon
<InputGroup>
 <InputGroupAddon>https://</InputGroupAddon>
 <Input placeholder="example.com" />
</InputGroup>

// Suffix addon
<InputGroup>
 <Input placeholder="Username" />
 <InputGroupAddon>@mail.com</InputGroupAddon>
</InputGroup>
```

## Testing

 Lint passes: `npm run lint`
 Focus outline applies to entire group
 No divider lines between components
 No visible dashes or artifacts
 All styling now perfectly matches shadcn/ui reference design
