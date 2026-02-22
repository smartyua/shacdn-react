# Component Guide

## Using Existing Components

### Button

```tsx
import { Button } from './components/Button/Button';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// Different sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// Icon buttons
<Button size="icon" variant="outline"></Button>
<Button size="iconSm" variant="outline"></Button>
<Button size="iconLg" variant="outline"></Button>

// With events
<Button onClick={() => alert('Clicked!')}>Click me</Button>
<Button disabled>Disabled</Button>
```

### Input

```tsx
import { Input } from './components/Input/Input';

// Basic usage
<Input placeholder="Enter text..." />

// Different types
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="" />
<Input type="search" placeholder="Search..." />
<Input type="file" />

// With states
<Input disabled placeholder="Disabled" />
<Input aria-invalid placeholder="Invalid input" />
```

### Card

```tsx
import { 
 Card, 
 CardHeader, 
 CardTitle, 
 CardDescription,
 CardContent, 
 CardFooter,
 CardAction 
} from './components/Card/Card';

// Basic usage
<Card>
 <CardHeader>
 <CardTitle>Card Title</CardTitle>
 <CardDescription>Card description text</CardDescription>
 </CardHeader>
 <CardContent>
 <p>Your content here</p>
 </CardContent>
 <CardFooter>
 <Button>Action</Button>
 </CardFooter>
</Card>

// With corner action
<Card>
 <CardHeader>
 <CardTitle>Title</CardTitle>
 <CardDescription>Description</CardDescription>
 <CardAction>
 <Badge>New</Badge>
 </CardAction>
 </CardHeader>
 <CardContent>Content</CardContent>
</Card>
```

### Badge

```tsx
import { Badge } from './components/Badge/Badge';

// Variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="ghost">Ghost</Badge>
```

### Checkbox

```tsx
import { Checkbox } from './components/Checkbox/Checkbox';

// With label
<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
 <Checkbox id="terms" />
 <label htmlFor="terms">Accept terms</label>
</div>

// Controlled
const [checked, setChecked] = useState(false);
<Checkbox 
 checked={checked} 
 onChange={(e) => setChecked(e.target.checked)} 
/>

// With states
<Checkbox defaultChecked />
<Checkbox disabled />
```

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from './components/Alert/Alert';

// Basic Alert
<Alert>
 <span></span>
 <div>
 <AlertTitle>Heads up!</AlertTitle>
 <AlertDescription>
 You can add components to your app.
 </AlertDescription>
 </div>
</Alert>

// Destructive Alert
<Alert variant="destructive">
 <span></span>
 <div>
 <AlertTitle>Error</AlertTitle>
 <AlertDescription>
 Something went wrong.
 </AlertDescription>
 </div>
</Alert>
```

### Textarea

```tsx
import { Textarea } from './components/Textarea/Textarea';

// Basic usage
<Textarea placeholder="Type your message..." />

// With configuration
<Textarea rows={4} placeholder="Feedback..." />
<Textarea disabled placeholder="Disabled" />
<Textarea aria-invalid placeholder="Invalid" />
```

### Slider

```tsx
import { Slider } from './components/Slider/Slider';

// Basic usage
<Slider defaultValue={50} />

// With range configuration
<Slider min={0} max={10} step={0.5} defaultValue={5} />

// Controlled
const [value, setValue] = useState(50);
<Slider value={value} onValueChange={setValue} />

// Disabled
<Slider defaultValue={30} disabled />
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs/Tabs';

// Basic usage
<Tabs defaultValue="tab1">
 <TabsList>
 <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 <TabsTrigger value="tab3">Tab 3</TabsTrigger>
 </TabsList>
 
 <TabsContent value="tab1">
 <p>Content for tab 1</p>
 </TabsContent>
 
 <TabsContent value="tab2">
 <p>Content for tab 2</p>
 </TabsContent>
 
 <TabsContent value="tab3">
 <p>Content for tab 3</p>
 </TabsContent>
</Tabs>

// Controlled
const [activeTab, setActiveTab] = useState('tab1');
<Tabs value={activeTab} onValueChange={setActiveTab}>
 {/* ... */}
