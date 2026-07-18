import { useMemo, useState } from 'react';
import { CreditCard, Download, Plus } from 'lucide-react';

import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/Card/Card';
import { Combobox } from '../../../components/Combobox/Combobox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/Dialog/Dialog';
import { Input } from '../../../components/Input/Input';
import { Label } from '../../../components/Label/Label';
import { Progress } from '../../../components/Progress/Progress';
import { Separator } from '../../../components/Separator/Separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/Table/Table';
import { useToastActions } from '../../../components/Toast/Toast';

import {
  INVOICE_STATUS_VARIANT,
  INVOICES,
  PAYMENT_METHODS,
  type InvoiceStatus,
} from '../accountData';
import { PageHeader } from '../components/PageHeader';
import styles from '../Dashboard.module.scss';

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'open', label: 'Open' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
] as const;

export const PaymentsPage = () => {
  const { addToast } = useToastActions();
  const [status, setStatus] = useState('all');
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [methods, setMethods] = useState(PAYMENT_METHODS);

  const invoices = useMemo(() => {
    if (status === 'all') return INVOICES;
    return INVOICES.filter((row) => row.status === status);
  }, [status]);

  const setDefaultMethod = (id: string) => {
    const next = methods.find((method) => method.id === id);
    setMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
    if (next) {
      addToast({
        title: 'Default updated',
        description: `${next.brand} ···· ${next.last4} is now the default.`,
      });
    }
  };

  return (
    <>
      <PageHeader
        title="Payments"
        lead="Plan card + methods + filterable invoice table — typical billing composition."
        meta="Pro plan · renews Aug 1, 2026 · $49/mo"
        actions={
          <Button type="button" variant="outline" onClick={() => addToast({ title: 'Portal opened', description: 'Stripe customer portal (demo).' })}>
            Manage subscription
          </Button>
        }
      />

      <section className={styles.section} aria-labelledby="payments-plan-heading">
        <div className={styles.kpiGrid}>
          <Card>
            <CardHeader>
              <CardTitle id="payments-plan-heading">Current plan</CardTitle>
              <CardDescription>Usage resets with each billing cycle.</CardDescription>
            </CardHeader>
            <CardContent className={styles.formGrid}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p className={styles.metricTileLabel}>Pro</p>
                <Badge>Active</Badge>
              </div>
              <p className={styles.panelDescription}>$49 / month · unlimited reports · 10 seats</p>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className={styles.panelDescription}>Seats used</span>
                  <span className={styles.panelDescription}>7 / 10</span>
                </div>
                <Progress value={70} />
              </div>
            </CardContent>
            <CardFooter style={{ gap: '0.5rem' }}>
              <Button type="button" size="sm">Upgrade</Button>
              <Button type="button" size="sm" variant="ghost">Compare plans</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment methods</CardTitle>
              <CardDescription>Card + Badge + Dialog for add-method flow.</CardDescription>
            </CardHeader>
            <CardContent className={styles.paymentMethods}>
              {methods.map((method) => (
                <div key={method.id} className={styles.paymentMethodItem}>
                  <div className={styles.paymentMethodTile}>
                    <p className={styles.paymentMethodBrand}>{method.brand}</p>
                    <p className={styles.paymentMethodNumber}>
                      <CreditCard size={14} className={styles.paymentMethodIcon} aria-hidden />
                      <span>.... {method.last4}</span>
                    </p>
                    <p className={styles.panelDescription}>Expires {method.exp}</p>
                  </div>
                  {method.isDefault ? (
                    <Badge variant="secondary">Default</Badge>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setDefaultMethod(method.id)}
                    >
                      Make default
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddCardOpen(true)}>
                <Plus size={14} aria-hidden />
                Add card
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="invoices-heading">
        <h2 id="invoices-heading" className={styles.sectionHeading}>
          Invoices
        </h2>
        <p className={styles.sectionLead}>
          Toolbar filters + Table + row actions — same recipe as Orders, scoped to billing.
        </p>

        <div className={styles.tableSurface}>
          <div className={styles.tableToolbar}>
            <Combobox
              options={[...STATUS_FILTERS]}
              value={status}
              onValueChange={setStatus}
              placeholder="Status…"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addToast({ title: 'Export started', description: 'Invoice CSV will download shortly.' })}
            >
              <Download size={14} aria-hidden />
              Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>{invoice.method}</TableCell>
                  <TableCell>
                    <Badge variant={INVOICE_STATUS_VARIANT[invoice.status as InvoiceStatus]}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>{invoice.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
            <DialogDescription>Demo form — card details stay in this dialog only.</DialogDescription>
          </DialogHeader>
          <div className={styles.formGrid}>
            <div>
              <Label htmlFor="card-number">Card number</Label>
              <Input id="card-number" placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <Label htmlFor="card-exp">Expiry</Label>
                <Input id="card-exp" placeholder="MM/YY" autoComplete="cc-exp" />
              </div>
              <div>
                <Label htmlFor="card-cvc">CVC</Label>
                <Input id="card-cvc" placeholder="123" autoComplete="cc-csc" />
              </div>
            </div>
          </div>
          <Separator />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddCardOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setAddCardOpen(false);
                addToast({ title: 'Card added', description: 'Visa ···· 4242 is ready for renewals.' });
              }}
            >
              Save card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
