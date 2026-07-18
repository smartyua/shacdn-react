import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Layers,
  LayoutTemplate,
  Receipt,
  ScrollText,
  Table2,
  UserRound,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../../../components/Alert/Alert';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/Dialog/Dialog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../../components/Empty/Empty';
import { Field, FieldDescription, FieldLabel } from '../../../components/Field/Field';
import { Input } from '../../../components/Input/Input';
import { Separator } from '../../../components/Separator/Separator';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/Tabs/Tabs';
import { useToastActions } from '../../../components/Toast/Toast';

import { PageHeader } from '../components/PageHeader';
import styles from '../Dashboard.module.scss';

const RECIPE_LINKS = [
  {
    title: 'Profile tabs',
    description: 'Tabs + Card + Form + Switch + InputOTP',
    path: '/dashboard/profile',
    icon: UserRound,
  },
  {
    title: 'Billing stack',
    description: 'Plan Card + Progress + Dialog + invoice Table',
    path: '/dashboard/payments',
    icon: Receipt,
  },
  {
    title: 'Audit trail',
    description: 'Toolbar filters + Table + Avatar + HoverCard',
    path: '/dashboard/audit-log',
    icon: ScrollText,
  },
  {
    title: 'Request inbox',
    description: 'Table + Empty + create Dialog + detail Drawer',
    path: '/dashboard/requests',
    icon: ClipboardList,
  },
  {
    title: 'Orders CRUD',
    description: 'Bulk select + Combobox filters + AlertDialog',
    path: '/dashboard/orders',
    icon: Table2,
  },
] as const;

export const PatternsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToastActions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  return (
    <>
      <PageHeader
        title="Patterns"
        lead="Recipes for the most common product UI cases — built only from shacdn primitives."
        meta="Composition over new components · open a live example from each card"
      />

      <section className={styles.section} aria-labelledby="patterns-recipes-heading">
        <h2 id="patterns-recipes-heading" className={styles.sectionHeading}>
          Live recipes
        </h2>
        <p className={styles.sectionLead}>
          Each card jumps to a full screen that demonstrates the pattern in a realistic flow.
        </p>

        <div className={styles.kpiGrid}>
          {RECIPE_LINKS.map((recipe) => {
            const Icon = recipe.icon;
            return (
              <Card key={recipe.path}>
                <CardHeader>
                  <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={16} aria-hidden />
                    {recipe.title}
                  </CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button type="button" variant="outline" size="sm" onClick={() => navigate(recipe.path)}>
                    Open screen
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="patterns-inline-heading">
        <h2 id="patterns-inline-heading" className={styles.sectionHeading}>
          Inline composition kit
        </h2>
        <p className={styles.sectionLead}>
          Mini demos on this page — confirm Dialog, loading Skeleton, Empty, and Alert feedback.
        </p>

        <Tabs defaultValue="confirm">
          <TabsList>
            <TabsTrigger value="confirm">Confirm</TabsTrigger>
            <TabsTrigger value="loading">Loading</TabsTrigger>
            <TabsTrigger value="empty">Empty</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="confirm">
            <Card>
              <CardHeader>
                <CardTitle>Destructive confirm</CardTitle>
                <CardDescription>
                  Button opens Dialog — prefer AlertDialog for irreversible deletes; Dialog works for soft confirms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="destructive" onClick={() => setConfirmOpen(true)}>
                  Revoke API key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loading">
            <Card>
              <CardHeader>
                <CardTitle>Loading placeholders</CardTitle>
                <CardDescription>Skeleton blocks while data fetches — keep layout stable.</CardDescription>
              </CardHeader>
              <CardContent className={styles.formGrid}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setLoadingDemo(true);
                    window.setTimeout(() => setLoadingDemo(false), 1200);
                  }}
                >
                  Simulate fetch
                </Button>
                {loadingDemo ? (
                  <>
                    <Skeleton style={{ height: '1rem', width: '40%' }} />
                    <Skeleton style={{ height: '1rem', width: '70%' }} />
                    <Skeleton style={{ height: '5rem', width: '100%' }} />
                  </>
                ) : (
                  <Alert>
                    <LayoutTemplate size={16} aria-hidden />
                    <div>
                      <AlertTitle>Ready</AlertTitle>
                      <AlertDescription>Replace skeletons with real content when the promise resolves.</AlertDescription>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empty">
            <Card>
              <CardHeader>
                <CardTitle>Empty states</CardTitle>
                <CardDescription>Empty + CTA when filters or first-run have no rows.</CardDescription>
              </CardHeader>
              <CardContent>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <Layers size={20} aria-hidden />
                    </EmptyMedia>
                    <EmptyTitle>Nothing here yet</EmptyTitle>
                    <EmptyDescription>Create your first request or clear filters.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button type="button" size="sm" onClick={() => navigate('/dashboard/requests')}>
                      Go to Requests
                    </Button>
                  </EmptyContent>
                </Empty>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Inline + toast feedback</CardTitle>
                <CardDescription>Alert for persistent page status; Toast for ephemeral actions.</CardDescription>
              </CardHeader>
              <CardContent className={styles.formGrid}>
                <Alert>
                  <div>
                    <AlertTitle>Billing email unverified</AlertTitle>
                    <AlertDescription>
                      Invoices go to alex@acme.io — verify to avoid failed renewals.
                    </AlertDescription>
                  </div>
                </Alert>
                <Field>
                  <FieldLabel htmlFor="pattern-note">Quick note</FieldLabel>
                  <Input id="pattern-note" placeholder="Optional context for the toast…" />
                  <FieldDescription>Field wraps Label + description without a full Form.</FieldDescription>
                </Field>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    onClick={() =>
                      addToast({ title: 'Saved', description: 'Toast for success after mutations.' })
                    }
                  >
                    Show success toast
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addToast({
                        title: 'Sync delayed',
                        description: 'Retrying in the background.',
                        variant: 'destructive',
                      })
                    }
                  >
                    Show error toast
                  </Button>
                  <Badge variant="secondary">Composable chips</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API key?</DialogTitle>
            <DialogDescription>
              Integrations using this key will fail until a new key is created.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                addToast({ title: 'API key revoked', variant: 'destructive' });
              }}
            >
              Revoke key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
