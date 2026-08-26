import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  Factory,
  Plus,
  Printer,
  Search,
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
import { Banner, BannerAction, BannerTitle } from '../../components/Banner/Banner';
import { ButtonGroup } from '../../components/ButtonGroup/ButtonGroup';
import { Calendar } from '../../components/Calendar/Calendar';
import { CheckboxCards, CheckboxCardsItem } from '../../components/CheckboxCards/CheckboxCards';
import { CheckboxGroup, CheckboxGroupItem } from '../../components/CheckboxGroup/CheckboxGroup';
import {
  Breadcrumb,
  BreadcrumbItem,
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
import { Combobox } from '../../components/Combobox/Combobox';
import { DatePicker } from '../../components/DatePicker/DatePicker';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../components/Drawer/Drawer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/Dialog/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/DropdownMenu/DropdownMenu';
import { Field, FieldLabel } from '../../components/Field/Field';
import { Form, FormDescription, FormField, FormLabel } from '../../components/Form/Form';
import { Input } from '../../components/Input/Input';
import { InputOTP } from '../../components/InputOTP/InputOTP';
import { Label } from '../../components/Label/Label';
import { InputGroup, InputGroupAddon } from '../../components/InputGroup/InputGroup';
import { Kbd, KbdGroup } from '../../components/Kbd/Kbd';
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
import { NativeSelect } from '../../components/NativeSelect/NativeSelect';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/Popover/Popover';
import { RadioCards, RadioCardsItem } from '../../components/RadioCards/RadioCards';
import { RadioGroup, RadioGroupItem } from '../../components/RadioGroup/RadioGroup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/Select/Select';
import { Skeleton } from '../../components/Skeleton/Skeleton';
import { Spinner } from '../../components/Spinner/Spinner';
import { Stepper } from '../../components/Stepper/Stepper';
import { Switch } from '../../components/Switch/Switch';
import { TokenField } from '../../components/TokenField/TokenField';
import { ToggleGroup, ToggleGroupItem } from '../../components/ToggleGroup/ToggleGroup';
import { TypographyMuted } from '../../components/Typography/Typography';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../components/Resizable/Resizable';
import { ScrollArea } from '../../components/ScrollArea/ScrollArea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../../components/Sheet/Sheet';
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
import { Slider } from '../../components/Slider/Slider';
import { Textarea } from '../../components/Textarea/Textarea';
import { useToastActions } from '../../components/Toast/Toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/Tooltip/Tooltip';

import { CrmContext } from './crmContext';
import {
  ACCOUNTS,
  CRM_NAV,
  DEALS,
  INVOICES,
  ORDERS,
  PLANTS,
  QUOTES,
  computeKpis,
  defaultSelectionForView,
  formatCompactEur,
  formatEur,
  getAccount,
  getOwner,
  viewLabel,
  type CrmView,
  type Quote,
  type SelectedRecord,
} from './crmData';
import { CrmInspector } from './CrmInspector';
import { CrmOpsStrip } from './CrmOpsStrip';
import { CrmWorkbench } from './CrmWorkbench';
import styles from './CrmErp.module.scss';

const BASE_TITLE = 'Helix Works · CRM / ERP';

const NOTIFICATIONS = [
  { id: 'n1', title: 'Q-10482 waiting on margin desk', body: 'Nordvik Pulp · 22% vs 18% floor' },
  { id: 'n2', title: 'SO-2255 credit hold', body: 'Baltic Ports · overdue INV-4882' },
  { id: 'n3', title: 'HX-440 below safety', body: '3 allocated · 4 on hand · safety 8' },
];

export const CrmErp = () => {
  const { addToast } = useToastActions();
  const [view, setViewState] = useState<CrmView>('pipeline');
  const [deals, setDeals] = useState(DEALS);
  const [quotes, setQuotes] = useState(QUOTES);
  const [selected, setSelected] = useState<SelectedRecord>(defaultSelectionForView('pipeline'));
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [regions, setRegions] = useState<string[]>([]);
  const [plant, setPlant] = useState('all');
  const [closeAfter, setCloseAfter] = useState<Date | undefined>();
  const [bannerOpen, setBannerOpen] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [expediteOpen, setExpediteOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [horizon, setHorizon] = useState('q');
  const [watchMine, setWatchMine] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pinned, setPinned] = useState(true);
  const [deskPin, setDeskPin] = useState('');
  const [visitDate, setVisitDate] = useState(new Date(2026, 8, 4));
  const [visitSlot, setVisitSlot] = useState('am');
  const [printPack, setPrintPack] = useState(['ack', 'certs']);

  const [quoteAccount, setQuoteAccount] = useState('nordvik');
  const [quoteTitle, setQuoteTitle] = useState('Follow-up commercial offer');
  const [quoteValid, setQuoteValid] = useState<Date | undefined>(new Date(2026, 8, 30));
  const [quoteMargin, setQuoteMargin] = useState(22);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteIncoterms, setQuoteIncoterms] = useState('fca');
  const [quoteDelivery, setQuoteDelivery] = useState('standard');
  const [quoteAddons, setQuoteAddons] = useState(['fat', 'certs']);
  const [quoteKits, setQuoteKits] = useState(4);
  const [quoteTags, setQuoteTags] = useState(['capex', 'hygienic']);
  const [quotePriority, setQuotePriority] = useState('normal');

  const [sidebarDefaultOpen] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return true;
    }
    return window.matchMedia('(min-width: 768px)').matches;
  });
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(max-width: 767px)').matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 767px)');
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const kpis = useMemo(() => computeKpis(deals, ORDERS, INVOICES), [deals]);
  const selectedAccountId =
    selected.kind === 'account'
      ? selected.id
      : selected.kind === 'deal'
        ? deals.find((deal) => deal.id === selected.id)?.accountId
        : selected.kind === 'quote'
          ? quotes.find((quote) => quote.id === selected.id)?.accountId
          : selected.kind === 'order'
            ? ORDERS.find((order) => order.id === selected.id)?.accountId
            : selected.kind === 'invoice'
              ? INVOICES.find((invoice) => invoice.id === selected.id)?.accountId
              : 'nordvik';
  const sheetAccount = getAccount(selectedAccountId ?? 'nordvik');

  const setView = (next: CrmView) => {
    setViewState(next);
    setSelected(defaultSelectionForView(next));
    setSearch('');
  };

  useEffect(() => {
    document.title = `${viewLabel(view)} · ${BASE_TITLE}`;
    return () => {
      document.title = 'shacdn';
    };
  }, [view]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const createQuote = () => {
    const account = getAccount(quoteAccount);
    const created: Quote = {
      id: `q-${Date.now()}`,
      number: `Q-10${520 + quotes.length}`,
      accountId: account.id,
      status: 'draft',
      value: Math.round(account.ltmRevenue * 0.12),
      margin: quoteMargin,
      validUntil: quoteValid ? quoteValid.toISOString().slice(0, 10) : '2026-09-30',
      ownerId: account.ownerId,
      plant: account.plant,
      incoterms: quoteIncoterms === 'cip' ? 'CIP site' : quoteIncoterms === 'dap' ? 'DAP site' : 'FCA Lyon',
      lines: [{ skuId: 'gsk12', qty: quoteKits, unitPrice: 1150, leadDays: 7 }],
    };
    setQuotes((current) => [created, ...current]);
    setViewState('quotes');
    setSelected({ kind: 'quote', id: created.id });
    setQuoteOpen(false);
    addToast({
      title: `${created.number} drafted`,
      description: `${account.name} · ${quoteTitle || 'Untitled offer'}`,
    });
  };

  const contextValue = {
    view,
    setView,
    deals,
    setDeals,
    quotes,
    setQuotes,
    selected,
    setSelected,
    search,
    setSearch,
    ownerFilter,
    setOwnerFilter,
    regions,
    setRegions,
    plant,
    setPlant,
    closeAfter,
    setCloseAfter,
    horizon,
    setHorizon,
    watchMine,
    setWatchMine,
    refreshing,
    pinned,
    setPinned,
    openQuote: () => setQuoteOpen(true),
    openApprove: () => setApproveOpen(true),
    openAccount: () => setAccountOpen(true),
    openCommand: () => setCommandOpen(true),
    openVisit: () => setVisitOpen(true),
    openExpedite: () => setExpediteOpen(true),
    openPrint: () => setPrintOpen(true),
  };

  const refreshDesk = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      addToast({ title: 'Desk refreshed', description: `Horizon ${horizon.toUpperCase()} reloaded locally.` });
    }, 700);
  };

  return (
    <TooltipProvider>
      <CrmContext.Provider value={contextValue}>
        <SidebarProvider defaultOpen={sidebarDefaultOpen} className={styles.shell}>
          <Sidebar className={styles.sidebarNav} aria-label="CRM navigation">
            <SidebarHeader>
              <div className={styles.brand}>
                <span className={styles.brandMark} aria-hidden>
                  <Factory size={14} />
                </span>
                <span className={styles.brandCopy}>
                  <span className={styles.brandName}>Helix Works</span>
                  <span className={styles.brandMeta}>Process equipment</span>
                </span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <p className={styles.navGroupLabel}>Workspace</p>
              <SidebarMenu aria-label="Workspace">
                {CRM_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = view === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={item.label}
                            onClick={() => setView(item.id)}
                          >
                            <Icon size={16} aria-hidden />
                            <SidebarMenuButtonLabel>{item.label}</SidebarMenuButtonLabel>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.description}</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <div className={styles.sidebarFoot}>
                <span>FY26 Q3 · week 35</span>
                <span>Hamburg · Lyon · Gdańsk</span>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className={styles.inset}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarStart}>
                <SidebarTrigger />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Helix Works</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{viewLabel(view)}</BreadcrumbPage>
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
                    value={globalSearch}
                    onChange={(event) => setGlobalSearch(event.target.value)}
                    placeholder="Search accounts, SKUs, orders…"
                    aria-label="Search workspace"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && globalSearch.trim()) {
                        setSearch(globalSearch);
                        addToast({ title: 'Workspace filter applied', description: globalSearch });
                      }
                    }}
                  />
                </InputGroup>
                <Combobox
                  className={styles.plantSelect}
                  options={[...PLANTS]}
                  value={plant}
                  onValueChange={setPlant}
                  placeholder="Plant"
                />
                <ToggleGroup
                  type="single"
                  value={horizon}
                  onValueChange={(value) => {
                    if (typeof value === 'string' && value) setHorizon(value);
                  }}
                  aria-label="Planning horizon"
                >
                  <ToggleGroupItem value="7d">7d</ToggleGroupItem>
                  <ToggleGroupItem value="30d">30d</ToggleGroupItem>
                  <ToggleGroupItem value="q">Q3</ToggleGroupItem>
                </ToggleGroup>
                <label className={styles.switchRow}>
                  <Switch
                    id="crm-watch"
                    checked={watchMine}
                    onChange={(event) => setWatchMine(event.target.checked)}
                    aria-label="Watch my book"
                  />
                  <Label htmlFor="crm-watch">My book</Label>
                </label>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCommandOpen(true)}
                      aria-label="Open command palette"
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
                        {NOTIFICATIONS.length}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className={styles.notificationPopover}>
                    <header className={styles.notificationHeader}>
                      <h2 className={styles.notificationTitle}>Inbox</h2>
                      <span className={styles.workbenchMeta}>{NOTIFICATIONS.length} open</span>
                    </header>
                    <ScrollArea className={styles.notificationList}>
                      {NOTIFICATIONS.map((note) => (
                        <button key={note.id} type="button" className={styles.notificationItem}>
                          <span className={styles.notificationItemTitle}>{note.title}</span>
                          <span className={styles.notificationItemBody}>{note.body}</span>
                        </button>
                      ))}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={styles.avatarMenuTrigger} aria-label="User menu">
                      <Avatar>
                        <AvatarFallback>HL</AvatarFallback>
                        <AvatarBadge />
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hanna Lind</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setAccountOpen(true)}>My book</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setQuoteOpen(true)}>New quote</DropdownMenuItem>
                    <DropdownMenuItem>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className={styles.menubarWrap}>
              <Menubar className={styles.crmMenubar} aria-label="Desk menus">
                <MenubarMenu menuId="crm-file">
                  <MenubarTrigger menuId="crm-file">File</MenubarTrigger>
                  <MenubarContent menuId="crm-file">
                    <MenubarItem onClick={() => setQuoteOpen(true)}>New quote</MenubarItem>
                    <MenubarItem onClick={() => setPrintOpen(true)}>Print acknowledgment</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={refreshDesk}>Refresh desk</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu menuId="crm-view">
                  <MenubarTrigger menuId="crm-view">View</MenubarTrigger>
                  <MenubarContent menuId="crm-view">
                    <MenubarItem onClick={() => setView('pipeline')}>Pipeline</MenubarItem>
                    <MenubarItem onClick={() => setView('finance')}>Finance</MenubarItem>
                    <MenubarItem onClick={() => setPinned(!pinned)}>
                      {pinned ? 'Unpin inspector' : 'Pin inspector'}
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu menuId="crm-ops">
                  <MenubarTrigger menuId="crm-ops">Operations</MenubarTrigger>
                  <MenubarContent menuId="crm-ops">
                    <MenubarItem onClick={() => setVisitOpen(true)}>Schedule site visit</MenubarItem>
                    <MenubarItem onClick={() => setExpediteOpen(true)}>Expedite material</MenubarItem>
                    <MenubarItem onClick={() => setApproveOpen(true)}>Margin exception</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
              {refreshing ? (
                <span className={styles.refreshHint}>
                  <Spinner />
                  Reloading book…
                </span>
              ) : null}
            </div>

            <div className={styles.page}>
              <header className={styles.pageHeader}>
                <div className={styles.pageTitleBlock}>
                  <p className={styles.pageEyebrow}>CRM / ERP command center</p>
                  <h1 className={styles.pageTitle}>Helix Works operations</h1>
                  <p className={styles.pageLead}>
                    One desk for pipeline, quotes, the order book, available-to-promise and collections — composed from
                    the same shacdn primitives as the rest of the library.
                  </p>
                </div>
                <div className={styles.headerActions}>
                  <ButtonGroup className={styles.headerActionGroup}>
                    <Button variant="outline" size="sm" onClick={() => setVisitOpen(true)}>
                      <CalendarDays size={14} aria-hidden />
                      Visit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPrintOpen(true)}>
                      <Printer size={14} aria-hidden />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setApproveOpen(true)}>
                      <AlertTriangle size={14} aria-hidden />
                      Margin exception
                    </Button>
                    <Button size="sm" onClick={() => setQuoteOpen(true)}>
                      <Plus size={14} aria-hidden />
                      New quote
                    </Button>
                  </ButtonGroup>
                </div>
              </header>

              {bannerOpen ? (
                <Banner variant="warning" dismissible onDismiss={() => setBannerOpen(false)} aria-label="Operating alerts">
                  <BannerTitle>
                    2 quotes expire this week · {kpis.criticalSkus} SKUs below safety · {kpis.overdueCount} invoices in
                    collections
                  </BannerTitle>
                  <BannerAction>
                    <Button size="sm" variant="outline" onClick={() => setView('finance')}>
                      Open finance
                    </Button>
                  </BannerAction>
                </Banner>
              ) : null}

              <CrmOpsStrip overdueSum={kpis.overdueSum} winRate={kpis.winRate} />

              <section className={styles.kpiGrid} aria-label="Operating KPIs">
                <article className={styles.kpi}>
                  <span className={styles.kpiLabel}>Weighted pipeline</span>
                  <strong className={styles.kpiValue}>{formatCompactEur(kpis.pipeline)}</strong>
                  <span className={styles.kpiNote}>{kpis.openDeals} open opportunities</span>
                </article>
                <article className={styles.kpi}>
                  <span className={styles.kpiLabel}>Win rate</span>
                  <strong className={styles.kpiValue}>{kpis.winRate}%</strong>
                  <span className={styles.kpiNote}>Closed-won vs closed-lost</span>
                </article>
                <article className={styles.kpi}>
                  <span className={styles.kpiLabel}>Open orders</span>
                  <strong className={styles.kpiValue}>{kpis.openPos}</strong>
                  <span className={styles.kpiNote}>Not yet invoiced</span>
                </article>
                <article className={`${styles.kpi} ${styles.kpiWarn}`}>
                  <span className={styles.kpiLabel}>Overdue AR</span>
                  <strong className={styles.kpiValue}>{formatCompactEur(kpis.overdueSum)}</strong>
                  <span className={styles.kpiNote}>{kpis.overdueCount} invoices past due</span>
                </article>
                <article className={`${styles.kpi} ${kpis.criticalSkus > 0 ? styles.kpiDanger : ''}`}>
                  <span className={styles.kpiLabel}>Material risk</span>
                  <strong className={styles.kpiValue}>{kpis.criticalSkus}</strong>
                  <span className={styles.kpiNote}>SKUs blocking live quotes</span>
                </article>
              </section>

              {refreshing ? (
                <div className={styles.skeletonRow} aria-hidden>
                  <Skeleton className={styles.skeletonBlock} />
                  <Skeleton className={styles.skeletonBlock} />
                  <Skeleton className={styles.skeletonBlock} />
                </div>
              ) : null}

              <ResizablePanelGroup
                className={styles.split}
                orientation={narrow ? 'vertical' : 'horizontal'}
              >
                <ResizablePanel defaultSize={narrow ? 58 : pinned ? 62 : 100} className={styles.pane}>
                  <CrmWorkbench />
                </ResizablePanel>
                {pinned ? (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={narrow ? 42 : 38} className={styles.pane}>
                      <CrmInspector />
                    </ResizablePanel>
                  </>
                ) : null}
              </ResizablePanelGroup>
            </div>
          </SidebarInset>
        </SidebarProvider>

        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <Command>
            <CommandInput placeholder="Jump to a workspace or record…" />
            <CommandList>
              <CommandEmpty />
              <CommandGroup heading="Workspace">
                {CRM_NAV.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.label.toLowerCase()}
                    onSelect={() => {
                      setView(item.id);
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
                  value="new quote"
                  onSelect={() => {
                    setCommandOpen(false);
                    setQuoteOpen(true);
                  }}
                >
                  <Plus size={14} aria-hidden />
                  New quote
                </CommandItem>
                <CommandItem
                  value="account"
                  onSelect={() => {
                    setCommandOpen(false);
                    setAccountOpen(true);
                  }}
                >
                  <Building2 size={14} aria-hidden />
                  Open account sheet
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>

        <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
          <DialogContent onClose={() => setQuoteOpen(false)}>
            <DialogHeader>
              <DialogTitle>New quote</DialogTitle>
              <DialogDescription>Draft a commercial offer. Line items stay local to this demo.</DialogDescription>
            </DialogHeader>
            <Form
              className={styles.dialogGrid}
              onSubmit={(event) => {
                event.preventDefault();
                createQuote();
              }}
            >
              <FormField>
                <FormLabel htmlFor="crm-quote-account">Account</FormLabel>
                <Combobox
                  id="crm-quote-account"
                  options={ACCOUNTS.map((account) => ({ value: account.id, label: account.name }))}
                  value={quoteAccount}
                  onValueChange={setQuoteAccount}
                  placeholder="Account"
                />
              </FormField>
              <FormField>
                <FormLabel htmlFor="crm-quote-title">Offer title</FormLabel>
                <Input
                  id="crm-quote-title"
                  value={quoteTitle}
                  onChange={(event) => setQuoteTitle(event.target.value)}
                />
              </FormField>
              <FormField>
                <FormLabel>Valid until</FormLabel>
                <DatePicker value={quoteValid} onValueChange={setQuoteValid} label="Valid until" />
              </FormField>
              <FormField>
                <FormLabel htmlFor="crm-quote-incoterms">Incoterms</FormLabel>
                <Select value={quoteIncoterms} onValueChange={setQuoteIncoterms}>
                  <SelectTrigger id="crm-quote-incoterms" aria-label="Incoterms">
                    <SelectValue placeholder="Incoterms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fca">FCA Lyon</SelectItem>
                    <SelectItem value="dap">DAP site</SelectItem>
                    <SelectItem value="cip">CIP site</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField>
                <FormLabel htmlFor="crm-quote-margin">Target margin · {quoteMargin}%</FormLabel>
                <Slider id="crm-quote-margin" min={12} max={36} step={1} value={quoteMargin} onValueChange={setQuoteMargin} />
                <FormDescription>Floor is 18%. Anything below needs a margin exception.</FormDescription>
              </FormField>
              <FormField>
                <FormLabel htmlFor="crm-quote-priority">Priority</FormLabel>
                <NativeSelect
                  id="crm-quote-priority"
                  value={quotePriority}
                  onChange={(event) => setQuotePriority(event.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="hot">Hot — this week</option>
                  <option value="frame">Frame agreement</option>
                </NativeSelect>
              </FormField>
              <FormField className={styles.dialogFull}>
                <FormLabel>Delivery</FormLabel>
                <RadioCards value={quoteDelivery} onValueChange={setQuoteDelivery} columns={3} size="sm">
                  <RadioCardsItem value="standard">Standard · 6–8 wks</RadioCardsItem>
                  <RadioCardsItem value="split">Split shipment</RadioCardsItem>
                  <RadioCardsItem value="exworks">Collect EXW</RadioCardsItem>
                </RadioCards>
              </FormField>
              <FormField className={styles.dialogFull}>
                <FormLabel>Commercial extras</FormLabel>
                <CheckboxCards value={quoteAddons} onValueChange={setQuoteAddons} columns={3} size="sm">
                  <CheckboxCardsItem value="fat">FAT in Lyon</CheckboxCardsItem>
                  <CheckboxCardsItem value="certs">3.1 certificates</CheckboxCardsItem>
                  <CheckboxCardsItem value="install">Supervision</CheckboxCardsItem>
                </CheckboxCards>
              </FormField>
              <FormField>
                <FormLabel>Spare kits</FormLabel>
                <Stepper value={quoteKits} min={1} max={24} onValueChange={setQuoteKits} aria-label="Spare kit quantity" />
              </FormField>
              <FormField>
                <FormLabel>Tags</FormLabel>
                <TokenField value={quoteTags} onValueChange={setQuoteTags} aria-label="Quote tags" placeholder="Add tag…" />
              </FormField>
              <FormField className={styles.dialogFull}>
                <FormLabel htmlFor="crm-quote-notes">Internal note</FormLabel>
                <Textarea
                  id="crm-quote-notes"
                  rows={3}
                  value={quoteNotes}
                  onChange={(event) => setQuoteNotes(event.target.value)}
                  placeholder="Scope, Incoterms, or installation window…"
                />
              </FormField>
              <DialogFooter className={styles.dialogFull}>
                <Button type="button" variant="outline" onClick={() => setQuoteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create draft</Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
          <AlertDialogContent onClose={() => setApproveOpen(false)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Request a margin exception?</AlertDialogTitle>
              <AlertDialogDescription>
                Nordvik Pulp Q-10482 sits at 22% versus an 18% floor, but HX-440 transfer freight would drop contribution
                to 16.4%. Confirm with the four-digit desk PIN.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className={styles.otpBlock}>
              <Label htmlFor="crm-desk-pin">Desk PIN</Label>
              <InputOTP id="crm-desk-pin" length={4} value={deskPin} onChange={setDeskPin} />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setApproveOpen(false)}>Keep current terms</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setApproveOpen(false);
                  addToast({ title: 'Exception queued', description: 'Deal desk will review Q-10482.' });
                }}
              >
                Send to deal desk
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Sheet open={accountOpen} onOpenChange={setAccountOpen} side="right">
          <SheetContent onClose={() => setAccountOpen(false)} side="right">
            <SheetHeader>
              <SheetTitle>{sheetAccount.name}</SheetTitle>
              <SheetDescription>
                {sheetAccount.industry} · {sheetAccount.site}
              </SheetDescription>
            </SheetHeader>
            <div className={styles.sheetBlock}>
              <p className={styles.workbenchMeta}>
                Owner {getOwner(sheetAccount.ownerId).name} · {sheetAccount.paymentTerms} · credit{' '}
                {formatEur(sheetAccount.creditLimit)}
              </p>
              {sheetAccount.contacts.map((contact) => (
                <div key={contact.email}>
                  <strong>{contact.name}</strong>
                  <p className={styles.workbenchMeta}>
                    {contact.title} · {contact.email}
                  </p>
                </div>
              ))}
            </div>
            <SheetFooter>
              <Button size="sm" onClick={() => setAccountOpen(false)}>
                Close
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Drawer open={visitOpen} onOpenChange={setVisitOpen} side="right">
          <DrawerContent onClose={() => setVisitOpen(false)}>
            <DrawerHeader>
              <DrawerTitle>Schedule a site visit</DrawerTitle>
              <DrawerDescription>Books a slot on the owner calendar. Nothing is sent off-box.</DrawerDescription>
            </DrawerHeader>
            <div className={styles.sheetBlock}>
              <Calendar selected={visitDate} onSelect={setVisitDate} />
              <Field>
                <FieldLabel>Slot</FieldLabel>
                <RadioGroup value={visitSlot} onValueChange={setVisitSlot} name="visit-slot">
                  <label className={styles.radioRow}>
                    <RadioGroupItem value="am" id="slot-am" />
                    <Label htmlFor="slot-am">Morning</Label>
                  </label>
                  <label className={styles.radioRow}>
                    <RadioGroupItem value="pm" id="slot-pm" />
                    <Label htmlFor="slot-pm">Afternoon</Label>
                  </label>
                </RadioGroup>
              </Field>
            </div>
            <DrawerFooter>
              <Button
                onClick={() => {
                  setVisitOpen(false);
                  addToast({
                    title: 'Visit held',
                    description: `${visitDate.toLocaleDateString('en-IE')} · ${visitSlot === 'am' ? 'morning' : 'afternoon'}`,
                  });
                }}
              >
                Hold slot
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer open={expediteOpen} onOpenChange={setExpediteOpen} side="right">
          <DrawerContent onClose={() => setExpediteOpen(false)}>
            <DrawerHeader>
              <DrawerTitle>Expedite material</DrawerTitle>
              <DrawerDescription>Ask Lyon or Gdańsk to pull a pack for a live quote.</DrawerDescription>
            </DrawerHeader>
            <div className={styles.sheetBlock}>
              <TypographyMuted>HX-440 is the usual bottleneck. Transfer freight hits margin.</TypographyMuted>
              <Button
                onClick={() => {
                  setExpediteOpen(false);
                  addToast({ title: 'Expedite filed', description: 'Lyon works notified for week 38.' });
                }}
              >
                File request
              </Button>
            </div>
          </DrawerContent>
        </Drawer>

        <Modal open={printOpen} onOpenChange={setPrintOpen}>
          <ModalContent onClose={() => setPrintOpen(false)}>
            <ModalHeader>
              <ModalTitle>Print order acknowledgment</ModalTitle>
              <ModalDescription>Choose the document pack for SO-2291.</ModalDescription>
            </ModalHeader>
            <CheckboxGroup value={printPack} onValueChange={setPrintPack} aria-label="Document pack">
              <CheckboxGroupItem value="ack">Order acknowledgment</CheckboxGroupItem>
              <CheckboxGroupItem value="certs">3.1 mill certificates</CheckboxGroupItem>
              <CheckboxGroupItem value="weld">Weld map</CheckboxGroupItem>
            </CheckboxGroup>
            <ModalFooter>
              <Button variant="outline" onClick={() => setPrintOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setPrintOpen(false);
                  addToast({ title: 'Print queued', description: `${printPack.length} documents` });
                }}
              >
                Send to printer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CrmContext.Provider>
    </TooltipProvider>
  );
};
