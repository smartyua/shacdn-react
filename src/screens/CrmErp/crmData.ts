import type { LucideIcon } from 'lucide-react';
import { Building2, FileSpreadsheet, Kanban, Package, Receipt, Truck } from 'lucide-react';

export type CrmView = 'pipeline' | 'quotes' | 'orders' | 'inventory' | 'accounts' | 'finance';

export type DealStage = 'qualify' | 'proposal' | 'negotiation' | 'commit' | 'won' | 'lost';
export type QuoteStatus = 'draft' | 'sent' | 'review' | 'accepted' | 'expired';
export type OrderStatus = 'released' | 'production' | 'packed' | 'shipped' | 'invoiced' | 'hold';
export type StockHealth = 'ok' | 'watch' | 'critical';
export type CreditStatus = 'ok' | 'watch' | 'hold';
export type InvoiceStatus = 'open' | 'overdue' | 'paid' | 'disputed';
export type ActivityKind = 'call' | 'email' | 'meeting' | 'note' | 'system';
export type RecordKind = 'deal' | 'quote' | 'order' | 'account' | 'sku' | 'invoice';

export type SelectedRecord = {
  kind: RecordKind;
  id: string;
};

export type Owner = {
  id: string;
  name: string;
  initials: string;
  role: string;
};

export type Account = {
  id: string;
  name: string;
  industry: string;
  region: string;
  plant: string;
  tier: 'gold' | 'silver' | 'bronze';
  ownerId: string;
  ltmRevenue: number;
  openAr: number;
  credit: CreditStatus;
  creditLimit: number;
  paymentTerms: string;
  site: string;
  contacts: { name: string; title: string; email: string }[];
};

export type Deal = {
  id: string;
  accountId: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number;
  closeDate: string;
  ownerId: string;
  region: string;
  plant: string;
  nextAction: string;
  risk?: string;
  quoteId?: string;
};

export type QuoteLine = {
  skuId: string;
  qty: number;
  unitPrice: number;
  leadDays: number;
};

export type Quote = {
  id: string;
  number: string;
  accountId: string;
  dealId?: string;
  status: QuoteStatus;
  value: number;
  margin: number;
  validUntil: string;
  ownerId: string;
  plant: string;
  incoterms: string;
  lines: QuoteLine[];
};

export type Order = {
  id: string;
  number: string;
  accountId: string;
  quoteId?: string;
  status: OrderStatus;
  value: number;
  promised: string;
  progress: number;
  plant: string;
  ownerId: string;
};

export type Sku = {
  id: string;
  sku: string;
  name: string;
  family: string;
  onHand: number;
  allocated: number;
  safety: number;
  plant: string;
  leadDays: number;
  unit: string;
};

export type Invoice = {
  id: string;
  number: string;
  accountId: string;
  orderId?: string;
  amount: number;
  due: string;
  aging: 0 | 30 | 60 | 90;
  status: InvoiceStatus;
};

export type Activity = {
  id: string;
  recordId: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  at: string;
  status: 'complete' | 'current' | 'upcoming';
};

export type DocumentFile = {
  id: string;
  recordId: string;
  name: string;
  kind: string;
  size: string;
};

