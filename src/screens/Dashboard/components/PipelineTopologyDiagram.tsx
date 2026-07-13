import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

import {
  PACKET_OPS,
  STATUS_LABELS,
  STATUS_TONES,
  TOPOLOGY_EDGES,
  TOPOLOGY_LAYOUT,
  TOPOLOGY_NODES,
  TOPOLOGY_GROUP_SURFACE,
  TOPOLOGY_VIEWBOX,
  WORKER_SLOT,
  WORKER_Y_POSITIONS,
  type TopologyNode,
  type WorkerStatus,
} from '../topologyData';
import {
  formatSpeed,
  formatTotal,
  laneEdgePath,
  pointOnEdge,
  randomEdge,
  spawnPacket,
  type TopologyPacket,
  type WorkerMetrics,
} from '../topologyUtils';
import styles from '../TopologyPage.module.scss';
import dashStyles from '../Dashboard.module.scss';
import { TopologyFlowStrip } from './TopologyFlowStrip';
import { TopologyNodeIcon } from './TopologyNodeIcon';
import {
  getFlowStatusLabel,
  motionOverrideActive,
  resolveFlowMotion,
  type FlowMotionPreference,
} from '../topologyMotion';

const PACKET_TONE_CLASS: Record<string, string> = {
  blue: styles.topologyPacketToneBlue,
  green: styles.topologyPacketToneGreen,
  amber: styles.topologyPacketToneAmber,
  purple: styles.topologyPacketTonePurple,
  cyan: styles.topologyPacketToneCyan,
  orange: styles.topologyPacketToneOrange,
};

const STATUS_DOT_CLASS: Record<string, string> = {
  success: styles.topologyStatusDotSuccess,
  warning: styles.topologyStatusDotWarning,
  muted: styles.topologyStatusDotMuted,
  destructive: styles.topologyStatusDotDestructive,
};

const STATUS_SUB_CLASS: Record<string, string> = {
  success: styles.topologyNodeSubSuccess,
  warning: styles.topologyNodeSubWarning,
  muted: styles.topologyNodeSubMuted,
  destructive: styles.topologyNodeSubDestructive,
};

const MOBILE_STATUS_CLASS: Record<string, string> = {
  success: styles.topologyMobileStatusSuccess,
  warning: styles.topologyMobileStatusWarning,
  muted: styles.topologyMobileStatusMuted,
  destructive: styles.topologyMobileStatusDestructive,
};

const MOBILE_DOT_CLASS: Record<string, string> = {
  success: styles.topologyMobileDotSuccess,
  warning: styles.topologyMobileDotWarning,
  muted: styles.topologyMobileDotMuted,
  destructive: styles.topologyMobileDotDestructive,
};

const LEGEND_SWATCH_CLASS: Record<string, string> = {
  blue: styles.topologyLegendSwatchBlue,
  green: styles.topologyLegendSwatchGreen,
  amber: styles.topologyLegendSwatchAmber,
  purple: styles.topologyLegendSwatchPurple,
  cyan: styles.topologyLegendSwatchCyan,
  orange: styles.topologyLegendSwatchOrange,
};

const WORKER_IDS = TOPOLOGY_NODES.filter((n) => n.group).map((n) => n.id);

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

const randOf = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
};

export type PipelineTopologyDiagramProps = {
  running: boolean;
  motionPreference: FlowMotionPreference;
  totalPackets: number;
  onTotalPacketsChange: (updater: (prev: number) => number) => void;
};

type WorkerSlotMetricsProps = {
  metrics: WorkerMetrics;
  group: 'adbreak' | 'transcode';
};

