import { ArrowDownRight, ArrowUpRight, Download, Plus, RefreshCw, UserPlus, Zap } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../../../components/Alert/Alert';
import { AspectRatio } from '../../../components/AspectRatio/AspectRatio';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '../../../components/Avatar/Avatar';
import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import { ButtonGroup, ButtonGroupSeparator } from '../../../components/ButtonGroup/ButtonGroup';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselSlide,
  CarouselViewport,
} from '../../../components/Carousel/Carousel';
import { BarChart, ChartContainer } from '../../../components/Chart/Chart';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../../components/ContextMenu/ContextMenu';
import { Kbd } from '../../../components/Kbd/Kbd';
import { Label } from '../../../components/Label/Label';
import { Progress } from '../../../components/Progress/Progress';
import { Separator } from '../../../components/Separator/Separator';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { Spinner } from '../../../components/Spinner/Spinner';
import { Switch } from '../../../components/Switch/Switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/Table/Table';
import { useToastActions } from '../../../components/Toast/Toast';
import { TypographyMuted } from '../../../components/Typography/Typography';

import { PageHeader } from '../components/PageHeader';
import { useDashboard } from '../useDashboard';
import { HIGHLIGHTS, KPI_CARDS, REVENUE_DATA, STATUS_LABEL, STATUS_VARIANT, TRANSACTIONS } from '../dashboardData';
import styles from '../Dashboard.module.scss';