export type CrmNavItem = {
  id: CrmView;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const OWNERS: Owner[] = [
  { id: 'hanna', name: 'Hanna Lind', initials: 'HL', role: 'Strategic accounts' },
  { id: 'marek', name: 'Marek Nowak', initials: 'MN', role: 'Central EU' },
  { id: 'sofia', name: 'Sofia Alves', initials: 'SA', role: 'Ports & energy' },
  { id: 'kenji', name: 'Kenji Sato', initials: 'KS', role: 'Life science' },
];

export const PLANTS = [
  { value: 'all', label: 'All plants' },
  { value: 'hamburg', label: 'Hamburg DC' },
  { value: 'lyon', label: 'Lyon works' },
  { value: 'gdansk', label: 'Gdańsk assembly' },
] as const;

export const REGION_OPTIONS = [
  { value: 'nordics', label: 'Nordics' },
  { value: 'dach', label: 'DACH' },
  { value: 'iberia', label: 'Iberia' },
  { value: 'benelux', label: 'Benelux' },
  { value: 'cee', label: 'Central Europe' },
];

export const OWNER_OPTIONS = [
  { value: 'all', label: 'All owners' },
  ...OWNERS.map((owner) => ({ value: owner.id, label: owner.name })),
];

export const CRM_NAV: CrmNavItem[] = [
  { id: 'pipeline', label: 'Pipeline', description: 'Weighted opportunities', icon: Kanban },
  { id: 'quotes', label: 'Quotes', description: 'Commercial offers', icon: FileSpreadsheet },
  { id: 'orders', label: 'Orders', description: 'Sales order book', icon: Truck },
  { id: 'inventory', label: 'Inventory', description: 'ATP and safety stock', icon: Package },
  { id: 'accounts', label: 'Accounts', description: 'Customer 360', icon: Building2 },
  { id: 'finance', label: 'Finance', description: 'AR and collections', icon: Receipt },
];

export const DEAL_STAGE_META: Record<DealStage, { label: string; column: boolean }> = {
  qualify: { label: 'Qualify', column: true },
  proposal: { label: 'Proposal', column: true },
  negotiation: { label: 'Negotiation', column: true },
  commit: { label: 'Verbal commit', column: true },
  won: { label: 'Won', column: true },
  lost: { label: 'Lost', column: false },
};

export const BOARD_STAGES = (Object.keys(DEAL_STAGE_META) as DealStage[]).filter(
  (stage) => DEAL_STAGE_META[stage].column
);

export const ACCOUNTS: Account[] = [
  {
    id: 'nordvik',
    name: 'Nordvik Pulp AB',
    industry: 'Pulp & paper',
    region: 'nordics',
    plant: 'hamburg',
    tier: 'gold',
    ownerId: 'hanna',
    ltmRevenue: 2_140_000,
    openAr: 186_000,
    credit: 'ok',
    creditLimit: 900_000,
    paymentTerms: 'Net 45',
    site: 'Sundsvall, SE',
    contacts: [
      { name: 'Elsa Bergman', title: 'Head of capex', email: 'elsa.bergman@nordvik.example' },
      { name: 'Jonas Holm', title: 'Maintenance lead', email: 'jonas.holm@nordvik.example' },
    ],
  },
  {
    id: 'rhine',
    name: 'Rhine Chem GmbH',
    industry: 'Specialty chemicals',
    region: 'dach',
    plant: 'lyon',
    tier: 'silver',
    ownerId: 'marek',
    ltmRevenue: 640_000,
    openAr: 92_000,
    credit: 'ok',
    creditLimit: 350_000,
    paymentTerms: 'Net 30',
    site: 'Ludwigshafen, DE',
    contacts: [{ name: 'Anke Vogel', title: 'Procurement', email: 'anke.vogel@rhinechem.example' }],
  },
  {
    id: 'baltic',
    name: 'Baltic Ports Authority',
    industry: 'Ports',
    region: 'cee',
    plant: 'gdansk',
    tier: 'silver',
    ownerId: 'sofia',
    ltmRevenue: 410_000,
    openAr: 154_000,
    credit: 'watch',
    creditLimit: 250_000,
    paymentTerms: 'Net 60',
    site: 'Gdańsk, PL',
    contacts: [{ name: 'Piotr Lewandowski', title: 'Harbour engineer', email: 'piotr.l@balticports.example' }],
  },
  {
    id: 'alpine',
    name: 'Alpine Dairy AG',
    industry: 'Food',
    region: 'dach',
    plant: 'lyon',
    tier: 'gold',
    ownerId: 'hanna',
    ltmRevenue: 880_000,
    openAr: 41_000,
    credit: 'ok',
    creditLimit: 400_000,
    paymentTerms: 'Net 30',
    site: 'Innsbruck, AT',
    contacts: [{ name: 'Greta Fuchs', title: 'Plant director', email: 'greta.fuchs@alpinedairy.example' }],
  },
  {
    id: 'iberia',
    name: 'Iberia Pharma S.A.',
    industry: 'Life science',
    region: 'iberia',
    plant: 'lyon',
    tier: 'gold',
    ownerId: 'kenji',
    ltmRevenue: 1_320_000,
    openAr: 310_000,
    credit: 'hold',
    creditLimit: 500_000,
    paymentTerms: 'Net 30',
    site: 'Barcelona, ES',
    contacts: [{ name: 'Marina Costa', title: 'QA / utilities', email: 'marina.costa@iberiapharma.example' }],
  },
  {
    id: 'loire',
    name: 'Loire Distillery',
    industry: 'Food & beverage',
    region: 'benelux',
    plant: 'lyon',
    tier: 'bronze',
    ownerId: 'sofia',
    ltmRevenue: 190_000,
    openAr: 18_000,
    credit: 'ok',
    creditLimit: 120_000,
    paymentTerms: 'Net 30',
    site: 'Nantes, FR',
    contacts: [{ name: 'Luc Moreau', title: 'Operations', email: 'luc.moreau@loiredist.example' }],
  },
  {
    id: 'oslo',
    name: 'Oslo Metro Infra',
    industry: 'Infrastructure',
    region: 'nordics',
    plant: 'hamburg',
    tier: 'gold',
    ownerId: 'marek',
    ltmRevenue: 760_000,
    openAr: 0,
    credit: 'ok',
    creditLimit: 1_200_000,
    paymentTerms: 'Net 60',
    site: 'Oslo, NO',
    contacts: [{ name: 'Ingrid Dahl', title: 'Project controls', email: 'ingrid.dahl@oslometro.example' }],
  },
  {
    id: 'helvetia',
    name: 'Helvetia Labs',
    industry: 'Life science',
    region: 'dach',
    plant: 'hamburg',
    tier: 'silver',
    ownerId: 'kenji',
    ltmRevenue: 540_000,
    openAr: 67_000,
    credit: 'ok',
    creditLimit: 300_000,
    paymentTerms: 'Net 45',
    site: 'Basel, CH',
    contacts: [{ name: 'Nico Frei', title: 'Facilities', email: 'nico.frei@helvetialabs.example' }],
  },
];

export const SKUS: Sku[] = [
  {
    id: 'hx440',
    sku: 'HX-440',
    name: 'Plate pack, titanium, 440 plates',
    family: 'Heat exchangers',
    onHand: 4,
    allocated: 3,
    safety: 8,
    plant: 'hamburg',
    leadDays: 42,
    unit: 'set',
  },
  {
    id: 'pv220',
    sku: 'PV-220',
    name: 'Control valve DN150, PTFE seat',
    family: 'Valves',
    onHand: 12,
    allocated: 4,
    safety: 6,
    plant: 'lyon',
    leadDays: 18,
    unit: 'ea',
  },
  {
    id: 'pmp90',
    sku: 'PMP-90',
    name: 'Centrifugal pump 90 kW, hygienic',
    family: 'Pumps',
    onHand: 2,
    allocated: 2,
    safety: 4,
    plant: 'gdansk',
    leadDays: 28,
    unit: 'ea',
  },
  {
    id: 'gsk12',
    sku: 'GSK-12',
    name: 'Gasket kit, EPDM, HX-440',
    family: 'Spares',
    onHand: 140,
    allocated: 22,
    safety: 80,
    plant: 'hamburg',
    leadDays: 7,
    unit: 'kit',
  },
  {
    id: 'ctl881',
    sku: 'CTL-881',
    name: 'PLC rack, SIL-2 I/O',
    family: 'Controls',
    onHand: 1,
    allocated: 1,
    safety: 3,
    plant: 'lyon',
    leadDays: 35,
    unit: 'ea',
  },
  {
    id: 'ahu55',
    sku: 'AHU-55',
    name: 'Cleanroom AHU, 55 000 m³/h',
    family: 'Air handling',
    onHand: 1,
    allocated: 1,
    safety: 1,
    plant: 'hamburg',
    leadDays: 56,
    unit: 'ea',
  },
  {
    id: 'srvann',
    sku: 'SRV-ANN',
    name: 'Annual service retainer (hours)',
    family: 'Service',
    onHand: 620,
    allocated: 180,
    safety: 200,
    plant: 'lyon',
    leadDays: 0,
    unit: 'h',
  },
];

export const QUOTES: Quote[] = [
  {
    id: 'q10482',
    number: 'Q-10482',
    accountId: 'nordvik',
    dealId: 'd-nordvik',
    status: 'review',
    value: 1_840_000,
    margin: 22,
    validUntil: '2026-09-04',
    ownerId: 'hanna',
    plant: 'hamburg',
    incoterms: 'CIP Sundsvall',
    lines: [
      { skuId: 'hx440', qty: 2, unitPrice: 620_000, leadDays: 42 },
      { skuId: 'pv220', qty: 6, unitPrice: 18_400, leadDays: 18 },
      { skuId: 'ctl881', qty: 2, unitPrice: 74_000, leadDays: 35 },
      { skuId: 'gsk12', qty: 8, unitPrice: 1_150, leadDays: 7 },
    ],
  },
  {
    id: 'q10491',
    number: 'Q-10491',
    accountId: 'rhine',
    dealId: 'd-rhine',
    status: 'sent',
    value: 420_000,
    margin: 27,
    validUntil: '2026-09-18',
    ownerId: 'marek',
    plant: 'lyon',
    incoterms: 'FCA Lyon',
    lines: [
      { skuId: 'pmp90', qty: 2, unitPrice: 86_000, leadDays: 28 },
      { skuId: 'pv220', qty: 8, unitPrice: 18_400, leadDays: 18 },
      { skuId: 'srvann', qty: 120, unitPrice: 210, leadDays: 0 },
    ],
  },
  {
    id: 'q10503',
    number: 'Q-10503',
    accountId: 'alpine',
    dealId: 'd-alpine',
    status: 'accepted',
    value: 275_000,
    margin: 31,
    validUntil: '2026-08-30',
    ownerId: 'hanna',
    plant: 'lyon',
    incoterms: 'DAP Innsbruck',
    lines: [
      { skuId: 'hx440', qty: 1, unitPrice: 210_000, leadDays: 36 },
      { skuId: 'gsk12', qty: 4, unitPrice: 1_150, leadDays: 7 },
    ],
  },
  {
    id: 'q10511',
    number: 'Q-10511',
    accountId: 'iberia',
    dealId: 'd-iberia',
    status: 'sent',
    value: 1_120_000,
    margin: 19,
    validUntil: '2026-09-22',
    ownerId: 'kenji',
    plant: 'lyon',
    incoterms: 'CIP Barcelona',
    lines: [
      { skuId: 'ahu55', qty: 1, unitPrice: 780_000, leadDays: 56 },
      { skuId: 'ctl881', qty: 3, unitPrice: 74_000, leadDays: 35 },
    ],
  },
  {
    id: 'q10520',
    number: 'Q-10520',
    accountId: 'helvetia',
    dealId: 'd-helvetia',
    status: 'draft',
    value: 680_000,
    margin: 24,
    validUntil: '2026-10-02',
    ownerId: 'kenji',
    plant: 'hamburg',
    incoterms: 'CIP Basel',
    lines: [{ skuId: 'ahu55', qty: 1, unitPrice: 680_000, leadDays: 56 }],
  },
  {
    id: 'q10440',
    number: 'Q-10440',
    accountId: 'loire',
    dealId: 'd-loire',
    status: 'expired',
    value: 148_000,
    margin: 29,
    validUntil: '2026-08-12',
    ownerId: 'sofia',
    plant: 'lyon',
    incoterms: 'EXW Lyon',
    lines: [{ skuId: 'pmp90', qty: 1, unitPrice: 148_000, leadDays: 28 }],
  },
];

export const DEALS: Deal[] = [
  {
    id: 'd-nordvik',
    accountId: 'nordvik',
    title: 'Evaporator train upgrade',
    value: 1_840_000,
    stage: 'negotiation',
    probability: 65,
    closeDate: '2026-09-12',
    ownerId: 'hanna',
    region: 'nordics',
    plant: 'hamburg',
    nextAction: 'Margin review Friday',
    risk: 'HX-440 below safety stock',
    quoteId: 'q10482',
  },
  {
    id: 'd-rhine',
    accountId: 'rhine',
    title: 'CIP skid package',
    value: 420_000,
    stage: 'proposal',
    probability: 40,
    closeDate: '2026-10-03',
    ownerId: 'marek',
    region: 'dach',
    plant: 'lyon',
    nextAction: 'Walk the P&ID with Anke',
    quoteId: 'q10491',
  },
  {
    id: 'd-baltic',
    accountId: 'baltic',
    title: 'Dock pump retrofit',
    value: 910_000,
    stage: 'qualify',
    probability: 20,
    closeDate: '2026-11-20',
    ownerId: 'sofia',
    region: 'cee',
    plant: 'gdansk',
    nextAction: 'Site survey 4 Sep',
    risk: 'Open AR past 60 days',
  },
  {
    id: 'd-alpine',
    accountId: 'alpine',
    title: 'Heat-recovery loop',
    value: 275_000,
    stage: 'commit',
    probability: 80,
    closeDate: '2026-09-02',
    ownerId: 'hanna',
    region: 'dach',
    plant: 'lyon',
    nextAction: 'Convert accepted quote',
    quoteId: 'q10503',
  },
  {
    id: 'd-iberia',
    accountId: 'iberia',
    title: 'WFI loop + AHU',
    value: 1_120_000,
    stage: 'proposal',
    probability: 35,
    closeDate: '2026-10-16',
    ownerId: 'kenji',
    region: 'iberia',
    plant: 'lyon',
    nextAction: 'Credit hold — finance call',
    risk: 'Account on credit hold',
    quoteId: 'q10511',
  },
  {
    id: 'd-loire',
    accountId: 'loire',
    title: 'Mash cooler replacement',
    value: 148_000,
    stage: 'qualify',
    probability: 15,
    closeDate: '2026-12-04',
    ownerId: 'sofia',
    region: 'benelux',
    plant: 'lyon',
    nextAction: 'Re-issue expired quote',
    quoteId: 'q10440',
  },
  {
    id: 'd-oslo',
    accountId: 'oslo',
    title: 'Tunnel HVAC phase 2',
    value: 2_400_000,
    stage: 'negotiation',
    probability: 55,
    closeDate: '2026-10-28',
    ownerId: 'marek',
    region: 'nordics',
    plant: 'hamburg',
    nextAction: 'Frame agreement markup',
  },
  {
    id: 'd-helvetia',
    accountId: 'helvetia',
    title: 'Cleanroom AHU swap',
    value: 680_000,
    stage: 'commit',
    probability: 75,
    closeDate: '2026-09-19',
    ownerId: 'kenji',
    region: 'dach',
    plant: 'hamburg',
    nextAction: 'Lock FAT slot',
    quoteId: 'q10520',
  },
  {
    id: 'd-won-alpine-q2',
    accountId: 'alpine',
    title: 'Pasteuriser service year',
    value: 96_000,
    stage: 'won',
    probability: 100,
    closeDate: '2026-08-08',
    ownerId: 'hanna',
    region: 'dach',
    plant: 'lyon',
    nextAction: 'Kickoff complete',
  },
  {
    id: 'd-lost-loire',
    accountId: 'loire',
    title: 'Yeast recovery skid',
    value: 210_000,
    stage: 'lost',
    probability: 0,
    closeDate: '2026-07-22',
    ownerId: 'sofia',
    region: 'benelux',
    plant: 'lyon',
    nextAction: 'Lost to local fabricator',
  },
];

export const ORDERS: Order[] = [
  {
    id: 'so2291',
    number: 'SO-2291',
    accountId: 'alpine',
    quoteId: 'q10503',
    status: 'production',
    value: 275_000,
    promised: '2026-09-18',
    progress: 62,
    plant: 'lyon',
    ownerId: 'hanna',
  },
  {
    id: 'so2284',
    number: 'SO-2284',
    accountId: 'helvetia',
    status: 'released',
    value: 214_000,
    promised: '2026-10-02',
    progress: 18,
    plant: 'hamburg',
    ownerId: 'kenji',
  },
  {
    id: 'so2270',
    number: 'SO-2270',
    accountId: 'iberia',
    status: 'packed',
    value: 388_000,
    promised: '2026-08-29',
    progress: 91,
    plant: 'lyon',
    ownerId: 'kenji',
  },
  {
    id: 'so2261',
    number: 'SO-2261',
    accountId: 'loire',
    status: 'invoiced',
    value: 86_400,
    promised: '2026-08-14',
    progress: 100,
    plant: 'lyon',
    ownerId: 'sofia',
  },
  {
    id: 'so2255',
    number: 'SO-2255',
    accountId: 'baltic',
    status: 'hold',
    value: 162_000,
    promised: '2026-09-08',
    progress: 44,
    plant: 'gdansk',
    ownerId: 'sofia',
  },
  {
    id: 'so2240',
    number: 'SO-2240',
    accountId: 'nordvik',
    status: 'shipped',
    value: 128_000,
    promised: '2026-08-22',
    progress: 100,
    plant: 'hamburg',
    ownerId: 'hanna',
  },
];

export const INVOICES: Invoice[] = [
  { id: 'inv901', number: 'INV-4901', accountId: 'nordvik', orderId: 'so2240', amount: 128_000, due: '2026-09-06', aging: 0, status: 'open' },
  { id: 'inv882', number: 'INV-4882', accountId: 'baltic', orderId: 'so2255', amount: 81_000, due: '2026-07-12', aging: 60, status: 'overdue' },
  { id: 'inv874', number: 'INV-4874', accountId: 'iberia', orderId: 'so2270', amount: 194_000, due: '2026-08-01', aging: 30, status: 'overdue' },
  { id: 'inv860', number: 'INV-4860', accountId: 'helvetia', amount: 67_000, due: '2026-08-20', aging: 0, status: 'open' },
  { id: 'inv841', number: 'INV-4841', accountId: 'rhine', amount: 48_200, due: '2026-06-30', aging: 90, status: 'disputed' },
  { id: 'inv830', number: 'INV-4830', accountId: 'alpine', orderId: 'so2261', amount: 41_000, due: '2026-08-10', aging: 0, status: 'paid' },
  { id: 'inv812', number: 'INV-4812', accountId: 'loire', amount: 18_000, due: '2026-08-18', aging: 0, status: 'open' },
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    recordId: 'd-nordvik',
    kind: 'meeting',
    title: 'Commercial desk review',
    detail: 'Hanna + controller walked 22% margin vs 18% floor. Pending VP sign-off.',
    at: 'Today · 09:40',
    status: 'current',
  },
  {
    id: 'a2',
    recordId: 'd-nordvik',
    kind: 'email',
    title: 'Revised evaporator duty sent',
    detail: 'Elsa confirmed 2 × HX-440 and asked for CIP-compatible gaskets.',
    at: 'Yesterday',
    status: 'complete',
  },
  {
    id: 'a3',
    recordId: 'd-nordvik',
    kind: 'system',
    title: 'ATP warning',
    detail: 'Allocated 3 of 4 HX-440; safety cover is 8. Lyon can borrow 1 pack in week 38.',
    at: 'Mon',
    status: 'complete',
  },
  {
    id: 'a4',
    recordId: 'd-nordvik',
    kind: 'call',
    title: 'Follow-up with Jonas Holm',
    detail: 'Shutdown window locked to week 42. Need FAT protocol attached.',
    at: 'Thu 10:00',
    status: 'upcoming',
  },
  {
    id: 'a5',
    recordId: 'so2291',
    kind: 'system',
    title: 'Welding bay booked',
    detail: 'Frame 2 in Lyon works. Hydrotest scheduled 8 Sep.',
    at: 'Today · 08:15',
    status: 'current',
  },
  {
    id: 'a6',
    recordId: 'so2291',
    kind: 'note',
    title: 'Customer punch list',
    detail: 'Greta asked for 3.1 certificates on all wetted parts.',
    at: 'Yesterday',
    status: 'complete',
  },
  {
    id: 'a7',
    recordId: 'nordvik',
    kind: 'meeting',
    title: 'Q3 business review',
    detail: 'Pipeline + service attach. They want a 24-month spare agreement.',
    at: '12 Aug',
    status: 'complete',
  },
];

