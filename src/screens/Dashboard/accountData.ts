export type InvoiceStatus = 'paid' | 'open' | 'failed' | 'refunded';

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: InvoiceStatus;
  method: string;
};

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp: string;
  isDefault: boolean;
};

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'export' | 'invite';

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  initials: string;
  action: AuditAction;
  target: string;
  ip: string;
  detail: string;
};

export type RequestStatus = 'open' | 'in_review' | 'approved' | 'rejected' | 'done';
export type RequestType = 'access' | 'refund' | 'limit' | 'feature' | 'support';

export type UserRequest = {
  id: string;
  title: string;
  type: RequestType;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high';
  submittedAt: string;
  updatedAt: string;
  requester: string;
  assignee: string;
  summary: string;
};

export const PROFILE_USER = {
  name: 'Alex Morgan',
  email: 'alex@acme.io',
  role: 'Workspace admin',
  initials: 'AM',
  title: 'Head of Product',
  timezone: 'Europe/Berlin',
  joined: 'Mar 12, 2024',
  locale: 'en-US',
  phone: '+49 30 1234 5678',
} as const;

export const INVOICES: Invoice[] = [
  { id: 'INV-2048', date: 'Jul 1, 2026', description: 'Pro plan · July', amount: '$49.00', status: 'paid', method: 'Visa ···· 4242' },
  { id: 'INV-2041', date: 'Jun 1, 2026', description: 'Pro plan · June', amount: '$49.00', status: 'paid', method: 'Visa ···· 4242' },
  { id: 'INV-2033', date: 'May 1, 2026', description: 'Pro plan · May', amount: '$49.00', status: 'paid', method: 'Visa ···· 4242' },
  { id: 'INV-2028', date: 'Apr 18, 2026', description: 'Seat add-on ×2', amount: '$18.00', status: 'paid', method: 'Visa ···· 4242' },
  { id: 'INV-2019', date: 'Apr 1, 2026', description: 'Pro plan · April', amount: '$49.00', status: 'refunded', method: 'Visa ···· 4242' },
  { id: 'INV-2012', date: 'Mar 1, 2026', description: 'Pro plan · March', amount: '$49.00', status: 'failed', method: 'Mastercard ···· 4444' },
  { id: 'INV-2005', date: 'Feb 1, 2026', description: 'Pro plan · February', amount: '$49.00', status: 'open', method: 'Visa ···· 4242' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm_1', brand: 'Visa', last4: '4242', exp: '08/28', isDefault: true },
  { id: 'pm_2', brand: 'Mastercard', last4: '4444', exp: '01/27', isDefault: false },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id: 'AUD-901', at: 'Jul 18, 2026 · 13:42', actor: 'Alex Morgan', initials: 'AM', action: 'update', target: 'Workspace settings', ip: '89.12.44.10', detail: 'Changed billing email' },
  { id: 'AUD-900', at: 'Jul 18, 2026 · 11:05', actor: 'Alex Morgan', initials: 'AM', action: 'export', target: 'Orders CSV', ip: '89.12.44.10', detail: 'Exported 128 rows' },
  { id: 'AUD-899', at: 'Jul 17, 2026 · 19:21', actor: 'Sarah Chen', initials: 'SC', action: 'invite', target: 'marcus@nova.dev', ip: '54.1.22.9', detail: 'Invited as Editor' },
  { id: 'AUD-898', at: 'Jul 17, 2026 · 16:03', actor: 'System', initials: 'SY', action: 'create', target: 'Invoice INV-2048', ip: '—', detail: 'Auto-generated renewal' },
  { id: 'AUD-897', at: 'Jul 16, 2026 · 09:48', actor: 'Alex Morgan', initials: 'AM', action: 'login', target: 'Dashboard', ip: '89.12.44.10', detail: 'SSO via Google' },
  { id: 'AUD-896', at: 'Jul 15, 2026 · 22:10', actor: 'Elena Rossi', initials: 'ER', action: 'delete', target: 'Report draft #44', ip: '91.200.1.4', detail: 'Removed unused draft' },
  { id: 'AUD-895', at: 'Jul 15, 2026 · 14:33', actor: 'Alex Morgan', initials: 'AM', action: 'update', target: 'API token', ip: '89.12.44.10', detail: 'Rotated production key' },
  { id: 'AUD-894', at: 'Jul 14, 2026 · 08:01', actor: 'Marcus Webb', initials: 'MW', action: 'create', target: 'Request REQ-312', ip: '18.44.2.11', detail: 'Submitted refund request' },
];

export const USER_REQUESTS: UserRequest[] = [
  {
    id: 'REQ-318',
    title: 'Increase export limit to 50k rows',
    type: 'limit',
    status: 'in_review',
    priority: 'high',
    submittedAt: 'Jul 18, 2026',
    updatedAt: '2h ago',
    requester: 'Alex Morgan',
    assignee: 'Support',
    summary: 'Need larger CSV exports for quarterly finance reconciliation.',
  },
  {
    id: 'REQ-312',
    title: 'Refund failed charge INV-2012',
    type: 'refund',
    status: 'open',
    priority: 'medium',
    submittedAt: 'Jul 14, 2026',
    updatedAt: '1d ago',
    requester: 'Marcus Webb',
    assignee: 'Billing',
    summary: 'Card declined but seat was still provisioned for 3 days.',
  },
  {
    id: 'REQ-301',
    title: 'SSO for contractors domain',
    type: 'access',
    status: 'approved',
    priority: 'medium',
    submittedAt: 'Jul 8, 2026',
    updatedAt: 'Jul 10',
    requester: 'Sarah Chen',
    assignee: 'Security',
    summary: 'Allow @contractors.acme.io via Okta.',
  },
  {
    id: 'REQ-288',
    title: 'Dark mode for reports PDF',
    type: 'feature',
    status: 'done',
    priority: 'low',
    submittedAt: 'Jun 22, 2026',
    updatedAt: 'Jul 2',
    requester: 'Elena Rossi',
    assignee: 'Product',
    summary: 'Optional dark theme when exporting brand kits.',
  },
  {
    id: 'REQ-275',
    title: 'Cannot access Topology page',
    type: 'support',
    status: 'rejected',
    priority: 'high',
    submittedAt: 'Jun 12, 2026',
    updatedAt: 'Jun 13',
    requester: 'James Park',
    assignee: 'Support',
    summary: 'Free plan does not include topology — upgrade required.',
  },
];

export const INVOICE_STATUS_VARIANT: Record<InvoiceStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  paid: 'default',
  open: 'secondary',
  failed: 'destructive',
  refunded: 'outline',
};

export const REQUEST_STATUS_VARIANT: Record<RequestStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  open: 'secondary',
  in_review: 'default',
  approved: 'default',
  rejected: 'destructive',
  done: 'outline',
};

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  open: 'Open',
  in_review: 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
  done: 'Done',
};

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  login: 'Login',
  export: 'Export',
  invite: 'Invite',
};
