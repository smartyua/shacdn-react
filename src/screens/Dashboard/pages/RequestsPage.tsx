import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import { Combobox } from '../../../components/Combobox/Combobox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/Dialog/Dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../../components/Drawer/Drawer';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '../../../components/Empty/Empty';
import { Input } from '../../../components/Input/Input';
import { Label } from '../../../components/Label/Label';
import { Select } from '../../../components/Select/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/Table/Table';
import { Textarea } from '../../../components/Textarea/Textarea';
import { useToastActions } from '../../../components/Toast/Toast';

import {
  REQUEST_STATUS_LABEL,
  REQUEST_STATUS_VARIANT,
  USER_REQUESTS,
  type UserRequest,
} from '../accountData';
import { PageHeader } from '../components/PageHeader';
import styles from '../Dashboard.module.scss';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_review', label: 'In review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'done', label: 'Done' },
] as const;

const TYPE_OPTIONS = [
  { value: 'all', label: 'All types' },
  { value: 'access', label: 'Access' },
  { value: 'refund', label: 'Refund' },
  { value: 'limit', label: 'Limit' },
  { value: 'feature', label: 'Feature' },
  { value: 'support', label: 'Support' },
] as const;

export const RequestsPage = () => {
  const { addToast } = useToastActions();
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<UserRequest | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [newType, setNewType] = useState('support');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return USER_REQUESTS.filter((row) => {
      const matchesStatus = status === 'all' || row.status === status;
      const matchesType = type === 'all' || row.type === type;
      const matchesQuery =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        row.requester.toLowerCase().includes(q);
      return matchesStatus && matchesType && matchesQuery;
    });
  }, [status, type, query]);

  return (
    <>
      <PageHeader
        title="Requests"
        lead="Ticket inbox: filterable table, create Dialog, detail Drawer — classic ops composition."
        meta={`${rows.length} requests in view`}
        actions={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus size={14} aria-hidden />
            New request
          </Button>
        }
      />

      <section className={styles.section} aria-labelledby="requests-table-heading">
        <h2 id="requests-table-heading" className={styles.sectionHeading}>
          Inbox
        </h2>
        <p className={styles.sectionLead}>
          Click a row to open a side Drawer with full context and quick actions.
        </p>

        <div className={styles.tableSurface}>
          <div className={styles.tableToolbar}>
            <Input
              placeholder="Search title, ID, or requester…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search requests"
              className={styles.tableSearch}
            />
            <div className={styles.tableFilters}>
              <Combobox options={[...STATUS_OPTIONS]} value={status} onValueChange={setStatus} placeholder="Status…" />
              <Combobox options={[...TYPE_OPTIONS]} value={type} onValueChange={setType} placeholder="Type…" />
            </div>
          </div>

          {rows.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No requests match</EmptyTitle>
                <EmptyDescription>Clear filters or create a new request.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelected(row)}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={REQUEST_STATUS_VARIANT[row.status]}>
                        {REQUEST_STATUS_LABEL[row.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.priority}</TableCell>
                    <TableCell>{row.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New request</DialogTitle>
            <DialogDescription>Describe what you need — billing, access, or product.</DialogDescription>
          </DialogHeader>
          <div className={styles.formGrid}>
            <div>
              <Label htmlFor="req-title">Title</Label>
              <Input
                id="req-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short summary"
              />
            </div>
            <div>
              <Label htmlFor="req-type">Type</Label>
              <Select id="req-type" value={newType} onChange={(e) => setNewType(e.target.value)}>
                <option value="access">Access</option>
                <option value="refund">Refund</option>
                <option value="limit">Limit</option>
                <option value="feature">Feature</option>
                <option value="support">Support</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="req-summary">Details</Label>
              <Textarea
                id="req-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Context for the assignee…"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setCreateOpen(false);
                setTitle('');
                setSummary('');
                addToast({
                  title: 'Request submitted',
                  description: `${newType} ticket queued for review.`,
                });
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DrawerContent>
          {selected ? (
            <>
              <DrawerHeader>
                <DrawerTitle>{selected.title}</DrawerTitle>
                <DrawerDescription>
                  {selected.id} · {selected.requester} · submitted {selected.submittedAt}
                </DrawerDescription>
              </DrawerHeader>
              <div className={styles.formGrid} style={{ padding: '0 1.25rem 1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant={REQUEST_STATUS_VARIANT[selected.status]}>
                    {REQUEST_STATUS_LABEL[selected.status]}
                  </Badge>
                  <Badge variant="outline">{selected.type}</Badge>
                  <Badge variant="secondary">{selected.priority} priority</Badge>
                </div>
                <p style={{ margin: 0 }}>{selected.summary}</p>
                <p className={styles.panelDescription}>
                  Assignee: {selected.assignee} · Updated {selected.updatedAt}
                </p>
              </div>
              <DrawerFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addToast({ title: 'Marked in review', description: selected.id });
                    setSelected(null);
                  }}
                >
                  Mark in review
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    addToast({ title: 'Approved', description: selected.id });
                    setSelected(null);
                  }}
                >
                  Approve
                </Button>
              </DrawerFooter>
            </>
          ) : null}
        </DrawerContent>
      </Drawer>
    </>
  );
};
