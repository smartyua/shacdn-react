import { memo, useEffect, useRef, useState } from 'react';
import { Sun, Zap, CircuitBoard, Factory, Building2, BatteryCharging, PlugZap, Car } from 'lucide-react';

import { BessProgress } from './BessProgress';
import {
  PLANT,
  formatKw,
  formatPower,
  powerMode,
  type BankStatus,
  type ChargerStatus,
  type PlantState,
} from './bessData';
import { t } from './bessCopy';
import styles from './flow.module.scss';

const CANVAS_WIDTH = 1000;

type Tone = 'solar' | 'battery' | 'grid' | 'load' | 'ev' | 'import' | 'export';

const TONE_VAR: Record<Tone, string> = {
  solar: '--solar',
  battery: '--battery',
  grid: '--grid',
  load: '--load',
  ev: '--ev',
  import: '--import',
  export: '--export',
};

type Point = [number, number];

type FlowEdge = {
  id: string;
  points: Point[];
  tone: Tone;
  kind: 'flow' | 'bar';
  power?: number;
  scale?: number;
  reverse?: boolean;
  label?: string;
  labelPos?: Point;
};

const roundedPath = (points: Point[], radius = 14): string => {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;
  }

  let d = `M ${points[0][0]} ${points[0][1]}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index - 1];
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    const dx1 = x1 - x0;
    const dy1 = y1 - y0;
    const dx2 = x2 - x1;
    const dy2 = y2 - y1;
    const len1 = Math.hypot(dx1, dy1) || 1;
    const len2 = Math.hypot(dx2, dy2) || 1;
    const r = Math.min(radius, len1 * 0.85, len2 * 0.85);

    if (r < 1) {
      d += ` L ${x1} ${y1}`;
      continue;
    }

    const p1x = x1 - (dx1 / len1) * r;
    const p1y = y1 - (dy1 / len1) * r;
    const p2x = x1 + (dx2 / len2) * r;
    const p2y = y1 + (dy2 / len2) * r;
    const sweep = dx1 * dy2 - dy1 * dx2 > 0 ? 1 : 0;
    d += ` L ${p1x.toFixed(1)} ${p1y.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 ${sweep} ${p2x.toFixed(1)} ${p2y.toFixed(1)}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last[0]} ${last[1]}`;
  return d;
};

const MIN_SCALE = 0.55;
const MAX_SCALE = 1.2;

const useCanvasScale = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width || 0;
      if (width > 0) setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, width / CANVAS_WIDTH)));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, scale };
};

const BRANCH_RUN = 76;

type BarUnit = { id: string; x: number; power: number; scale: number };

const chainEdges = (
  prefix: string,
  tone: Tone,
  barY: number,
  cardY: number,
  entryX: number,
  units: BarUnit[],
  reverseWhenPositive = false,
): FlowEdge[] => {
  const edges: FlowEdge[] = [];
  const flowsBack = (power: number) => reverseWhenPositive && power > 0;
  let fromX = entryX;

  units.forEach((unit, index) => {
    const downstream = units.slice(index);
    const runPower = downstream.reduce((sum, item) => sum + item.power, 0);
    const runScale = downstream.reduce((sum, item) => sum + item.scale, 0);
    const isLast = index === units.length - 1;

    if (fromX !== unit.x) {
      edges.push({
        id: `${prefix}-run-${unit.id}`,
        points: isLast
          ? [
              [fromX, barY],
              [unit.x, barY],
              [unit.x, cardY],
            ]
          : [
              [fromX, barY],
              [unit.x, barY],
            ],
        tone,
        kind: 'flow',
        power: isLast ? unit.power : runPower,
        scale: isLast ? unit.scale : runScale,
        reverse: flowsBack(isLast ? unit.power : runPower),
      });
    }

    if (!isLast || fromX === unit.x) {
      edges.push({
        id: `${prefix}-drop-${unit.id}`,
        points: [
          [unit.x, barY],
          [unit.x, cardY],
        ],
        tone,
        kind: 'flow',
        power: unit.power,
        scale: unit.scale,
        reverse: flowsBack(unit.power),
      });
    }

    fromX = unit.x;
  });

  return edges;
};

const ratioOf = (power?: number, scale?: number) => (!power || !scale ? 0 : Math.min(1, Math.abs(power) / scale));
const strokeWidthFor = (ratio: number) => 1.6 + 2.6 * ratio;

// Must match the `animation-duration` of `.wireFlow`: the rate below is relative to that period.
const FLOW_PERIOD_S = 1.6;
const speedFor = (ratio: number) => Number((FLOW_PERIOD_S / (FLOW_PERIOD_S - 0.95 * ratio)).toFixed(2));

type FlowWireProps = {
  d: string;
  tone: Tone;
  reverse: boolean;
  dim: boolean;
  strokeWidth: number;
  speed: number;
};

// Power sets the playback rate rather than the animation duration. Changing the duration keeps the
// original start time, so the browser re-maps the elapsed time onto the new period and the dashes
// visibly jump on every simulation tick; changing the rate preserves the current position.
const FlowWire = ({ d, tone, reverse, dim, strokeWidth, speed }: FlowWireProps) => {
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof element.getAnimations !== 'function') return;

    element.getAnimations().forEach(animation => {
      // Transitions are in here too, and slowing those down would drag out the stroke width change.
      if ('animationName' in animation) animation.playbackRate = speed;
    });
    // `reverse` swaps the keyframes, which replaces the animation and resets its rate to 1.
  }, [speed, reverse]);

  const marker = `url(#bessArrow-${tone})`;

  return (
    <g>
      <path className={styles.wireBase} d={d} />
      <path
        ref={ref}
        className={`${styles.wireFlow} ${styles[tone]} ${reverse ? styles.reverse : ''}`}
        d={d}
        style={{ strokeWidth, opacity: dim ? 0.22 : 1 }}
        {...(dim ? {} : reverse ? { markerStart: marker } : { markerEnd: marker })}
      />
    </g>
  );
};
const LANE_X = 20;
const ZONE_LEFT = 40;
const ZONE_LABEL_X = ZONE_LEFT + 16;

