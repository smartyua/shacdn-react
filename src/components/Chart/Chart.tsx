import { forwardRef, useId, type HTMLAttributes } from 'react';
import styles from './Chart.module.scss';

export type ChartDataPoint = {
  label: string;
  value: number;
};

export type ChartContainerProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
};

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ title, description, className = '', children, ...props }, ref) => (
    <div ref={ref} className={`${styles.container} ${className}`} {...props}>
      {(title || description) && (
        <div className={styles.header}>
          {title ? <div className={styles.title}>{title}</div> : null}
          {description ? <div className={styles.description}>{description}</div> : null}
        </div>
      )}
      {children}
    </div>
  )
);

ChartContainer.displayName = 'ChartContainer';

export type BarChartProps = HTMLAttributes<SVGSVGElement> & {
  data: ChartDataPoint[];
  maxValue?: number;
};

export const BarChart = forwardRef<SVGSVGElement, BarChartProps>(
  ({ data, maxValue, className = '', ...props }, ref) => {
    const gradientId = useId();
    const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
    const width = 400;
    const height = 192;
    const padding = { top: 8, right: 8, bottom: 28, left: 8 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;
    const barGap = 8;
    const barWidth = Math.max(12, (innerW - barGap * (data.length - 1)) / data.length);

    return (
      <>
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          className={`${styles.chart} ${className}`}
          role="img"
          aria-label="Bar chart"
          {...props}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = padding.top + innerH * (1 - tick);
            return (
              <line
                key={tick}
                className={styles.grid}
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
              />
            );
          })}
          <line
            className={styles.axis}
            x1={padding.left}
            x2={width - padding.right}
            y1={height - padding.bottom}
            y2={height - padding.bottom}
          />
          {data.map((point, index) => {
            const barH = (point.value / max) * innerH;
            const x = padding.left + index * (barWidth + barGap);
            const y = padding.top + innerH - barH;
            return (
              <g key={point.label}>
                <rect
                  className={styles.bar}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={4}
                  fill={`url(#${gradientId})`}
                />
                <text
                  className={styles.label}
                  x={x + barWidth / 2}
                  y={height - 8}
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.65)" />
            </linearGradient>
          </defs>
        </svg>
        <div className={styles.legend}>
          {data.map((point) => (
            <span key={point.label} className={styles.legendItem}>
              <span className={styles.legendSwatch} aria-hidden />
              {point.label}: {point.value}
            </span>
          ))}
        </div>
      </>
    );
  }
);

BarChart.displayName = 'BarChart';
