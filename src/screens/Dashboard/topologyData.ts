export type WorkerStatus = 'busy' | 'processing' | 'idle' | 'error';

export type NodeType = 'server' | 'adbreak' | 'transcode';

export type NodeGroup = 'adbreak' | 'transcode';

export type TopologyNode = {
  id: string;
  label: string;
  sub: string;
  type: NodeType;
  x: number;
  y: number;
  group?: NodeGroup;
};

export type TopologyEdge = {
  id: string;
  from: string;
  to: string;
};

export type PacketOpType = 'JOB' | 'RESULT' | 'CHUNK' | 'STATUS' | 'ACK' | 'RETRY';

export type PacketOp = {
  type: PacketOpType;
  tone: 'blue' | 'green' | 'amber' | 'purple' | 'cyan' | 'orange';
};

export const PACKET_OPS: PacketOp[] = [
  { type: 'JOB', tone: 'blue' },
  { type: 'RESULT', tone: 'green' },
  { type: 'CHUNK', tone: 'amber' },
  { type: 'STATUS', tone: 'purple' },
  { type: 'ACK', tone: 'cyan' },
  { type: 'RETRY', tone: 'orange' },
];

/** Icon-row centers — 126px pitch leaves ~16px between slots (110px tall). */
export const WORKER_Y_POSITIONS = [58, 184, 310, 436, 562, 688] as const;

export const WORKER_SLOT = {
  halfWidth: 58,
  halfHeight: 55,
  slotTop: -32,
  slotHeight: 110,
  titleY: 12,
  statusY: 24,
  metricsDividerY: 40,
  metricsY: 54,
  totalY: 66,
} as const;

export const WORKER_PITCH =
  WORKER_Y_POSITIONS.length > 1 ? WORKER_Y_POSITIONS[1] - WORKER_Y_POSITIONS[0] : 126;

export const WORKER_GROUP_BOUNDS = {
  top: WORKER_Y_POSITIONS[0] + WORKER_SLOT.slotTop,
  bottom: WORKER_Y_POSITIONS[WORKER_Y_POSITIONS.length - 1] + WORKER_SLOT.slotTop + WORKER_SLOT.slotHeight,
} as const;

export const TOPOLOGY_LAYOUT = {
  leftLaneX: 325,
  rightLaneX: 455,
  nodeAnchorOffset: 26,
  workerConnectorInset: 64,
  leftWorkerX: 168,
  rightWorkerX: 612,
  serverX: 390,
  serverY: 373,
  groupLabelY: 22,
  groupSurfaceY: 34,
  groupSurfacePadBottom: 12,
} as const;

export const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'server',
    label: 'Main Server',
    sub: 'Media Pipeline Hub',
    type: 'server',
    x: TOPOLOGY_LAYOUT.serverX,
    y: TOPOLOGY_LAYOUT.serverY,
  },
  ...WORKER_Y_POSITIONS.map((y, i) => ({
    id: `ab${i + 1}`,
    label: `Ad-Break #${i + 1}`,
    sub: 'ad-break',
    type: 'adbreak' as const,
    x: TOPOLOGY_LAYOUT.leftWorkerX,
    y,
    group: 'adbreak' as const,
  })),
  ...WORKER_Y_POSITIONS.map((y, i) => ({
    id: `tc${i + 1}`,
    label: `Transcode #${i + 1}`,
    sub: 'transcode',
    type: 'transcode' as const,
    x: TOPOLOGY_LAYOUT.rightWorkerX,
    y,
    group: 'transcode' as const,
  })),
];

export const TOPOLOGY_EDGES: TopologyEdge[] = [
  ...WORKER_Y_POSITIONS.map((_, i) => ({ id: `eab${i + 1}`, from: 'server', to: `ab${i + 1}` })),
  ...WORKER_Y_POSITIONS.map((_, i) => ({ id: `etc${i + 1}`, from: 'server', to: `tc${i + 1}` })),
];

export const TOPOLOGY_NODE_MAP = Object.fromEntries(TOPOLOGY_NODES.map((n) => [n.id, n])) as Record<
  string,
  TopologyNode
>;

export const STATUS_LABELS: Record<WorkerStatus, string> = {
  busy: 'Busy',
  processing: 'Processing',
  idle: 'Idle',
  error: 'Error',
};

export const STATUS_TONES: Record<WorkerStatus, 'success' | 'warning' | 'muted' | 'destructive'> = {
  busy: 'success',
  processing: 'warning',
  idle: 'muted',
  error: 'destructive',
};

export const WORKER_STATUS_POOL: WorkerStatus[] = [
  'busy',
  'busy',
  'busy',
  'processing',
  'processing',
  'idle',
];

/** ViewBox fitted to slot grid, lanes, and hub. */
export const TOPOLOGY_VIEWBOX = {
  width: 780,
  height: WORKER_GROUP_BOUNDS.bottom + 24,
} as const;

export const TOPOLOGY_GROUP_SURFACE = {
  y: TOPOLOGY_LAYOUT.groupSurfaceY,
  height: WORKER_GROUP_BOUNDS.bottom - TOPOLOGY_LAYOUT.groupSurfaceY + TOPOLOGY_LAYOUT.groupSurfacePadBottom,
} as const;
