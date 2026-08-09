import { useMemo, useState } from 'react';
import { Mail, MoreHorizontal, UserPlus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '../../../components/Avatar/Avatar';
import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/DropdownMenu/DropdownMenu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../components/HoverCard/HoverCard';
import { Input } from '../../../components/Input/Input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '../../../components/Item/Item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/Table/Table';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ToggleGroup/ToggleGroup';

import { PageHeader } from '../components/PageHeader';
import {
  CUSTOMERS,
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_STATUS_VARIANT,
  PLAN_LABEL,
  TEAM_MEMBERS,
} from '../dashboardData';
import styles from '../Dashboard.module.scss';

export const CustomersPage = () => {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CUSTOMERS.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query);
      const matchesPlan = planFilter === 'all' || customer.plan === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [search, planFilter]);

  const activeCount = CUSTOMERS.filter((c) => c.status === 'active').length;
  const totalMrr = CUSTOMERS.reduce((sum, c) => sum + parseInt(c.mrr.replace(/[^0-9]/g, ''), 10) || 0, 0);

  return (
    <>
      <PageHeader
        title="Customers"
        lead="Manage accounts, subscription plans, and workspace team access."
        meta={`${activeCount} active accounts · $${totalMrr.toLocaleString()} combined MRR`}
        actions={
          <Button size="sm">
            <UserPlus size={14} aria-hidden />
            Invite customer
          </Button>
        }
      />

      <section className={styles.section} aria-labelledby="customers-team-heading">
        <h2 id="customers-team-heading" className={styles.sectionHeading}>
          Workspace team
        </h2>
        <p className={styles.sectionLead}>Internal collaborators with admin or analyst roles.</p>
        <div className={styles.teamGrid}>
          <div className={styles.surfacePanel}>
            <AvatarGroup>
              {TEAM_MEMBERS.map((member) => (
                <Avatar key={member.initials} size="sm">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+4</AvatarGroupCount>
            </AvatarGroup>
            <Button variant="outline" size="sm" className={styles.panelAction}>
              <UserPlus size={14} aria-hidden />
              Invite teammate
            </Button>
          </div>
          <div className={styles.teamMemberList}>
            {TEAM_MEMBERS.map((member) => (
              <Item key={member.initials} className={styles.teamMemberItem}>
                <Avatar size="sm">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <ItemContent>
                  <ItemTitle>{member.name}</ItemTitle>
                  <ItemDescription>{member.role}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="customers-accounts-heading">
        <h2 id="customers-accounts-heading" className={styles.sectionHeading}>
          Customer accounts
        </h2>
        <p className={styles.sectionLead}>Filter by plan and search by name or email.</p>

        <div className={styles.tableSurface}>
          <div className={styles.tableToolbar}>
            <Input
              placeholder="Search customers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search customers"
              className={styles.tableSearch}
            />
            <ToggleGroup type="single" value={planFilter} onValueChange={(v) => { if (typeof v === 'string') setPlanFilter(v); }}>
              <ToggleGroupItem value="all" aria-label="All plans">All</ToggleGroupItem>
              <ToggleGroupItem value="free" aria-label="Free plan">Free</ToggleGroupItem>
              <ToggleGroupItem value="pro" aria-label="Pro plan">Pro</ToggleGroupItem>
              <ToggleGroupItem value="enterprise" aria-label="Enterprise plan">Enterprise</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className={styles.tableScroll}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className={styles.colHideMobile}>MRR</TableHead>
                  <TableHead className={styles.colHideTablet}>Last active</TableHead>
                  <TableHead className={styles.colHideTablet} aria-label="Actions" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className={styles.customerCell}>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Avatar size="sm">
                              <AvatarFallback>{customer.initials}</AvatarFallback>
                            </Avatar>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            <p className={styles.hoverCardName}>{customer.name}</p>
                            <p className={styles.hoverCardEmail}>{customer.email}</p>
                          </HoverCardContent>
                        </HoverCard>
                        <div className={styles.customerInfo}>
                          <div className={styles.customerName}>{customer.name}</div>
                          <div className={styles.customerId}>{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.plan === 'enterprise' ? 'default' : 'secondary'}>
                        {PLAN_LABEL[customer.plan]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={CUSTOMER_STATUS_VARIANT[customer.status]}>
                        {CUSTOMER_STATUS_LABEL[customer.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.colHideMobile}>{customer.mrr}</TableCell>
                    <TableCell className={styles.colHideTablet}>{customer.lastActive}</TableCell>
                    <TableCell className={styles.colHideTablet}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label={`Actions for ${customer.name}`}>
                            <MoreHorizontal size={14} aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail size={14} aria-hidden />
                            Send email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Upgrade plan</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
