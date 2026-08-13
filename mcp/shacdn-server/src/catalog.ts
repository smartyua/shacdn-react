export interface ComponentMeta {
  name: string;
  folder: string;
  description: string;
  tasks: string[];
  exports: string[];
  aliasOf?: string;
  requiresProvider?: string;
  npmDeps?: string[];
  /** Demo chrome — do not copy into consumer apps. */
  demoOnly?: boolean;
}

/** Task → component mapping from docs/COMPONENTS_AI_REFERENCE.md */
export const COMPONENT_CATALOG: ComponentMeta[] = [
  { name: 'Accordion', folder: 'Accordion', description: 'Expandable FAQ / disclosure sections', tasks: ['faq', 'accordion', 'collapse', 'expand'], exports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'], npmDeps: [] },
  { name: 'Alert', folder: 'Alert', description: 'Inline status banner on page', tasks: ['alert', 'banner', 'message', 'warning', 'error'], exports: ['Alert', 'AlertTitle', 'AlertDescription'] },
  { name: 'AlertDialog', folder: 'AlertDialog', description: 'Blocking confirmation for destructive actions', tasks: ['confirm', 'delete', 'destructive', 'modal'], exports: ['AlertDialog', 'AlertDialogContent', 'AlertDialogHeader', 'AlertDialogFooter', 'AlertDialogTitle', 'AlertDialogDescription', 'AlertDialogAction', 'AlertDialogCancel'] },
  { name: 'AspectRatio', folder: 'AspectRatio', description: 'Fixed aspect ratio container for media', tasks: ['aspect', 'ratio', 'image', 'video'], exports: ['AspectRatio'] },
  { name: 'Attachment', folder: 'Attachment', description: 'File/image attachment preview with upload states and actions', tasks: ['attachment', 'file upload', 'chat composer', 'media preview'], exports: ['AttachmentGroup', 'Attachment', 'AttachmentMedia', 'AttachmentContent', 'AttachmentTitle', 'AttachmentDescription', 'AttachmentActions', 'AttachmentAction', 'AttachmentTrigger'], npmDeps: [] },
  { name: 'Avatar', folder: 'Avatar', description: 'User avatar with fallback initials, badge and overlapping group', tasks: ['avatar', 'profile', 'user', 'avatar group'], exports: ['Avatar', 'AvatarImage', 'AvatarFallback', 'AvatarBadge', 'AvatarGroup', 'AvatarGroupCount'] },
  { name: 'Badge', folder: 'Badge', description: 'Status tag or label chip', tasks: ['badge', 'tag', 'status', 'label'], exports: ['Badge'] },
  { name: 'Banner', folder: 'Banner', description: 'Full-width page-level notice, optionally dismissible', tasks: ['banner', 'page notice', 'announcement'], exports: ['Banner', 'BannerTitle', 'BannerAction'] },
  { name: 'Bento', folder: 'Bento', description: 'Mixed-span CSS grid layout (bento box)', tasks: ['bento', 'bento grid', 'dashboard tiles'], exports: ['Bento', 'BentoItem'] },
  { name: 'Breadcrumb', folder: 'Breadcrumb', description: 'Page hierarchy navigation', tasks: ['breadcrumb', 'navigation', 'hierarchy'], exports: ['Breadcrumb', 'BreadcrumbList', 'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbPage', 'BreadcrumbSeparator'] },
  { name: 'Bubble', folder: 'Bubble', description: 'Chat message bubble with variants and reactions slot', tasks: ['bubble', 'chat message', 'conversation', 'reactions'], exports: ['BubbleGroup', 'Bubble', 'BubbleContent', 'BubbleReactions'], npmDeps: [] },
  { name: 'Button', folder: 'Button', description: 'Action button or link CTA (supports href)', tasks: ['button', 'cta', 'link', 'submit'], exports: ['Button'] },
  { name: 'ButtonGroup', folder: 'ButtonGroup', description: 'Grouped buttons with shared border', tasks: ['button group', 'segmented buttons'], exports: ['ButtonGroup'] },
  { name: 'Calendar', folder: 'Calendar', description: 'Month grid date picker', tasks: ['calendar', 'date'], exports: ['Calendar'] },
  { name: 'Callout', folder: 'Callout', description: 'In-content notice with accent border (info/warning/success/danger)', tasks: ['callout', 'inline alert', 'note', 'tip'], exports: ['Callout', 'CalloutTitle', 'CalloutDescription'] },
  { name: 'Card', folder: 'Card', description: 'Content card with header/footer', tasks: ['card', 'panel', 'container'], exports: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'] },
  { name: 'Checkbox', folder: 'Checkbox', description: 'Boolean checkbox input', tasks: ['checkbox', 'check', 'form'], exports: ['Checkbox'] },
  { name: 'Chip', folder: 'Chip', description: 'Interactive removable or selectable label', tasks: ['chip', 'tag', 'pill', 'removable tag'], exports: ['Chip'] },
  { name: 'Carousel', folder: 'Carousel', description: 'Horizontal scroll-snap carousel (no Embla)', tasks: ['carousel', 'slider gallery', 'slides'], exports: ['Carousel', 'CarouselViewport', 'CarouselContent', 'CarouselItem', 'CarouselPrevious', 'CarouselNext', 'CarouselDots', 'CarouselSlide'] },
  { name: 'Chart', folder: 'Chart', description: 'SVG bar chart + container (zero-dep; Recharts in consumer apps)', tasks: ['chart', 'graph', 'analytics'], exports: ['ChartContainer', 'BarChart'] },
  { name: 'Collapsible', folder: 'Collapsible', description: 'Show/hide content region', tasks: ['collapsible', 'toggle content'], exports: ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent'] },
  { name: 'ColorPicker', folder: 'ColorPicker', description: 'Swatch trigger with color and hex inputs', tasks: ['color picker', 'color well', 'swatch'], exports: ['ColorPicker'] },
  { name: 'ComboButton', folder: 'ComboButton', description: 'Primary action joined to a related-actions menu', tasks: ['combo button', 'split button', 'action menu'], exports: ['ComboButton', 'ComboButtonAction', 'ComboButtonMenu'] },
  {
    name: 'Combobox',
    folder: 'Combobox',
    description: 'Searchable select: compound Input/Content/List/Item (Appica-style) + legacy options API',
    tasks: ['combobox', 'autocomplete', 'search select', 'clearable'],
    exports: [
      'Combobox',
      'ComboboxInput',
      'ComboboxContent',
      'ComboboxList',
      'ComboboxItem',
      'ComboboxEmpty',
    ],
  },
  { name: 'Command', folder: 'Command', description: 'Command palette with search filter', tasks: ['command', 'command palette', 'cmdk', 'search menu'], exports: ['Command', 'CommandDialog', 'CommandInput', 'CommandList', 'CommandEmpty', 'CommandGroup', 'CommandItem', 'CommandSeparator'] },
  { name: 'ContextMenu', folder: 'ContextMenu', description: 'Right-click context menu', tasks: ['context menu', 'right click'], exports: ['ContextMenu', 'ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuItem', 'ContextMenuSeparator'] },
  { name: 'DatePicker', folder: 'DatePicker', description: 'Date input with calendar popup', tasks: ['date picker', 'date input', 'calendar'], exports: ['DatePicker'] },
  { name: 'Direction', folder: 'Direction', description: 'RTL/LTR direction provider', tasks: ['rtl', 'direction', 'i18n'], exports: ['DirectionProvider', 'useDirection'] },
  { name: 'Dialog', folder: 'Dialog', description: 'Modal dialog overlay', tasks: ['dialog', 'modal', 'overlay', 'popup'], exports: ['Dialog', 'DialogContent', 'DialogHeader', 'DialogFooter', 'DialogTitle', 'DialogDescription'] },
  { name: 'Drawer', folder: 'Drawer', description: 'Side panel / sheet overlay', tasks: ['drawer', 'sidebar', 'sheet', 'panel'], exports: ['Drawer', 'DrawerContent', 'DrawerHeader', 'DrawerTitle', 'DrawerDescription'] },
  { name: 'DropdownMenu', folder: 'DropdownMenu', description: 'Dropdown action menu', tasks: ['dropdown', 'menu', 'actions'], exports: ['DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuSeparator'] },
  { name: 'Empty', folder: 'Empty', description: 'Empty state placeholder', tasks: ['empty', 'no data', 'placeholder'], exports: ['Empty'] },
  { name: 'Field', folder: 'Field', description: 'Form field wrapper with label/description', tasks: ['field', 'form field'], exports: ['Field', 'FieldLabel', 'FieldDescription'] },
  { name: 'Floating', folder: 'Floating', description: 'Positioning primitives shared by every popup surface (portal, collision-aware placement, dismiss layer)', tasks: ['floating', 'positioning', 'portal', 'popup internals'], exports: ['FloatingPortal', 'useFloatingPosition', 'useDismissLayer', 'useInitialMenuFocus', 'computeFloatingPosition', 'composeRefs'] },
  { name: 'Form', folder: 'Form', description: 'Form composition helpers', tasks: ['form'], exports: ['Form', 'FormField', 'FormItem', 'FormLabel', 'FormDescription', 'FormMessage'] },
  { name: 'HoverCard', folder: 'HoverCard', description: 'Rich preview on hover', tasks: ['hover card', 'preview'], exports: ['HoverCard', 'HoverCardTrigger', 'HoverCardContent'] },
  { name: 'Input', folder: 'Input', description: 'Single-line text input', tasks: ['input', 'text field', 'email', 'password', 'search'], exports: ['Input'] },
  { name: 'InputGroup', folder: 'InputGroup', description: 'Input with prefix/suffix addon', tasks: ['input group', 'prefix', 'suffix'], exports: ['InputGroup', 'InputGroupAddon'] },
  { name: 'InputOTP', folder: 'InputOTP', description: 'One-time password / PIN input', tasks: ['otp', 'pin', 'verification code'], exports: ['InputOTP'] },
  { name: 'Item', folder: 'Item', description: 'List item row pattern', tasks: ['list item', 'row'], exports: ['Item'] },
  { name: 'Kbd', folder: 'Kbd', description: 'Keyboard shortcut display', tasks: ['keyboard', 'shortcut', 'kbd'], exports: ['Kbd', 'KbdGroup'] },
  { name: 'Label', folder: 'Label', description: 'Form field label', tasks: ['label', 'form'], exports: ['Label'] },
  { name: 'Lightbox', folder: 'Lightbox', description: 'Click-to-enlarge media overlay with scrim', tasks: ['lightbox', 'image overlay', 'gallery enlarge'], exports: ['Lightbox', 'LightboxTrigger', 'LightboxContent', 'LightboxClose', 'LightboxOverlay'] },
  { name: 'Locale', folder: 'Locale', description: 'Locale provider, message catalog and language switcher for demo screens', tasks: ['locale', 'i18n', 'language switcher', 'translations'], exports: ['LocaleProvider', 'useLocale', 'LocaleSwitcher'], requiresProvider: 'LocaleProvider', demoOnly: true },
  { name: 'Marquee', folder: 'Marquee', description: 'Endless horizontal scrolling content strip', tasks: ['marquee', 'ticker', 'infinite scroll text'], exports: ['Marquee', 'MarqueeContent'] },
  { name: 'Masonry', folder: 'Masonry', description: 'Column-packed variable-height card layout', tasks: ['masonry', 'pinterest grid', 'column layout'], exports: ['Masonry', 'MasonryItem'] },
  { name: 'Menubar', folder: 'Menubar', description: 'Desktop-style menu bar', tasks: ['menubar', 'menu bar'], exports: ['Menubar', 'MenubarMenu', 'MenubarTrigger', 'MenubarContent', 'MenubarItem'] },
  { name: 'MentionTextarea', folder: 'MentionTextarea', description: 'Composer textarea with @mentions, /commands autosuggest, and shortened link chips', tasks: ['mention', 'slash command', 'composer', 'autosuggest', 'link chip'], exports: ['MentionTextarea'] },
  { name: 'Marker', folder: 'Marker', description: 'Chat status chip or date/unread separator', tasks: ['marker', 'chat separator', 'date divider', 'delivery status'], exports: ['Marker', 'MarkerIcon', 'MarkerContent'], npmDeps: [] },
  { name: 'Message', folder: 'Message', description: 'Chat message row: avatar slot + content + header/footer', tasks: ['message', 'chat row', 'conversation thread'], exports: ['MessageGroup', 'Message', 'MessageAvatar', 'MessageContent', 'MessageHeader', 'MessageFooter'], npmDeps: [] },
  { name: 'MessageScroller', folder: 'MessageScroller', description: 'Scrollable message list with auto-scroll and jump buttons (zero-dep; no @shadcn/react)', tasks: ['message scroller', 'chat scroll', 'auto scroll', 'conversation list'], exports: ['MessageScrollerProvider', 'MessageScroller', 'MessageScrollerViewport', 'MessageScrollerContent', 'MessageScrollerItem', 'MessageScrollerButton', 'useMessageScroller', 'useMessageScrollerScrollable', 'useMessageScrollerVisibility'], requiresProvider: 'MessageScrollerProvider', npmDeps: [] },
  { name: 'MultiSelect', folder: 'MultiSelect', description: 'Multi-value select with chips and checkbox listbox', tasks: ['multi select', 'multiselect', 'checkbox dropdown', 'tags select'], exports: ['MultiSelect'] },
  { name: 'NavigationMenu', folder: 'NavigationMenu', description: 'Site navigation with dropdown panels', tasks: ['navigation menu', 'navbar', 'mega menu'], exports: ['NavigationMenu', 'NavigationMenuList', 'NavigationMenuItem', 'NavigationMenuTrigger', 'NavigationMenuContent', 'NavigationMenuLink', 'NavigationMenuContentLink'] },
  { name: 'Modal', folder: 'Modal', description: 'Alias for Dialog API', tasks: ['modal'], exports: ['Modal', 'ModalContent', 'ModalHeader', 'ModalFooter', 'ModalTitle', 'ModalDescription'], aliasOf: 'Dialog' },
  { name: 'Pagination', folder: 'Pagination', description: 'Page navigation controls', tasks: ['pagination', 'pages'], exports: ['Pagination', 'PaginationList', 'PaginationItem', 'PaginationLink', 'PaginationButton', 'PaginationEllipsis'] },
  { name: 'PasswordToggleField', folder: 'PasswordToggleField', description: 'Password input with show/hide toggle', tasks: ['password', 'password toggle', 'show password', 'hide password'], exports: ['PasswordToggleField', 'PasswordToggleFieldInput', 'PasswordToggleFieldToggle', 'PasswordToggleFieldIcon'] },
  { name: 'Popover', folder: 'Popover', description: 'Floating content panel', tasks: ['popover', 'floating'], exports: ['Popover', 'PopoverTrigger', 'PopoverContent'] },
  { name: 'Progress', folder: 'Progress', description: 'Linear progress bar', tasks: ['progress', 'loading bar'], exports: ['Progress'] },
  { name: 'ProgressRing', folder: 'ProgressRing', description: 'Circular determinate progress indicator', tasks: ['progress ring', 'circular progress', 'donut progress'], exports: ['ProgressRing'] },
  { name: 'RadioGroup', folder: 'RadioGroup', description: 'Single choice from group', tasks: ['radio', 'single choice'], exports: ['RadioGroup', 'RadioGroupItem'] },
  { name: 'Resizable', folder: 'Resizable', description: 'Drag-to-resize panel groups (zero-dep)', tasks: ['resizable', 'split pane', 'panel resize'], exports: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'] },
  { name: 'ScrollArea', folder: 'ScrollArea', description: 'Custom styled scroll container', tasks: ['scroll', 'overflow'], exports: ['ScrollArea'] },
  { name: 'Scrollspy', folder: 'Scrollspy', description: 'On-this-page nav that tracks the visible section', tasks: ['scrollspy', 'table of contents', 'on this page'], exports: ['Scrollspy', 'ScrollspyLink'] },
  { name: 'Select', folder: 'Select', description: 'Custom listbox select with popup, groups and keyboard navigation', tasks: ['select', 'dropdown', 'listbox', 'choose option'], exports: ['Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem', 'SelectGroup', 'SelectLabel', 'SelectSeparator'] },
  { name: 'NativeSelect', folder: 'NativeSelect', description: 'Styled native <select> element for simple or mobile-first forms', tasks: ['native select', 'native-select', 'form select'], exports: ['NativeSelect'] },
  { name: 'Separator', folder: 'Separator', description: 'Visual divider line', tasks: ['separator', 'divider'], exports: ['Separator'] },
  { name: 'Sheet', folder: 'Sheet', description: 'Alias for Drawer API', tasks: ['sheet', 'side panel'], exports: ['Sheet', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription'], aliasOf: 'Drawer' },
  { name: 'Sidebar', folder: 'Sidebar', description: 'App sidebar layout with collapse (zero-dep)', tasks: ['sidebar', 'app shell', 'dashboard layout'], exports: ['SidebarProvider', 'Sidebar', 'SidebarHeader', 'SidebarContent', 'SidebarFooter', 'SidebarInset', 'SidebarTrigger', 'SidebarMenu', 'SidebarMenuItem', 'SidebarMenuButton'] },
  { name: 'Sonner', folder: 'Sonner', description: 'Registry alias for Toast', tasks: ['sonner', 'toast'], exports: ['SonnerToaster', 'useSonner', 'ToastItem', 'ToastTitle', 'ToastDescription'], aliasOf: 'Toast' },
  { name: 'SiteHeader', folder: 'SiteHeader', description: 'Demo site header with theme switcher', tasks: ['header', 'navbar', 'demo'], exports: ['SiteHeader'], demoOnly: true },
  { name: 'Skeleton', folder: 'Skeleton', description: 'Loading placeholder shimmer', tasks: ['skeleton', 'loading placeholder'], exports: ['Skeleton'] },
  { name: 'Slider', folder: 'Slider', description: 'Range slider input', tasks: ['slider', 'range'], exports: ['Slider'] },
  { name: 'Spinner', folder: 'Spinner', description: 'Circular loading indicator', tasks: ['spinner', 'loading'], exports: ['Spinner'] },
  { name: 'Stepper', folder: 'Stepper', description: 'Compact increment/decrement value control', tasks: ['stepper', 'number stepper', 'increment'], exports: ['Stepper'] },
  { name: 'Steps', folder: 'Steps', description: 'Wizard / checkout step indicator', tasks: ['steps', 'stepper wizard', 'checkout steps', 'wizard'], exports: ['Steps', 'StepsItem'] },
  {
    name: 'Timeline',
    folder: 'Timeline',
    description: 'Vertical status timeline for order tracking and event history',
    tasks: ['timeline', 'order tracking', 'status history', 'shipment track'],
    exports: [
      'Timeline',
      'TimelineItem',
      'TimelineIndicator',
      'TimelineContent',
      'TimelineTitle',
      'TimelineDescription',
      'TimelineTime',
    ],
  },
  { name: 'Switch', folder: 'Switch', description: 'Toggle switch control', tasks: ['switch', 'toggle setting'], exports: ['Switch'] },
  { name: 'Table', folder: 'Table', description: 'Data table with semantic parts', tasks: ['table', 'data grid', 'list'], exports: ['Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell', 'TableFooter', 'TableCaption'] },
  { name: 'Tabs', folder: 'Tabs', description: 'Tabbed panel navigation', tasks: ['tabs', 'panels'], exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'] },
  { name: 'Textarea', folder: 'Textarea', description: 'Multi-line text input', tasks: ['textarea', 'multiline'], exports: ['Textarea'] },
  { name: 'TokenField', folder: 'TokenField', description: 'Text input that commits values as removable tokens', tasks: ['token field', 'tags input', 'chip input'], exports: ['TokenField'] },
  { name: 'Typography', folder: 'Typography', description: 'Prose typography primitives (h1–h4, p, lead, muted, blockquote, list)', tasks: ['typography', 'prose', 'heading'], exports: ['Typography', 'TypographyH1', 'TypographyH2', 'TypographyH3', 'TypographyH4', 'TypographyP', 'TypographyLead', 'TypographyMuted', 'TypographyList', 'TypographyTable'] },
  { name: 'ThemeSwitcher', folder: 'ThemeSwitcher', description: 'Light/dark + color scheme picker', tasks: ['theme', 'dark mode', 'color scheme'], exports: ['ThemeSwitcher'] },
  { name: 'Toast', folder: 'Toast', description: 'Transient corner notifications', tasks: ['toast', 'notification', 'snackbar'], exports: ['ToastProvider', 'useToast', 'ToastItem', 'ToastViewport', 'ToastTitle', 'ToastDescription'], requiresProvider: 'ToastProvider' },
  { name: 'Toggle', folder: 'Toggle', description: 'Pressable toggle button', tasks: ['toggle', 'pressed state'], exports: ['Toggle'] },
  { name: 'ToggleGroup', folder: 'ToggleGroup', description: 'Group of toggle buttons', tasks: ['toggle group', 'segmented control'], exports: ['ToggleGroup', 'ToggleGroupItem'] },
  { name: 'Toolbar', folder: 'Toolbar', description: 'Accessible toolbar with roving focus for grouped controls', tasks: ['toolbar', 'formatting bar', 'editor toolbar'], exports: ['Toolbar', 'ToolbarButton', 'ToolbarLink', 'ToolbarSeparator', 'ToolbarToggleGroup', 'ToolbarToggleItem'] },
  { name: 'Tooltip', folder: 'Tooltip', description: 'Hover/focus tooltip hint', tasks: ['tooltip', 'hint', 'help'], exports: ['TooltipProvider', 'Tooltip', 'TooltipTrigger', 'TooltipContent'], requiresProvider: 'TooltipProvider' },
];

/**
 * Internal shacdn component dependencies, mirroring the relative imports in
 * `src/components/*`. Kept in sync by `mcp/shacdn-server/catalog.test.ts`, which fails
 * whenever a component gains or loses an internal import. The graph contains cycles
 * (Dialog ↔ Modal), so consumers must tolerate them.
 */
export const INTERNAL_DEPS: Record<string, string[]> = {
  Accordion: ['Collapsible'],
  AlertDialog: ['Dialog', 'Modal'],
  Attachment: ['Button'],
  ColorPicker: ['Input', 'Popover'],
  ComboButton: ['Button', 'ButtonGroup', 'DropdownMenu'],
  Combobox: ['Floating'],
  Command: ['Dialog'],
  ContextMenu: ['Floating'],
  DatePicker: ['Calendar', 'Floating'],
  Dialog: ['Button', 'Modal'],
  Drawer: ['Modal'],
  DropdownMenu: ['Floating'],
  HoverCard: ['Floating'],
  Lightbox: ['Modal'],
  Locale: ['Button', 'DropdownMenu'],
  Menubar: ['Floating'],
  MentionTextarea: ['Floating'],
  Modal: ['Dialog'],
  MultiSelect: ['Checkbox', 'Floating'],
  NativeSelect: [],
  NavigationMenu: ['Floating'],
  PasswordToggleField: ['Floating'],
  Popover: ['Floating'],
  Select: ['Floating'],
  Sheet: ['Drawer'],
  SiteHeader: ['Locale', 'ThemeSwitcher'],
  Sonner: ['Toast'],
  ThemeSwitcher: ['Floating'],
  ToggleGroup: ['Toggle'],
  Toolbar: ['Direction', 'Floating'],
  Tooltip: ['Floating'],
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
  {
    id: 'bess-solar',
    name: 'BessSolar',
    description: 'BESS + solar inverter + EV charging monitoring dashboard demo with animated energy flow',
    path: 'src/screens/Dashboard/pages/Bess',
    components: ['Card', 'Badge', 'Progress', 'ProgressRing', 'Tabs', 'Table', 'Dialog'],
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