</Tabs>
```

### Spinner 

```tsx
import { Spinner } from './components/Spinner/Spinner';

// Different sizes
<Spinner size="sm" />
<Spinner /> // default size
<Spinner size="lg" />

// In a button
<Button disabled>
 <Spinner size="sm" />
 Loading...
</Button>
```

### RadioGroup 

```tsx
import { RadioGroup, RadioGroupItem } from './components/RadioGroup/RadioGroup';
import { Label } from './components/Label/Label';

// Basic usage
<RadioGroup defaultValue="option1">
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
 <RadioGroupItem value="option1" id="r1" />
 <Label htmlFor="r1">Option 1</Label>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
 <RadioGroupItem value="option2" id="r2" />
 <Label htmlFor="r2">Option 2</Label>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
 <RadioGroupItem value="option3" id="r3" />
 <Label htmlFor="r3">Option 3</Label>
 </div>
</RadioGroup>

// Controlled
const [value, setValue] = useState('option1');
<RadioGroup value={value} onValueChange={setValue}>
 {/* ... */}
</RadioGroup>

// Disabled
<RadioGroup disabled>
 {/* ... */}
</RadioGroup>
```

### Tooltip 

```tsx
import { 
 Tooltip, 
 TooltipTrigger, 
 TooltipContent, 
 TooltipProvider 
} from './components/Tooltip/Tooltip';

// Basic usage
<TooltipProvider>
 <Tooltip>
 <TooltipTrigger>
 <Button variant="outline">Hover me</Button>
 </TooltipTrigger>
 <TooltipContent>
 <p>Add to library</p>
 </TooltipContent>
 </Tooltip>
</TooltipProvider>

// Different positions
<Tooltip>
 <TooltipTrigger>
 <Button>Top</Button>
 </TooltipTrigger>
 <TooltipContent side="top">
 <p>Tooltip on top</p>
 </TooltipContent>
</Tooltip>

<Tooltip>
 <TooltipTrigger>
 <Button>Right</Button>
 </TooltipTrigger>
 <TooltipContent side="right">
 <p>Tooltip on right</p>
 </TooltipContent>
</Tooltip>

<Tooltip>
 <TooltipTrigger>
 <Button>Bottom</Button>
 </TooltipTrigger>
 <TooltipContent side="bottom">
 <p>Tooltip on bottom</p>
 </TooltipContent>
</Tooltip>

<Tooltip>
 <TooltipTrigger>
 <Button>Left</Button>
 </TooltipTrigger>
 <TooltipContent side="left">
 <p>Tooltip on left</p>
 </TooltipContent>
</Tooltip>

// Custom offset
<TooltipContent side="top" sideOffset={10}>
 <p>Tooltip with custom offset</p>
</TooltipContent>
```

### Avatar

```tsx
import { 
 Avatar, 
 AvatarImage, 
 AvatarFallback,
 AvatarBadge,
 AvatarGroup,
 AvatarGroupCount
} from './components/Avatar/Avatar';

// Basic usage
<Avatar>
 <AvatarImage src="/avatar.jpg" alt="User" />
 <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Different sizes
<Avatar size="sm">
 <AvatarImage src="/avatar.jpg" alt="User" />
 <AvatarFallback>JD</AvatarFallback>
</Avatar>
<Avatar> // default size
 <AvatarImage src="/avatar.jpg" alt="User" />
 <AvatarFallback>JD</AvatarFallback>
</Avatar>
<Avatar size="lg">
 <AvatarImage src="/avatar.jpg" alt="User" />
 <AvatarFallback>JD</AvatarFallback>
</Avatar>

// With badge
<Avatar>
 <AvatarImage src="/avatar.jpg" alt="User" />
 <AvatarFallback>JD</AvatarFallback>
 <AvatarBadge />
</Avatar>

// Avatar group
<AvatarGroup>
 <Avatar>
 <AvatarImage src="/avatar1.jpg" alt="User 1" />
 <AvatarFallback>U1</AvatarFallback>
 </Avatar>
 <Avatar>
 <AvatarImage src="/avatar2.jpg" alt="User 2" />
 <AvatarFallback>U2</AvatarFallback>
 </Avatar>
 <Avatar>
 <AvatarImage src="/avatar3.jpg" alt="User 3" />
 <AvatarFallback>U3</AvatarFallback>
 </Avatar>
 <AvatarGroupCount>+5</AvatarGroupCount>
