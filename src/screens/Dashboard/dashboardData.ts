import {
  Activity,
  BarChart3,
  CreditCard,
  Network,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const BASE_TITLE = 'shacdn';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export type Transaction = {
  id: string;
  customer: string;
  initials: string;
  email: string;
  amount: string;
  status: TransactionStatus;
  date: string;
  region: string;
};

export type Customer = {
  id: string;
  name: string;
  initials: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  mrr: string;
  lastActive: string;
  status: 'active' | 'invited' | 'churned';
};

export const TRANSACTIONS: Transaction[] = [
  { id: 'TX-4821', customer: 'Sarah Chen', initials: 'SC', email: 'sarah@acme.io', amount: '$2,450.00', status: 'completed', date: 'Jul 12, 2026', region: 'us-east' },
  { id: 'TX-4820', customer: 'Marcus Webb', initials: 'MW', email: 'marcus@nova.dev', amount: '$890.50', status: 'pending', date: 'Jul 12, 2026', region: 'us-west' },
  { id: 'TX-4819', customer: 'Elena Rossi', initials: 'ER', email: 'elena@studio.it', amount: '$1,200.00', status: 'completed', date: 'Jul 11, 2026', region: 'eu-central' },
  { id: 'TX-4818', customer: 'James Park', initials: 'JP', email: 'james@labs.co', amount: '$340.00', status: 'failed', date: 'Jul 11, 2026', region: 'ap-south' },
  { id: 'TX-4817', customer: 'Aisha Patel', initials: 'AP', email: 'aisha@flow.app', amount: '$5,670.25', status: 'completed', date: 'Jul 10, 2026', region: 'us-east' },
  { id: 'TX-4816', customer: 'Tom Becker', initials: 'TB', email: 'tom@stack.dev', amount: '$128.99', status: 'pending', date: 'Jul 10, 2026', region: 'eu-central' },
  { id: 'TX-4815', customer: 'Nina Ortiz', initials: 'NO', email: 'nina@craft.co', amount: '$2,100.00', status: 'completed', date: 'Jul 9, 2026', region: 'us-west' },
  { id: 'TX-4814', customer: 'Leo Fischer', initials: 'LF', email: 'leo@berlin.de', amount: '$760.00', status: 'completed', date: 'Jul 9, 2026', region: 'eu-central' },
];

export const CUSTOMERS: Customer[] = [
  { id: 'CU-101', name: 'Sarah Chen', initials: 'SC', email: 'sarah@acme.io', plan: 'enterprise', mrr: '$890', lastActive: '2 hours ago', status: 'active' },
  { id: 'CU-102', name: 'Marcus Webb', initials: 'MW', email: 'marcus@nova.dev', plan: 'pro', mrr: '$49', lastActive: 'Today', status: 'active' },
  { id: 'CU-103', name: 'Elena Rossi', initials: 'ER', email: 'elena@studio.it', plan: 'pro', mrr: '$49', lastActive: 'Yesterday', status: 'active' },
  { id: 'CU-104', name: 'James Park', initials: 'JP', email: 'james@labs.co', plan: 'free', mrr: '$0', lastActive: '3 days ago', status: 'active' },
  { id: 'CU-105', name: 'Aisha Patel', initials: 'AP', email: 'aisha@flow.app', plan: 'enterprise', mrr: '$1,200', lastActive: '1 hour ago', status: 'active' },
  { id: 'CU-106', name: 'Tom Becker', initials: 'TB', email: 'tom@stack.dev', plan: 'pro', mrr: '$49', lastActive: 'Jul 8', status: 'invited' },
  { id: 'CU-107', name: 'Nina Ortiz', initials: 'NO', email: 'nina@craft.co', plan: 'pro', mrr: '$49', lastActive: 'Jul 5', status: 'churned' },
];

export const REVENUE_DATA = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5100 },
  { label: 'Mar', value: 4800 },
  { label: 'Apr', value: 6200 },
  { label: 'May', value: 5800 },
  { label: 'Jun', value: 7100 },
  { label: 'Jul', value: 6450 },
] as const;

