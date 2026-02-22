# Theme System

## Overview

The component library now supports **light/dark themes** and **6 color schemes** with automatic persistence using localStorage.

## Features

 **2 Themes**: Light (default) and Dark 
 **6 Color Schemes**: Default, Blue, Green, Purple, Orange, Rose 
 **Auto-persist**: Preferences saved to localStorage 
 **Fast transitions**: 150ms CSS transitions (optimized) 
 **Lucide Icons**: Beautiful Sun, Moon, and Palette icons 
 **All components**: Full theme support across all 30 components

## Usage

### Theme Switcher Component

The `ThemeSwitcher` component provides UI controls for changing themes and color schemes:

```tsx
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';

function App() {
 return (
 <div>
 <ThemeSwitcher />
 {/* Your content */}
 </div>
 );
}
```

### Controls

1. ** Sun/ Moon Button**: Toggle between light and dark themes
2. ** Palette Button**: Open color scheme menu
3. **Color Options**: Choose from 6 color schemes with checkmarks

### Icons

All icons are from **lucide-react**:
- `Sun` - Light theme indicator
- `Moon` - Dark theme indicator 
- `Palette` - Color scheme selector
- `Check` - Active color scheme indicator

### Available Color Schemes

| Scheme | Primary Color | Use Case |
|--------|---------------|----------|
| **Default** | `hsl(222.2, 47.4%, 11.2%)` | Slate/Gray - Professional |
| **Blue** | `hsl(221.2, 83.2%, 53.3%)` | Vibrant blue - Tech/Corporate |
| **Green** | `hsl(142.1, 76.2%, 36.3%)` | Fresh green - Health/Nature |
| **Purple** | `hsl(262.1, 83.3%, 57.8%)` | Creative purple - Design/Creative |
| **Orange** | `hsl(24.6, 95%, 53.1%)` | Energetic orange - Social/Fun |
| **Rose** | `hsl(346.8, 77.2%, 49.8%)` | Elegant rose - Luxury/Fashion |

## Implementation Details

### CSS Variables

All colors are defined as HSL values in CSS variables:

```css
:root {
 --background: 0 0% 100%;
 --foreground: 222.2 84% 4.9%;
 --primary: 222.2 47.4% 11.2%;
 /* ... more variables */
}

[data-theme="dark"] {
 --background: 222.2 84% 4.9%;
 --foreground: 210 40% 98%;
 /* ... inverted colors */
}

[data-theme="blue"] {
 --primary: 221.2 83.2% 53.3%;
 /* ... custom primary color */
}
```

### SCSS Variables

Components use SCSS variables that reference CSS variables:

```scss
$primary: hsl(var(--primary));
$background: hsl(var(--background));
```

This allows:
- Dynamic theme switching without recompilation
- Smooth CSS transitions
- Full backward compatibility with existing components

### Persistence

Themes are automatically saved to localStorage:

```typescript
localStorage.setItem('theme', 'dark');
localStorage.setItem('colorScheme', 'blue');
```

On page load, saved preferences are restored automatically.

## Manual Theme Control

You can also set themes programmatically:

```typescript
// Set dark theme
document.documentElement.setAttribute('data-theme', 'dark');

// Set color scheme
document.documentElement.setAttribute('data-theme', 'blue');

// Combine both
document.documentElement.setAttribute('data-theme', 'dark blue');
```

## Component Support

All 30 components automatically support themes:

 Alert, AlertDialog, Avatar, Badge, Breadcrumb 
 Button, Card, Checkbox, DatePicker, Dialog 
 Drawer, DropdownMenu, Input, InputGroup, Kbd 
 Label, Pagination, Progress, RadioGroup, Select 
 Separator, Skeleton, Slider, Spinner, Switch 
 Table, Tabs, Textarea, Toast, Tooltip 

## Examples

### Dark Mode with Blue Accent

```tsx
<ThemeSwitcher />
```

1. Click sun/moon button Switch to dark
2. Click palette button Open menu
3. Click "Blue" Apply blue color scheme

Result: Dark background with blue primary color

### Light Mode with Green Accent

1. Click sun/moon button Switch to light (if dark)
2. Click palette button Open menu 
3. Click "Green" Apply green color scheme

Result: Light background with green primary color

## Design Tokens

### Light Theme Colors

```
Background: White (hsl(0, 0%, 100%))
Foreground: Dark slate (hsl(222.2, 84%, 4.9%))
Primary: Dark slate (hsl(222.2, 47.4%, 11.2%))
Border: Light gray (hsl(214.3, 31.8%, 91.4%))
```

### Dark Theme Colors

```
Background: Dark slate (hsl(222.2, 84%, 4.9%))
Foreground: Light (hsl(210, 40%, 98%))
Primary: Light (hsl(210, 40%, 98%))
Border: Dark gray (hsl(217.2, 32.6%, 17.5%))
```

## Best Practices

1. **Use semantic variables**: Always use `$primary`, `$background`, etc. instead of hardcoded colors
2. **Test both themes**: Check component appearance in both light and dark modes
3. **Respect user preference**: System preference can be detected with `prefers-color-scheme`
4. **Smooth transitions**: CSS transitions are applied to background/color changes

## Browser Support

 Chrome 49+ 
 Firefox 31+ 
 Safari 9.1+ 
 Edge 79+ 

All modern browsers with CSS Variables support.

---

**Created**: February 22, 2026 
**Version**: 1.2.0