</AvatarGroup>
```

### Label

```tsx
import { Label } from './components/Label/Label';

// Basic usage
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// With states
<Label data-disabled>Disabled Label</Label>
<Label data-invalid>Invalid Label</Label>
```

### Separator

```tsx
import { Separator } from './components/Separator/Separator';

// Horizontal (default)
<Separator />

// Vertical
<div style={{ display: 'flex', height: '3rem' }}>
 <span>Item 1</span>
 <Separator orientation="vertical" />
 <span>Item 2</span>
</div>

// Non-decorative (semantic)
<Separator decorative={false} />
```

### Skeleton

```tsx
import { Skeleton } from './components/Skeleton/Skeleton';

// Basic usage
<Skeleton style={{ width: '100px', height: '20px' }} />

// Card skeleton
<div>
 <Skeleton style={{ width: '100%', height: '200px', marginBottom: '1rem' }} />
 <Skeleton style={{ width: '80%', height: '20px', marginBottom: '0.5rem' }} />
 <Skeleton style={{ width: '60%', height: '20px' }} />
</div>
```

---

## Creating New Components

### Step 1: File Structure

Create a folder for your component in `src/components/`:

```
src/components/YourComponent/
 YourComponent.tsx
 YourComponent.module.scss
```

### Step 2: SCSS Module (YourComponent.module.scss)

Follow the shadcn/ui design system:

```scss
@import '../../styles/variables.scss';

.component {
 display: flex;
 align-items: center;
 border-radius: $radius-md;
 border: 1px solid $border;
 background-color: $background;
 color: $foreground;
 font-family: $font-sans;
 font-size: $font-size-sm;
 transition: all $transition-fast;
 
 &:focus-visible {
 outline: 2px solid $ring;
 outline-offset: 2px;
 }
 
 &:disabled {
 pointer-events: none;
 opacity: 0.5;
 }
}

// Variants
.primary {
 background-color: $primary;
 color: $primary-foreground;
 
 &:hover {
 background-color: hsl(222.2, 47.4%, 9%);
 }
}

.secondary {
 background-color: $secondary;
 color: $secondary-foreground;
 
 &:hover {
 background-color: hsl(210, 40%, 92%);
 }
}

// Sizes
.sm {
 padding: 0.375rem 0.75rem;
 font-size: $font-size-sm;
}

.md {
 padding: 0.5rem 1rem;
 font-size: $font-size-base;
}
```

### Step 3: TypeScript Component (YourComponent.tsx)

```tsx
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './YourComponent.module.scss';

export interface YourComponentProps extends HTMLAttributes<HTMLDivElement> {
 variant?: 'primary' | 'secondary';
 size?: 'sm' | 'md';
}

export const YourComponent = forwardRef<HTMLDivElement, YourComponentProps>(
 ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
 const variantClass = styles[variant];
 const sizeClass = styles[size];
 
 return (
 <div
 ref={ref}
 className={`${styles.component} ${variantClass} ${sizeClass} ${className || ''}`}
 {...props}
 >
 {children}
 </div>
 );
 }
);

