import {
  PACKET_OPS,
  TOPOLOGY_EDGES,
  TOPOLOGY_LAYOUT,
  TOPOLOGY_NODE_MAP,
  type PacketOp,
  type TopologyEdge,
  type TopologyNode,
  type WorkerStatus,
} from './topologyData';

type Point = { x: number; y: number };

const laneXForWorker = (worker: TopologyNode): number =>
  worker.group === 'adbreak' ? TOPOLOGY_LAYOUT.leftLaneX : TOPOLOGY_LAYOUT.rightLaneX;

export const getEdgeEndpoints = (edge: TopologyEdge): { worker: TopologyNode; server: TopologyNode } => {
  const from = TOPOLOGY_NODE_MAP[edge.from];
  const to = TOPOLOGY_NODE_MAP[edge.to];
  return from.type === 'server' ? { server: from, worker: to } : { server: to, worker: from };
};

export const getEdgeAnchors = (edge: TopologyEdge): { start: Point; end: Point; laneX: number } => {
  const { worker, server } = getEdgeEndpoints(edge);
  const off = TOPOLOGY_LAYOUT.nodeAnchorOffset;
  const laneX = laneXForWorker(worker);
  const workerAttach =
    worker.group === 'adbreak'
      ? worker.x + TOPOLOGY_LAYOUT.workerConnectorInset
      : worker.x - TOPOLOGY_LAYOUT.workerConnectorInset;

  if (worker.group === 'adbreak') {
    return {
      laneX,
      start: { x: server.x - off, y: server.y },
      end: { x: workerAttach, y: worker.y },
    };
  }

  return {
    laneX,
    start: { x: server.x + off, y: server.y },
    end: { x: workerAttach, y: worker.y },
  };
};

const cornerRadius = (x1: number, y1: number, laneX: number, y2: number, x2: number, r: number): string => {
  const dx1 = Math.sign(laneX - x1) || 1;
  const dx2 = Math.sign(x2 - laneX) || 1;
  const dy = Math.sign(y2 - y1) || 1;
  const h1 = Math.abs(laneX - x1);
  const v = Math.abs(y2 - y1);
  const h2 = Math.abs(x2 - laneX);
  const ra = Math.min(r, h1 * 0.85, v * 0.45);
  const rb = Math.min(r, h2 * 0.85, v * 0.45);

  if (v < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;

  return [
    `M ${x1} ${y1}`,
    `L ${laneX - ra * dx1} ${y1}`,
    `Q ${laneX} ${y1} ${laneX} ${y1 + ra * dy}`,
    `L ${laneX} ${y2 - rb * dy}`,
    `Q ${laneX} ${y2} ${laneX + rb * dx2} ${y2}`,
    `L ${x2} ${y2}`,
  ].join(' ');
};

/** Hub-spoke path via dedicated vertical lane — avoids metric and label zones. */
export const laneEdgePath = (edge: TopologyEdge, r = 10): string => {
  const { start, end, laneX } = getEdgeAnchors(edge);
  return cornerRadius(start.x, start.y, laneX, end.y, end.x, r);
};

/** @deprecated Use laneEdgePath — kept for tests referencing midpoint routing. */
export const orthogonalPath = (x1: number, y1: number, x2: number, y2: number, r = 16): string => {
  if (Math.abs(y1 - y2) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  if (Math.abs(x1 - x2) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const midX = (x1 + x2) / 2;
  return cornerRadius(x1, y1, midX, y2, x2, r);
};

const pointOnHVH = (x1: number, y1: number, laneX: number, y2: number, x2: number, t: number): Point => {
  const s1 = Math.abs(laneX - x1);
  const s2 = Math.abs(y2 - y1);
  const s3 = Math.abs(x2 - laneX);
  const total = s1 + s2 + s3;
  const d = t * total;
  if (d <= s1) return { x: x1 + (laneX - x1) * (s1 === 0 ? 0 : d / s1), y: y1 };
  if (d <= s1 + s2) return { x: laneX, y: y1 + (y2 - y1) * (s2 === 0 ? 0 : (d - s1) / s2) };
  return { x: laneX + (x2 - laneX) * (s3 === 0 ? 0 : (d - s1 - s2) / s3), y: y2 };
};

export const pointOnEdge = (edge: TopologyEdge, t: number): Point => {
  const { start, end, laneX } = getEdgeAnchors(edge);
  return pointOnHVH(start.x, start.y, laneX, end.y, end.x, t);
};

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

const randOf = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export type WorkerMetrics = {
  read: number;
  write: number;
  total: number;
};

export type TopologyPacket = {
  id: number;
  edgeId: string;
  progress: number;
  speed: number;
  op: PacketOp;
  size: string;
  rate: string;
  reverse: boolean;
};

let packetId = 0;

export const spawnPacket = (
  edge: TopologyEdge,
  workerStatus: Record<string, WorkerStatus>
): TopologyPacket | null => {
  const node = TOPOLOGY_NODE_MAP[edge.to] ?? TOPOLOGY_NODE_MAP[edge.from];
  const status = node?.group ? (workerStatus[node.id] ?? 'idle') : 'busy';
  if (status === 'idle' && Math.random() < 0.7) return null;
  const op = randOf(PACKET_OPS);
  const reverse = Math.random() < 0.35;
  return {
    id: packetId++,
    edgeId: edge.id,
    progress: reverse ? 1 : 0,
    speed: rand(0.1, 0.3) * (reverse ? -1 : 1),
    op,
    size: `${rand(1, 999).toFixed(0)} KB`,
    rate: `${randOf(['0.4', '1.2', '2.8', '5.5', '11', '22', '48', '95'])} MB/s`,
    reverse,
  };
};

export const randomEdge = (): TopologyEdge => randOf(TOPOLOGY_EDGES);

export const formatSpeed = (value: number): string =>
  value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2);

export const formatTotal = (value: number): string =>
  value >= 1 ? `${value.toFixed(2)} TB` : `${(value * 1024).toFixed(1)} GB`;
