# Component guide

Import from the component folder (copy-friendly). Optional barrel: `src/components/index.ts`.

```tsx
import { cn } from './lib/cn';
import { Button } from './components/Button/Button';
import { Input } from './components/Input/Input';
import { Label } from './components/Label/Label';
```

## Button

```tsx
<Button>Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button href="https://example.com">Docs</Button>
```

## Form

```tsx
<Form>
  <FormField>
    <FormLabel htmlFor="email">Email</FormLabel>
    <Input id="email" type="email" />
    <FormDescription>Work email only.</FormDescription>
    <FormMessage />
  </FormField>
</Form>
```

## Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit</DialogTitle>
      <DialogDescription>Update the record.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Copies `Modal/modalLayer.tsx` with the Dialog folder.

## Toast

Wrap the tree with `ToastProvider`, then `useToast().addToast({ title, description })`.

## Tooltip / Popover

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger><Button>Hint</Button></TooltipTrigger>
    <TooltipContent>More detail</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Floating surfaces need `Floating/` in the same `components` tree.

## Theme

```tsx
import './styles/theme-init';
import './styles/globals.scss';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
```

`ThemeSwitcher` does not need `LocaleProvider`. Pass `labels` for i18n.

Task → component: [COMPONENTS_AI_REFERENCE.md](./COMPONENTS_AI_REFERENCE.md).