export const CONVERSION_DATA = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 67 },
  { label: 'Fri', value: 73 },
  { label: 'Sat', value: 38 },
  { label: 'Sun', value: 29 },
] as const;

export const REGION_OPTIONS = [
  { value: 'all', label: 'All regions' },
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'eu-central', label: 'EU Central' },
  { value: 'ap-south', label: 'AP South' },
] as const;

export type KpiCard = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  progress: number;
  icon: LucideIcon;
  description: string;
  target: string;
};

export const KPI_CARDS: KpiCard[] = [
  {
    title: 'Total Revenue',
    value: '$48,352',
    change: '+12.5%',
    trend: 'up',
    progress: 78,
    icon: CreditCard,
    description: 'Gross sales from completed orders, net of refunds',
    target: '78% of $62k monthly goal',
  },
  {
    title: 'Active Users',
    value: '2,847',
    change: '+8.2%',
    trend: 'up',
    progress: 65,
    icon: Users,
    description: 'Unique accounts with at least one session this period',
    target: '142 new signups this week',
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '-0.4%',
    trend: 'down',
    progress: 42,
    icon: TrendingUp,
    description: 'Checkout completions divided by unique store visits',
    target: 'Target: 3.5% by end of quarter',
  },
  {
    title: 'Avg. Order Value',
    value: '$186',
    change: '+2.1%',
    trend: 'up',
    progress: 55,
    icon: BarChart3,
    description: 'Mean transaction amount across all completed orders',
    target: 'Up from $182 last period',
  },
];

export const ACTIVITY_MESSAGES = [
  { id: 'a1', author: 'System', initials: 'SY', body: 'Backup completed successfully.', time: '10:02 AM', isUser: false },
  { id: 'a2', author: 'You', initials: 'YO', body: 'Exported Q2 analytics report.', time: '10:15 AM', isUser: true },
  { id: 'a3', author: 'Alex Kim', initials: 'AK', body: 'New team member invited — review pending.', time: '10:28 AM', isUser: false },
  { id: 'a4', author: 'You', initials: 'YO', body: 'Updated billing threshold to $5,000.', time: '10:41 AM', isUser: true },
  { id: 'a5', author: 'System', initials: 'SY', body: 'SSL certificate renewed automatically.', time: '11:00 AM', isUser: false },
  { id: 'a6', author: 'Sarah Chen', initials: 'SC', body: 'Enterprise renewal signed — $24k ARR added.', time: '11:18 AM', isUser: false },
];

export type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Payment received',
    description: 'Invoice #4821 paid by Sarah Chen — $2,450.00',
    time: '2m ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'New signup',
    description: 'Marcus Webb joined your workspace from nova.dev',
    time: '18m ago',
    read: false,
  },
  {
    id: 'n3',
    title: 'Alert threshold',
    description: 'API usage reached 80% of the 500k monthly quota',
    time: '1h ago',
    read: true,
  },
  {
    id: 'n4',
    title: 'Report ready',
    description: 'Q2 Revenue Summary is available for download',
    time: '3h ago',
    read: true,
  },
];

export const HIGHLIGHTS = [
  { value: 'Revenue up 12%', detail: 'Month-over-month growth driven by enterprise renewals' },
  { value: '142 new signups', detail: 'Organic acquisition from the July product launch' },
  { value: '99.9% uptime', detail: 'Zero P1 incidents across all regions in 30 days' },
] as const;

export const ENGAGEMENT_METRICS = [
  { label: 'Sessions', value: '18,420', change: '+6.3%' },
  { label: 'Pages / session', value: '4.2', change: '+0.4' },
  { label: 'Returning users', value: '61%', change: '+2.1%' },
] as const;

export const STATUS_VARIANT: Record<TransactionStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  completed: 'secondary',
  pending: 'outline',
  failed: 'destructive',
};

export const STATUS_LABEL: Record<TransactionStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
};

