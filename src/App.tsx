import './styles/globals.scss';
import styles from './App.module.scss';
import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider, useToast } from './components/Toast/Toast';
import { Button } from './components/Button/Button';
import { Input } from './components/Input/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card/Card';
import { Badge } from './components/Badge/Badge';
import { Checkbox } from './components/Checkbox/Checkbox';
import { Alert, AlertTitle, AlertDescription } from './components/Alert/Alert';
import { Textarea } from './components/Textarea/Textarea';
import { Slider } from './components/Slider/Slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/Table/Table';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './components/Breadcrumb/Breadcrumb';
import { Progress } from './components/Progress/Progress';
import { Kbd } from './components/Kbd/Kbd';
import { Switch } from './components/Switch/Switch';
import { Select } from './components/Select/Select';
import { Pagination, PaginationList, PaginationItem, PaginationLink, PaginationButton } from './components/Pagination/Pagination';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './components/Dialog/Dialog';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from './components/Modal/Modal';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from './components/AlertDialog/AlertDialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from './components/Drawer/Drawer';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from './components/DropdownMenu/DropdownMenu';
import { InputGroup, InputGroupAddon } from './components/InputGroup/InputGroup';
import { DatePicker } from './components/DatePicker/DatePicker';
import { Avatar, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from './components/Avatar/Avatar';
import { Label } from './components/Label/Label';
import { Separator } from './components/Separator/Separator';
import { Skeleton } from './components/Skeleton/Skeleton';
import { Spinner } from './components/Spinner/Spinner';
import { RadioGroup, RadioGroupItem } from './components/RadioGroup/RadioGroup';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/Tooltip/Tooltip';
import { SiteHeader } from './components/SiteHeader/SiteHeader';
import { SessyLanding } from './screens/SessyLanding/SessyLanding';
import { ShadcnHome } from './screens/ShadcnHome/ShadcnHome';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/Accordion/Accordion';
import { Calendar } from './components/Calendar/Calendar';
import { AspectRatio } from './components/AspectRatio/AspectRatio';
import { ScrollArea } from './components/ScrollArea/ScrollArea';
import { Popover, PopoverContent, PopoverTrigger } from './components/Popover/Popover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './components/HoverCard/HoverCard';
import { Toggle } from './components/Toggle/Toggle';
import { ToggleGroup, ToggleGroupItem } from './components/ToggleGroup/ToggleGroup';
import { ButtonGroup, ButtonGroupSeparator } from './components/ButtonGroup/ButtonGroup';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle, EmptyMedia } from './components/Empty/Empty';
import { Field, FieldDescription, FieldLabel } from './components/Field/Field';
import { Item, ItemContent, ItemDescription, ItemTitle } from './components/Item/Item';
import { Form, FormField } from './components/Form/Form';
import { Combobox } from './components/Combobox/Combobox';
import { InputOTP } from './components/InputOTP/InputOTP';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from './components/Menubar/Menubar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './components/ContextMenu/ContextMenu';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from './components/Sheet/Sheet';
import { Inbox } from 'lucide-react';