export const DOCUMENTS: DocumentFile[] = [
  { id: 'doc1', recordId: 'd-nordvik', name: 'Q-10482_revC.pdf', kind: 'Quote', size: '1.8 MB' },
  { id: 'doc2', recordId: 'd-nordvik', name: 'Duty_sheet_evap.xlsx', kind: 'Engineering', size: '240 KB' },
  { id: 'doc3', recordId: 'd-nordvik', name: 'FAT_protocol_draft.docx', kind: 'Quality', size: '88 KB' },
  { id: 'doc4', recordId: 'so2291', name: 'SO-2291_ack.pdf', kind: 'Order', size: '420 KB' },
  { id: 'doc5', recordId: 'so2291', name: 'Weld_map_Lyon.pdf', kind: 'Production', size: '3.1 MB' },
];

export const BOOKINGS_CHART = [
  { label: 'Mar', value: 1.1 },
  { label: 'Apr', value: 0.86 },
  { label: 'May', value: 1.42 },
  { label: 'Jun', value: 0.94 },
  { label: 'Jul', value: 1.68 },
  { label: 'Aug', value: 1.21 },
];

export const NEXT_STAGE: Partial<Record<DealStage, DealStage>> = {
  qualify: 'proposal',
  proposal: 'negotiation',
  negotiation: 'commit',
  commit: 'won',
};