export const CUSTOMER_STATUS_VARIANT: Record<Customer['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  active: 'secondary',
  invited: 'outline',
  churned: 'destructive',
};

export const CUSTOMER_STATUS_LABEL: Record<Customer['status'], string> = {
  active: 'Active',
  invited: 'Invited',
  churned: 'Churned',
};

export const PLAN_LABEL: Record<Customer['plan'], string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

export const TEAM_MEMBERS = [
  { initials: 'SC', name: 'Sarah Chen', role: 'Owner' },
  { initials: 'MW', name: 'Marcus Webb', role: 'Analyst' },
  { initials: 'ER', name: 'Elena Rossi', role: 'Support' },
  { initials: 'AK', name: 'Alex Kim', role: 'Engineer' },
];

export const ANALYTICS_FUNNEL = [
  { label: 'Store visits', value: 100 },
  { label: 'Product views', value: 72 },
  { label: 'Add to cart', value: 38 },
  { label: 'Checkout started', value: 22 },
  { label: 'Completed purchase', value: 12 },
];

export type TrafficHealth = 'healthy' | 'degraded' | 'incident';

export type TrafficFlowNode = {
  id: string;
  label: string;
  subtitle: string;
  throughput: string;
  latency: string;
  status: TrafficHealth;
  statusLabel: string;
};

export type TrafficRegionStat = {
  region: string;
  code: string;
  requests: string;
  share: number;
  latency: string;
  status: TrafficHealth;
  statusLabel: string;
};

export type TrafficSourceStat = {
  source: string;
  protocol: string;
  requests: string;
  share: number;
  errorRate: string;
};

export type TrafficEndpointStat = {
  path: string;
  method: string;
  rps: string;
  p95: string;
  errors: string;
  status: TrafficHealth;
  statusLabel: string;
};

export type TrafficIncident = {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'critical';
  region: string;
  started: string;
  status: 'active' | 'resolved';
};

export const TRAFFIC_METRICS = [
  {
    title: 'Total Requests',
    value: '4.82M',
    change: '+14.2%',
    trend: 'up' as const,
    progress: 82,
    icon: Activity,
    description: 'HTTP requests served across all edge regions',
    target: 'Peak: 18.4k req/s at 14:32 UTC',
  },
  {
    title: 'Throughput',
    value: '12.4 Gbps',
    change: '+6.8%',
    trend: 'up' as const,
    progress: 71,
    icon: Network,
    description: 'Aggregate egress bandwidth at the CDN edge',
    target: '84% of 15 Gbps capacity ceiling',
  },
  {
    title: 'P95 Latency',
    value: '142 ms',
    change: '-8 ms',
    trend: 'up' as const,
    progress: 68,
    icon: BarChart3,
    description: '95th percentile end-to-end response time',
    target: 'Target SLA: under 200 ms',
  },
  {
    title: 'Error Rate',
    value: '0.18%',
    change: '+0.03%',
    trend: 'down' as const,
    progress: 12,
    icon: TrendingUp,
    description: '5xx and gateway timeout responses',
    target: 'Budget: 0.25% monthly allowance',
  },
];

export const TRAFFIC_FLOW_NODES: TrafficFlowNode[] = [
  {
    id: 'users',
    label: 'Users & Regions',
    subtitle: '4 active PoPs',
    throughput: '4.82M req',
    latency: '—',
    status: 'healthy',
    statusLabel: 'Healthy',
  },
  {
    id: 'edge',
    label: 'Edge / CDN',
    subtitle: 'Cloudflare + Fastly',
    throughput: '4.71M req',
    latency: '18 ms',
    status: 'healthy',
    statusLabel: 'Healthy',
  },
  {
    id: 'lb',
    label: 'Load Balancer',
    subtitle: 'API Gateway',
    throughput: '3.94M req',
    latency: '34 ms',
    status: 'healthy',
    statusLabel: 'Healthy',
  },
  {
    id: 'services',
    label: 'App Services',
    subtitle: '12 pods · us-east-1',
    throughput: '2.18M req',
    latency: '56 ms',
    status: 'healthy',
    statusLabel: 'Healthy',
  },
  {
    id: 'cache',
    label: 'Redis Cache',
    subtitle: 'Session + object',
    throughput: '1.42M hits',
    latency: '2 ms',
    status: 'healthy',
    statusLabel: 'Healthy',
  },
  {
    id: 'database',
    label: 'PostgreSQL',
    subtitle: 'Primary + 2 replicas',
    throughput: '284k queries',
    latency: '12 ms',
    status: 'degraded',
    statusLabel: 'Degraded',
  },
];

