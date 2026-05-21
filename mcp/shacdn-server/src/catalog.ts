export interface ComponentMeta {
  name: string;
  folder: string;
  description: string;
  tasks: string[];
  exports: string[];
  aliasOf?: string;
  requiresProvider?: string;
  npmDeps?: string[];
}

/** Task → component mapping from docs/COMPONENTS_AI_REFERENCE.md */
export const COMPONENT_CATALOG: ComponentMeta[] = [
  { name: 'Accordion', folder: 'Accordion', description: 'Expandable FAQ / disclosure sections', tasks: ['faq', 'accordion', 'collapse', 'expand'], exports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'], npmDeps: [] },
  { name: 'Alert', folder: 'Alert', description: 'Inline status banner on page', tasks: ['alert', 'banner', 'message', 'warning', 'error'], exports: ['Alert', 'AlertTitle', 'AlertDescription'] },
  { name: 'AlertDialog', folder: 'AlertDialog', description: 'Blocking confirmation for destructive actions', tasks: ['confirm', 'delete', 'destructive', 'modal'], exports: ['AlertDialog', 'AlertDialogContent', 'AlertDialogHeader', 'AlertDialogFooter', 'AlertDialogTitle', 'AlertDialogDescription', 'AlertDialogAction', 'AlertDialogCancel'] },
  { name: 'AspectRatio', folder: 'AspectRatio', description: 'Fixed aspect ratio container for media', tasks: ['aspect', 'ratio', 'image', 'video'], exports: ['AspectRatio'] },
  { name: 'Avatar', folder: 'Avatar', description: 'User avatar with fallback initials', tasks: ['avatar', 'profile', 'user'], exports: ['Avatar', 'AvatarImage', 'AvatarFallback'] },
  { name: 'Badge', folder: 'Badge', description: 'Status tag or label chip', tasks: ['badge', 'tag', 'status', 'label'], exports: ['Badge'] },
  { name: 'Breadcrumb', folder: 'Breadcrumb', description: 'Page hierarchy navigation', tasks: ['breadcrumb', 'navigation', 'hierarchy'], exports: ['Breadcrumb', 'BreadcrumbList', 'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbPage', 'BreadcrumbSeparator'] },
  { name: 'Button', folder: 'Button', description: 'Action button or link CTA (supports href)', tasks: ['button', 'cta', 'link', 'submit'], exports: ['Button'] },
  { name: 'ButtonGroup', folder: 'ButtonGroup', description: 'Grouped buttons with shared border', tasks: ['button group', 'toolbar'], exports: ['ButtonGroup'] },
  { name: 'Calendar', folder: 'Calendar', description: 'Month grid date picker', tasks: ['calendar', 'date'], exports: ['Calendar'] },
  { name: 'Card', folder: 'Card', description: 'Content card with header/footer', tasks: ['card', 'panel', 'container'], exports: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'] },
  { name: 'Checkbox', folder: 'Checkbox', description: 'Boolean checkbox input', tasks: ['checkbox', 'check', 'form'], exports: ['Checkbox'] },
  { name: 'Carousel', folder: 'Carousel', description: 'Horizontal scroll-snap carousel (no Embla)', tasks: ['carousel', 'slider gallery', 'slides'], exports: ['Carousel', 'CarouselViewport', 'CarouselContent', 'CarouselItem', 'CarouselPrevious', 'CarouselNext', 'CarouselDots', 'CarouselSlide'] },
  { name: 'Chart', folder: 'Chart', description: 'SVG bar chart + container (zero-dep; Recharts in consumer apps)', tasks: ['chart', 'graph', 'analytics'], exports: ['ChartContainer', 'BarChart'] },
  { name: 'Collapsible', folder: 'Collapsible', description: 'Show/hide content region', tasks: ['collapsible', 'toggle content'], exports: ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent'] },
  { name: 'Combobox', folder: 'Combobox', description: 'Searchable select input', tasks: ['combobox', 'autocomplete', 'search select'], exports: ['Combobox'] },
  { name: 'Command', folder: 'Command', description: 'Command palette with search filter', tasks: ['command', 'command palette', 'cmdk', 'search menu'], exports: ['Command', 'CommandDialog', 'CommandInput', 'CommandList', 'CommandEmpty', 'CommandGroup', 'CommandItem', 'CommandSeparator'] },
  { name: 'ContextMenu', folder: 'ContextMenu', description: 'Right-click context menu', tasks: ['context menu', 'right click'], exports: ['ContextMenu', 'ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuItem', 'ContextMenuSeparator'] },
  { name: 'DatePicker', folder: 'DatePicker', description: 'Date input with calendar popup', tasks: ['date picker', 'date input', 'calendar'], exports: ['DatePicker'] },
  { name: 'Direction', folder: 'Direction', description: 'RTL/LTR direction provider', tasks: ['rtl', 'direction', 'i18n'], exports: ['DirectionProvider', 'useDirection'] },
  { name: 'Dialog', folder: 'Dialog', description: 'Modal dialog overlay', tasks: ['dialog', 'modal', 'overlay', 'popup'], exports: ['Dialog', 'DialogContent', 'DialogHeader', 'DialogFooter', 'DialogTitle', 'DialogDescription'] },
  { name: 'Drawer', folder: 'Drawer', description: 'Side panel / sheet overlay', tasks: ['drawer', 'sidebar', 'sheet', 'panel'], exports: ['Drawer', 'DrawerContent', 'DrawerHeader', 'DrawerTitle', 'DrawerDescription'] },
  { name: 'DropdownMenu', folder: 'DropdownMenu', description: 'Dropdown action menu', tasks: ['dropdown', 'menu', 'actions'], exports: ['DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuSeparator'] },
  { name: 'Empty', folder: 'Empty', description: 'Empty state placeholder', tasks: ['empty', 'no data', 'placeholder'], exports: ['Empty'] },
  { name: 'Field', folder: 'Field', description: 'Form field wrapper with label/description', tasks: ['field', 'form field'], exports: ['Field', 'FieldLabel', 'FieldDescription'] },
  { name: 'Form', folder: 'Form', description: 'Form composition helpers', tasks: ['form'], exports: ['Form', 'FormField', 'FormItem', 'FormLabel', 'FormControl', 'FormDescription', 'FormMessage'] },
  { name: 'HoverCard', folder: 'HoverCard', description: 'Rich preview on hover', tasks: ['hover card', 'preview'], exports: ['HoverCard', 'HoverCardTrigger', 'HoverCardContent'] },
  { name: 'Input', folder: 'Input', description: 'Single-line text input', tasks: ['input', 'text field', 'email', 'password', 'search'], exports: ['Input'] },
  { name: 'InputGroup', folder: 'InputGroup', description: 'Input with prefix/suffix addon', tasks: ['input group', 'prefix', 'suffix'], exports: ['InputGroup', 'InputGroupAddon'] },
  { name: 'InputOTP', folder: 'InputOTP', description: 'One-time password / PIN input', tasks: ['otp', 'pin', 'verification code'], exports: ['InputOTP', 'InputOTPGroup', 'InputOTPSlot'] },
  { name: 'Item', folder: 'Item', description: 'List item row pattern', tasks: ['list item', 'row'], exports: ['Item'] },
  { name: 'Kbd', folder: 'Kbd', description: 'Keyboard shortcut display', tasks: ['keyboard', 'shortcut', 'kbd'], exports: ['Kbd', 'KbdGroup'] },
  { name: 'Label', folder: 'Label', description: 'Form field label', tasks: ['label', 'form'], exports: ['Label'] },
  { name: 'Menubar', folder: 'Menubar', description: 'Desktop-style menu bar', tasks: ['menubar', 'menu bar'], exports: ['Menubar', 'MenubarMenu', 'MenubarTrigger', 'MenubarContent', 'MenubarItem'] },
  { name: 'NavigationMenu', folder: 'NavigationMenu', description: 'Site navigation with dropdown panels', tasks: ['navigation menu', 'navbar', 'mega menu'], exports: ['NavigationMenu', 'NavigationMenuList', 'NavigationMenuItem', 'NavigationMenuTrigger', 'NavigationMenuContent', 'NavigationMenuLink', 'NavigationMenuContentLink'] },
  { name: 'Modal', folder: 'Modal', description: 'Alias for Dialog API', tasks: ['modal'], exports: ['Modal', 'ModalContent', 'ModalHeader', 'ModalFooter', 'ModalTitle', 'ModalDescription'], aliasOf: 'Dialog' },
  { name: 'Pagination', folder: 'Pagination', description: 'Page navigation controls', tasks: ['pagination', 'pages'], exports: ['Pagination', 'PaginationContent', 'PaginationItem', 'PaginationLink', 'PaginationPrevious', 'PaginationNext', 'PaginationEllipsis'] },
  { name: 'Popover', folder: 'Popover', description: 'Floating content panel', tasks: ['popover', 'floating'], exports: ['Popover', 'PopoverTrigger', 'PopoverContent'] },
  { name: 'Progress', folder: 'Progress', description: 'Linear progress bar', tasks: ['progress', 'loading bar'], exports: ['Progress'] },
  { name: 'RadioGroup', folder: 'RadioGroup', description: 'Single choice from group', tasks: ['radio', 'single choice'], exports: ['RadioGroup', 'RadioGroupItem'] },
  { name: 'Resizable', folder: 'Resizable', description: 'Drag-to-resize panel groups (zero-dep)', tasks: ['resizable', 'split pane', 'panel resize'], exports: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'] },
  { name: 'ScrollArea', folder: 'ScrollArea', description: 'Custom styled scroll container', tasks: ['scroll', 'overflow'], exports: ['ScrollArea'] },
  { name: 'Select', folder: 'Select', description: 'Native select dropdown', tasks: ['select', 'dropdown native'], exports: ['Select'] },
  { name: 'NativeSelect', folder: 'NativeSelect', description: 'Registry alias for Select', tasks: ['native select', 'native-select'], exports: ['NativeSelect'], aliasOf: 'Select' },
  { name: 'Separator', folder: 'Separator', description: 'Visual divider line', tasks: ['separator', 'divider'], exports: ['Separator'] },
  { name: 'Sheet', folder: 'Sheet', description: 'Alias for Drawer API', tasks: ['sheet', 'side panel'], exports: ['Sheet', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription'], aliasOf: 'Drawer' },
  { name: 'Sidebar', folder: 'Sidebar', description: 'App sidebar layout with collapse (zero-dep)', tasks: ['sidebar', 'app shell', 'dashboard layout'], exports: ['SidebarProvider', 'Sidebar', 'SidebarHeader', 'SidebarContent', 'SidebarFooter', 'SidebarInset', 'SidebarTrigger', 'SidebarMenu', 'SidebarMenuItem', 'SidebarMenuButton'] },
  { name: 'Sonner', folder: 'Sonner', description: 'Registry alias for Toast', tasks: ['sonner', 'toast'], exports: ['SonnerToaster', 'useSonner', 'ToastItem', 'ToastTitle', 'ToastDescription'], aliasOf: 'Toast' },
  { name: 'SiteHeader', folder: 'SiteHeader', description: 'Demo site header with theme switcher', tasks: ['header', 'navbar', 'demo'], exports: ['SiteHeader'] },
  { name: 'Skeleton', folder: 'Skeleton', description: 'Loading placeholder shimmer', tasks: ['skeleton', 'loading placeholder'], exports: ['Skeleton'] },
  { name: 'Slider', folder: 'Slider', description: 'Range slider input', tasks: ['slider', 'range'], exports: ['Slider'] },
  { name: 'Spinner', folder: 'Spinner', description: 'Circular loading indicator', tasks: ['spinner', 'loading'], exports: ['Spinner'] },
  { name: 'Switch', folder: 'Switch', description: 'Toggle switch control', tasks: ['switch', 'toggle setting'], exports: ['Switch'] },
  { name: 'Table', folder: 'Table', description: 'Data table with semantic parts', tasks: ['table', 'data grid', 'list'], exports: ['Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell', 'TableFooter', 'TableCaption'] },
  { name: 'Tabs', folder: 'Tabs', description: 'Tabbed panel navigation', tasks: ['tabs', 'panels'], exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'] },
  { name: 'Textarea', folder: 'Textarea', description: 'Multi-line text input', tasks: ['textarea', 'multiline'], exports: ['Textarea'] },
  { name: 'Typography', folder: 'Typography', description: 'Prose typography primitives (h1–h4, p, lead, muted, blockquote, list)', tasks: ['typography', 'prose', 'heading'], exports: ['Typography', 'TypographyH1', 'TypographyH2', 'TypographyH3', 'TypographyH4', 'TypographyP', 'TypographyLead', 'TypographyLarge', 'TypographySmall', 'TypographyMuted', 'TypographyBlockquote', 'TypographyList'] },
  { name: 'ThemeSwitcher', folder: 'ThemeSwitcher', description: 'Light/dark + color scheme picker', tasks: ['theme', 'dark mode', 'color scheme'], exports: ['ThemeSwitcher'] },
  { name: 'Toast', folder: 'Toast', description: 'Transient corner notifications', tasks: ['toast', 'notification', 'snackbar'], exports: ['ToastProvider', 'useToast', 'Toast', 'ToastTitle', 'ToastDescription'], requiresProvider: 'ToastProvider' },
  { name: 'Toggle', folder: 'Toggle', description: 'Pressable toggle button', tasks: ['toggle', 'pressed state'], exports: ['Toggle'] },
  { name: 'ToggleGroup', folder: 'ToggleGroup', description: 'Group of toggle buttons', tasks: ['toggle group', 'segmented control'], exports: ['ToggleGroup', 'ToggleGroupItem'] },
  { name: 'Tooltip', folder: 'Tooltip', description: 'Hover/focus tooltip hint', tasks: ['tooltip', 'hint', 'help'], exports: ['TooltipProvider', 'Tooltip', 'TooltipTrigger', 'TooltipContent'], requiresProvider: 'TooltipProvider' },
];

/** Hard-coded internal shacdn component dependencies (from import analysis) */
export const INTERNAL_DEPS: Record<string, string[]> = {
  Accordion: ['Collapsible'],
  AlertDialog: ['Dialog'],
  Combobox: ['Input'],
  Command: ['Dialog'],
  DatePicker: ['Calendar'],
  Modal: ['Dialog'],
  Sheet: ['Drawer'],
  NativeSelect: ['Select'],
  Sonner: ['Toast'],
  SiteHeader: ['ThemeSwitcher'],
  ToggleGroup: ['Toggle'],
};

export const SCREEN_PATTERNS = [
  {
    id: 'sessy-landing',
    name: 'SessyLanding',
    description: 'Marketing landing page: hero, pricing table, feature cards, CTA',
    path: 'src/screens/SessyLanding',
    components: ['Button', 'Card', 'Table', 'Badge', 'Separator', 'ThemeSwitcher'],
  },
  {
    id: 'shadcn-home',
    name: 'ShadcnHome',
    description: 'Component library showcase home page',
    path: 'src/screens/ShadcnHome',
    components: ['Button', 'Card', 'Badge'],
  },
];

export const NPM_DEPENDENCIES = {
  required: ['react', 'react-dom', 'sass'],
  optional: ['lucide-react'],
  note: 'lucide-react is used in demos/screens; core components use inline SVG where needed',
};

export const getComponentMeta = (name: string): ComponentMeta | undefined => {
  const normalized = name.trim();
  return COMPONENT_CATALOG.find(
    (c) => c.name.toLowerCase() === normalized.toLowerCase() || c.folder.toLowerCase() === normalized.toLowerCase(),
  );
};

export const searchCatalog = (query: string): ComponentMeta[] => {
  const q = query.toLowerCase().trim();
  if (!q) return COMPONENT_CATALOG;

  return COMPONENT_CATALOG.filter((c) => {
    const haystack = [c.name, c.folder, c.description, ...c.tasks, ...c.exports].join(' ').toLowerCase();
    return haystack.includes(q);
  });
};
