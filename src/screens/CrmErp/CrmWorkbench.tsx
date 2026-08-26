import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

import { Avatar, AvatarFallback } from '../../components/Avatar/Avatar';
import { Badge } from '../../components/Badge/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/Card/Card';
import { BarChart, ChartContainer } from '../../components/Chart/Chart';
import { Combobox } from '../../components/Combobox/Combobox';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../components/ContextMenu/ContextMenu';
import { DatePicker } from '../../components/DatePicker/DatePicker';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../../components/Empty/Empty';
import { Input } from '../../components/Input/Input';
import { InputGroup, InputGroupAddon } from '../../components/InputGroup/InputGroup';
import { Masonry, MasonryItem } from '../../components/Masonry/Masonry';
import { MultiSelect } from '../../components/MultiSelect/MultiSelect';
import {
  Pagination,
  PaginationButton,
  PaginationItem,
  PaginationList,
} from '../../components/Pagination/Pagination';
import { Progress } from '../../components/Progress/Progress';
import { ScrollArea } from '../../components/ScrollArea/ScrollArea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/Select/Select';
import { Toolbar, ToolbarButton, ToolbarSeparator } from '../../components/Toolbar/Toolbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/Table/Table';

import { useCrm } from './crmContext';
import {
  ACCOUNTS,
  BOARD_STAGES,
  BOOKINGS_CHART,
  DEAL_STAGE_META,
  INVOICES,
  ORDERS,
  OWNER_OPTIONS,
  REGION_OPTIONS,
  SKUS,
  creditLabel,
  formatCompactEur,
  formatEur,
  getAccount,
  getOwner,
  getPlantLabel,
  invoiceStatusLabel,
  matchesDealFilters,
  orderStatusLabel,
  quoteStatusLabel,
  skuAvailable,
  skuHealth,
  viewLabel,
  type Deal,
  type DealStage,
  type Invoice,
  type Order,
  type Quote,
  type CreditStatus,
  type Sku,
  type StockHealth,
} from './crmData';
import styles from './CrmErp.module.scss';

const healthBadge = (health: StockHealth): { label: string; variant: 'secondary' | 'outline' | 'destructive' } => {
  if (health === 'critical') return { label: 'Shortage', variant: 'destructive' };
  if (health === 'watch') return { label: 'Below safety', variant: 'outline' };
  return { label: 'Covered', variant: 'secondary' };
};

const creditBadge = (status: CreditStatus) => {
  if (status === 'hold') return { label: creditLabel[status], variant: 'destructive' as const };
  if (status === 'watch') return { label: creditLabel[status], variant: 'outline' as const };
  return { label: creditLabel[status], variant: 'secondary' as const };
};

const quoteBadge = (status: Quote['status']) => {
  if (status === 'expired') return { variant: 'destructive' as const };
  if (status === 'accepted') return { variant: 'secondary' as const };
  if (status === 'review') return { variant: 'default' as const };
  return { variant: 'outline' as const };
};

const orderBadge = (status: Order['status']) => {
  if (status === 'hold') return { variant: 'destructive' as const };
  if (status === 'invoiced' || status === 'shipped') return { variant: 'secondary' as const };
  if (status === 'production') return { variant: 'default' as const };
  return { variant: 'outline' as const };
};

const invoiceBadge = (status: Invoice['status']) => {
  if (status === 'overdue' || status === 'disputed') return { variant: 'destructive' as const };
  if (status === 'paid') return { variant: 'secondary' as const };
  return { variant: 'outline' as const };
};

