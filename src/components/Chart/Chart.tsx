import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Chart.module.scss';

export type ChartDataPoint = {
  label: string;
  value: number;
};

export type ChartContainerProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  variant?: 'default' | 'bare';
};

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ title, description, variant = 'default', className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`${styles.container} ${variant === 'bare' ? styles.bare : ''} ${className}`}
      {...props}
    >
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
  showLegend?: boolean;
};

export const BarChart = forwardRef<SVGSVGElement, BarChartProps>(
  ({ data, maxValue, showLegend = true, className = '', ...props }, ref) => {
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
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.65" />
            </linearGradient>
          </defs>
        </svg>
        {showLegend ? (
          <div className={styles.legend}>
            {data.map((point) => (
              <span key={point.label} className={styles.legendItem}>
                <span className={styles.legendSwatch} aria-hidden />
                {point.label}: {point.value}
              </span>
            ))}
          </div>
        ) : null}
      </>
    );
  }
);

BarChart.displayName = 'BarChart';

export type ChartSeries = {
  key: string;
  label: string;
  color?: string;
};

export type GroupedBarPoint = {
  label: string;
  values: Record<string, number>;
};

export type GroupedBarChartProps = HTMLAttributes<SVGSVGElement> & {
  data: GroupedBarPoint[];
  series: ChartSeries[];
  maxValue?: number;
  showLegend?: boolean;
};

const SERIES_TOKEN_VARS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const seriesColor = (series: { color?: string }, index: number): string =>
  series.color ?? SERIES_TOKEN_VARS[index % SERIES_TOKEN_VARS.length];

export const GroupedBarChart = forwardRef<SVGSVGElement, GroupedBarChartProps>(
  ({ data, series, maxValue, showLegend = true, className = '', ...props }, ref) => {
    const width = 520;
    const height = 220;
    const padding = { top: 12, right: 8, bottom: 28, left: 8 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;
    const groupGap = 16;
    const barGap = 4;
    const groupWidth = Math.max(24, (innerW - groupGap * (data.length - 1)) / Math.max(data.length, 1));
    const barWidth = Math.max(
      6,
      (groupWidth - barGap * (series.length - 1)) / Math.max(series.length, 1)
    );
    const max =
      maxValue ??
      Math.max(
        1,
        ...data.flatMap((point) => series.map((item) => point.values[item.key] ?? 0))
      );

    return (
      <>
        <svg
          ref={ref}
          viewBox={`0 0 ${width} ${height}`}
          className={`${styles.chart} ${className}`}
          role="img"
          aria-label="Grouped bar chart"
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
          {data.map((point, groupIndex) => {
            const groupX = padding.left + groupIndex * (groupWidth + groupGap);
            return (
              <g key={point.label}>
                {series.map((item, seriesIndex) => {
                  const value = point.values[item.key] ?? 0;
                  const barH = (value / max) * innerH;
                  const x = groupX + seriesIndex * (barWidth + barGap);
                  const y = padding.top + innerH - barH;
                  return (
                    <rect
                      key={item.key}
                      className={styles.seriesBar}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barH, 0)}
                      rx={4}
                      style={{ '--chart-color': seriesColor(item, seriesIndex) } as CSSProperties}
                    />
                  );
                })}
                <text
                  className={styles.label}
                  x={groupX + groupWidth / 2}
                  y={height - 8}
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
        {showLegend ? (
          <div className={styles.legend}>
            {series.map((item, index) => (
              <span key={item.key} className={styles.legendItem}>
                <span
                  className={styles.legendSwatch}
                  aria-hidden
                  style={{ '--chart-color': seriesColor(item, index) } as CSSProperties}
                />
                {item.label}
              </span>
            ))}
          </div>
        ) : null}
      </>
    );
  }
);

GroupedBarChart.displayName = 'GroupedBarChart';

export type DonutSlice = {
  label: string;
  value: number;
  color?: string;
};

export type DonutChartProps = HTMLAttributes<SVGSVGElement> & {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  children?: ReactNode;
  showLegend?: boolean;
};

export const DonutChart = forwardRef<SVGSVGElement, DonutChartProps>(
  (
    {
      data,
      size = 220,
      thickness = 28,
      children,
      showLegend = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const total = data.reduce((sum, slice) => sum + slice.value, 0);
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;
    let dashOffset = 0;

    return (
      <div className={styles.donutWrap}>
        <div className={styles.donutCanvas} style={{ width: size, height: size }}>
          <svg
            ref={ref}
            viewBox={`0 0 ${size} ${size}`}
            width={size}
            height={size}
            className={`${styles.donut} ${className}`}
            role="img"
            aria-label="Donut chart"
            {...props}
          >
            {data.map((slice, index) => {
              const fraction = total > 0 ? slice.value / total : 0;
              const dash = fraction * circumference;
              const offset = dashOffset;
              dashOffset += dash;
              return (
                <circle
                  key={slice.label}
                  className={styles.donutSlice}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${center} ${center})`}
                  style={{ '--chart-color': seriesColor(slice, index) } as CSSProperties}
                />
              );
            })}
          </svg>
          {children ? <div className={styles.donutLabel}>{children}</div> : null}
        </div>
        {showLegend ? (
          <div className={styles.legend}>
            {data.map((slice, index) => (
              <span key={slice.label} className={styles.legendItem}>
                <span
                  className={styles.legendSwatch}
                  aria-hidden
                  style={{ '--chart-color': seriesColor(slice, index) } as CSSProperties}
                />
                {slice.label}: {slice.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

DonutChart.displayName = 'DonutChart';

export type SparklineProps = HTMLAttributes<SVGSVGElement> & {
  data: number[];
};

export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  ({ data, className = '', ...props }, ref) => {
    const width = 160;
    const height = 48;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const pointCount = Math.max(data.length, 1);
    const coords = data.map((value, index) => {
      const x = pointCount === 1 ? width / 2 : (index / (pointCount - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return { x, y };
    });
    const line = coords
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
      .join(' ');
    const area =
      coords.length === 0
        ? ''
        : `${line} L ${width} ${height} L 0 ${height} Z`;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        className={`${styles.sparkline} ${className}`}
        role="img"
        aria-label="Sparkline"
        {...props}
      >
        <path className={styles.sparkArea} d={area} />
        <path className={styles.sparkLine} d={line} />
      </svg>
    );
  }
);

Sparkline.displayName = 'Sparkline';
