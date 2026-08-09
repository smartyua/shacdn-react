import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  Download,
  LayoutDashboard,
  RefreshCw,
  Search,
  Settings,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/AlertDialog/AlertDialog';
import { Avatar, AvatarBadge, AvatarFallback } from '../../components/Avatar/Avatar';
import { Badge } from '../../components/Badge/Badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/Breadcrumb/Breadcrumb';
import { Button } from '../../components/Button/Button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components/Command/Command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/Dialog/Dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../components/Drawer/Drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/DropdownMenu/DropdownMenu';
import { Input } from '../../components/Input/Input';
import { InputGroup, InputGroupAddon } from '../../components/InputGroup/InputGroup';
import { Kbd, KbdGroup } from '../../components/Kbd/Kbd';
import { Label } from '../../components/Label/Label';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../../components/Menubar/Menubar';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '../../components/Modal/Modal';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/Popover/Popover';
import { ScrollArea } from '../../components/ScrollArea/ScrollArea';
import { Separator } from '../../components/Separator/Separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../../components/Sheet/Sheet';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuButtonLabel,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../../components/Sidebar/Sidebar';
import { Switch } from '../../components/Switch/Switch';
import { useToastActions } from '../../components/Toast/Toast';
import { ToggleGroup, ToggleGroupItem } from '../../components/ToggleGroup/ToggleGroup';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/Tooltip/Tooltip';
import { TypographyMuted } from '../../components/Typography/Typography';

import { DashboardProvider } from './DashboardProvider';
import { BASE_TITLE, NOTIFICATIONS } from './dashboardData';
import { DASHBOARD_NAV_GROUPS, getDashboardNavItem } from './dashboardNav';
import styles from './Dashboard.module.scss';