const WorkerSlotMetrics = ({ metrics, group }: WorkerSlotMetricsProps) => {
  const totalClass =
    group === 'adbreak' ? styles.topologyMetricsTotalValueAdbreak : styles.topologyMetricsTotalValueTranscode;

  return (
    <g aria-hidden>
      <text
        x={-WORKER_SLOT.halfWidth + 10}
        y={WORKER_SLOT.metricsY}
        className={`${styles.topologySlotMetric} ${styles.topologyMetricsLabelRead}`}
      >
        R {formatSpeed(metrics.read)}
      </text>
      <text
        x={WORKER_SLOT.halfWidth - 10}
        y={WORKER_SLOT.metricsY}
        textAnchor="end"
        className={`${styles.topologySlotMetric} ${styles.topologyMetricsLabelWrite}`}
      >
        W {formatSpeed(metrics.write)}
      </text>
      <text
        x={-WORKER_SLOT.halfWidth + 10}
        y={WORKER_SLOT.totalY}
        className={styles.topologySlotTotalLabel}
      >
        Today
      </text>
      <text
        x={WORKER_SLOT.halfWidth - 10}
        y={WORKER_SLOT.totalY}
        textAnchor="end"
        className={`${styles.topologySlotTotalValue} ${totalClass}`}
      >
        {formatTotal(metrics.total)}
      </text>
    </g>
  );
};

type StatusPillProps = {
  status: WorkerStatus;
  tone: 'success' | 'warning' | 'muted' | 'destructive';
};

const STATUS_PILL_CLASS: Record<string, string> = {
  success: styles.topologyStatusPillSuccess,
  warning: styles.topologyStatusPillWarning,
  muted: styles.topologyStatusPillMuted,
  destructive: styles.topologyStatusPillDestructive,
};

const StatusPill = ({ status, tone }: StatusPillProps) => {
  const label = STATUS_LABELS[status];
  const approxW = label.length * 4.6 + 12;

  return (
    <g transform={`translate(0,${WORKER_SLOT.statusY})`}>
      <rect
        x={-approxW / 2}
        y={-7}
        width={approxW}
        height={9}
        rx="3"
        className={`${styles.topologyStatusPill} ${STATUS_PILL_CLASS[tone]}`}
      />
      <text y={0} textAnchor="middle" className={`${styles.topologyNodeSub} ${STATUS_SUB_CLASS[tone]}`}>
        {label}
      </text>
    </g>
  );
};

type GroupLabelProps = {
  x: number;
  label: string;
  tone: 'adbreak' | 'transcode' | 'server';
};

const GroupLabel = ({ x, label, tone }: GroupLabelProps) => {
  const approxW = label.length * 5.5 + 14;
  const toneClass =
    tone === 'adbreak'
      ? styles.topologyGroupLabelAdbreak
      : tone === 'transcode'
        ? styles.topologyGroupLabelTranscode
        : styles.topologyGroupLabelServer;

  return (
    <g transform={`translate(${x},${TOPOLOGY_LAYOUT.groupLabelY})`}>
      <rect
        x={-approxW / 2}
        y={-10}
        width={approxW}
        height={12}
        rx="3"
        className={styles.topologyGroupLabelPlate}
      />
      <text y={0} textAnchor="middle" className={`${styles.topologyGroupLabel} ${toneClass}`}>
        {label}
      </text>
    </g>
  );
};

type NodeLabelBackplateProps = {
  y: number;
  text: string;
  className: string;
  compact?: boolean;
};

const NodeLabelBackplate = ({ y, text, className, compact }: NodeLabelBackplateProps) => {
  const approxW = text.length * (compact ? 4.4 : 4.8) + 10;
  return (
    <g>
      <rect
        x={-approxW / 2}
        y={y - 8}
        width={approxW}
        height={10}
        rx="3"
        className={styles.topologyNodeLabelPlate}
      />
      <text y={y} textAnchor="middle" className={className}>
        {text}
      </text>
    </g>
  );
};