const R1_TOP = 36;
const R1_H = 132;
const R1_MID = R1_TOP + R1_H / 2;
const R1_BOTTOM = R1_TOP + R1_H;

const R2_TOP = 268;
const R2_H = 112;
const R2_MID = R2_TOP + R2_H / 2;
const R2_BOTTOM = R2_TOP + R2_H;

const BESS_BAR_Y = R2_BOTTOM + 36;
const BESS_ZONE_TOP = BESS_BAR_Y + 14;
const BESS_LABEL_Y = BESS_ZONE_TOP + 18;
const BANK_TOP = BESS_LABEL_Y + 18;
const BANK_H = 126;
const BANK_BOTTOM = BANK_TOP + BANK_H;
const BESS_ZONE_BOTTOM = BANK_BOTTOM + 14;

const EV_BAR_Y = BESS_ZONE_BOTTOM + 44;
const EV_ZONE_TOP = EV_BAR_Y + 14;
const EV_LABEL_Y = EV_ZONE_TOP + 18;
const CHARGER_TOP = EV_LABEL_Y + 18;
const CHARGER_H = 108;
const CHARGER_BOTTOM = CHARGER_TOP + CHARGER_H;
const EV_ZONE_BOTTOM = CHARGER_BOTTOM + 14;

const CANVAS_HEIGHT = EV_ZONE_BOTTOM + 20;

const SIDE_NODE_W = 168;
const WIDE_NODE_W = 196;
const PV_LEFT = 8;
const PV_RIGHT = PV_LEFT + SIDE_NODE_W;
const INV_LEFT = 268;
const INV_RIGHT = INV_LEFT + SIDE_NODE_W;
const RIGHT_EDGE = 992;
const GRID_LEFT = RIGHT_EDGE - SIDE_NODE_W;
const LOAD_LEFT = RIGHT_EDGE - WIDE_NODE_W;

const BUS_LEFT = 536;
const BUS_WIDTH = 140;
const BUS_RIGHT = BUS_LEFT + BUS_WIDTH;
const EV_TAP_X = BUS_LEFT + 36;
const BESS_TAP_X = BUS_LEFT + 80;
const LOAD_TAP_X = BUS_LEFT + 124;
const EV_ELBOW_Y = Math.round((R1_BOTTOM + R2_TOP) / 2);
const EV_HUB_X = 106;
const EV_DROP_Y = R2_BOTTOM + 22;

