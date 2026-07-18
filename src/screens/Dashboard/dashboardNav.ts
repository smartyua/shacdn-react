import {
  Activity,
  BarChart3,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LayoutTemplate,
  LineChart,
  Network,
  Receipt,
  ScrollText,
  Settings,
  UserRound,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type DashboardNavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export type DashboardNavGroup = {
  label: string;
  items: DashboardNavItem[];
};

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    label: 'Main',
    items: [
      {
        path: '/dashboard/overview',
        label: 'Overview',
        icon: LayoutDashboard,
        description: 'KPIs, revenue trends, and recent activity',
      },
      {
        path: '/dashboard/patterns',
        label: 'Patterns',
        icon: LayoutTemplate,
        description: 'Common composition recipes for product UI',
      },
    ],
  },
  {
    label: 'Commerce',
    items: [
      {
        path: '/dashboard/orders',
        label: 'Orders',
        icon: CreditCard,
        description: 'Transactions, refunds, and payment status',
      },
      {
        path: '/dashboard/customers',
        label: 'Customers',
        icon: Users,
        description: 'Accounts, plans, and team access',
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        path: '/dashboard/profile',
        label: 'Profile',
        icon: UserRound,
        description: 'Identity, security, and notification prefs',
      },
      {
        path: '/dashboard/payments',
        label: 'Payments',
        icon: Receipt,
        description: 'Plan, methods, and invoice history',
      },
      {
        path: '/dashboard/audit-log',
        label: 'Audit log',
        icon: ScrollText,
        description: 'Security and workspace operation history',
      },
      {
        path: '/dashboard/requests',
        label: 'Requests',
        icon: ClipboardList,
        description: 'Access, refunds, limits, and support tickets',
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        path: '/dashboard/analytics',
        label: 'Analytics',
        icon: BarChart3,
        description: 'Engagement, funnels, and traffic quality',
      },
      {
        path: '/dashboard/traffic',
        label: 'Traffic',
        icon: Network,
        description: 'Request flow, edge routing, and service health',
      },
      {
        path: '/dashboard/topology',
        label: 'Network topology',
        icon: Workflow,
        description: 'Pipeline hub, worker nodes, and live packet flow',
      },
      {
        path: '/dashboard/reports',
        label: 'Reports',
        icon: LineChart,
        description: 'Scheduled exports and attachments',
      },
    ],
  },
  {
    label: 'Communication',
    items: [
      {
        path: '/dashboard/activity',
        label: 'Activity',
        icon: Activity,
        description: 'Team feed, messages, and notifications',
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        path: '/dashboard/settings',
        label: 'Settings',
        icon: Settings,
        description: 'Workspace preferences and security',
      },
    ],
  },
];

export const DASHBOARD_NAV_ITEMS = DASHBOARD_NAV_GROUPS.flatMap((group) => group.items);

export const getDashboardNavItem = (pathname: string): DashboardNavItem | undefined =>
  DASHBOARD_NAV_ITEMS.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