const DealCard = ({ deal, active, onSelect }: { deal: Deal; active: boolean; onSelect: () => void }) => {
  const account = getAccount(deal.accountId);
  const owner = getOwner(deal.ownerId);
  const { openQuote, openApprove, openVisit } = useCrm();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
    <button
      type="button"
      className={`${styles.dealCard} ${active ? styles.dealCardActive : ''}`}
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`${account.name}: ${deal.title}, ${formatEur(deal.value)}`}
    >
      <div className={styles.dealTop}>
        <span className={styles.dealAccount}>{account.name}</span>
        <Badge variant="outline">{deal.probability}%</Badge>
      </div>
      <span className={styles.dealTitle}>{deal.title}</span>
      <strong className={styles.dealValue}>{formatEur(deal.value)}</strong>
      {deal.risk ? <Badge variant="destructive">{deal.risk}</Badge> : null}
      <div className={styles.dealMeta}>
        <span className={styles.dealOwner}>
          <Avatar size="sm">
            <AvatarFallback>{owner.initials}</AvatarFallback>
          </Avatar>
          {owner.name.split(' ')[0]}
        </span>
        <time dateTime={deal.closeDate}>{deal.closeDate}</time>
      </div>
      <span className={styles.dealTitle}>{deal.nextAction}</span>
    </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onSelect}>Open inspector</ContextMenuItem>
        <ContextMenuItem onClick={openQuote}>New quote from this deal</ContextMenuItem>
        <ContextMenuItem onClick={openVisit}>Schedule visit</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={openApprove}>Request margin exception</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const PipelineBoard = () => {
  const { deals, search, ownerFilter, regions, plant, closeAfter, watchMine, selected, setSelected } = useCrm();

  const filtered = useMemo(
    () =>
      deals.filter((deal) => {
        if (watchMine && deal.ownerId !== 'hanna') return false;
        return matchesDealFilters(deal, { search, ownerId: ownerFilter, regions, plant, closeAfter });
      }),
    [closeAfter, deals, ownerFilter, plant, regions, search, watchMine]
  );

  return (
    <div className={styles.board} role="list" aria-label="Opportunity board">
      {BOARD_STAGES.map((stage: DealStage) => {
        const columnDeals = filtered.filter((deal) => deal.stage === stage);
        const sum = columnDeals.reduce((total, deal) => total + deal.value, 0);
        return (
          <section key={stage} className={styles.column} aria-labelledby={`crm-col-${stage}`}>
            <header className={styles.columnHead}>
              <h3 id={`crm-col-${stage}`} className={styles.columnTitle}>
                {DEAL_STAGE_META[stage].label}
              </h3>
              <Badge variant="secondary">{columnDeals.length}</Badge>
            </header>
            <span className={styles.columnSum}>{formatCompactEur(sum)} unweighted</span>
            {columnDeals.length === 0 ? (
              <p className={styles.workbenchMeta}>No deals in this gate.</p>
            ) : (
              columnDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  active={selected.kind === 'deal' && selected.id === deal.id}
                  onSelect={() => setSelected({ kind: 'deal', id: deal.id })}
                />
              ))
            )}
          </section>
        );
      })}
    </div>
  );
};

