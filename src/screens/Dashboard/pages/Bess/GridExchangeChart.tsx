import { memo, useMemo } from 'react';

import type { HourlyExchange } from './bessData';
import { t } from './bessCopy';
import styles from './gridChart.module.scss';

const WIDTH = 760;
const HEIGHT = 260;
const PAD_LEFT = 46;
const PAD_RIGHT = 12;
const PAD_TOP = 26;
const PAD_BOTTOM = 26;
const AXIS_Y = PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) / 2;

const niceMax = (value: number) => {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const scaled = value / magnitude;
  const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return step * magnitude;
};

type Props = {
  hours: HourlyExchange[];
  currentHour: number;
};

export const GridExchangeChart = memo<Props>(({ hours, currentHour }) => {
  const { bars, ticks } = useMemo(() => {
    const peak = Math.max(1, ...hours.map(hour => Math.max(hour.importKwh, hour.exportKwh)));
    const max = niceMax(peak);
    const half = (HEIGHT - PAD_TOP - PAD_BOTTOM) / 2;
    const slot = (WIDTH - PAD_LEFT - PAD_RIGHT) / 24;
    const barWidth = Math.max(6, slot - 6);

    return {
      ticks: [max, max / 2, 0, max / 2, max],
      bars: hours.map(hour => ({
        hour: hour.hour,
        x: PAD_LEFT + hour.hour * slot + (slot - barWidth) / 2,
        width: barWidth,
        importHeight: (hour.importKwh / max) * half,
        exportHeight: (hour.exportKwh / max) * half,
        importKwh: hour.importKwh,
        exportKwh: hour.exportKwh,
        elapsed: hour.elapsed,
      })),
    };
  }, [hours]);

  const half = (HEIGHT - PAD_TOP - PAD_BOTTOM) / 2;

  return (
    <div className={styles.scroller}>
      <svg className={styles.chart} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} role="img">
        <title>{t('_BESS_GRID_CHART_TITLE')}</title>

        {ticks.map((tick, index) => {
          const y = PAD_TOP + (index * half) / 2;
          return (
            <g key={`tick-${index}`}>
              <line className={index === 2 ? styles.axisLine : styles.gridLine} x1={PAD_LEFT} y1={y} x2={WIDTH - PAD_RIGHT} y2={y} />
              <text className={styles.axisLabel} x={PAD_LEFT - 8} y={y + 3} textAnchor="end">
                {index === 2 ? '0' : Math.round(tick)}
              </text>
            </g>
          );
        })}

        {bars.map(bar => (
          <g key={bar.hour} className={bar.elapsed ? '' : styles.future}>
            {bar.exportHeight > 0 && (
              <rect
                className={styles.exportBar}
                x={bar.x}
                y={AXIS_Y - bar.exportHeight}
                width={bar.width}
                height={Math.max(1, bar.exportHeight)}
                rx={2}
              >
                <title>{`${String(bar.hour).padStart(2, '0')}:00 · ${t('_BESS_FLOW_EXPORT')} ${bar.exportKwh.toFixed(0)} kWh`}</title>
              </rect>
            )}
            {bar.importHeight > 0 && (
              <rect
                className={styles.importBar}
                x={bar.x}
                y={AXIS_Y}
                width={bar.width}
                height={Math.max(1, bar.importHeight)}
                rx={2}
              >
                <title>{`${String(bar.hour).padStart(2, '0')}:00 · ${t('_BESS_FLOW_IMPORT')} ${bar.importKwh.toFixed(0)} kWh`}</title>
              </rect>
            )}
            {bar.hour % 3 === 0 && (
              <text className={styles.hourLabel} x={bar.x + bar.width / 2} y={HEIGHT - 8} textAnchor="middle">
                {String(bar.hour).padStart(2, '0')}
              </text>
            )}
          </g>
        ))}

        <line
          className={styles.marker}
          x1={PAD_LEFT + ((currentHour + 0.5) * (WIDTH - PAD_LEFT - PAD_RIGHT)) / 24}
          y1={PAD_TOP}
          x2={PAD_LEFT + ((currentHour + 0.5) * (WIDTH - PAD_LEFT - PAD_RIGHT)) / 24}
          y2={HEIGHT - PAD_BOTTOM}
        />

        <text className={styles.sideLabel} x={PAD_LEFT - 8} y={12} textAnchor="end">
          kWh
        </text>
      </svg>
    </div>
  );
});

GridExchangeChart.displayName = 'GridExchangeChart';
