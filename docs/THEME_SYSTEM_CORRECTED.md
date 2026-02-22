# Theme System - Corrected Implementation

## Overview

Theme system with **2 base themes** (Light/Dark) and **6 color schemes** that work within each theme.

## How It Works

### 1. Base Theme (Background/Foreground)
- **Light**: White background, dark text
- **Dark**: Dark background, light text

### 2. Color Scheme (Accent Colors)
- **Default**: Slate/Gray
- **Blue**: Vibrant blue
- **Green**: Fresh green
- **Purple**: Creative purple
- **Orange**: Energetic orange
- **Rose**: Elegant rose

### Combinations

You can combine ANY base theme with ANY color scheme:

| Base Theme | Color Scheme | Result |
|------------|--------------|--------|
| Light | Default | Light with gray accents (default) |
| Light | Blue | Light with blue accents |
| Light | Green | Light with green accents |
| Dark | Default | Dark with light accents |
| Dark | Blue | Dark with blue accents |
| Dark | Green | Dark with green accents |

**Total**: 2 6 = **12 possible combinations**

## UI Controls

### Button 1: Theme Toggle (/)
- Switches between **Light** and **Dark** base theme
- Changes background and foreground colors
- Icon: `Sun` (light) or `Moon` (dark)

### Button 2: Color Scheme ()
- Opens menu with 6 color options
- Changes **accent color** (primary, ring, etc.)
- Works in **BOTH** light and dark themes
- Icon: `Palette`
- Active scheme marked with `Check` icon

## CSS Implementation

### Structure

```css
/* Base light theme */
:root {
 --background: white;
 --foreground: dark;
 --primary: slate;
}

/* Dark theme - changes background/foreground */
:root[data-theme*="dark"] {
 --background: dark;
 --foreground: light;
 --primary: light;
}

/* Color schemes - override primary color */
:root[data-theme*="blue"] {
 --primary: blue;
}

/* Color scheme in dark theme */
:root[data-theme*="blue"][data-theme*="dark"] {
 --primary: blue;
 --primary-foreground: white;
}
```

### Attribute System

Theme is applied via `data-theme` attribute on `<html>`:

```html
<!-- Light + Default -->
<html>

<!-- Light + Blue -->
<html data-theme="blue">

<!-- Dark + Default -->
<html data-theme="dark">

<!-- Dark + Blue -->
<html data-theme="dark blue">
```

## Component Logic

```tsx
const applyTheme = (theme: 'light' | 'dark', color: string) => {
 const root = document.documentElement;
 root.removeAttribute('data-theme');
 
 const classes: string[] = [];
 
 if (theme === 'dark') classes.push('dark');
 if (color !== 'default') classes.push(color);
 
 if (classes.length > 0) {
 root.setAttribute('data-theme', classes.join(' '));
 }
};
```

## Examples

### Example 1: Light theme with blue accents
1. Click (ensure light theme)
2. Click 
3. Select "Blue"
4. Result: White background + blue buttons

### Example 2: Dark theme with green accents
1. Click (switch to dark)
2. Click 
3. Select "Green"
4. Result: Dark background + green buttons

### Example 3: Switching theme keeps color
1. Set color to "Purple"
2. Click / to switch theme
3. Result: Purple accents preserved in new theme

## Color Definitions

### Light Theme + Color Schemes

| Scheme | Primary Color |
|--------|--------------|
| Default | `hsl(222.2, 47.4%, 11.2%)` - Slate |
| Blue | `hsl(221.2, 83.2%, 53.3%)` - Blue |
| Green | `hsl(142.1, 76.2%, 36.3%)` - Green |
| Purple | `hsl(262.1, 83.3%, 57.8%)` - Purple |
| Orange | `hsl(24.6, 95%, 53.1%)` - Orange |
| Rose | `hsl(346.8, 77.2%, 49.8%)` - Rose |

### Dark Theme + Color Schemes

Same accent colors, but adjusted `primary-foreground` for readability.

## Usage

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

## Icons

- `Sun` from lucide-react - Light theme
- `Moon` from lucide-react - Dark theme
- `Palette` from lucide-react - Color picker
- `Check` from lucide-react - Active scheme indicator

## Persistence

Both theme and color scheme are saved to localStorage:

```typescript
localStorage.setItem('theme', 'dark');
localStorage.setItem('colorScheme', 'blue');
```

Restored automatically on page load.

---

**Implementation Date**: February 22, 2026 
**Version**: 1.2.1 (Corrected)