export const formatEur = (value: number): string =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

export const formatCompactEur = (value: number): string =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const getOwner = (id: string): Owner => OWNERS.find((owner) => owner.id === id) ?? OWNERS[0];

export const getAccount = (id: string): Account => ACCOUNTS.find((account) => account.id === id) ?? ACCOUNTS[0];

export const getSku = (id: string): Sku | undefined => SKUS.find((sku) => sku.id === id);

export const getPlantLabel = (id: string): string => PLANTS.find((plant) => plant.value === id)?.label ?? id;

export const getRegionLabel = (id: string): string =>
  REGION_OPTIONS.find((region) => region.value === id)?.label ?? id;

export const skuHealth = (sku: Sku): StockHealth => {
  const available = sku.onHand - sku.allocated;
  if (available <= 0 || sku.onHand < sku.safety * 0.4) return 'critical';
  if (sku.onHand < sku.safety) return 'watch';
  return 'ok';
};

export const skuAvailable = (sku: Sku): number => sku.onHand - sku.allocated;

export const quoteStatusLabel: Record<QuoteStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  review: 'In review',
  accepted: 'Accepted',
  expired: 'Expired',
};

export const orderStatusLabel: Record<OrderStatus, string> = {
  released: 'Released',
  production: 'In production',
  packed: 'Packed',
  shipped: 'Shipped',
  invoiced: 'Invoiced',
  hold: 'On hold',
};

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  open: 'Open',
  overdue: 'Overdue',
  paid: 'Paid',
  disputed: 'Disputed',
};