YourComponent.displayName = 'YourComponent';
```

### Step 4: Use the Design System

#### Available Variables (variables.scss):

**Colors:**
- `$background` - main background
- `$foreground` - main text
- `$primary` - primary accent color
- `$primary-foreground` - text on primary
- `$secondary` - secondary color
- `$secondary-foreground` - text on secondary
- `$muted` - muted color
- `$muted-foreground` - muted text
- `$destructive` - error/delete color
- `$destructive-foreground` - text on destructive
- `$border` - border color
- `$input` - input border color
- `$ring` - focus ring color

**Border Radius:**
- `$radius-xs` - 0.25rem
- `$radius-sm` - 0.375rem
- `$radius-md` - 0.5rem
- `$radius-lg` - 0.75rem
- `$radius-xl` - 1rem

**Font Sizes:**
- `$font-size-xs` - 0.75rem
- `$font-size-sm` - 0.875rem
- `$font-size-base` - 1rem
- `$font-size-lg` - 1.125rem
- `$font-size-xl` - 1.25rem

**Transitions:**
- `$transition-fast` - 150ms
- `$transition-base` - 200ms
- `$transition-slow` - 300ms

**Spacing:**
- `$spacing-xs` - 0.25rem
- `$spacing-sm` - 0.5rem
- `$spacing-md` - 1rem
- `$spacing-lg` - 1.5rem
- `$spacing-xl` - 2rem

### Step 5: Design Patterns

#### Hover Effects
```scss
.button {
 transition: all $transition-fast;
 
 &:hover {
 background-color: darken($primary, 5%);
 // or use HSL:
 background-color: hsl(222.2, 47.4%, 9%);
 }
}
```

#### Focus States
```scss
.input {
 &:focus {
 outline: 2px solid $ring;
 outline-offset: 2px;
 }
}
```

#### Disabled States
```scss
.component {
 &:disabled,
 &[disabled] {
 pointer-events: none;
 opacity: 0.5;
 }
}
```

#### Invalid States
```scss
.input {
 &[aria-invalid='true'] {
 border-color: $destructive;
 }
}
```

### Step 6: TypeScript Types

Extend the appropriate HTML types:

```tsx
// For div
export interface Props extends HTMLAttributes<HTMLDivElement> {}

// For button
export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

// For input
export interface Props extends InputHTMLAttributes<HTMLInputElement> {}

// For textarea
export interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

// Type alias instead of empty interface
export type Props = HTMLAttributes<HTMLDivElement>;
```

### Step 7: forwardRef

Always use `forwardRef` for DOM element access:

```tsx
export const Component = forwardRef<HTMLDivElement, ComponentProps>(
 (props, ref) => {
 return <div ref={ref} {...props} />;
 }
);

Component.displayName = 'Component';
```

### Step 8: Testing

Verify your component:

1. **Visually** - add to App.tsx
2. **Lint** - `npm run lint`
3. **Build** - `npm run build`
4. **All variants** - test all props
5. **States** - hover, focus, disabled, active

---

## Advanced Component Examples

### Component with Context API (like Tabs)

```tsx
import { createContext, useContext, useState } from 'react';

interface ContextValue {
 value: string;
 onChange: (value: string) => void;
}

const Context = createContext<ContextValue | undefined>(undefined);

export const Parent = ({ children, defaultValue = '' }) => {
 const [value, setValue] = useState(defaultValue);
 
 return (
 <Context.Provider value={{ value, onChange: setValue }}>
 {children}
 </Context.Provider>
 );
};

export const Child = ({ value: childValue }) => {
 const context = useContext(Context);
 if (!context) throw new Error('Child must be used within Parent');
 
 const isActive = context.value === childValue;
 
 return (
 <button onClick={() => context.onChange(childValue)}>
 {/* ... */}
 </button>
 );
};
```

### Controlled / Uncontrolled Component

```tsx
export const Component = ({ value, defaultValue, onValueChange }) => {
 const [internalValue, setInternalValue] = useState(defaultValue);
 
 // Use controlled value if provided
 const currentValue = value !== undefined ? value : internalValue;
 
 const handleChange = (newValue) => {
 setInternalValue(newValue);
 onValueChange?.(newValue);
 };
 
 return (
 <input 
 value={currentValue} 
 onChange={(e) => handleChange(e.target.value)} 
 />
 );
};
```

---

## Best Practices

### DO:
- Use SCSS variables from `variables.scss`
- Follow patterns from existing components
- Add all necessary accessibility attributes
- Use `forwardRef` for all components
- Type all props
- Add `displayName` for better debugging

### DON'T:
- Don't use inline styles for main values
- Don't add external UI libraries
- Don't use Tailwind CSS
- Don't duplicate CSS variables
- Don't forget states (hover, focus, disabled)

---

## Resources

- [shadcn/ui documentation](https://ui.shadcn.com)
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui)
- Examples in `src/App.tsx`
- All components in `src/components/`
