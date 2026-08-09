import { useMemo, useState } from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/AlertDialog/AlertDialog';
import { Avatar, AvatarFallback } from '../../../components/Avatar/Avatar';
import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import { Checkbox } from '../../../components/Checkbox/Checkbox';
import { Combobox } from '../../../components/Combobox/Combobox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/DropdownMenu/DropdownMenu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../components/HoverCard/HoverCard';
import { Input } from '../../../components/Input/Input';
import {
  Pagination,
  PaginationButton,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from '../../../components/Pagination/Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/Table/Table';
import { useToastActions } from '../../../components/Toast/Toast';

import { PageHeader } from '../components/PageHeader';
import { REGION_OPTIONS, STATUS_LABEL, STATUS_VARIANT, TRANSACTIONS } from '../dashboardData';
import styles from '../Dashboard.module.scss';

export const OrdersPage = () => {
  const { addToast } = useToastActions();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return TRANSACTIONS.filter((row) => {
      const matchesSearch =
        !query ||
        row.customer.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.id.toLowerCase().includes(query);
      const matchesRegion = region === 'all' || row.region === region;
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [search, region, statusFilter]);

  const allSelected =
    filteredTransactions.length > 0 && filteredTransactions.every((row) => selectedRows.has(row.id));

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(filteredTransactions.map((row) => row.id)));
  };

  return (
    <>
      <PageHeader
        title="Orders"
        lead="Search, filter, and manage payment transactions across all regions."
        meta={`${filteredTransactions.length} transactions match your current filters`}
      />

      <section className={styles.section} aria-labelledby="orders-table-heading">
        <h2 id="orders-table-heading" className={styles.sectionHeading}>
          Payment activity
        </h2>
        <p className={styles.sectionLead}>
          {selectedRows.size > 0
            ? `${selectedRows.size} transaction${selectedRows.size === 1 ? '' : 's'} selected for bulk actions`
            : 'Select rows to refund, export, or delete in bulk.'}
        </p>

        <div className={styles.tableSurface}>
          <div className={styles.tableToolbar}>
            <Input
              placeholder="Search by customer, email, or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search transactions"
              className={styles.tableSearch}
            />
            <div className={styles.tableFilters}>
              <Combobox
                options={[...REGION_OPTIONS]}
                value={region}
                onValueChange={setRegion}
                placeholder="Region…"
              />
              <Combobox
                options={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' },
                ]}
                value={statusFilter}
                onValueChange={setStatusFilter}
                placeholder="Status…"
              />
            </div>
            <div className={styles.tableActions}>
              {selectedRows.size > 0 ? (
                <Button variant="destructive" size="sm" onClick={() => setAlertDialogOpen(true)}>
                  <Trash2 size={14} aria-hidden />
                  Delete ({selectedRows.size})
                </Button>
              ) : null}
            </div>
          </div>

          <div className={styles.tableScroll}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      className={styles.rowCheckbox}
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className={styles.colHideMobile}>Date</TableHead>
                  <TableHead className={styles.colHideTablet} aria-label="Actions" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <p className={styles.emptyTableMessage}>No transactions match your filters. Try clearing search or region.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Checkbox
                          className={styles.rowCheckbox}
                          checked={selectedRows.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                          aria-label={`Select ${row.customer}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={styles.customerCell}>
                          <HoverCard>
                            <HoverCardTrigger>
                              <Avatar size="sm">
                                <AvatarFallback>{row.initials}</AvatarFallback>
                              </Avatar>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <p className={styles.hoverCardName}>{row.customer}</p>
                              <p className={styles.hoverCardEmail}>{row.email}</p>
                            </HoverCardContent>
                          </HoverCard>
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
                      <TableCell className={styles.colHideTablet}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" aria-label={`Actions for ${row.customer}`}>
                              <MoreHorizontal size={14} aria-hidden />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Send receipt</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Refund</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className={styles.paginationWrap}>
            <Pagination>
              <PaginationList>
                <PaginationItem>
                  <PaginationButton direction="previous" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationButton direction="next" />
                </PaginationItem>
              </PaginationList>
            </Pagination>
          </div>
        </div>
      </section>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent onClose={() => setAlertDialogOpen(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected transactions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {selectedRows.size} transaction record
              {selectedRows.size === 1 ? '' : 's'}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setAlertDialogOpen(false);
                setSelectedRows(new Set());
                addToast({ title: 'Deleted', description: 'Selected transactions removed.', variant: 'destructive' });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