const QuotesTable = () => {
  const { quotes, selected, setSelected, search, plant, watchMine } = useCrm();
  const [sort, setSort] = useState('value');
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const rows = quotes.filter((quote) => {
    const account = getAccount(quote.accountId);
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      quote.number.toLowerCase().includes(query) ||
      account.name.toLowerCase().includes(query);
    const matchesOwner = !watchMine || quote.ownerId === 'hanna';
    return matchesSearch && matchesOwner && (plant === 'all' || quote.plant === plant);
  });
  const sorted = [...rows].sort((a, b) => (sort === 'margin' ? b.margin - a.margin : b.value - a.value));
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className={styles.tableBlock}>
      <div className={styles.tableToolbar}>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger aria-label="Sort quotes" className={styles.filterControl}>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value">Sort by value</SelectItem>
            <SelectItem value="margin">Sort by margin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    <div className={styles.tableScroll}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quote</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plant</TableHead>
            <TableHead className={styles.numeric}>Value</TableHead>
            <TableHead className={styles.numeric}>Margin</TableHead>
            <TableHead>Valid until</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((quote) => {
            const active = selected.kind === 'quote' && selected.id === quote.id;
            return (
              <TableRow
                key={quote.id}
                className={`${styles.clickableRow} ${active ? styles.clickableRowActive : ''}`}
                onClick={() => setSelected({ kind: 'quote', id: quote.id })}
                data-state={active ? 'selected' : undefined}
              >
                <TableCell>{quote.number}</TableCell>
                <TableCell>{getAccount(quote.accountId).name}</TableCell>
                <TableCell>
                  <Badge variant={quoteBadge(quote.status).variant}>{quoteStatusLabel[quote.status]}</Badge>
                </TableCell>
                <TableCell>{getPlantLabel(quote.plant)}</TableCell>
                <TableCell className={styles.numeric}>{formatEur(quote.value)}</TableCell>
                <TableCell className={styles.numeric}>{quote.margin}%</TableCell>
                <TableCell>{quote.validUntil}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
      <Pagination>
        <PaginationList>
          <PaginationItem>
            <PaginationButton
              direction="previous"
              aria-label="Previous quotes page"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationButton
                aria-label={`Quotes page ${index + 1}`}
                aria-current={safePage === index + 1 ? 'page' : undefined}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </PaginationButton>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationButton
              direction="next"
              aria-label="Next quotes page"
              disabled={safePage >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            />
          </PaginationItem>
        </PaginationList>
      </Pagination>
    </div>
  );
};

const OrdersTable = () => {
  const { selected, setSelected, search, plant } = useCrm();
  const rows = ORDERS.filter((order) => {
    const account = getAccount(order.accountId);
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      order.number.toLowerCase().includes(query) ||
      account.name.toLowerCase().includes(query);
    return matchesSearch && (plant === 'all' || order.plant === plant);
  });

  return (
    <div className={styles.tableScroll}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Promised</TableHead>
            <TableHead>Fulfillment</TableHead>
            <TableHead className={styles.numeric}>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => {
            const active = selected.kind === 'order' && selected.id === order.id;
            return (
              <TableRow
                key={order.id}
                className={`${styles.clickableRow} ${active ? styles.clickableRowActive : ''}`}
                onClick={() => setSelected({ kind: 'order', id: order.id })}
              >
                <TableCell>{order.number}</TableCell>
                <TableCell>{getAccount(order.accountId).name}</TableCell>
                <TableCell>
                  <Badge variant={orderBadge(order.status).variant}>{orderStatusLabel[order.status]}</Badge>
                </TableCell>
                <TableCell>{order.promised}</TableCell>
                <TableCell>
                  <div className={styles.stockCell}>
                    <Progress value={order.progress} aria-label={`${order.number} fulfillment`} />
                    <span className={styles.workbenchMeta}>{order.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className={styles.numeric}>{formatEur(order.value)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const InventoryTable = () => {
  const { selected, setSelected, search, plant } = useCrm();
  const rows = SKUS.filter((sku) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query || sku.sku.toLowerCase().includes(query) || sku.name.toLowerCase().includes(query);
    return matchesSearch && (plant === 'all' || sku.plant === plant);
  });

  return (
    <div className={styles.tableScroll}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Plant</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Health</TableHead>
            <TableHead className={styles.numeric}>Lead</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((sku: Sku) => {
            const health = skuHealth(sku);
            const badge = healthBadge(health);
            const available = skuAvailable(sku);
            const cover = Math.min(100, Math.round((sku.onHand / sku.safety) * 100));
            const active = selected.kind === 'sku' && selected.id === sku.id;
            return (
              <TableRow
                key={sku.id}
                className={`${styles.clickableRow} ${active ? styles.clickableRowActive : ''}`}
                onClick={() => setSelected({ kind: 'sku', id: sku.id })}
              >
                <TableCell>{sku.sku}</TableCell>
                <TableCell>{sku.name}</TableCell>
                <TableCell>{getPlantLabel(sku.plant)}</TableCell>
                <TableCell>
                  <div className={styles.stockCell}>
                    <Progress value={cover} aria-label={`${sku.sku} stock cover`} />
                    <span className={styles.workbenchMeta}>
                      {available} ATP · {sku.onHand} on hand / {sku.safety} safety
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </TableCell>
                <TableCell className={styles.numeric}>{sku.leadDays}d</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const AccountsGrid = () => {
  const { selected, setSelected, search, ownerFilter, regions } = useCrm();
  const cards = ACCOUNTS.filter((account) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || account.name.toLowerCase().includes(query) || account.industry.toLowerCase().includes(query);
    const matchesOwner = ownerFilter === 'all' || account.ownerId === ownerFilter;
    const matchesRegion = regions.length === 0 || regions.includes(account.region);
    return matchesSearch && matchesOwner && matchesRegion;
  });

  return (
    <Masonry columns={2} gap="sm" className={styles.accountGrid}>
      {cards.map((account) => {
        const owner = getOwner(account.ownerId);
        const credit = creditBadge(account.credit);
        const active = selected.kind === 'account' && selected.id === account.id;
        return (
          <MasonryItem key={account.id} className={styles.accountMasonryItem}>
          <button
            type="button"
            className={`${styles.accountCard} ${active ? styles.accountCardActive : ''}`}
            onClick={() => setSelected({ kind: 'account', id: account.id })}
            aria-pressed={active}
          >
            <div className={styles.accountHead}>
              <div>
                <strong className={styles.dealAccount}>{account.name}</strong>
                <p className={styles.workbenchMeta}>
                  {account.industry} · {account.site}
                </p>
              </div>
              <Badge variant="outline">{account.tier}</Badge>
            </div>
            <div className={styles.dealMeta}>
              <span>LTM {formatCompactEur(account.ltmRevenue)}</span>
              <span>AR {formatCompactEur(account.openAr)}</span>
            </div>
            <div className={styles.dealMeta}>
              <span className={styles.dealOwner}>
                <Avatar size="sm">
                  <AvatarFallback>{owner.initials}</AvatarFallback>
                </Avatar>
                {owner.name}
              </span>
              <Badge variant={credit.variant}>{credit.label}</Badge>
            </div>
          </button>
          </MasonryItem>
        );
      })}
    </Masonry>
  );
};

const FinanceView = () => {
  const { selected, setSelected, search } = useCrm();
  const rows = INVOICES.filter((invoice) => {
    const account = getAccount(invoice.accountId);
    const query = search.trim().toLowerCase();
    return !query || invoice.number.toLowerCase().includes(query) || account.name.toLowerCase().includes(query);
  });

  return (
    <div className={styles.financeGrid}>
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Confirmed order intake, last six months (€m).</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer>
            <BarChart data={BOOKINGS_CHART} />
          </ChartContainer>
        </CardContent>
      </Card>
      <div className={styles.tableScroll}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Aging</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className={styles.numeric}>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((invoice) => {
              const active = selected.kind === 'invoice' && selected.id === invoice.id;
              return (
                <TableRow
                  key={invoice.id}
                  className={`${styles.clickableRow} ${active ? styles.clickableRowActive : ''}`}
                  onClick={() => setSelected({ kind: 'invoice', id: invoice.id })}
                >
                  <TableCell>{invoice.number}</TableCell>
                  <TableCell>{getAccount(invoice.accountId).name}</TableCell>
                  <TableCell>{invoice.aging === 0 ? 'Current' : `${invoice.aging}+`}</TableCell>
                  <TableCell>
                    <Badge variant={invoiceBadge(invoice.status).variant}>{invoiceStatusLabel[invoice.status]}</Badge>
                  </TableCell>
                  <TableCell className={styles.numeric}>{formatEur(invoice.amount)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const CrmWorkbench = () => {
  const {
    view,
    search,
    setSearch,
    ownerFilter,
    setOwnerFilter,
    regions,
    setRegions,
    plant,
    closeAfter,
    setCloseAfter,
    watchMine,
    openQuote,
    openPrint,
    deals,
    quotes,
  } = useCrm();

  const filteredDeals = useMemo(
    () =>
      deals.filter((deal) => {
        if (watchMine && deal.ownerId !== 'hanna') return false;
        return matchesDealFilters(deal, { search, ownerId: ownerFilter, regions, plant, closeAfter });
      }),
    [closeAfter, deals, ownerFilter, plant, regions, search, watchMine]
  );

  const meta =
    view === 'pipeline'
      ? `${filteredDeals.length} opportunities in view`
      : view === 'quotes'
        ? `${quotes.length} live quotes`
        : view === 'orders'
          ? `${ORDERS.length} sales orders`
          : view === 'inventory'
            ? `${SKUS.length} stock-keeping units`
            : view === 'accounts'
              ? `${ACCOUNTS.length} trading accounts`
              : `${INVOICES.length} receivables`;

  return (
    <section className={styles.workbench} aria-labelledby="crm-workbench-heading">
      <header className={styles.workbenchHead}>
        <div>
          <h2 id="crm-workbench-heading" className={styles.workbenchTitle}>
            {viewLabel(view)}
          </h2>
          <p className={styles.workbenchMeta}>{meta}</p>
        </div>
        <Toolbar className={styles.filters} aria-label="Workbench tools">
          <ToolbarButton type="button" onClick={openQuote}>
            Quote
          </ToolbarButton>
          <ToolbarButton type="button" onClick={openPrint}>
            Print
          </ToolbarButton>
          <ToolbarSeparator />
          <InputGroup className={styles.filterControl}>
            <InputGroupAddon>
              <Search size={14} aria-hidden />
            </InputGroupAddon>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter this view…"
              aria-label="Filter current view"
            />
          </InputGroup>
          {view === 'pipeline' || view === 'accounts' ? (
            <>
              <Combobox
                className={styles.filterControl}
                options={[...OWNER_OPTIONS]}
                value={ownerFilter}
                onValueChange={setOwnerFilter}
                placeholder="Owner"
              />
              <MultiSelect
                className={styles.filterControl}
                options={REGION_OPTIONS}
                value={regions}
                onValueChange={setRegions}
                placeholder="Regions"
              />
            </>
          ) : null}
          {view === 'pipeline' ? (
            <div className={styles.dateFilter}>
              <DatePicker label="Close after" value={closeAfter} onValueChange={setCloseAfter} />
            </div>
          ) : null}
        </Toolbar>
      </header>
      <ScrollArea className={styles.workbenchBody}>
        {view === 'pipeline' && filteredDeals.length === 0 ? (
          <div className={styles.emptyWrap}>
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <SlidersHorizontal size={20} aria-hidden />
                </EmptyMedia>
                <EmptyTitle>No opportunities match</EmptyTitle>
                <EmptyDescription>Clear owner, region, or close-date filters to bring the board back.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : null}
        {view === 'pipeline' && filteredDeals.length > 0 ? <PipelineBoard /> : null}
        {view === 'quotes' ? <QuotesTable /> : null}
        {view === 'orders' ? <OrdersTable /> : null}
        {view === 'inventory' ? <InventoryTable /> : null}
        {view === 'accounts' ? <AccountsGrid /> : null}
        {view === 'finance' ? <FinanceView /> : null}
      </ScrollArea>
    </section>
  );
};