const ComponentsShowcase = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [calDate, setCalDate] = useState<Date | undefined>(() => new Date());
  const [comboValue, setComboValue] = useState('apple');
  const [otp, setOtp] = useState('');
  const { addToast } = useToast();

  const comboOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
  ];

  const components = [
    'Accordion', 'Alert', 'Alert Dialog', 'Aspect Ratio', 'Avatar', 'Badge', 'Breadcrumb', 'Button',
    'Button Group', 'Calendar', 'Card', 'Checkbox', 'Combobox', 'Context Menu', 'Date Picker', 'Dialog',
    'Drawer', 'Dropdown Menu', 'Empty', 'Field', 'Form', 'Hover Card', 'Input', 'Input Group',
    'Input OTP', 'Item', 'Kbd', 'Label', 'Menubar', 'Modal', 'Pagination', 'Popover', 'Progress',
    'RadioGroup', 'Scroll Area', 'Select', 'Separator', 'Sheet', 'Skeleton', 'Slider', 'Spinner',
    'Switch', 'Table', 'Tabs', 'Textarea', 'Toast', 'Toggle', 'Toggle Group', 'Tooltip',
  ];

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navigation}>
        <h3>Components ({components.length})</h3>
        <ul className={styles.navList}>
          {components.map(comp => (
            <li key={comp} className={styles.navItem}>
              <a href={`#${comp.toLowerCase().replace(/ /g, '-')}`}>{comp}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div>
              <h1>Каталог компонентов</h1>
              <p>50+ примитивов в стиле shadcn/ui — SCSS modules, высоты h-8 / h-9 / h-10</p>
            </div>
          </div>
        </header>

        <section id="alert" className={styles.section}>
          <h2>Alert</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <Alert>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <div>
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components and dependencies to your app using the cli.
                </AlertDescription>
              </div>
            </Alert>
            <Alert>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <div>
                <AlertTitle>Payment successful</AlertTitle>
                <AlertDescription>
                  Your payment has been processed successfully.
                </AlertDescription>
              </div>
            </Alert>
            <Alert variant="destructive">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" x2="12" y1="8" y2="12"/>
                <line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </div>
            </Alert>
          </div>
        </section>

        <section id="alert-dialog" className={styles.section}>
          <h2>Alert Dialog</h2>
          <Button onClick={() => setAlertDialogOpen(true)}>Open Alert Dialog</Button>
          <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <AlertDialogContent onClose={() => setAlertDialogOpen(false)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => setAlertDialogOpen(false)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        <section id="avatar" className={styles.section}>
          <h2>Avatar</h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Avatar size="sm">
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </div>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
              <AvatarBadge style={{ backgroundColor: '#16a34a' }} />
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+3</AvatarGroupCount>
            </AvatarGroup>
          </div>
        </section>

        <section id="badge" className={styles.section}>
          <h2>Badge</h2>
          <div className={styles.examples}>
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
        </section>

        <section id="breadcrumb" className={styles.section}>
          <h2>Breadcrumb</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Components</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>

        <section id="button" className={styles.section}>
          <h2>Button</h2>
          <div className={styles.subsection}>
            <h3>Variants</h3>
            <div className={styles.examples}>
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div className={styles.subsection}>
            <h3>Sizes</h3>
            <div className={styles.examples}>
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </section>

        <section id="card" className={styles.section}>
          <h2>Card</h2>
          <div className={`${styles.grid} ${styles.cols2}`}>
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Basic card example</CardDescription>
              </CardHeader>
              <CardContent>Card content here</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.formExample}>
                  <Input placeholder="Email" />
                  <Input type="password" placeholder="Password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button style={{ width: '100%' }}>Login</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section id="checkbox" className={styles.section}>
          <h2>Checkbox</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className={styles.fieldHorizontal}>
              <Checkbox id="c1" />
              <label htmlFor="c1">Accept terms</label>
            </div>
            <div className={styles.fieldHorizontal}>
              <Checkbox id="c2" defaultChecked />
              <label htmlFor="c2">Notifications</label>
            </div>
            <div className={styles.fieldHorizontal}>
              <Checkbox id="c3" disabled />
              <label htmlFor="c3">Disabled</label>
            </div>
          </div>
        </section>

        <section id="date-picker" className={styles.section}>
          <h2>Date Picker</h2>
          <div style={{ maxWidth: '300px' }}>
            <DatePicker label="Select date" />
          </div>
        </section>

        <section id="dialog" className={styles.section}>
          <h2>Dialog</h2>
          <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent onClose={() => setDialogOpen(false)}>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here
                </DialogDescription>
              </DialogHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input placeholder="Name" />
                <Input placeholder="Email" />
              </div>
              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <section id="modal" className={styles.section}>
          <h2>Modal</h2>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem', maxWidth: '40rem' }}>
            Same implementation as Dialog, exported as Modal* for documentation and codebases that prefer the term «modal window».
          </p>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal open={modalOpen} onOpenChange={setModalOpen}>
            <ModalContent onClose={() => setModalOpen(false)}>
              <ModalHeader>
                <ModalTitle>Modal window</ModalTitle>
                <ModalDescription>
                  Overlay, focus trap via escape/close, body scroll lock — identical to Dialog.
                </ModalDescription>
              </ModalHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input placeholder="Example field" />
              </div>
              <ModalFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Done</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </section>

        <section id="drawer" className={styles.section}>
          <h2>Drawer</h2>
          <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} side="right">
            <DrawerContent onClose={() => setDrawerOpen(false)}>
              <DrawerHeader>
                <DrawerTitle>Settings</DrawerTitle>
                <DrawerDescription>Manage your settings</DrawerDescription>
              </DrawerHeader>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem' }}>Drawer content here</p>
              </div>
              <DrawerFooter>
                <Button onClick={() => setDrawerOpen(false)}>Close</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </section>

        <section id="dropdown-menu" className={styles.section}>
          <h2>Dropdown Menu</h2>
          <DropdownMenu>
            <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        <section id="input" className={styles.section}>
          <h2>Input</h2>
          <div className={`${styles.grid} ${styles.cols2}`}>
            <Input placeholder="Basic input" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Input disabled placeholder="Disabled" />
          </div>
        </section>

        <section id="input-group" className={styles.section}>
          <h2>Input Group</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InputGroup>
              <InputGroupAddon>Web ·</InputGroupAddon>
              <Input placeholder="example.com" />
            </InputGroup>
            <InputGroup>
              <Input placeholder="Username" />
              <InputGroupAddon>@mail.com</InputGroupAddon>
            </InputGroup>
          </div>
        </section>

        <section id="kbd" className={styles.section}>
          <h2>Kbd</h2>
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to copy
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Or <Kbd>⌘</Kbd> + <Kbd>V</Kbd> to paste
            </p>
          </div>
        </section>

        <section id="label" className={styles.section}>
          <h2>Label</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Label htmlFor="email-label">Email address</Label>
              <Input id="email-label" type="email" placeholder="email@example.com" />
            </div>
          </div>
        </section>

        <section id="pagination" className={styles.section}>
          <h2>Pagination</h2>
          <Pagination>
            <PaginationList>
              <PaginationItem>
                <PaginationButton direction="previous" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationButton direction="next" />
              </PaginationItem>
            </PaginationList>
          </Pagination>
        </section>

        <section id="progress" className={styles.section}>
          <h2>Progress</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Progress value={33} />
            <Progress value={66} />
            <Progress value={100} />
          </div>
        </section>

        <section id="select" className={styles.section}>
          <h2>Select</h2>
          <div className={`${styles.grid} ${styles.cols2}`}>
            <Select>
              <option value="">Select option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </Select>
            <Select disabled>
              <option>Disabled</option>
            </Select>
          </div>
        </section>

        <section id="separator" className={styles.section}>
          <h2>Separator</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ maxWidth: '300px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>shadcn/ui</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Design System Components</div>
              <Separator style={{ margin: '1rem 0' }} />
              <div style={{ fontSize: '14px' }}>Beautiful, accessible components for React.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '20px' }}>
              <span>Home</span>
              <Separator orientation="vertical" />
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Components</span>
            </div>
          </div>
        </section>

        <section id="skeleton" className={styles.section}>
          <h2>Skeleton</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
            <Skeleton style={{ height: '100px', width: '100%' }} />
            <Skeleton style={{ height: '20px', width: '80%' }} />
            <Skeleton style={{ height: '20px', width: '60%' }} />
          </div>
        </section>

        <section id="slider" className={styles.section}>
          <h2>Slider</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Slider defaultValue={50} />
            <Slider defaultValue={75} />
            <Slider defaultValue={25} disabled />
          </div>
        </section>

        <section id="switch" className={styles.section}>
          <h2>Switch</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className={styles.fieldHorizontal}>
              <Switch id="s1" />
              <label htmlFor="s1">Enable feature</label>
            </div>
            <div className={styles.fieldHorizontal}>
              <Switch id="s2" defaultChecked />
              <label htmlFor="s2">Enabled</label>
            </div>
            <div className={styles.fieldHorizontal}>
              <Switch id="s3" disabled />
              <label htmlFor="s3">Disabled</label>
            </div>
          </div>
        </section>

        <section id="table" className={styles.section}>
          <h2>Table</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell><Badge>Active</Badge></TableCell>
                <TableCell>User</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bob Johnson</TableCell>
                <TableCell><Badge variant="outline">Inactive</Badge></TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        <section id="tabs" className={styles.section}>
          <h2>Tabs</h2>
          <Tabs defaultValue="account" style={{ maxWidth: '500px' }}>
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Account info</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input placeholder="Name" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change password</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input type="password" placeholder="New password" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={styles.fieldHorizontal}>
                    <Checkbox id="notify" />
                    <label htmlFor="notify">Notifications</label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section id="textarea" className={styles.section}>
          <h2>Textarea</h2>
          <div className={`${styles.grid} ${styles.cols2}`}>
            <Textarea placeholder="Basic textarea" />
            <Textarea placeholder="4 rows" rows={4} />
            <Textarea placeholder="Disabled" disabled />
          </div>
        </section>

        <section id="toast" className={styles.section}>
          <h2>Toast</h2>
          <div className={styles.examples}>
            <Button onClick={() => addToast({ title: 'Success', description: 'Operation completed' })}>
              Show Toast (Bottom Right)
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => addToast({ 
                title: 'Error', 
                description: 'Something went wrong', 
                variant: 'destructive' 
              })}
            >
              Show Error Toast
            </Button>
            <Button 
              variant="secondary"
              onClick={() => addToast({ 
                title: 'Information', 
                description: 'This toast appears at the top center', 
                position: 'top-center'
              })}
            >
              Show Toast (Top Center)
            </Button>
          </div>
        </section>

        <section id="radiogroup" className={styles.section}>
          <h2>RadioGroup</h2>
          <RadioGroup defaultValue="comfortable">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
        </section>

        <section id="spinner" className={styles.section}>
          <h2>Spinner</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
            <Button disabled style={{ gap: '0.5rem' }}>
              <Spinner size="sm" />
              Loading...
            </Button>
          </div>
        </section>

        <section id="accordion" className={styles.section}>
          <h2>Accordion</h2>
          <div style={{ maxWidth: '32rem' }}>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It uses semantic buttons and region roles.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>Yes. Matches shadcn card and border tokens.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section id="aspect-ratio" className={styles.section}>
          <h2>Aspect Ratio</h2>
          <div style={{ maxWidth: '20rem' }}>
            <AspectRatio ratio={16 / 9}>
              <div
                role="img"
                aria-label="Демо-плейсхолдер"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--accent)) 100%)',
                }}
              />
            </AspectRatio>
          </div>
        </section>

        <section id="button-group" className={styles.section}>
          <h2>Button Group</h2>
          <ButtonGroup>
            <Button variant="outline" size="sm">Left</Button>
            <Button variant="outline" size="sm">Middle</Button>
            <ButtonGroupSeparator />
            <Button variant="outline" size="sm">Right</Button>
          </ButtonGroup>
        </section>

        <section id="calendar" className={styles.section}>
          <h2>Calendar</h2>
          <Calendar selected={calDate} onSelect={d => setCalDate(d)} />
        </section>

        <section id="combobox" className={styles.section}>
          <h2>Combobox</h2>
          <div style={{ maxWidth: '16rem' }}>
            <Combobox options={comboOptions} value={comboValue} onValueChange={setComboValue} placeholder="Pick a fruit…" />
          </div>
        </section>

        <section id="context-menu" className={styles.section}>
          <h2>Context Menu</h2>
          <ContextMenu>
            <ContextMenuTrigger style={{ padding: '1.5rem', border: '1px dashed var(--border, #ccc)', borderRadius: '8px', display: 'inline-block' }}>
              Right-click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Back</ContextMenuItem>
              <ContextMenuItem>Forward</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Reload</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </section>

        <section id="empty" className={styles.section}>
          <h2>Empty</h2>
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <Inbox aria-hidden />
              </EmptyMedia>
              <EmptyTitle>No messages</EmptyTitle>
              <EmptyDescription>You are all caught up.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">New message</Button>
            </EmptyContent>
          </Empty>
        </section>

        <section id="field" className={styles.section}>
          <h2>Field</h2>
          <Field>
            <FieldLabel htmlFor="field-demo">Username</FieldLabel>
            <Input id="field-demo" placeholder="shadcn" />
            <FieldDescription>Public display name.</FieldDescription>
          </Field>
        </section>

        <section id="form" className={styles.section}>
          <h2>Form</h2>
          <Form onSubmit={e => e.preventDefault()} style={{ maxWidth: '20rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormField>
              <Label htmlFor="form-email">Email</Label>
              <Input id="form-email" type="email" placeholder="you@example.com" />
            </FormField>
            <Button type="submit" size="sm">Submit</Button>
          </Form>
        </section>

        <section id="hover-card" className={styles.section}>
          <h2>Hover Card</h2>
          <HoverCard>
            <HoverCardTrigger>
              <Button variant="link" type="button">@shadcn</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>shadcn</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground, #666)' }}>Design system primitives.</p>
            </HoverCardContent>
          </HoverCard>
        </section>

        <section id="input-otp" className={styles.section}>
          <h2>Input OTP</h2>
          <InputOTP length={6} value={otp} onChange={setOtp} />
        </section>

        <section id="item" className={styles.section}>
          <h2>Item</h2>
          <Item style={{ maxWidth: '24rem' }}>
            <ItemContent>
              <ItemTitle>Team invite</ItemTitle>
              <ItemDescription>You have been invited to join.</ItemDescription>
            </ItemContent>
          </Item>
        </section>

        <section id="menubar" className={styles.section}>
          <h2>Menubar</h2>
          <Menubar>
            <MenubarMenu menuId="file">
              <MenubarTrigger menuId="file">File</MenubarTrigger>
              <MenubarContent menuId="file">
                <MenubarItem>New Tab</MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu menuId="edit">
              <MenubarTrigger menuId="edit">Edit</MenubarTrigger>
              <MenubarContent menuId="edit">
                <MenubarItem>Undo</MenubarItem>
                <MenubarItem>Redo</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </section>

        <section id="popover" className={styles.section}>
          <h2>Popover</h2>
          <Popover>
            <PopoverTrigger>Open popover</PopoverTrigger>
            <PopoverContent>The popover is absolutely positioned below the trigger.</PopoverContent>
          </Popover>
        </section>

        <section id="scroll-area" className={styles.section}>
          <h2>Scroll Area</h2>
          <ScrollArea style={{ height: '8rem', maxWidth: '20rem', border: '1px solid var(--border, #eee)', borderRadius: '8px' }}>
            <div style={{ padding: '1rem' }}>
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Line {i + 1}</p>
              ))}
            </div>
          </ScrollArea>
        </section>

        <section id="sheet" className={styles.section}>
          <h2>Sheet</h2>
          <Button onClick={() => setSheetOpen(true)}>Open Sheet</Button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen} side="left">
            <SheetContent onClose={() => setSheetOpen(false)} side="left">
              <SheetHeader>
                <SheetTitle>Sheet panel</SheetTitle>
                <SheetDescription>Same implementation as Drawer, shadcn-style API.</SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <Button size="sm" onClick={() => setSheetOpen(false)}>Close</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </section>

        <section id="toggle" className={styles.section}>
          <h2>Toggle</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Toggle aria-label="Bold">B</Toggle>
            <Toggle variant="outline" aria-label="Italic">I</Toggle>
          </div>
        </section>

        <section id="toggle-group" className={styles.section}>
          <h2>Toggle Group</h2>
          <ToggleGroup type="single" defaultValue="left">
            <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Right">R</ToggleGroupItem>
          </ToggleGroup>
        </section>

        <section id="tooltip" className={styles.section}>
          <h2>Tooltip</h2>
          <TooltipProvider>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline">Top</Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Tooltip on top</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline">Right</Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tooltip on right</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline">Bottom</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tooltip on bottom</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </section>

        <a href="#" className={styles.backToTop}>↑ Back to Top</a>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SiteHeader />
                <ShadcnHome />
              </>
            }
          />
          <Route
            path="/components"
            element={
              <>
                <SiteHeader />
                <ComponentsShowcase />
              </>
            }
          />
          <Route
            path="/sessy"
            element={
              <>
                <SiteHeader />
                <SessyLanding />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
