import { useMemo, useState } from 'react';

import { Avatar, AvatarFallback } from '../../../components/Avatar/Avatar';
import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import { Combobox } from '../../../components/Combobox/Combobox';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../../components/HoverCard/HoverCard';
import { Input } from '../../../components/Input/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/Table/Table';
import { useToastActions } from '../../../components/Toast/Toast';

import { AUDIT_ACTION_LABEL, AUDIT_LOG, type AuditAction } from '../accountData';
import { PageHeader } from '../components/PageHeader';
import styles from '../Dashboard.module.scss';

const ACTION_OPTIONS = [
  { value: 'all', label: 'All actions' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'login', label: 'Login' },
  { value: 'export', label: 'Export' },
  { value: 'invite', label: 'Invite' },
] as const;

const ACTION_VARIANT: Record<AuditAction, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  create: 'default',
  update: 'secondary',
  delete: 'destructive',
  login: 'outline',
  export: 'secondary',
  invite: 'default',
};

export const AuditLogPage = () => {
  const { addToast } = useToastActions();
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('all');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AUDIT_LOG.filter((entry) => {
      const matchesAction = action === 'all' || entry.action === action;
      const matchesQuery =
        !q ||
        entry.actor.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q) ||
        entry.detail.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q);
      return matchesAction && matchesQuery;
    });
  }, [query, action]);

  return (
    <>
      <PageHeader
        title="Audit log"
        lead="Immutable operation history — search, filter by action, inspect details via HoverCard."
        meta={`${rows.length} events · retention 90 days`}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addToast({ title: 'Export queued', description: 'Audit CSV for the current filters.' })
            }
          >
            Export log
          </Button>
        }
      />

      <section className={styles.section} aria-labelledby="audit-table-heading">
        <h2 id="audit-table-heading" className={styles.sectionHeading}>
          Workspace operations
        </h2>
        <p className={styles.sectionLead}>
          Combine Input + Combobox toolbar with Table rows that reveal IP and detail on hover.
        </p>

        <div className={styles.tableSurface}>
          <div className={styles.tableToolbar}>
            <Input
              placeholder="Search actor, target, or detail…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search audit log"
              className={styles.tableSearch}
            />
            <div className={styles.tableFilters}>
              <Combobox
                options={[...ACTION_OPTIONS]}
                value={action}
                onValueChange={setAction}
                placeholder="Action…"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Button type="button" variant="link" size="sm">
                          {entry.at}
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p style={{ margin: 0, fontWeight: 600 }}>{entry.id}</p>
                        <p className={styles.panelDescription}>IP {entry.ip}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Avatar size="sm">
                        <AvatarFallback>{entry.initials}</AvatarFallback>
                      </Avatar>
                      {entry.actor}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ACTION_VARIANT[entry.action]}>
                      {AUDIT_ACTION_LABEL[entry.action]}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.target}</TableCell>
                  <TableCell>
                    <span className={styles.panelDescription}>{entry.detail}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
};
