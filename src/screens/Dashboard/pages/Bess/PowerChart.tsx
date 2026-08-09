import { memo, useMemo } from 'react';

import type { SeriesPoint } from './bessData';
import { t } from './bessCopy';
import styles from './chart.module.scss';

const WIDTH = 960;
const HEIGHT = 300;
const PADDING = { top: 16, right: 46, bottom: 28, left: 52 };
const INNER_W = WIDTH - PADDING.left - PADDING.right;
const INNER_H = HEIGHT - PADDING.top - PADDING.bottom;

type Props = {
  series: SeriesPoint[];
  currentMinute: number;
};

const roundTo = (value: number, step: number) => Math.ceil(value / step) * step;

export const PowerChart = memo<Props>(({ series, currentMinute }) => {
  const { paths, ticks, zeroY } = useMemo(() => {
    const values = series.flatMap(point => [point.pvKw, point.loadKw, point.batteryKw, point.gridKw]);
    const max = roundTo(Math.max(...values, 100), 250);
    const min = -roundTo(Math.abs(Math.min(...values, -100)), 250);

    const x = (minute: number) => PADDING.left + (minute / 1440) * INNER_W;
    const y = (kw: number) => PADDING.top + INNER_H * (1 - (kw - min) / (max - min));
    const ySoc = (percent: number) => PADDING.top + INNER_H * (1 - percent / 100);

    const line = (accessor: (point: SeriesPoint) => number) =>
      series.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.minute).toFixed(1)} ${accessor(point).toFixed(1)}`).join(' ');

    const area = (accessor: (point: SeriesPoint) => number) => {
      const baseline = y(0).toFixed(1);
      const first = x(series[0].minute).toFixed(1);
      const last = x(series[series.length - 1].minute).toFixed(1);
      return `${line(accessor)} L ${last} ${baseline} L ${first} ${baseline} Z`;
    };

    const gridValues: number[] = [];
    for (let value = min; value <= max; value += 500) gridValues.push(value);

    return {
      zeroY: y(0),
      paths: {
        pvArea: area(point => y(point.pvKw)),
        pvLine: line(point => y(point.pvKw)),
        batteryArea: area(point => y(point.batteryKw)),
        batteryLine: line(point => y(point.batteryKw)),
        loadLine: line(point => y(point.loadKw)),
        evLine: line(point => y(point.evKw)),
        gridLine: line(point => y(point.gridKw)),
        socLine: line(point => ySoc(point.socPercent)),
      },
      ticks: {
        x: [0, 3, 6, 9, 12, 15, 18, 21, 24].map(hour => ({ hour, px: x(hour * 60) })),
        y: gridValues.map(value => ({ value, py: y(value) })),
      },
    };
  }, [series]);

  const nowX = PADDING.left + (currentMinute / 1440) * INNER_W;

  return (
    <div className={styles.scroller}>
      <div className={styles.inner}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="img" aria-label={t('_BESS_CHART_TITLE')}>
          <defs>
            <linearGradient id="bessPvGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--solar) / 0.42)" />
              <stop offset="100%" stopColor="hsl(var(--solar) / 0.02)" />
            </linearGradient>
            <linearGradient id="bessBatteryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--battery) / 0.3)" />
              <stop offset="100%" stopColor="hsl(var(--battery) / 0.05)" />
            </linearGradient>
          </defs>

          {ticks.y.map(tick => (
            <g key={tick.value}>
              <line className={styles.grid} x1={PADDING.left} x2={WIDTH - PADDING.right} y1={tick.py} y2={tick.py} />
              <text className={styles.axisLabel} x={PADDING.left - 8} y={tick.py + 3} textAnchor="end">
                {tick.value}
              </text>
            </g>
          ))}

          {ticks.x.map(tick => (
            <text
              key={tick.hour}
              className={styles.axisLabel}
              x={tick.px}
              y={HEIGHT - PADDING.bottom + 16}
              textAnchor="middle"
            >
              {`${String(tick.hour).padStart(2, '0')}:00`}
            </text>
          ))}

          <text className={styles.axisUnit} x={PADDING.left - 8} y={PADDING.top - 4} textAnchor="end">
            kW
          </text>
          <text className={styles.axisUnit} x={WIDTH - PADDING.right + 8} y={PADDING.top - 4} textAnchor="start">
            SOC %
          </text>

          <path className={styles.pvArea} d={paths.pvArea} />
          <path className={styles.batteryArea} d={paths.batteryArea} />

          <line className={styles.zero} x1={PADDING.left} x2={WIDTH - PADDING.right} y1={zeroY} y2={zeroY} />

          <path className={styles.socLine} d={paths.socLine} />
          <path className={styles.evLine} d={paths.evLine} />
          <path className={styles.gridLine} d={paths.gridLine} />
          <path className={styles.batteryLine} d={paths.batteryLine} />
          <path className={styles.loadLine} d={paths.loadLine} />
          <path className={styles.pvLine} d={paths.pvLine} />

          <g className={styles.nowMarker}>
            <line x1={nowX} x2={nowX} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} />
            <circle cx={nowX} cy={PADDING.top} r={3.5} />
          </g>

          <text className={styles.axisLabel} x={WIDTH - PADDING.right + 8} y={PADDING.top + 12} textAnchor="start">
            100
          </text>
          <text className={styles.axisLabel} x={WIDTH - PADDING.right + 8} y={PADDING.top + INNER_H} textAnchor="start">
            0
          </text>
        </svg>

        <ul className={styles.legend}>
          <li className={styles.solar}>
            <i />
            {t('_BESS_LEGEND_PV')}
          </li>
          <li className={styles.load}>
            <i />
            {t('_BESS_LEGEND_LOAD')}
          </li>
          <li className={styles.ev}>
            <i />
            {t('_BESS_LEGEND_EV')}
          </li>
          <li className={styles.battery}>
            <i />
            {t('_BESS_LEGEND_BATTERY')}
          </li>
          <li className={styles.gridSeries}>
            <i />
            {t('_BESS_LEGEND_GRID')}
          </li>
          <li className={styles.soc}>
            <i />
            {t('_BESS_LEGEND_SOC')}
          </li>
        </ul>
      </div>
    </div>
  );
});

PowerChart.displayName = 'PowerChart';