export const DashboardLayout = () => {
  const { addToast } = useToastActions();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const [sidebarDefaultOpen] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true
  );

  const activeNav = getDashboardNavItem(location.pathname);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addToast({ title: 'Data refreshed', description: 'Dashboard metrics updated successfully.' });
    }, 1200);
  };

  const timeRangeLabel =
    timeRange === '24h' ? '24-hour' : timeRange === '7d' ? '7-day' : '30-day';

  useEffect(() => {
    const title = activeNav ? `${activeNav.label} · ${BASE_TITLE}` : `Dashboard · ${BASE_TITLE}`;
    document.title = title;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [activeNav]);

  const contextValue = {
    timeRange,
    timeRangeLabel,
    setTimeRange,
    refreshing,
    handleRefresh,
    showSkeleton,
    setShowSkeleton,
    openCommandPalette: () => setCommandOpen(true),
    openSettings: () => navigate('/dashboard/settings'),
    openReports: () => navigate('/dashboard/reports'),
  };

  return (
    <TooltipProvider>
      <DashboardProvider value={contextValue}>
        <SidebarProvider defaultOpen={sidebarDefaultOpen} className={styles.shell}>
          <Sidebar className={styles.sidebarNav} aria-label="Dashboard navigation">
            <SidebarHeader>
              <div className={styles.sidebarBrand}>
                <span className={styles.sidebarBrandIcon} aria-hidden>
                  <LayoutDashboard size={14} />
                </span>
                <span>Acme Admin</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              {DASHBOARD_NAV_GROUPS.map((group) => (
                <div key={group.label} className={styles.navGroup}>
                  <p className={styles.navGroupLabel} aria-hidden>
                    {group.label}
                  </p>
                  <SidebarMenu aria-label={group.label}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <SidebarMenuItem key={item.path}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                isActive={isActive}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={item.label}
                                onClick={() => navigate(item.path)}
                              >
                                <Icon size={16} aria-hidden />
                                <SidebarMenuButtonLabel>{item.label}</SidebarMenuButtonLabel>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                          </Tooltip>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </div>
              ))}
            </SidebarContent>
            <SidebarFooter>
              <span className={styles.sidebarVersion}>shacdn v1.0</span>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className={styles.inset}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarStart}>
                <SidebarTrigger />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeNav?.label ?? 'Overview'}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className={styles.toolbarEnd}>
                <InputGroup className={styles.searchGroup}>
                  <InputGroupAddon>
                    <Search size={14} aria-hidden />
                  </InputGroupAddon>
                  <Input
                    placeholder="Search workspace…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search workspace"
                  />
                </InputGroup>
                <ToggleGroup
                  type="single"
                  value={timeRange}
                  onValueChange={(v) => {
                    if (typeof v === 'string') setTimeRange(v);
                  }}
                  className={styles.toolbarTimeRange}
                >
                  <ToggleGroupItem value="24h" aria-label="24 hours">
                    24h
                  </ToggleGroupItem>
                  <ToggleGroupItem value="7d" aria-label="7 days">
                    7d
                  </ToggleGroupItem>
                  <ToggleGroupItem value="30d" aria-label="30 days">
                    30d
                  </ToggleGroupItem>
                </ToggleGroup>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCommandOpen(true)}
                      aria-label="Open command palette"
                      className={styles.toolbarCommand}
                    >
                      <KbdGroup>
                        <Kbd>⌘</Kbd>
                        <Kbd>K</Kbd>
                      </KbdGroup>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Command palette</TooltipContent>
                </Tooltip>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" aria-label="Notifications" className={styles.notificationBtn}>
                      <Bell size={16} aria-hidden />
                      <Badge variant="destructive" className={styles.badgeCount}>
                        {NOTIFICATIONS.filter((note) => !note.read).length}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className={styles.notificationPopover}>
                    <header className={styles.notificationPopoverHeader}>
                      <h2 className={styles.notificationPopoverTitle}>Notifications</h2>
                      <span className={styles.notificationPopoverMeta}>
                        {NOTIFICATIONS.filter((note) => !note.read).length} unread
                      </span>
                    </header>
                    <ScrollArea className={styles.notificationList}>
                      <ul className={styles.notificationRows}>
                        {NOTIFICATIONS.map((note) => (
                          <li key={note.id}>
                            <button
                              type="button"
                              className={`${styles.notificationItem} ${note.read ? styles.notificationItemRead : styles.notificationItemUnread}`}
                              aria-label={`${note.read ? 'Read' : 'Unread'}: ${note.title}. ${note.description}. ${note.time}`}
                            >
                              <span className={styles.notificationItemHeader}>
                                <span className={styles.notificationItemTitle}>{note.title}</span>
                                <time className={styles.notificationItemTime} dateTime={note.time}>
                                  {note.time}
                                </time>
                              </span>
                              <span className={styles.notificationItemBody}>{note.description}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                    <footer className={styles.notificationPopoverFooter}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={styles.notificationPopoverAction}
                        onClick={() => navigate('/dashboard/activity')}
                      >
                        View all activity
                      </Button>
                    </footer>
                  </PopoverContent>
                </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={styles.avatarMenuTrigger} aria-label="User menu">
                      <Avatar>
                        <AvatarFallback>AD</AvatarFallback>
                        <AvatarBadge />
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Admin User</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/payments')}>Payments</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/requests')}>Requests</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSheetOpen(true)}>Preferences</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDrawerOpen(true)}>Quick billing</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDialogOpen(true)}>Quick edit profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className={styles.menubarWrap}>
              <Menubar className={styles.dashboardMenubar}>
                <MenubarMenu menuId="dash-file">
                  <MenubarTrigger menuId="dash-file">File</MenubarTrigger>
                  <MenubarContent menuId="dash-file">
                    <MenubarItem
                      onClick={() =>
                        addToast({ title: 'Export started', description: 'CSV download will begin shortly.' })
                      }
                    >
                      Export CSV
                    </MenubarItem>
                    <MenubarItem onClick={() => setModalOpen(true)}>Print report</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => setAlertDialogOpen(true)}>Delete workspace</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu menuId="dash-view">
                  <MenubarTrigger menuId="dash-view">View</MenubarTrigger>
                  <MenubarContent menuId="dash-view">
                    <MenubarItem onClick={() => setShowSkeleton(true)}>Show loading state</MenubarItem>
                    <MenubarItem onClick={() => setShowSkeleton(false)}>Show data</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu menuId="dash-help">
                  <MenubarTrigger menuId="dash-help">Help</MenubarTrigger>
                  <MenubarContent menuId="dash-help">
                    <MenubarItem>Documentation</MenubarItem>
                    <MenubarItem onClick={() => setCommandOpen(true)}>Keyboard shortcuts</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>

            <div className={styles.pageBody}>
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>

        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <Command>
            <CommandInput placeholder="Search commands…" />
            <CommandList>
              <CommandEmpty />
              <CommandGroup heading="Navigate">
                {DASHBOARD_NAV_GROUPS.flatMap((g) => g.items).map((item) => (
                  <CommandItem
                    key={item.path}
                    value={item.label.toLowerCase()}
                    onSelect={() => {
                      navigate(item.path);
                      setCommandOpen(false);
                    }}
                  >
                    <item.icon size={14} aria-hidden />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Actions">
                <CommandItem
                  value="refresh"
                  onSelect={() => {
                    handleRefresh();
                    setCommandOpen(false);
                  }}
                >
                  <RefreshCw size={14} aria-hidden />
                  Refresh data
                </CommandItem>
                <CommandItem
                  value="export"
                  onSelect={() => {
                    addToast({ title: 'Export', description: 'CSV export started.' });
                    setCommandOpen(false);
                  }}
                >
                  <Download size={14} aria-hidden />
                  Export CSV
                </CommandItem>
                <CommandItem
                  value="settings"
                  onSelect={() => {
                    navigate('/dashboard/settings');
                    setCommandOpen(false);
                  }}
                >
                  <Settings size={14} aria-hidden />
                  Open settings
                </CommandItem>
                <CommandItem
                  value="calendar"
                  onSelect={() => {
                    navigate('/dashboard/reports');
                    setCommandOpen(false);
                  }}
                >
                  <CalendarDays size={14} aria-hidden />
                  Generate report
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent onClose={() => setDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Update your account details</DialogDescription>
            </DialogHeader>
            <div className={styles.dialogFields}>
              <Input placeholder="Full name" defaultValue="Admin User" />
              <Input type="email" placeholder="Email" defaultValue="admin@acme.io" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  addToast({ title: 'Profile updated' });
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <ModalContent onClose={() => setModalOpen(false)}>
            <ModalHeader>
              <ModalTitle>Print report</ModalTitle>
              <ModalDescription>Preview before sending to printer</ModalDescription>
            </ModalHeader>
            <TypographyMuted>Report preview would render here in a production app.</TypographyMuted>
            <ModalFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>Print</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} side="right">
          <SheetContent onClose={() => setSheetOpen(false)} side="right">
            <SheetHeader>
              <SheetTitle>Preferences</SheetTitle>
              <SheetDescription>Customize your dashboard experience</SheetDescription>
            </SheetHeader>
            <div className={styles.sheetFields}>
              <div className={styles.fieldRow}>
                <Switch id="pref-dark" defaultChecked />
                <Label htmlFor="pref-dark">Dark mode charts</Label>
              </div>
              <div className={styles.fieldRow}>
                <Switch id="pref-compact" />
                <Label htmlFor="pref-compact">Compact sidebar</Label>
              </div>
            </div>
            <SheetFooter>
              <Button size="sm" onClick={() => setSheetOpen(false)}>
                Done
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} side="right">
          <DrawerContent onClose={() => setDrawerOpen(false)}>
            <DrawerHeader>
              <DrawerTitle>Billing</DrawerTitle>
              <DrawerDescription>Manage subscription and payment methods</DrawerDescription>
            </DrawerHeader>
            <div className={styles.drawerBody}>
              <Badge variant="secondary">Pro Plan · $49/mo</Badge>
              <Separator className={styles.drawerSeparator} />
              <TypographyMuted>Next billing date: Aug 13, 2026</TypographyMuted>
            </div>
            <DrawerFooter>
              <Button onClick={() => setDrawerOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <AlertDialogContent onClose={() => setAlertDialogOpen(false)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the workspace and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setAlertDialogOpen(false);
                  addToast({ title: 'Cancelled', description: 'Workspace deletion was not confirmed.' });
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardProvider>
    </TooltipProvider>
  );
};
