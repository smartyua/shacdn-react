import { useState, type CSSProperties } from 'react';
import {
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  FileText,
  MoreHorizontal,
  Plus,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '../../../../components/Avatar/Avatar';
import { Badge } from '../../../../components/Badge/Badge';
import { Button } from '../../../../components/Button/Button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/Card/Card';
import { DonutChart, GroupedBarChart, Sparkline } from '../../../../components/Chart/Chart';
import { DateRangePicker, type DateRange } from '../../../../components/DateRangePicker/DateRangePicker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/Dialog/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/DropdownMenu/DropdownMenu';
import { Input } from '../../../../components/Input/Input';
import { Label } from '../../../../components/Label/Label';
import { ProgressRing } from '../../../../components/ProgressRing/ProgressRing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/Table/Table';
import { useToastActions } from '../../../../components/Toast/Toast';

import { PageHeader } from '../../components/PageHeader';
import dashStyles from '../../Dashboard.module.scss';
import styles from './Finance.module.scss';
import {
  EXPENSE_MONTHS,
  EXPENSE_SERIES,
  EXPENSE_SUMMARY,
  FINANCE_KPIS,
  FINANCE_RANGE_END,
  FINANCE_RANGE_START,
  FINANCE_TRANSACTIONS,
  INCOME_SOURCES,
  SAVING_GOAL,
  TOTAL_INCOME,
  WALLET_CARDS,
  formatUsd,
  type FinanceKpiTone,
  type WalletCardTone,
  type WalletNetwork,
} from './financeData';

const KPI_ICONS = {
  balance: Wallet,
  profit: Banknote,
  expenses: Receipt,
  invoices: FileText,
} as const;

const toneClass = (tone: FinanceKpiTone): string => {
  switch (tone) {
    case 'success':
      return styles.toneSuccess;
    case 'info':
      return styles.toneInfo;
    case 'warning':
      return styles.toneWarning;
    case 'caution':
      return styles.toneCaution;
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
};

const walletToneClass = (tone: WalletCardTone): string => {
  switch (tone) {
    case 'dark':
      return styles.walletDark;
    case 'muted':
      return styles.walletMuted;
    case 'accent':
      return styles.walletAccent;
    case 'primary':
      return styles.walletPrimary;
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
};

const chartToken = (index: number): string => `hsl(var(--chart-${(index % 5) + 1}))`;

const formatIncome = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const NetworkMark = ({ network }: { network: WalletNetwork }) => {
  if (network === 'visa') {
    return <span className={styles.networkMark}>VISA</span>;
  }
  return (
    <span className={styles.mastercard} aria-hidden>
      <span className={styles.mastercardCircle} />
      <span className={styles.mastercardCircle} />
    </span>
  );
};

export const FinancePage = () => {
  const { addToast } = useToastActions();
  const [range, setRange] = useState<DateRange>({
    from: FINANCE_RANGE_START,
    to: FINANCE_RANGE_END,
  });
  const [transferOpen, setTransferOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState('500');
  const [requestAmount, setRequestAmount] = useState('250');
  const [cardName, setCardName] = useState('Travel Card');
  const [cardLast4, setCardLast4] = useState('4421');

  const notify = (title: string, description: string) => {
    addToast({ title, description });
  };

  return (
    <>
      <PageHeader
        title="Finance Dashboard"
        lead="Balance, income mix, expenses, and wallet activity for the selected period."
        actions={
          <DateRangePicker value={range} onValueChange={setRange} />
        }
      />

      <section className={dashStyles.section} aria-labelledby="finance-kpi-heading">
        <h2 id="finance-kpi-heading" className={dashStyles.sectionHeading}>
          Key metrics
        </h2>
        <div className={styles.kpiGrid}>
          {FINANCE_KPIS.map((kpi) => {
            const Icon = KPI_ICONS[kpi.id as keyof typeof KPI_ICONS];
            return (
              <Card key={kpi.id} className={styles.kpiCard}>
                <CardHeader className={styles.kpiHeader}>
                  <div className={styles.kpiIntro}>
                    <span className={`${styles.iconTile} ${toneClass(kpi.tone)}`} aria-hidden>
                      <Icon size={16} />
                    </span>
                    <p className={styles.kpiLabel}>{kpi.label}</p>
                  </div>
                  <CardAction>
                    <Badge variant={kpi.id === 'invoices' ? 'outline' : 'success'}>
                      {kpi.id !== 'invoices' ? <ArrowUpRight size={12} aria-hidden /> : null}
                      {kpi.change}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className={styles.kpiValue}>{kpi.value}</p>
                  {kpi.hint ? <p className={styles.kpiHint}>{kpi.hint}</p> : null}
                  {kpi.id === 'balance' ? (
                    <div className={styles.kpiActions}>
                      <Button size="xs" onClick={() => setTransferOpen(true)}>
                        <ArrowLeftRight size={14} aria-hidden />
                        Transfer
                      </Button>
                      <Button size="xs" variant="outline" onClick={() => setRequestOpen(true)}>
                        Request
                      </Button>
                    </div>
                  ) : null}
                  {kpi.sparkline ? (
                    <Sparkline className={styles.sparkline} data={kpi.sparkline} />
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className={styles.chartsRow}>
        <section aria-labelledby="income-heading">
          <Card className={styles.cardFill}>
            <CardHeader>
              <CardTitle id="income-heading">Income Sources</CardTitle>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="iconSm" aria-label="Income sources actions">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => notify('Income report', 'Opening the detailed income mix.')}>
                      Open income report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent className={`${styles.incomeBody} ${styles.incomeChart}`}>
              <DonutChart data={INCOME_SOURCES} size={196} thickness={26} showLegend={false}>
                <p className={styles.donutCenterLabel}>Total Income</p>
                <p className={styles.donutCenterValue}>{formatIncome(TOTAL_INCOME)}</p>
              </DonutChart>
              <div className={styles.incomeLegend}>
                <div className={styles.incomeLegendHead}>
                  <p className={styles.incomeTotalLabel}>Total Income</p>
                  <p className={styles.incomeTotalValue}>{formatIncome(TOTAL_INCOME)}</p>
                  <Badge variant="success">
                    <ArrowUpRight size={12} aria-hidden />
                    15.5% compared to last month
                  </Badge>
                </div>
                {INCOME_SOURCES.map((source, index) => (
                  <div key={source.label} className={styles.incomeLegendRow}>
                    <span className={styles.incomeLegendName}>
                      <span
                        className={styles.swatch}
                        style={{ '--chart-color': chartToken(index) } as CSSProperties}
                        aria-hidden
                      />
                      {source.label}
                    </span>
                    <span className={styles.incomeLegendAmount}>{formatIncome(source.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="expenses-heading">
          <Card className={styles.cardFill}>
            <CardHeader>
              <CardTitle id="expenses-heading">Monthly Expenses</CardTitle>
              <CardAction>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => notify('Expense report', 'Monthly expense report is ready to export.')}
                >
                  View Report
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className={styles.expensesBody}>
              <div className={styles.expensesChart}>
                <GroupedBarChart data={EXPENSE_MONTHS} series={EXPENSE_SERIES} />
                <div className={styles.chartFoot}>
                  <p className={styles.chartFootTitle}>
                    <TrendingUp size={14} aria-hidden />
                    Trending up by 5.2% this month
                  </p>
                  <p className={styles.chartFootHint}>Showing data from the last 6 months</p>
                </div>
              </div>
              <div>
                <h3 className={styles.summaryTitle}>Summary</h3>
                <div className={styles.summaryList}>
                  {EXPENSE_SUMMARY.map((item) => (
                    <div key={item.label} className={styles.summaryRow}>
                      <div className={styles.summaryMeta}>
                        <span>{item.label}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className={styles.summaryBar} aria-hidden>
                        <div className={styles.summaryFill} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className={styles.bottomRow}>
        <section aria-labelledby="transactions-heading">
          <Card className={styles.cardFill}>
            <CardHeader>
              <CardTitle id="transactions-heading">Transactions</CardTitle>
              <CardDescription>Latest income and expense activity</CardDescription>
              <CardAction>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => notify('All transactions', 'Showing the full transaction ledger.')}
                >
                  View All
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className={styles.tableWrap}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FINANCE_TRANSACTIONS.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className={styles.party}>
                          <Avatar size="sm">
                            <AvatarFallback>{row.initials}</AvatarFallback>
                          </Avatar>
                          <span className={styles.partyName}>{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Badge variant={row.type === 'Income' ? 'success' : 'secondary'}>{row.type}</Badge>
                      </TableCell>
                      <TableCell className={row.amount > 0 ? styles.amountIncome : styles.amountExpense}>
                        {formatUsd(row.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <div className={styles.stack}>
          <section aria-labelledby="saving-heading">
            <Card>
              <CardHeader>
                <CardTitle id="saving-heading">Saving Goal</CardTitle>
                <CardDescription>{SAVING_GOAL.progress}% Progress</CardDescription>
                <CardAction>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => notify('Saving report', 'Goal progress exported for this period.')}
                  >
                    View Report
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className={styles.savingBody}>
                <ProgressRing
                  value={SAVING_GOAL.progress}
                  size={132}
                  strokeWidth={10}
                  aria-label="Saving goal progress"
                >
                  <span className={styles.savingAmount}>{SAVING_GOAL.progress}%</span>
                </ProgressRing>
                <p className={styles.savingCaption}>
                  ${SAVING_GOAL.current.toLocaleString('en-US')}
                  <span className={styles.savingTarget}> of ${SAVING_GOAL.target.toLocaleString('en-US')}</span>
                </p>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="wallet-heading">
            <Card>
              <CardHeader>
                <CardTitle id="wallet-heading">My Wallet</CardTitle>
                <CardDescription>A total of {WALLET_CARDS.length} cards are listed</CardDescription>
                <CardAction>
                  <Button size="sm" variant="outline" onClick={() => setAddCardOpen(true)}>
                    <Plus size={14} aria-hidden />
                    Add New
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <ul className={styles.walletList}>
                  {WALLET_CARDS.map((card) => (
                    <li key={card.id} className={styles.walletRow}>
                      <div className={`${styles.walletCardFace} ${walletToneClass(card.tone)}`} aria-hidden>
                        <NetworkMark network={card.network} />
                      </div>
                      <div className={styles.walletMeta}>
                        <p className={styles.walletName}>{card.name}</p>
                        <p className={styles.walletNumber}>
                          {card.network === 'visa' ? '4532' : '5375'} **** **** {card.last4}
                        </p>
                      </div>
                      <p className={styles.walletBalance}>{card.balance}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="iconSm" aria-label={`${card.name} actions`}>
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => notify('Card selected', `${card.name} is now the default payment method.`)}
                          >
                            Set as default
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer funds</DialogTitle>
            <DialogDescription>Move money from your primary balance to another account.</DialogDescription>
          </DialogHeader>
          <Label htmlFor="transfer-amount">Amount</Label>
          <Input
            id="transfer-amount"
            value={transferAmount}
            onChange={(event) => setTransferAmount(event.target.value)}
            inputMode="decimal"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setTransferOpen(false);
                notify('Transfer requested', `$${transferAmount} is queued from your primary balance.`);
              }}
            >
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request payment</DialogTitle>
            <DialogDescription>Send a payment request to a contact or client.</DialogDescription>
          </DialogHeader>
          <Label htmlFor="request-amount">Amount</Label>
          <Input
            id="request-amount"
            value={requestAmount}
            onChange={(event) => setRequestAmount(event.target.value)}
            inputMode="decimal"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setRequestOpen(false);
                notify('Request sent', `Payment request for $${requestAmount} was sent.`);
              }}
            >
              Send request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a card</DialogTitle>
            <DialogDescription>Store a new wallet card for transfers and payouts.</DialogDescription>
          </DialogHeader>
          <Label htmlFor="card-name">Card name</Label>
          <Input id="card-name" value={cardName} onChange={(event) => setCardName(event.target.value)} />
          <Label htmlFor="card-last4">Last 4 digits</Label>
          <Input id="card-last4" value={cardLast4} onChange={(event) => setCardLast4(event.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCardOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAddCardOpen(false);
                notify('Card added', `${cardName} ···· ${cardLast4} was saved to your wallet.`);
              }}
            >
              Add card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