const BANK_LEFT = 52;
const BANK_WIDTH = 288;
const BANK_GAP = 316;
const bankCenter = (index: number) => BANK_LEFT + BANK_WIDTH / 2 + index * BANK_GAP;

const CHARGER_LEFT = 52;
const CHARGER_WIDTH = 218;
const CHARGER_GAP = 234;
const chargerCenter = (index: number) => CHARGER_LEFT + CHARGER_WIDTH / 2 + index * CHARGER_GAP;

const nodeStateClass = (state: BankStatus | ChargerStatus): string => {
  if (state === 'fault') return styles.nodeFault;
  if (state === 'idle') return styles.nodeIdle;
  return '';
};

type Props = {
  state: PlantState;
};

export const EnergyFlowDiagram = memo<Props>(({ state }) => {
  const { pvKw, loadKw, evKw, batteryKw, gridKw, curtailedKw, banks, chargers, totals, inverters } = state;
  const { ref: scrollerRef, scale } = useCanvasScale();

  const importKw = Math.max(0, gridKw);
  const exportKw = Math.max(0, -gridKw);
  const siteKw = loadKw - evKw;
  const batteryMode = powerMode(batteryKw);
  const batteryLabel =
    batteryMode === 'idle'
      ? t('_BESS_MODE_IDLE')
      : `${batteryMode === 'charging' ? t('_BESS_FLOW_CHARGE') : t('_BESS_FLOW_DISCHARGE')} ${formatPower(Math.abs(batteryKw))}`;
  const producing = inverters.filter(item => item.powerKw > 0);
  const averageEfficiency = producing.length
    ? producing.reduce((sum, item) => sum + item.efficiency, 0) / producing.length
    : 0;

  const allBankUnits: BarUnit[] = banks.map((bank, index) => ({
    id: bank.spec.id,
    x: bankCenter(index),
    power: bank.powerKw,
    scale: bank.spec.powerKw,
  }));
  const bankUnits = {
    right: allBankUnits.filter(unit => unit.x > BESS_TAP_X).sort((a, b) => a.x - b.x),
    left: allBankUnits.filter(unit => unit.x <= BESS_TAP_X).sort((a, b) => b.x - a.x),
  };

  const chargerUnits: BarUnit[] = chargers.map((charger, index) => ({
    id: charger.spec.id,
    x: chargerCenter(index),
    power: charger.powerKw,
    scale: charger.spec.ratedKw,
  }));

  const edges: FlowEdge[] = [
    {
      id: 'pv-inv',
      points: [
        [PV_RIGHT, R1_MID],
        [INV_LEFT - 2, R1_MID],
      ],
      tone: 'solar',
      kind: 'flow',
      power: pvKw,
      scale: PLANT.dcCapacityKwp,
      label: formatPower(pvKw),
      labelPos: [(PV_RIGHT + INV_LEFT) / 2, R1_MID],
    },
    {
      id: 'inv-bus',
      points: [
        [INV_RIGHT, R1_MID],
        [BUS_LEFT - 2, R1_MID],
      ],
      tone: 'solar',
      kind: 'flow',
      power: pvKw,
      scale: PLANT.dcCapacityKwp,
      label: formatPower(pvKw),
      labelPos: [(INV_RIGHT + BUS_LEFT) / 2, R1_MID],
    },
    {
      id: 'grid-import',
      points: [
        [BUS_RIGHT + 2, R1_TOP + 34],
        [GRID_LEFT - 2, R1_TOP + 34],
      ],
      tone: 'import',
      kind: 'flow',
      power: importKw,
      scale: PLANT.importLimitKw,
      reverse: true,
      label: `${t('_BESS_FLOW_IMPORT')} ${formatPower(importKw)}`,
      labelPos: [(BUS_RIGHT + GRID_LEFT) / 2, R1_TOP + 34],
    },
    {
      id: 'grid-export',
      points: [
        [BUS_RIGHT + 2, R1_TOP + 78],
        [GRID_LEFT - 2, R1_TOP + 78],
      ],
      tone: 'export',
      kind: 'flow',
      power: exportKw,
      scale: PLANT.exportLimitKw,
      label: `${t('_BESS_FLOW_EXPORT')} ${formatPower(exportKw)}`,
      labelPos: [(BUS_RIGHT + GRID_LEFT) / 2, R1_TOP + 78],
    },
    {
      id: 'bus-load',
      points: [
        [LOAD_TAP_X, R1_BOTTOM],
        [LOAD_TAP_X, R2_MID],
        [LOAD_LEFT - 2, R2_MID],
      ],
      tone: 'load',
      kind: 'flow',
      power: siteKw,
      scale: PLANT.acCapacityKw,
      label: formatPower(siteKw),
      labelPos: [727, R2_MID],
    },
    {
      id: 'ev-feed',
      points: [
        [EV_TAP_X, R1_BOTTOM],
        [EV_TAP_X, EV_ELBOW_Y],
        [EV_HUB_X, EV_ELBOW_Y],
        [EV_HUB_X, R2_TOP],
      ],
      tone: 'ev',
      kind: 'flow',
      power: evKw,
      scale: PLANT.chargerPowerKw,
      label: formatPower(evKw),
      labelPos: [340, EV_ELBOW_Y],
    },
    {
      id: 'bess-feed',
      points: [
        [BESS_TAP_X, R1_BOTTOM],
        [BESS_TAP_X, BESS_BAR_Y],
      ],
      tone: 'battery',
      kind: 'flow',
      power: batteryKw,
      scale: PLANT.storagePowerKw,
      reverse: batteryMode !== 'charging',
      label: batteryLabel,
      labelPos: [BESS_TAP_X, R2_BOTTOM - 8],
    },
    {
      id: 'bess-bar',
      points: [
        [bankCenter(0), BANK_TOP],
        [bankCenter(0), BESS_BAR_Y],
        [bankCenter(banks.length - 1), BESS_BAR_Y],
        [bankCenter(banks.length - 1), BANK_TOP],
      ],
      tone: 'battery',
      kind: 'bar',
    },
    ...chainEdges('bess-right', 'battery', BESS_BAR_Y, BANK_TOP, BESS_TAP_X, bankUnits.right, true),
    ...chainEdges('bess-left', 'battery', BESS_BAR_Y, BANK_TOP, BESS_TAP_X, bankUnits.left, true),
    {
      id: 'ev-distribute',
      points: [
        [EV_HUB_X, R2_BOTTOM],
        [EV_HUB_X, EV_DROP_Y],
        [LANE_X, EV_DROP_Y],
        [LANE_X, EV_BAR_Y],
        [chargerCenter(0), EV_BAR_Y],
      ],
      tone: 'ev',
      kind: 'flow',
      power: evKw,
      scale: PLANT.chargerPowerKw,
    },
    {
      id: 'ev-bar',
      points: [
        [LANE_X, EV_BAR_Y - BRANCH_RUN],
        [LANE_X, EV_BAR_Y],
        [chargerCenter(chargers.length - 1), EV_BAR_Y],
        [chargerCenter(chargers.length - 1), CHARGER_TOP],
      ],
      tone: 'ev',
      kind: 'bar',
    },
    ...chainEdges('ev', 'ev', EV_BAR_Y, CHARGER_TOP, chargerCenter(0), chargerUnits),
  ];

  const usedTones = Array.from(new Set(edges.map(edge => edge.tone)));

  return (
    <div className={styles.scroller} ref={scrollerRef} style={{ height: CANVAS_HEIGHT * scale }}>
      <div
        className={styles.canvas}
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${scale})` }}
      >
        <svg
          className={styles.wires}
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-hidden
        >
          <defs>
            {usedTones.map(tone => (
              <marker
                key={tone}
                id={`bessArrow-${tone}`}
                markerWidth={8}
                markerHeight={8}
                refX={6}
                refY={4}
                orient="auto-start-reverse"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L8,4 L0,8 Z" fill={`hsl(var(${TONE_VAR[tone]}))`} />
              </marker>
            ))}
          </defs>

          <text className={`${styles.zoneLabel} ${styles.battery}`} x={ZONE_LABEL_X} y={BESS_LABEL_Y}>
            {t('_BESS_KPI_BATTERY')}
          </text>

          <text className={`${styles.zoneLabel} ${styles.ev}`} x={ZONE_LABEL_X} y={EV_LABEL_Y}>
            {t('_BESS_TAB_CHARGERS')}
          </text>

          {edges
            .filter(edge => edge.kind === 'bar')
            .map(edge => (
              <path key={edge.id} className={styles.busBar} d={roundedPath(edge.points)} />
            ))}

          {edges
            .filter(edge => edge.kind !== 'bar')
            .map(edge => {
              const ratio = ratioOf(edge.power, edge.scale);
              const dim = Math.abs(edge.power || 0) < 4;
              const visualRatio = dim ? 0 : Math.max(0.22, ratio);

              return (
                <FlowWire
                  key={edge.id}
                  d={roundedPath(edge.points)}
                  tone={edge.tone}
                  reverse={Boolean(edge.reverse)}
                  dim={dim}
                  strokeWidth={strokeWidthFor(visualRatio)}
                  speed={speedFor(visualRatio)}
                />
              );
            })}
        </svg>

        {edges.map(edge => {
          if (!edge.label || !edge.labelPos) return null;
          const [left, top] = edge.labelPos;
          return (
            <span
              key={`${edge.id}-label`}
              className={`${styles.edgeLabel} ${styles[edge.tone]} ${Math.abs(edge.power || 0) < 4 ? styles.dim : ''}`}
              style={{ left, top }}
            >
              {edge.label}
            </span>
          );
        })}

        <article
          className={`${styles.node} ${styles.solarNode}`}
          style={{ left: PV_LEFT, top: R1_TOP, width: SIDE_NODE_W, height: R1_H }}
        >
          <header>
            <Sun aria-hidden />
            <span>{t('_BESS_NODE_PV')}</span>
          </header>
          <strong>{formatPower(pvKw)}</strong>
          <footer>
            <span>{`${(PLANT.dcCapacityKwp / 1000).toFixed(2)} MWp DC`}</span>
            <span>{`${t('_BESS_IRRADIANCE')} ${Math.round(state.irradiance * 1000)} W/m²`}</span>
          </footer>
        </article>

        <article
          className={`${styles.node} ${styles.solarNode}`}
          style={{ left: INV_LEFT, top: R1_TOP, width: SIDE_NODE_W, height: R1_H }}
        >
          <header>
            <Zap aria-hidden />
            <span>{t('_BESS_NODE_INV')}</span>
          </header>
          <strong>{`${totals.onlineInverters} / ${PLANT.inverterCount}`}</strong>
          <footer>
            <span>{`${(PLANT.acCapacityKw / 1000).toFixed(2)} MW AC · ${PLANT.stringCount} ${t('_BESS_STRINGS')}`}</span>
            <span>{`η ${averageEfficiency.toFixed(1)} %`}</span>
          </footer>
        </article>

        <article className={`${styles.node} ${styles.busNode}`} style={{ left: BUS_LEFT, top: R1_TOP, width: BUS_WIDTH, height: R1_H }}>
          <header>
            <CircuitBoard aria-hidden />
            <span>{t('_BESS_NODE_BUS')}</span>
          </header>
          <strong>50.01 Hz</strong>
          <footer>
            <span>33 kV · cos φ 0.99</span>
            <span>{`${t('_BESS_CURTAILED')} ${formatKw(curtailedKw)}`}</span>
          </footer>
        </article>

        <article
          className={`${styles.node} ${styles.gridNode}`}
          style={{ left: GRID_LEFT, top: R1_TOP, width: SIDE_NODE_W, height: R1_H }}
        >
          <header>
            <Factory aria-hidden />
            <span>{t('_BESS_NODE_GRID')}</span>
          </header>
          <strong>{formatPower(Math.abs(gridKw))}</strong>
          <div className={styles.gridMeters}>
            <div className={styles.gridMeter}>
              <span>{`↓ ${PLANT.importLimitKw}`}</span>
              <BessProgress value={totals.importLimitUse} tone="import" size="xs" />
            </div>
            <div className={styles.gridMeter}>
              <span>{`↑ ${PLANT.exportLimitKw}`}</span>
              <BessProgress value={totals.exportLimitUse} tone="export" size="xs" />
            </div>
          </div>
          <footer>
            <span>{`${t('_BESS_TODAY')} ↓${totals.importMwh.toFixed(1)} ↑${totals.exportMwh.toFixed(1)} MWh`}</span>
          </footer>
        </article>

        <article
          className={`${styles.node} ${styles.loadNode}`}
          style={{ left: LOAD_LEFT, top: R2_TOP, width: WIDE_NODE_W, height: R2_H }}
        >
          <header>
            <Building2 aria-hidden />
            <span>{t('_BESS_NODE_LOAD')}</span>
          </header>
          <strong>{formatPower(siteKw)}</strong>
          <footer>
            <span>{`${t('_BESS_SELF_SUFFICIENCY')} ${totals.selfSufficiency.toFixed(0)} %`}</span>
            <span>{`${t('_BESS_TODAY')} ${totals.pvYieldMwh.toFixed(1)} MWh PV`}</span>
          </footer>
        </article>

        <article
          className={`${styles.node} ${styles.evNode}`}
          style={{ left: PV_LEFT, top: R2_TOP, width: WIDE_NODE_W, height: R2_H }}
        >
          <header>
            <PlugZap aria-hidden />
            <span>{t('_BESS_NODE_EV')}</span>
          </header>
          <strong>{formatPower(evKw)}</strong>
          <footer>
            <span>{`${PLANT.chargerPowerKw} kW · ${PLANT.chargerCount} ${t('_BESS_EV_STATIONS')}`}</span>
            <span>{`${t('_BESS_TODAY')} ${(totals.evEnergyMwh * 1000).toFixed(0)} kWh`}</span>
          </footer>
        </article>

        {banks.map((bank, index) => (
          <article
            key={bank.spec.id}
            className={`${styles.node} ${styles.bessNode} ${nodeStateClass(bank.mode)}`}
            style={{ left: BANK_LEFT + index * BANK_GAP, top: BANK_TOP, width: BANK_WIDTH, height: BANK_H }}
          >
            <header>
              <BatteryCharging aria-hidden />
              <span>{bank.spec.id}</span>
              <em className={styles[bank.mode]}>{t(`_BESS_MODE_${bank.mode.toUpperCase()}`)}</em>
            </header>
            <div className={styles.bessBody}>
              <strong>{formatPower(Math.abs(bank.powerKw))}</strong>
              <span className={styles.bessSoc}>
                <b>{`${(bank.soc * 100).toFixed(1)}%`}</b>
                <small>SOC</small>
              </span>
            </div>
            <BessProgress value={bank.soc * 100} tone="battery" size="sm" />
            <footer>
              <span>{`${(bank.spec.capacityKwh / 1000).toFixed(0)} MWh · ${(bank.spec.powerKw / 1000).toFixed(1)} MW`}</span>
              <span>{`SOH ${bank.spec.soh} % · ${bank.cellTemp.toFixed(1)} °C`}</span>
            </footer>
          </article>
        ))}

        {chargers.map((charger, index) => (
          <article
            key={charger.spec.id}
            className={`${styles.node} ${styles.chargerNode} ${nodeStateClass(charger.status)}`}
            style={{ left: CHARGER_LEFT + index * CHARGER_GAP, top: CHARGER_TOP, width: CHARGER_WIDTH, height: CHARGER_H }}
          >
            <header>
              <Car aria-hidden />
              <span>{charger.spec.id}</span>
              <em className={styles[`badge-${charger.status}`]}>{t(`_BESS_EVSE_${charger.status.toUpperCase()}`)}</em>
            </header>
            <div className={styles.bessBody}>
              <strong>{formatKw(charger.powerKw)}</strong>
              <span className={styles.bessSoc}>
                <b>{`${charger.utilization.toFixed(0)}%`}</b>
              </span>
            </div>
            <BessProgress value={charger.utilization} tone="ev" size="sm" />
            <footer>
              <span>{`${charger.spec.ratedKw} kW · ${charger.spec.connectors} ${t('_BESS_EV_CONNECTORS_SHORT')}`}</span>
              <span>{`${charger.energyTodayKwh.toFixed(0)} kWh · ${charger.sessionsToday}`}</span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
});

EnergyFlowDiagram.displayName = 'EnergyFlowDiagram';

