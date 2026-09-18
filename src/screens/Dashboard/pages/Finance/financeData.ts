export type FinanceKpiTone = 'success' | 'info' | 'warning' | 'caution';

export type FinanceKpi = {
  id: string;
  label: string;
  value: string;
  change: string;
  hint: string;
  tone: FinanceKpiTone;
  sparkline?: number[];
};

export type IncomeSource = {
  label: string;
  value: number;
};

export type ExpenseMonth = {
  label: string;
  values: {
    food: number;
    shopping: number;
  };
};

export type ExpenseCategory = {
  label: string;
  percent: number;
};

export type FinanceTransactionType = 'Income' | 'Expenses';

export type FinanceTransaction = {
  id: string;
  name: string;
  initials: string;
  date: string;
  type: FinanceTransactionType;
  amount: number;
};

export type WalletNetwork = 'mastercard' | 'visa';

export type WalletCardTone = 'dark' | 'muted' | 'accent' | 'primary';

export type WalletCard = {
  id: string;
  name: string;
  last4: string;
  network: WalletNetwork;
  balance: string;
  tone: WalletCardTone;
};

export const FINANCE_RANGE_START = new Date(2026, 7, 22);
export const FINANCE_RANGE_END = new Date(2026, 8, 18);

export const FINANCE_KPIS: FinanceKpi[] = [
  {
    id: 'balance',
    label: 'My Balance',
    value: '$125,430',
    change: '12.5%',
    hint: 'compared to last month',
    tone: 'success',
    sparkline: [42, 48, 45, 52, 49, 61, 58, 64, 70, 68, 76, 82],
  },
  {
    id: 'profit',
    label: 'Net Profit',
    value: '$38,700',
    change: '8.5%',
    hint: 'compared to last month',
    tone: 'info',
  },
  {
    id: 'expenses',
    label: 'Expenses',
    value: '$26,450',
    change: '5.5%',
    hint: 'compared to last month',
    tone: 'warning',
  },
  {
    id: 'invoices',
    label: 'Pending Invoices',
    value: '$3,200',
    change: '3 overdue invoices',
    hint: '',
    tone: 'caution',
  },
];

export const INCOME_SOURCES: IncomeSource[] = [
  { label: 'Rental', value: 35000 },
  { label: 'Investments', value: 28000 },
  { label: 'Business', value: 18000 },
  { label: 'Freelance', value: 11000 },
];

export const TOTAL_INCOME = INCOME_SOURCES.reduce((sum, item) => sum + item.value, 0);

export const EXPENSE_MONTHS: ExpenseMonth[] = [
  { label: 'Jan', values: { food: 4200, shopping: 1600 } },
  { label: 'Feb', values: { food: 3800, shopping: 2100 } },
  { label: 'Mar', values: { food: 5100, shopping: 1800 } },
  { label: 'Apr', values: { food: 4600, shopping: 2400 } },
  { label: 'May', values: { food: 3900, shopping: 1700 } },
  { label: 'Jun', values: { food: 5400, shopping: 2200 } },
];

export const EXPENSE_SERIES = [
  { key: 'food', label: 'Food' },
  { key: 'shopping', label: 'Shopping' },
];

export const EXPENSE_SUMMARY: ExpenseCategory[] = [
  { label: 'Food & Drink', percent: 48 },
  { label: 'Grocery', percent: 32 },
  { label: 'Shopping', percent: 13 },
  { label: 'Transport', percent: 7 },
];

export const FINANCE_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'tx-1',
    name: 'Samantha William',
    initials: 'SW',
    date: '30 April 2024, 10:15 AM',
    type: 'Income',
    amount: 1640.26,
  },
  {
    id: 'tx-2',
    name: 'Grocery at Shop',
    initials: 'GS',
    date: '29 April 2024, 6:45 PM',
    type: 'Expenses',
    amount: -72.64,
  },
  {
    id: 'tx-3',
    name: 'Coffee',
    initials: 'CF',
    date: '21 April 2024, 8:30 AM',
    type: 'Expenses',
    amount: -8.65,
  },
  {
    id: 'tx-4',
    name: 'Karen Smith',
    initials: 'KS',
    date: '10 April 2024, 3:50 PM',
    type: 'Income',
    amount: 842.5,
  },
  {
    id: 'tx-5',
    name: 'Transportation',
    initials: 'TR',
    date: '2 April 2024, 5:20 PM',
    type: 'Expenses',
    amount: -18.52,
  },
  {
    id: 'tx-6',
    name: 'Online Course Purchase',
    initials: 'OC',
    date: '12 March 2024, 2:10 PM',
    type: 'Expenses',
    amount: -120,
  },
  {
    id: 'tx-7',
    name: 'Freelance Project Payment',
    initials: 'FP',
    date: '5 March 2024, 11:00 AM',
    type: 'Income',
    amount: 980.75,
  },
];

export const SAVING_GOAL = {
  current: 1052.98,
  target: 1200,
  progress: 75,
};

export const WALLET_CARDS: WalletCard[] = [
  {
    id: 'card-1',
    name: 'Credit Card',
    last4: '2368',
    network: 'mastercard',
    balance: '$5,325.57',
    tone: 'dark',
  },
  {
    id: 'card-2',
    name: 'Digital Card',
    last4: '1847',
    network: 'mastercard',
    balance: '$10,892.43',
    tone: 'muted',
  },
  {
    id: 'card-3',
    name: 'Premium Card',
    last4: '9876',
    network: 'visa',
    balance: '$2,156.89',
    tone: 'accent',
  },
  {
    id: 'card-4',
    name: 'Business Card',
    last4: '5432',
    network: 'visa',
    balance: '$15,743.21',
    tone: 'primary',
  },
];

export const formatUsd = (value: number): string => {
  const absolute = Math.abs(value);
  const formatted = absolute.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
};
