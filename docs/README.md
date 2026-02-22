# shadcn/ui React Component Library

A comprehensive implementation guide for this React component library.

## Quick Links

- [Component Guide](./COMPONENT_GUIDE.md) - Usage examples and API
- [Project Summary](./PROJECT_SUMMARY.md) - Architecture and features

## Component Categories

### Input & Forms
- **Button** - 6 variants, 4 sizes, icon buttons
- **Input** - text, email, password, search, file types
- **Textarea** - multiline text input
- **Checkbox** - custom styled checkbox
- **Switch** - toggle switch
- **Select** - dropdown select
- **DatePicker** - date selection with calendar
- **InputGroup** - inputs with prefix/suffix addons

### Display & Feedback
- **Badge** - 5 variants for labels and status
- **Alert** - default and destructive notifications
- **Toast** - toast notifications with provider
- **Progress** - progress bars
- **Kbd** - keyboard shortcut display

### Layout & Structure
- **Card** - cards with header, content, footer
- **Tabs** - tabbed interface with context
- **Table** - data tables with header and body

### Navigation
- **Breadcrumb** - navigation breadcrumbs
- **Pagination** - page navigation controls

### Overlays
- **Dialog** - modal dialogs
- **AlertDialog** - confirmation dialogs
- **Drawer** - slide-out panels (4 sides)
- **DropdownMenu** - dropdown menus

## Design System Reference

### Colors
All colors use HSL values from shadcn/ui:
- Primary: `hsl(222.2, 47.4%, 11.2%)`
- Secondary: `hsl(210, 40%, 96.1%)`
- Destructive: `hsl(0, 84.2%, 60.2%)`
- Border: `hsl(214.3, 31.8%, 91.4%)`

### Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

### Typography Scale
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)

### Border Radius Scale
- xs: 0.25rem
- sm: 0.375rem
- md: 0.5rem
- lg: 0.75rem
- xl: 1rem

## Development Workflow

### Creating New Components

1. **Create Directory**: `src/components/ComponentName/`
2. **Add Files**:
 - `ComponentName.tsx` - React component
 - `ComponentName.module.scss` - Styles

3. **Follow Pattern**:
 ```tsx
 import { forwardRef } from 'react';
 import styles from './Component.module.scss';
 
 export const Component = forwardRef((props, ref) => {
 return <div ref={ref} {...props} />;
 });
 
 Component.displayName = 'Component';
 ```

4. **Use Design Tokens**:
 ```scss
 @import '../../styles/variables.scss';
 
 .component {
 color: $foreground;
 border-radius: $radius-md;
 transition: all $transition-fast;
 }
 ```

5. **Validate**:
 - TypeScript: No errors
 - Lint: `npm run lint`
 - Build: `npm run build`
 - Visual: Test in App.tsx

### Component Checklist

- [ ] forwardRef with proper typing
- [ ] displayName set
- [ ] Extends appropriate HTML types
- [ ] Supports className prop
- [ ] Spreads ...props
- [ ] Uses SCSS modules
- [ ] Imports design variables
- [ ] Has focus-visible state
- [ ] Has disabled state
- [ ] Has hover state
- [ ] ARIA attributes where needed

## Common Patterns

### Composite Components
Components with multiple parts (like Card):
```tsx
export const Card = forwardRef(/* ... */);
export const CardHeader = forwardRef(/* ... */);
export const CardContent = forwardRef(/* ... */);
export const CardFooter = forwardRef(/* ... */);
```

### Context-Based Components
Components using React Context (like Tabs):
```tsx
const Context = createContext();

export const Tabs = ({ children, defaultValue }) => {
 const [value, setValue] = useState(defaultValue);
 return (
 <Context.Provider value={{ value, setValue }}>
 {children}
 </Context.Provider>
 );
};

export const TabsTrigger = ({ value: tabValue }) => {
 const { value, setValue } = useContext(Context);
 return <button onClick={() => setValue(tabValue)} />;
};
```

### Controlled/Uncontrolled Pattern
Components supporting both modes:
```tsx
export const Component = ({ 
 value, 
 defaultValue, 
 onValueChange 
}) => {
 const [internal, setInternal] = useState(defaultValue);
 const current = value !== undefined ? value : internal;
 
 const handleChange = (newValue) => {
 setInternal(newValue);
 onValueChange?.(newValue);
 };
 
 return <input value={current} onChange={handleChange} />;
};
```

## Best Practices

### DO
 Use design system variables from `variables.scss`
 Follow existing component patterns
 Add proper TypeScript types
 Include accessibility attributes
 Test all component states
 Keep styles scoped with SCSS modules
 Use semantic HTML elements

### DON'T
 Use inline styles for design tokens
 Add external UI libraries
 Use Tailwind CSS
 Create global styles (except in globals.scss)
 Duplicate CSS variable values
 Forget hover/focus/disabled states
 Skip forwardRef and displayName

## Resources

- [shadcn/ui Official](https://ui.shadcn.com)
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui)
- [React forwardRef](https://react.dev/reference/react/forwardRef)
- [SCSS Modules](https://github.com/css-modules/css-modules)