export const OverviewPage = () => {
  const { addToast } = useToastActions();
  const { timeRange, timeRangeLabel, refreshing, handleRefresh, showSkeleton } = useDashboard();

  const recentTransactions = TRANSACTIONS.slice(0, 4);

  return (
    <>
      <PageHeader
        title="Overview"
        lead="Monitor revenue, user growth, and payment activity across your workspace in one place."
        meta={`Last synced Jul 13, 2026 at 10:16 AM · ${timeRangeLabel} window`}
        actions={
          <>
            <ButtonGroup>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? <Spinner size="sm" /> : <RefreshCw size={14} aria-hidden />}
                Refresh
              </Button>
              <ButtonGroupSeparator />
              <Button variant="outline" size="sm">
                <Download size={14} aria-hidden />
                Export
              </Button>
            </ButtonGroup>
            <Button size="sm">
              <Plus size={14} aria-hidden />
              New report
            </Button>
          </>
        }
      />

      <Alert variant="subtle" className={styles.alertBanner}>
        <Zap size={16} aria-hidden />
        <div>
          <AlertTitle>Keyboard shortcuts</AlertTitle>
          <AlertDescription>
            Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open the command palette. Right-click charts for export and copy
            actions.
          </AlertDescription>
        </div>
      </Alert>

      <section className={styles.section} aria-labelledby="overview-kpi-heading">
        <h2 id="overview-kpi-heading" className={styles.sectionHeading}>
          Key metrics
        </h2>
        <p className={styles.sectionLead}>Headline numbers for the selected {timeRangeLabel} period.</p>
        <div className={styles.kpiGrid}>
          {KPI_CARDS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <article key={kpi.title} className={styles.metricTile}>
                <div className={styles.metricTileHeader}>
                  <div>
                    <p className={styles.metricTileLabel}>{kpi.title}</p>
                    <p className={styles.kpiDescription}>{kpi.description}</p>
                  </div>
                  <Icon size={16} aria-hidden className={styles.kpiIcon} />
                </div>
                <div className={styles.metricTileBody}>
                  <div className={styles.kpiValue}>{kpi.value}</div>
                  <div className={styles.kpiMeta}>
                    <Badge variant={kpi.trend === 'up' ? 'secondary' : 'destructive'} className={styles.badgeIcon}>
                      {kpi.trend === 'up' ? <ArrowUpRight size={12} aria-hidden /> : <ArrowDownRight size={12} aria-hidden />}
                      {kpi.change}
                    </Badge>
                    <span>vs previous {timeRange === '24h' ? 'day' : timeRange === '7d' ? 'week' : 'month'}</span>
                  </div>
                  <p className={styles.kpiTarget}>{kpi.target}</p>
                  <Progress value={kpi.progress} className={styles.kpiProgress} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="overview-charts-heading">
        <h2 id="overview-charts-heading" className={styles.sectionHeading}>
          Revenue &amp; highlights
        </h2>
        <p className={styles.sectionLead}>Compare monthly revenue against weekly conversion trends and team activity.</p>
        <div className={styles.mainGrid}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className={styles.surfacePanel}>
                <div className={styles.surfacePanelHeader}>
                  <div>
                    <h3 className={styles.panelTitle}>Revenue overview</h3>
                    <p className={styles.panelDescription}>
                      {timeRange === '24h'
                        ? 'Hourly revenue for the last 24 hours'
                        : timeRange === '7d'
                          ? 'Daily revenue for the past 7 days'
                          : 'Weekly revenue for the past 30 days'}
                    </p>
                  </div>
                </div>
                <div className={styles.chartWrap}>
                  {showSkeleton ? (
                    <Skeleton style={{ height: '12rem', width: '100%' }} />
                  ) : (
                    <ChartContainer className={styles.chartBare}>
                      <BarChart data={[...REVENUE_DATA]} />
                    </ChartContainer>
                  )}
                </div>
                <TypographyMuted className={styles.panelFooter}>
                  Peak month: Jun ($7,100) · Right-click for export options
                </TypographyMuted>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => addToast({ title: 'Copied', description: 'Chart data copied to clipboard.' })}>
                Copy data
              </ContextMenuItem>
              <ContextMenuItem>Download PNG</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>View full report</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <div className={styles.sideStack}>
            <div className={styles.surfacePanel}>
              <div className={styles.surfacePanelHeader}>
                <h3 className={styles.panelTitle}>Team</h3>
                <p className={styles.panelDescription}>8 collaborators with access to this workspace</p>
              </div>
              <AvatarGroup>
                <Avatar size="sm">
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>MW</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+5</AvatarGroupCount>
              </AvatarGroup>
              <Separator className={styles.inlineSeparator} />
              <div className={styles.fieldRow}>
                <Switch id="live-updates" defaultChecked />
                <Label htmlFor="live-updates">Stream live metric updates</Label>
              </div>
              <Button variant="outline" size="sm" className={styles.panelAction}>
                <UserPlus size={14} aria-hidden />
                Invite member
              </Button>
            </div>

            <div className={styles.surfacePanel}>
              <div className={styles.surfacePanelHeader}>
                <h3 className={styles.panelTitle}>Highlights</h3>
                <p className={styles.panelDescription}>Key wins from the selected time range</p>
              </div>
              <Carousel>
                <CarouselViewport>
                  <CarouselContent>
                    {HIGHLIGHTS.map((item) => (
                      <CarouselItem key={item.value}>
                        <CarouselSlide className={styles.highlightSlide}>
                          <span className={styles.highlightValue}>{item.value}</span>
                          <span className={styles.highlightDetail}>{item.detail}</span>
                        </CarouselSlide>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </CarouselViewport>
                <CarouselDots />
              </Carousel>
            </div>

            <div className={styles.surfacePanel}>
              <div className={styles.surfacePanelHeader}>
                <h3 className={styles.panelTitle}>Customer portal</h3>
                <p className={styles.panelDescription}>Snapshot of the customer-facing analytics portal</p>
              </div>
              <AspectRatio ratio={16 / 9}>
                <div className={styles.mediaPlaceholder} role="img" aria-label="Customer portal preview" />
              </AspectRatio>
              <p className={styles.mediaCaption}>Shared dashboards update within 5 minutes of new transactions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="overview-recent-heading">
        <h2 id="overview-recent-heading" className={styles.sectionHeading}>
          Recent transactions
        </h2>
        <p className={styles.sectionLead}>Latest payment activity — open Orders for full filtering and bulk actions.</p>
        <div className={styles.tableSurface}>
          <div className={styles.tableScroll}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className={styles.colHideMobile}>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className={styles.customerCell}>
                        <Avatar size="sm">
                          <AvatarFallback>{row.initials}</AvatarFallback>
                        </Avatar>
                        <div className={styles.customerInfo}>
                          <div className={styles.customerName}>{row.customer}</div>
                          <div className={styles.customerId}>{row.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>
                    </TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell className={styles.colHideMobile}>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </>
  );
};