export const PipelineTopologyDiagram = ({
  running,
  motionPreference,
  totalPackets,
  onTotalPacketsChange,
}: PipelineTopologyDiagramProps) => {
  const systemReducedMotion = usePrefersReducedMotion();
  const { linesEnabled, packetsEnabled } = resolveFlowMotion(motionPreference, systemReducedMotion);
  const linesAnimating = linesEnabled && running;
  const packetsAnimating = packetsEnabled && running;
  const iconReducedMotion = !packetsAnimating;
  const flowStatusLabel = getFlowStatusLabel(
    motionPreference,
    systemReducedMotion,
    running,
    linesEnabled
  );
  const [packets, setPackets] = useState<TopologyPacket[]>([]);
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [focusNode, setFocusNode] = useState<string | null>(null);
  const [wStatus, setWStatus] = useState<Record<string, WorkerStatus>>(() => {
    const s: Record<string, WorkerStatus> = {};
    WORKER_IDS.forEach((id) => {
      s[id] = randOf(['busy', 'busy', 'busy', 'processing', 'processing', 'idle']);
    });
    return s;
  });
  const [wMetrics, setWMetrics] = useState<Record<string, WorkerMetrics>>(() => {
    const m: Record<string, WorkerMetrics> = {};
    WORKER_IDS.forEach((id) => {
      m[id] = { read: rand(2, 48), write: rand(1, 28), total: rand(0.08, 9.4) };
    });
    return m;
  });

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const spawnRef = useRef(0);
  const pktsRef = useRef<TopologyPacket[]>([]);
  const runRef = useRef(running);
  const wStatusRef = useRef(wStatus);

  const onTotalPacketsChangeRef = useRef(onTotalPacketsChange);

  useEffect(() => {
    onTotalPacketsChangeRef.current = onTotalPacketsChange;
  }, [onTotalPacketsChange]);

  useEffect(() => {
    runRef.current = running;
  }, [running]);

  useEffect(() => {
    wStatusRef.current = wStatus;
  }, [wStatus]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setWStatus((prev) => {
        const next = { ...prev };
        WORKER_IDS.forEach((workerId) => {
          if (Math.random() < 0.2) {
            next[workerId] = randOf(['busy', 'busy', 'busy', 'processing', 'processing', 'idle']);
          }
        });
        return next;
      });
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setWMetrics((prev) => {
        const next = { ...prev };
        WORKER_IDS.forEach((workerId) => {
          const m = prev[workerId];
          const st = wStatusRef.current[workerId] ?? 'idle';
          const factor = st === 'idle' ? 0.08 : st === 'busy' ? 1.0 : 0.45;
          next[workerId] = {
            read: Math.max(0.1, m.read + rand(-4, 4) * factor),
            write: Math.max(0.1, m.write + rand(-2.5, 2.5) * factor),
            total: m.total + rand(0.0008, 0.006) * factor,
          };
        });
        return next;
      });
    }, 1300);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!packetsEnabled) {
      pktsRef.current = [];
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastRef.current = null;
      return;
    }

    const tick = (ts: number) => {
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;

      if (runRef.current) {
        pktsRef.current = pktsRef.current
          .map((p) => ({ ...p, progress: p.progress + p.speed * dt }))
          .filter((p) => (p.reverse ? p.progress > -0.05 : p.progress < 1.05));

        spawnRef.current += dt;
        if (spawnRef.current > 0.18) {
          spawnRef.current = 0;
          const count = Math.random() < 0.5 ? 2 : 1;
          for (let i = 0; i < count; i += 1) {
            if (pktsRef.current.length < 60) {
              const edge = randomEdge();
              const pkt = spawnPacket(edge, wStatusRef.current);
              if (pkt) {
                pktsRef.current.push(pkt);
                onTotalPacketsChangeRef.current((t) => t + 1);
              }
            }
          }
        }
        setPackets([...pktsRef.current]);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [packetsEnabled]);

  const visiblePackets = useMemo(
    () => (packetsAnimating ? packets : []),
    [packetsAnimating, packets]
  );

  const activeEdgeSet = useMemo(() => {
    const s = new Set<string>();
    visiblePackets.forEach((p) => s.add(p.edgeId));
    return s;
  }, [visiblePackets]);

  const selectedNodeId = focusNode ?? hoverNode;
  const selectedNode = selectedNodeId ? TOPOLOGY_NODES.find((n) => n.id === selectedNodeId) : null;

  const hoverFlows = useMemo(() => {
    if (!selectedNodeId) return [];
    return visiblePackets.filter((p) => {
      const e = TOPOLOGY_EDGES.find((edge) => edge.id === p.edgeId);
      return e && (e.from === selectedNodeId || e.to === selectedNodeId);
    });
  }, [visiblePackets, selectedNodeId]);

  const busyAdbreak = Object.entries(wStatus).filter(([k, v]) => k.startsWith('ab') && v !== 'idle').length;
  const busyTranscode = Object.entries(wStatus).filter(([k, v]) => k.startsWith('tc') && v !== 'idle').length;

  const handleNodeKeyDown = (node: TopologyNode, e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFocusNode((prev) => (prev === node.id ? null : node.id));
    }
    if (e.key === 'Escape') {
      setFocusNode(null);
    }
  };

  return (
    <div className={styles.topologySection}>
      <div className={styles.topologyStats} aria-live="polite">
        <div className={styles.topologyStat}>
          <p className={styles.topologyStatLabel}>Ad-break active</p>
          <p className={styles.topologyStatValue} data-tone="adbreak">
            {busyAdbreak} / {WORKER_Y_POSITIONS.length}
          </p>
        </div>
        <div className={styles.topologyStat}>
          <p className={styles.topologyStatLabel}>Transcode active</p>
          <p className={styles.topologyStatValue} data-tone="transcode">
            {busyTranscode} / {WORKER_Y_POSITIONS.length}
          </p>
        </div>
        <div className={styles.topologyStat}>
          <p className={styles.topologyStatLabel}>Packets</p>
          <p className={styles.topologyStatValue} data-tone="packets">
            {totalPackets.toLocaleString()}
          </p>
        </div>
        <div className={styles.topologyStat}>
          <p className={styles.topologyStatLabel}>In flight</p>
          <p className={styles.topologyStatValue} data-tone="inflight">
            {visiblePackets.length}
          </p>
        </div>
        <span className={styles.topologyLiveIndicator}>
          <span
            className={`${styles.topologyLiveDot} ${!linesAnimating ? styles.topologyLiveDotPaused : ''}`}
            aria-hidden
          />
          {flowStatusLabel}
        </span>
      </div>

      <div
        className={styles.topologyCanvasWrap}
        data-motion-override={motionOverrideActive(motionPreference) ? 'on' : 'off'}
        data-flow-paused={running ? 'false' : 'true'}
        data-flow-lines={linesEnabled ? 'on' : 'off'}
      >
        <div className={styles.topologyMobile} role="region" aria-label="Pipeline topology (compact view)">
          <TopologyFlowStrip linesActive={linesEnabled} />
          <div className={`${styles.topologyMobileHub} ${dashStyles.surfacePanel}`}>
            <TopologyNodeIcon type="server" size={32} busy={false} reducedMotion={iconReducedMotion} />
            <div>
              <p className={styles.topologyMobileHubTitle}>Main Server</p>
              <p className={styles.topologyMobileHubSub}>Media Pipeline Hub</p>
            </div>
            <span className={styles.topologyMobileHubFlows}>
              {visiblePackets.length} in flight
            </span>
          </div>

          <div className={styles.topologyMobileGroups}>
            {(['adbreak', 'transcode'] as const).map((group) => (
              <div key={group} className={styles.topologyMobileGroup}>
                <h3
                  className={
                    group === 'adbreak' ? styles.topologyMobileGroupTitleAdbreak : styles.topologyMobileGroupTitleTranscode
                  }
                >
                  {group === 'adbreak' ? 'Ad-break workers' : 'Transcode workers'}
                </h3>
                <ul className={styles.topologyMobileWorkerList}>
                  {TOPOLOGY_NODES.filter((n) => n.group === group).map((node) => {
                    const st = wStatus[node.id];
                    const tone = STATUS_TONES[st];
                    const metrics = wMetrics[node.id];
                    const flows = visiblePackets.filter((p) => {
                      const e = TOPOLOGY_EDGES.find((edge) => edge.id === p.edgeId);
                      return e && (e.from === node.id || e.to === node.id);
                    }).length;

                    return (
                      <li key={node.id}>
                        <button
                          type="button"
                          className={`${styles.topologyMobileWorkerCard} ${dashStyles.surfacePanel} ${selectedNodeId === node.id ? styles.topologyMobileWorkerCardSelected : ''}`}
                          onClick={() => setFocusNode((prev) => (prev === node.id ? null : node.id))}
                          aria-pressed={selectedNodeId === node.id}
                        >
                          <span className={`${styles.topologyMobileWorkerDot} ${MOBILE_DOT_CLASS[tone]}`} aria-hidden />
                          <span className={styles.topologyMobileWorkerName}>{node.label}</span>
                          <span className={`${styles.topologyMobileWorkerStatusPill} ${MOBILE_STATUS_CLASS[tone]}`}>
                            {STATUS_LABELS[st]}
                          </span>
                          {metrics ? (
                            <div className={styles.topologyMobileWorkerMetricsRow}>
                              <span className={styles.topologyMobileMetricRead}>
                                R {formatSpeed(metrics.read)}
                              </span>
                              <span className={styles.topologyMobileMetricWrite}>
                                W {formatSpeed(metrics.write)}
                              </span>
                            </div>
                          ) : null}
                          {metrics ? (
                            <div className={styles.topologyMobileWorkerTotalRow}>
                              <span className={styles.topologyMobileTotalLabel}>Today</span>
                              <span className={styles.topologyMobileTotalValue}>
                                {formatTotal(metrics.total)}
                              </span>
                            </div>
                          ) : null}
                          {flows > 0 ? (
                            <span className={styles.topologyMobileWorkerFlows}>{flows} flows</span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.topologyScroll} role="region" aria-label="Pipeline topology diagram">
          <svg
            className={styles.topologySvg}
            viewBox={`0 0 ${TOPOLOGY_VIEWBOX.width} ${TOPOLOGY_VIEWBOX.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <rect
              x="0"
              y="0"
              width={TOPOLOGY_VIEWBOX.width}
              height={TOPOLOGY_VIEWBOX.height}
              className={styles.topologySvgBg}
            />

            <rect
              x="20"
              y={TOPOLOGY_GROUP_SURFACE.y}
              width="190"
              height={TOPOLOGY_GROUP_SURFACE.height}
              rx="10"
              className={styles.topologyGroupSurfaceAdbreak}
            />
            <rect
              x="570"
              y={TOPOLOGY_GROUP_SURFACE.y}
              width="190"
              height={TOPOLOGY_GROUP_SURFACE.height}
              rx="10"
              className={styles.topologyGroupSurfaceTranscode}
            />

            <GroupLabel x={TOPOLOGY_LAYOUT.leftWorkerX} label="Ad-break workers" tone="adbreak" />
            <GroupLabel x={TOPOLOGY_LAYOUT.serverX} label="Main server" tone="server" />
            <GroupLabel x={TOPOLOGY_LAYOUT.rightWorkerX} label="Transcode workers" tone="transcode" />

            {TOPOLOGY_EDGES.map((edge) => {
              const b = TOPOLOGY_NODES.find((n) => n.id === edge.to);
              if (!b) return null;
              const active = activeEdgeSet.has(edge.id) || (!packetsAnimating && wStatus[edge.to] !== 'idle');
              const d = laneEdgePath(edge);
              const isLeft = b.group === 'adbreak';
              const edgeBase = isLeft ? styles.topologyEdgeAdbreak : styles.topologyEdgeTranscode;
              const edgeActive = isLeft ? styles.topologyEdgeActiveAdbreak : styles.topologyEdgeActiveTranscode;
              const flowTone = isLeft ? styles.topologyEdgeFlowAdbreak : styles.topologyEdgeFlowTranscode;

              return (
                <g key={edge.id}>
                  <path
                    d={d}
                    fill="none"
                    className={`${styles.topologyEdge} ${styles.topologyEdgeTrack} ${edgeBase} ${active ? edgeActive : ''}`}
                    strokeWidth={active ? 1.5 : 1.15}
                    strokeOpacity={active ? 0.42 : 0.28}
                  />
                  {linesEnabled ? (
                    <path
                      d={d}
                      fill="none"
                      className={`${styles.topologyEdge} ${styles.topologyEdgeFlowOverlay} ${flowTone}`}
                      strokeWidth={active ? 2 : 1.65}
                      strokeOpacity={active ? 0.92 : 0.78}
                    />
                  ) : null}
                </g>
              );
            })}

            {visiblePackets.map((pkt) => {
              const edge = TOPOLOGY_EDGES.find((e) => e.id === pkt.edgeId);
              if (!edge) return null;
              const t = Math.max(0, Math.min(1, Math.abs(pkt.progress)));
              const pos = pointOnEdge(edge, pkt.reverse ? 1 - t : t);
              const toneClass = PACKET_TONE_CLASS[pkt.op.tone];

              return (
                <g key={pkt.id} transform={`translate(${pos.x},${pos.y})`} aria-hidden>
                  <circle r="10" className={`${toneClass} ${styles.topologyPacketHaloOuter}`} />
                  <circle r="6" className={`${toneClass} ${styles.topologyPacketHaloMid}`} />
                  <circle r="3.5" className={`${toneClass} ${styles.topologyPacketCore}`} />
                </g>
              );
            })}

            {TOPOLOGY_NODES.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const st = wStatus[node.id];
              const tone = st ? STATUS_TONES[st] : 'muted';
              const metrics = wMetrics[node.id];
              const labelClass = `${styles.topologyNodeLabel} ${isSelected ? styles.topologyNodeLabelActive : ''} ${node.type === 'server' ? styles.topologyNodeLabelServer : styles.topologyNodeLabelWorker}`;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  className={styles.topologyNode}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}, ${node.group ? STATUS_LABELS[st] : node.sub}`}
                  onMouseEnter={() => setHoverNode(node.id)}
                  onMouseLeave={() => setHoverNode(null)}
                  onFocus={() => setFocusNode(node.id)}
                  onBlur={() => setFocusNode((prev) => (prev === node.id ? null : prev))}
                  onKeyDown={(e) => handleNodeKeyDown(node, e)}
                >
                  {node.group ? null : (
                    <circle
                      r="34"
                      className={`${styles.topologyNodeFocusRing} ${isSelected ? styles.topologyNodeFocusRingVisible : ''}`}
                    />
                  )}

                  {node.group ? (
                    <rect
                      x={-WORKER_SLOT.halfWidth}
                      y={WORKER_SLOT.slotTop}
                      width={WORKER_SLOT.halfWidth * 2}
                      height={WORKER_SLOT.slotHeight}
                      rx="8"
                      className={`${styles.topologyWorkerSlot} ${isSelected ? styles.topologyWorkerSlotSelected : ''}`}
                    />
                  ) : null}

                  {node.group ? (
                    <g transform="translate(0,-6)">
                      <TopologyNodeIcon
                        type={node.type}
                        size={28}
                        busy={st === 'busy'}
                        reducedMotion={iconReducedMotion}
                        ledBlinkClass={styles.topologyLedBlink}
                        ledBusyClass={styles.topologyLedBusy}
                      />
                    </g>
                  ) : (
                    <TopologyNodeIcon
                      type={node.type}
                      size={36}
                      busy={st === 'busy'}
                      reducedMotion={iconReducedMotion}
                      ledBlinkClass={styles.topologyLedBlink}
                      ledBusyClass={styles.topologyLedBusy}
                    />
                  )}

                  {node.group && st ? (
                    <circle
                      cx="12"
                      cy="-20"
                      r="3.5"
                      className={`${styles.topologyStatusDot} ${STATUS_DOT_CLASS[tone]}`}
                    />
                  ) : null}

                  {node.group ? (
                    <text
                      y={WORKER_SLOT.titleY}
                      textAnchor="middle"
                      className={`${styles.topologyNodeLabel} ${styles.topologyNodeLabelWorker} ${isSelected ? styles.topologyNodeLabelActive : ''}`}
                    >
                      {node.label}
                    </text>
                  ) : (
                    <NodeLabelBackplate y={32} text={node.label} className={labelClass} compact />
                  )}

                  {node.group && st ? <StatusPill status={st} tone={tone} /> : null}
                  {node.type === 'server' ? (
                    <text y="44" textAnchor="middle" className={styles.topologyNodeSubServer}>
                      {node.sub}
                    </text>
                  ) : null}

                  {node.group && metrics ? (
                    <WorkerSlotMetrics metrics={metrics} group={node.group} />
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className={styles.topologyFooter}>
        <div className={`${dashStyles.surfacePanel} ${styles.topologyLegend}`} aria-labelledby="topology-legend-heading">
          <h3 id="topology-legend-heading" className={styles.topologyLegendTitle}>
            Packet types
          </h3>
          <div className={styles.topologyLegendGrid}>
            {PACKET_OPS.map((op) => (
              <span key={op.type} className={styles.topologyLegendItem}>
                <span
                  className={`${styles.topologyLegendSwatch} ${LEGEND_SWATCH_CLASS[op.tone]}`}
                  aria-hidden
                />
                {op.type}
              </span>
            ))}
          </div>
          <div className={styles.topologyLegendStatuses}>
            {(['busy', 'processing', 'idle'] as const).map((key) => (
              <span key={key} className={styles.topologyLegendItem}>
                <span
                  className={`${styles.topologyLegendSwatch} ${
                    key === 'busy'
                      ? LEGEND_SWATCH_CLASS.green
                      : key === 'processing'
                        ? LEGEND_SWATCH_CLASS.amber
                        : styles.topologyLegendSwatchMuted
                  }`}
                  aria-hidden
                />
                {STATUS_LABELS[key]}
              </span>
            ))}
          </div>
        </div>

        <aside className={`${dashStyles.surfacePanel} ${styles.topologyDetail}`} aria-live="polite" aria-label="Node details">
          {selectedNode ? (
            <>
              <h3 className={styles.topologyDetailTitle}>{selectedNode.label}</h3>
              <div className={styles.topologyDetailRow}>
                <span className={styles.topologyDetailLabel}>Type</span>
                <span className={styles.topologyDetailValue}>{selectedNode.group ?? 'server'}</span>
              </div>
              {selectedNode.group && wStatus[selectedNode.id] ? (
                <div className={styles.topologyDetailRow}>
                  <span className={styles.topologyDetailLabel}>Status</span>
                  <span className={styles.topologyDetailValue}>{STATUS_LABELS[wStatus[selectedNode.id]]}</span>
                </div>
              ) : null}
              <div className={styles.topologyDetailRow}>
                <span className={styles.topologyDetailLabel}>Active flows</span>
                <span className={styles.topologyDetailValue}>{hoverFlows.length}</span>
              </div>
              {hoverFlows.length > 0 ? (
                <div className={styles.topologyDetailFlows}>
                  {hoverFlows.slice(0, 5).map((p) => (
                    <div key={p.id} className={styles.topologyDetailFlow}>
                      <span
                        className={`${styles.topologyDetailFlowDot} ${LEGEND_SWATCH_CLASS[p.op.tone]}`}
                        aria-hidden
                      />
                      {p.op.type} · {p.size} · {p.rate}
                    </div>
                  ))}
                </div>
              ) : null}
              {selectedNode.group && wMetrics[selectedNode.id] ? (
                <div className={styles.topologyDetailMetrics}>
                  <div className={styles.topologyDetailMetricRow}>
                    <div className={styles.topologyDetailMetricHeader}>
                      <span className={styles.topologyDetailMetricLabel}>Read</span>
                      <span className={styles.topologyDetailMetricValue}>
                        {formatSpeed(wMetrics[selectedNode.id].read)} MB/s
                      </span>
                    </div>
                    <div className={styles.topologyDetailMetricBar}>
                      <div
                        className={`${styles.topologyDetailMetricFill} ${styles.topologyDetailMetricFillRead}`}
                        style={{ width: `${Math.min(wMetrics[selectedNode.id].read / 50, 1) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.topologyDetailMetricRow}>
                    <div className={styles.topologyDetailMetricHeader}>
                      <span className={styles.topologyDetailMetricLabel}>Write</span>
                      <span className={styles.topologyDetailMetricValue}>
                        {formatSpeed(wMetrics[selectedNode.id].write)} MB/s
                      </span>
                    </div>
                    <div className={styles.topologyDetailMetricBar}>
                      <div
                        className={`${styles.topologyDetailMetricFill} ${styles.topologyDetailMetricFillWrite}`}
                        style={{ width: `${Math.min(wMetrics[selectedNode.id].write / 30, 1) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.topologyDetailRow}>
                    <span className={styles.topologyDetailLabel}>Total today</span>
                    <span className={styles.topologyDetailValue}>
                      {formatTotal(wMetrics[selectedNode.id].total)}
                    </span>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className={styles.topologyDetailEmpty}>
              Hover or focus a node to inspect status, throughput, and active packet flows.
            </p>
          )}
        </aside>
      </div>

    </div>
  );
};