export const creditLabel: Record<CreditStatus, string> = {
  ok: 'Credit OK',
  watch: 'Watch',
  hold: 'Hold',
};

export const computeKpis = (deals: Deal[], orders: Order[], invoices: Invoice[]) => {
  const openDeals = deals.filter((deal) => deal.stage !== 'won' && deal.stage !== 'lost');
  const weighted = openDeals.reduce((sum, deal) => sum + deal.value * (deal.probability / 100), 0);
  const won = deals.filter((deal) => deal.stage === 'won');
  const closed = deals.filter((deal) => deal.stage === 'won' || deal.stage === 'lost');
  const winRate = closed.length === 0 ? 0 : Math.round((won.length / closed.length) * 100);
  const openPos = orders.filter((order) => order.status !== 'invoiced').length;
  const overdue = invoices.filter((invoice) => invoice.status === 'overdue' || invoice.status === 'disputed');
  const overdueSum = overdue.reduce((sum, invoice) => sum + invoice.amount, 0);
  const criticalSkus = SKUS.filter((sku) => skuHealth(sku) === 'critical').length;
  return {
    pipeline: weighted,
    openDeals: openDeals.length,
    winRate,
    openPos,
    overdueSum,
    overdueCount: overdue.length,
    criticalSkus,
  };
};