export const TRAFFIC_REGIONS: TrafficRegionStat[] = [
  { region: 'US East', code: 'us-east', requests: '1.84M', share: 38, latency: '118 ms', status: 'healthy', statusLabel: 'Healthy' },
  { region: 'EU Central', code: 'eu-central', requests: '1.21M', share: 25, latency: '134 ms', status: 'healthy', statusLabel: 'Healthy' },
  { region: 'US West', code: 'us-west', requests: '980k', share: 20, latency: '126 ms', status: 'healthy', statusLabel: 'Healthy' },
  { region: 'AP South', code: 'ap-south', requests: '620k', share: 13, latency: '198 ms', status: 'degraded', statusLabel: 'Degraded' },
  { region: 'SA East', code: 'sa-east', requests: '196k', share: 4, latency: '212 ms', status: 'healthy', statusLabel: 'Healthy' },
];

export const TRAFFIC_SOURCES: TrafficSourceStat[] = [
  { source: 'Web app', protocol: 'HTTPS', requests: '2.41M', share: 50, errorRate: '0.12%' },
  { source: 'Mobile API', protocol: 'HTTPS', requests: '1.38M', share: 29, errorRate: '0.21%' },
  { source: 'Partner webhooks', protocol: 'HTTPS', requests: '620k', share: 13, errorRate: '0.08%' },
  { source: 'Internal jobs', protocol: 'gRPC', requests: '410k', share: 8, errorRate: '0.31%' },
];

export const TRAFFIC_ENDPOINTS: TrafficEndpointStat[] = [
  { path: '/api/v1/orders', method: 'GET', rps: '1,240', p95: '89 ms', errors: '0.04%', status: 'healthy', statusLabel: 'Healthy' },
  { path: '/api/v1/checkout', method: 'POST', rps: '680', p95: '142 ms', errors: '0.18%', status: 'healthy', statusLabel: 'Healthy' },
  { path: '/api/v1/search', method: 'GET', rps: '2,100', p95: '210 ms', errors: '0.42%', status: 'degraded', statusLabel: 'Degraded' },
  { path: '/api/v1/auth/token', method: 'POST', rps: '420', p95: '64 ms', errors: '0.02%', status: 'healthy', statusLabel: 'Healthy' },
  { path: '/health', method: 'GET', rps: '180', p95: '8 ms', errors: '0.00%', status: 'healthy', statusLabel: 'Healthy' },
];

export const TRAFFIC_INCIDENTS: TrafficIncident[] = [
  {
    id: 'inc-1',
    title: 'Elevated search latency in AP South',
    severity: 'warning',
    region: 'ap-south',
    started: 'Jul 13, 09:42 UTC',
    status: 'active',
  },
  {
    id: 'inc-2',
    title: 'PostgreSQL replica lag above 2s',
    severity: 'warning',
    region: 'us-east',
    started: 'Jul 13, 08:15 UTC',
    status: 'active',
  },
  {
    id: 'inc-3',
    title: 'CDN cache purge completed',
    severity: 'info',
    region: 'global',
    started: 'Jul 12, 22:00 UTC',
    status: 'resolved',
  },
];

export const TRAFFIC_HEALTH_VARIANT: Record<TrafficHealth, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  healthy: 'secondary',
  degraded: 'outline',
  incident: 'destructive',
};
