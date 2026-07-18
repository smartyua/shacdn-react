# Component Guide

Руководство по API примитивов.

**Официальный референс:** [https://ui.shadcn.com](https://ui.shadcn.com) · [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md) · [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md)

**Полный каталог и матрица «задача → контрол»:** **[COMPONENTS_AI_REFERENCE.md](./COMPONENTS_AI_REFERENCE.md)** (61 registry UI items + local extras). Перенос дизайн-системы: **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** · экран-референс `src/screens/SessyLanding/`.

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

// As anchor (same styles; renders <a>)
<Button href="https://example.com" target="_blank" rel="noopener noreferrer">Open site</Button>
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

### Attachment

```tsx
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from './components/Attachment/Attachment';

// Image group (horizontal scroll)
<AttachmentGroup>
  <Attachment orientation="vertical" size="sm">
    <AttachmentMedia variant="image">
      <img src="/preview.jpg" alt="" />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>photo.jpg</AttachmentTitle>
      <AttachmentDescription>2.4 MB</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
</AttachmentGroup>

// Uploading state
<Attachment state="uploading">
  <AttachmentMedia><Spinner size="sm" /></AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>report.pdf</AttachmentTitle>
    <AttachmentDescription>Uploading… 64%</AttachmentDescription>
  </AttachmentContent>
</Attachment>

// Done with actions + open trigger
<Attachment state="done">
  <AttachmentMedia variant="icon"><FileIcon /></AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>invoice.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 248 KB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Download"><DownloadIcon /></AttachmentAction>
    <AttachmentAction aria-label="Remove"><XIcon /></AttachmentAction>
  </AttachmentActions>
  <AttachmentTrigger aria-label="Open invoice.pdf" />
</Attachment>
```

**Props (root `Attachment`):** `state?` (`idle` | `uploading` | `processing` | `error` | `done`), `size?` (`default` | `sm` | `xs`), `orientation?` (`horizontal` | `vertical`).

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

### Bubble

```tsx
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from './components/Bubble/Bubble';

// Variants
<BubbleGroup>
  <Bubble variant="default">
    <BubbleContent>Outgoing message</BubbleContent>
  </Bubble>
  <Bubble variant="muted">
    <BubbleContent>Incoming message</BubbleContent>
  </Bubble>
</BubbleGroup>

// Alignment + reactions
<Bubble variant="muted" align="start">
  <BubbleContent>Great work on the scroll behavior!</BubbleContent>
  <BubbleReactions side="bottom" align="start">
    <ThumbsUpIcon /><span>2</span>
  </BubbleReactions>
</Bubble>
```

**Props (`Bubble`):** `variant?` (`default` | `secondary` | `muted` | `tinted` | `outline` | `ghost` | `destructive`), `align?` (`start` | `end`). **`BubbleReactions`:** `side?` (`top` | `bottom`), `align?` (`start` | `end`).

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

### Marker

```tsx
import { Marker, MarkerContent, MarkerIcon } from './components/Marker/Marker';

// Status chip
<Marker>
  <MarkerIcon><CheckIcon /></MarkerIcon>
  <MarkerContent>Delivered · 9:41 AM</MarkerContent>
</Marker>

// Date separator (common in chat threads)
<Marker variant="separator">
  <MarkerContent>Today</MarkerContent>
</Marker>

// Unread divider
<Marker variant="border">
  <MarkerContent>3 unread messages</MarkerContent>
</Marker>
```

**Props (`Marker`):** `variant?` (`default` | `separator` | `border`).

### Message

```tsx
import { Avatar, AvatarFallback } from './components/Avatar/Avatar';
import { Bubble, BubbleContent } from './components/Bubble/Bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from './components/Message/Message';

<MessageGroup>
  <Message align="start">
    <MessageAvatar>
      <Avatar size="sm"><AvatarFallback>AK</AvatarFallback></Avatar>
    </MessageAvatar>
    <MessageContent>
      <MessageHeader>Alex Kim · 9:12 AM</MessageHeader>
      <Bubble variant="muted">
        <BubbleContent>Can you review the chat primitives?</BubbleContent>
      </Bubble>
    </MessageContent>
  </Message>
  <Message align="end">
    <MessageAvatar>
      <Avatar size="sm"><AvatarFallback>YO</AvatarFallback></Avatar>
    </MessageAvatar>
    <MessageContent>
      <Bubble variant="default" align="end">
        <BubbleContent>Sure — wiring up the catalog now.</BubbleContent>
      </Bubble>
      <MessageFooter>Read · 9:14 AM</MessageFooter>
    </MessageContent>
  </Message>
</MessageGroup>
```

**Props (`Message`):** `align?` (`start` | `end`). Compose with **`Avatar`** + **`Bubble`** inside **`MessageContent`**.

### MessageScroller

```tsx
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from './components/MessageScroller/MessageScroller';
import { Message, MessageContent } from './components/Message/Message';
import { Bubble, BubbleContent } from './components/Bubble/Bubble';
import { Marker, MarkerContent } from './components/Marker/Marker';

<MessageScrollerProvider autoScroll initialScroll="end">
  <MessageScroller>
    <MessageScrollerViewport aria-label="Conversation">
      <MessageScrollerContent>
        <MessageScrollerItem messageId="today">
          <Marker variant="separator"><MarkerContent>Today</MarkerContent></Marker>
        </MessageScrollerItem>
        <MessageScrollerItem messageId="msg-1" scrollAnchor>
          <Message align="end">
            <MessageContent>
              <Bubble variant="default"><BubbleContent>Hello!</BubbleContent></Bubble>
            </MessageContent>
          </Message>
        </MessageScrollerItem>
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton direction="start" />
    <MessageScrollerButton direction="end" />
  </MessageScroller>
</MessageScrollerProvider>
```

**Provider props:** `autoScroll?`, `initialScroll?` (`start` | `end`). **`MessageScrollerItem`:** required `messageId`, optional `scrollAnchor` (peek previous row on append). Zero-dep implementation — no `@shadcn/react` npm package. Hooks: `useMessageScroller`, `useMessageScrollerScrollable`, `useMessageScrollerVisibility`.

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

### Table

```tsx
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from './components/Table/Table';

<Table>
 <TableHeader>
  <TableRow>
   <TableHead>Name</TableHead>
   <TableHead>Status</TableHead>
  </TableRow>
 </TableHeader>
 <TableBody>
  <TableRow>
   <TableCell>Ada</TableCell>
   <TableCell>Active</TableCell>
  </TableRow>
 </TableBody>
</Table>
```

### Breadcrumb

```tsx
import {
 Breadcrumb,
 BreadcrumbItem,
 BreadcrumbLink,
 BreadcrumbList,
 BreadcrumbPage,
 BreadcrumbSeparator,
} from './components/Breadcrumb/Breadcrumb';

<Breadcrumb>
 <BreadcrumbList>
  <BreadcrumbItem>
   <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>
   <BreadcrumbPage>Current</BreadcrumbPage>
  </BreadcrumbItem>
 </BreadcrumbList>
</Breadcrumb>
```

### Progress

```tsx
import { Progress } from './components/Progress/Progress';

<Progress value={33} />
<Progress value={66} max={100} />
```

### Kbd

```tsx
import { Kbd } from './components/Kbd/Kbd';

<span>
 Press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
</span>
```

### Switch

```tsx
import { Switch } from './components/Switch/Switch';

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
 <Switch id="notifications" />
 <label htmlFor="notifications">Notifications</label>
</div>
```

### Select

```tsx
import { Select } from './components/Select/Select';

<Select defaultValue="">
 <option value="" disabled>
  Select option
 </option>
 <option value="a">Option A</option>
 <option value="b">Option B</option>
</Select>
```

### Pagination

```tsx
import {
 Pagination,
 PaginationButton,
 PaginationItem,
 PaginationLink,
 PaginationList,
} from './components/Pagination/Pagination';

<Pagination>
 <PaginationList>
  <PaginationItem>
   <PaginationButton direction="previous" />
  </PaginationItem>
  <PaginationItem>
   <PaginationLink href="?page=1" isActive>
    1
   </PaginationLink>
  </PaginationItem>
  <PaginationItem>
   <PaginationButton direction="next" />
  </PaginationItem>
 </PaginationList>
</Pagination>
```

### Dialog

```tsx
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from './components/Dialog/Dialog';
import { Button } from './components/Button/Button';

const [open, setOpen] = useState(false);

<>
 <Button onClick={() => setOpen(true)}>Open</Button>
 <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent onClose={() => setOpen(false)}>
   <DialogHeader>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
   </DialogHeader>
   <DialogFooter>
    <Button onClick={() => setOpen(false)}>Done</Button>
   </DialogFooter>
  </DialogContent>
 </Dialog>
</>
```

### Modal (modal window)

Те же пропсы и поведение, что у `Dialog`; при переносе в другой проект держите рядом папки `Modal/` и `Dialog/` (Modal импортирует Dialog).

```tsx
import {
 Modal,
 ModalContent,
 ModalDescription,
 ModalFooter,
 ModalHeader,
 ModalTitle,
} from './components/Modal/Modal';
import { Button } from './components/Button/Button';

const [open, setOpen] = useState(false);

<>
 <Button onClick={() => setOpen(true)}>Open modal</Button>
 <Modal open={open} onOpenChange={setOpen}>
  <ModalContent onClose={() => setOpen(false)}>
   <ModalHeader>
    <ModalTitle>Modal title</ModalTitle>
    <ModalDescription>Optional description.</ModalDescription>
   </ModalHeader>
   <ModalFooter>
    <Button onClick={() => setOpen(false)}>Done</Button>
   </ModalFooter>
  </ModalContent>
 </Modal>
</>
```

### AlertDialog

```tsx
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from './components/AlertDialog/AlertDialog';

const [open, setOpen] = useState(false);

<AlertDialog open={open} onOpenChange={setOpen}>
 <AlertDialogContent onClose={() => setOpen(false)}>
  <AlertDialogHeader>
   <AlertDialogTitle>Confirm</AlertDialogTitle>
   <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
   <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
   <AlertDialogAction onClick={() => setOpen(false)}>Continue</AlertDialogAction>
  </AlertDialogFooter>
 </AlertDialogContent>
</AlertDialog>
```

### Drawer

```tsx
import {
 Drawer,
 DrawerContent,
 DrawerDescription,
 DrawerFooter,
 DrawerHeader,
 DrawerTitle,
} from './components/Drawer/Drawer';
import { Button } from './components/Button/Button';

const [open, setOpen] = useState(false);

<Drawer open={open} onOpenChange={setOpen} side="right">
 <DrawerContent onClose={() => setOpen(false)}>
  <DrawerHeader>
   <DrawerTitle>Panel</DrawerTitle>
   <DrawerDescription>Secondary content</DrawerDescription>
  </DrawerHeader>
  <DrawerFooter>
   <Button onClick={() => setOpen(false)}>Close</Button>
  </DrawerFooter>
 </DrawerContent>
</Drawer>
```

### DropdownMenu

```tsx
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from './components/DropdownMenu/DropdownMenu';

<DropdownMenu>
 <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
 <DropdownMenuContent>
  <DropdownMenuLabel>Account</DropdownMenuLabel>
  <DropdownMenuSeparator />
  <DropdownMenuItem>Profile</DropdownMenuItem>
  <DropdownMenuItem>Logout</DropdownMenuItem>
 </DropdownMenuContent>
</DropdownMenu>
```

### InputGroup

```tsx
import { Input } from './components/Input/Input';
import { InputGroup, InputGroupAddon } from './components/InputGroup/InputGroup';

<InputGroup>
 <InputGroupAddon>https://</InputGroupAddon>
 <Input placeholder="example.com" />
</InputGroup>
```

### DatePicker

```tsx
import { DatePicker } from './components/DatePicker/DatePicker';

<DatePicker label="Pick a date" />
<DatePicker defaultValue={new Date()} onValueChange={(d) => console.log(d)} />
```

### Toast

```tsx
import { ToastProvider, useToast } from './components/Toast/Toast';

// Root (e.g. App.tsx): wrap the app
function App() {
 return (
  <ToastProvider>
   <YourApp />
  </ToastProvider>
 );
}

// Any child
function SaveButton() {
 const { addToast } = useToast();
 return (
  <button
   type="button"
   onClick={() =>
    addToast({
     title: 'Saved',
     description: 'Changes applied',
     position: 'bottom-right',
    })
   }
  >
   Save
  </button>
 );
}
```

### ThemeSwitcher

```tsx
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';

<ThemeSwitcher />
```

### Accordion

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/Accordion/Accordion';

<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. Keyboard and ARIA are built in.</AccordionContent>
  </AccordionItem>
</Accordion>
```

### AspectRatio

```tsx
import { AspectRatio } from './components/AspectRatio/AspectRatio';

<AspectRatio ratio={16 / 9}>
  <img src="/hero.jpg" alt="Hero" />
</AspectRatio>
```

### ButtonGroup

```tsx
import { ButtonGroup, ButtonGroupSeparator } from './components/ButtonGroup/ButtonGroup';
import { Button } from './components/Button/Button';

<ButtonGroup>
  <Button variant="outline">Left</Button>
  <ButtonGroupSeparator />
  <Button variant="outline">Right</Button>
</ButtonGroup>
```

### Calendar

```tsx
import { Calendar } from './components/Calendar/Calendar';

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar selected={date} onSelect={setDate} />
```

### Chart

```tsx
import { BarChart, ChartContainer } from './components/Chart/Chart';

<ChartContainer>
  <BarChart data={[{ label: 'Jan', value: 120 }, { label: 'Feb', value: 90 }]} />
</ChartContainer>
```

### Collapsible

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/Collapsible/Collapsible';
import { Button } from './components/Button/Button';

<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="outline">Toggle</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>Hidden details</CollapsibleContent>
</Collapsible>
```

### Combobox

```tsx
import { Combobox } from './components/Combobox/Combobox';

<Combobox
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ]}
  placeholder="Search fruit…"
  onValueChange={(value) => console.log(value)}
/>
```

### ContextMenu

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './components/ContextMenu/ContextMenu';

<ContextMenu>
  <ContextMenuTrigger>
    <div>Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Direction

```tsx
import { DirectionProvider, useDirection } from './components/Direction/Direction';

<DirectionProvider dir="rtl">
  <App />
</DirectionProvider>
```

### Empty

```tsx
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from './components/Empty/Empty';

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">{/* icon */}</EmptyMedia>
    <EmptyTitle>No results</EmptyTitle>
    <EmptyDescription>Try a different filter.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Clear filters</Button>
  </EmptyContent>
</Empty>
```

### Field

```tsx
import { Field, FieldLabel, FieldDescription } from './components/Field/Field';
import { Input } from './components/Input/Input';

<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
  <FieldDescription>We never share your email.</FieldDescription>
</Field>
```

### Form

```tsx
import { Form, FormField } from './components/Form/Form';
import { Input } from './components/Input/Input';
import { Button } from './components/Button/Button';

<Form onSubmit={(e) => e.preventDefault()}>
  <FormField>
    <Input name="name" placeholder="Name" />
  </FormField>
  <Button type="submit">Save</Button>
</Form>
```

### HoverCard

```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent } from './components/HoverCard/HoverCard';
import { Button } from './components/Button/Button';

<HoverCard>
  <HoverCardTrigger>
    <Button variant="link">@shacdn</Button>
  </HoverCardTrigger>
  <HoverCardContent>Hover card details</HoverCardContent>
</HoverCard>
```

### InputOTP

```tsx
import { InputOTP } from './components/InputOTP/InputOTP';

const [otp, setOtp] = useState('');

<InputOTP value={otp} onChange={setOtp} length={6} />
```

### Item

```tsx
import { Item, ItemContent, ItemTitle, ItemDescription } from './components/Item/Item';

<Item>
  <ItemContent>
    <ItemTitle>Notifications</ItemTitle>
    <ItemDescription>Email digests and product updates.</ItemDescription>
  </ItemContent>
</Item>
```

### Locale

```tsx
import { LocaleProvider } from './components/Locale/Locale';

<LocaleProvider locale="en-US">
  <App />
</LocaleProvider>
```

### Menubar

```tsx
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from './components/Menubar/Menubar';

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New</MenubarItem>
      <MenubarItem>Open</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### NativeSelect

```tsx
import { NativeSelect } from './components/NativeSelect/NativeSelect';

{/* Alias of Select — native <select> styling */}
<NativeSelect>
  <option value="a">A</option>
  <option value="b">B</option>
</NativeSelect>
```

### Popover

```tsx
import { Popover, PopoverTrigger, PopoverContent } from './components/Popover/Popover';
import { Button } from './components/Button/Button';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent>Popover body</PopoverContent>
</Popover>
```

### Resizable

```tsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/Resizable/Resizable';

<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel defaultSize={50}>Left</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>Right</ResizablePanel>
</ResizablePanelGroup>
```

### ScrollArea

```tsx
import { ScrollArea } from './components/ScrollArea/ScrollArea';

<ScrollArea style={{ height: 200 }}>
  {Array.from({ length: 20 }, (_, i) => (
    <div key={i}>Row {i + 1}</div>
  ))}
</ScrollArea>
```

### Sheet

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './components/Sheet/Sheet';

{/* Alias of Drawer */}
<Sheet>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Sheet</SheetTitle>
      <SheetDescription>Side panel content</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

### Sidebar

```tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from './components/Sidebar/Sidebar';

<SidebarProvider>
  <Sidebar>
    <SidebarHeader>App</SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>Home</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    Main content
  </SidebarInset>
</SidebarProvider>
```

### SiteHeader

```tsx
import { SiteHeader } from './components/SiteHeader/SiteHeader';

{/* Demo chrome — theme switcher + nav links */}
<SiteHeader />
```

### Sonner

```tsx
import { SonnerToaster, useSonner } from './components/Sonner/Sonner';

{/* Alias of Toast provider + useToast */}
<SonnerToaster>
  <App />
</SonnerToaster>
```

### Toggle

```tsx
import { Toggle } from './components/Toggle/Toggle';

<Toggle aria-label="Bold">B</Toggle>
```

### ToggleGroup

```tsx
import { ToggleGroup, ToggleGroupItem } from './components/ToggleGroup/ToggleGroup';

<ToggleGroup type="single" defaultValue="center">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
```

### Typography

```tsx
import {
  TypographyH1,
  TypographyP,
  TypographyLead,
  TypographyMuted,
} from './components/Typography/Typography';

<TypographyH1>Heading</TypographyH1>
<TypographyLead>Lead paragraph</TypographyLead>
<TypographyP>Body copy</TypographyP>
<TypographyMuted>Muted helper text</TypographyMuted>
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

### Navigation Menu

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuContentLink,
  NavigationMenuLink,
} from './components/NavigationMenu/NavigationMenu';

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/">Home</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger menuId="products">Products</NavigationMenuTrigger>
      <NavigationMenuContent menuId="products">
        <NavigationMenuContentLink href="/widgets">Widgets</NavigationMenuContentLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Carousel

```tsx
import {
  Carousel,
  CarouselViewport,
  CarouselContent,
  CarouselItem,
  CarouselSlide,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from './components/Carousel/Carousel';

<Carousel>
  <CarouselViewport>
    <CarouselContent>
      <CarouselItem><CarouselSlide>1</CarouselSlide></CarouselItem>
      <CarouselItem><CarouselSlide>2</CarouselSlide></CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </CarouselViewport>
  <CarouselDots />
</Carousel>
```

### Command

```tsx
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './components/Command/Command';

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Command palette</Button>
<CommandDialog open={open} onOpenChange={setOpen}>
  <Command>
    <CommandInput />
    <CommandList>
      <CommandEmpty />
      <CommandGroup heading="Actions">
        <CommandItem value="settings" onSelect={() => setOpen(false)}>Settings</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</CommandDialog>
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

- [shadcn/ui — canonical design reference](https://ui.shadcn.com)
- [DESIGN_REFERENCE.md](./DESIGN_REFERENCE.md) · [SHADCN_PARITY_MATRIX.md](./SHADCN_PARITY_MATRIX.md)
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui)
- Examples in `src/App.tsx`
- All components in `src/components/`