export const viewLabel = (view: CrmView): string => CRM_NAV.find((item) => item.id === view)?.label ?? view;

export const defaultSelectionForView = (view: CrmView): SelectedRecord => {
  switch (view) {
    case 'pipeline':
      return { kind: 'deal', id: 'd-nordvik' };
    case 'quotes':
      return { kind: 'quote', id: 'q10482' };
    case 'orders':
      return { kind: 'order', id: 'so2291' };
    case 'inventory':
      return { kind: 'sku', id: 'hx440' };
    case 'accounts':
      return { kind: 'account', id: 'nordvik' };
    case 'finance':
      return { kind: 'invoice', id: 'inv882' };
  }
};

export type DealFilters = {
  search: string;
  ownerId: string;
  regions: string[];
  plant: string;
  closeAfter?: Date;
};

export const matchesDealFilters = (deal: Deal, filters: DealFilters): boolean => {
  const query = filters.search.trim().toLowerCase();
  const account = getAccount(deal.accountId);
  const matchesSearch =
    !query ||
    deal.title.toLowerCase().includes(query) ||
    account.name.toLowerCase().includes(query) ||
    deal.id.toLowerCase().includes(query);
  const matchesOwner = filters.ownerId === 'all' || deal.ownerId === filters.ownerId;
  const matchesRegion = filters.regions.length === 0 || filters.regions.includes(deal.region);
  const matchesPlant = filters.plant === 'all' || deal.plant === filters.plant;
  const closeFloor = filters.closeAfter
    ? new Date(filters.closeAfter.getFullYear(), filters.closeAfter.getMonth(), filters.closeAfter.getDate()).getTime()
    : null;
  const matchesClose = closeFloor === null || new Date(deal.closeDate).getTime() >= closeFloor;
  return matchesSearch && matchesOwner && matchesRegion && matchesPlant && matchesClose;
};
