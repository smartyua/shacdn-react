import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './UsageMeter.module.scss';

export interface UsageMeterSegment {
  label: string;
  value: number;
  /** Any CSS color; defaults cycle through the chart palette. */
  color?: string;
}

export interface UsageMeterProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  segments: UsageMeterSegment[];
  limit: number;
  /** Fraction of the limit (0–1) where the meter turns to the warning tone. */
  warnAt?: number;
  format?: (value: number) => string;
  showLegend?: boolean;
}

const PALETTE = ['var(--usage-1)', 'var(--usage-2)', 'var(--usage-3)', 'var(--usage-4)', 'var(--usage-5)'];

const defaultFormat = (value: number) => new Intl.NumberFormat().format(value);

export const UsageMeter = forwardRef<HTMLDivElement, UsageMeterProps>(
  ({ label, segments, limit, warnAt = 0.8, format = defaultFormat, showLegend = true, className, ...props }, ref) => {
    const used = segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0);
    const scale = Math.max(limit, used, 1);
    const ratio = limit > 0 ? used / limit : 0;
    const tone = ratio > 1 ? 'over' : ratio >= warnAt ? 'warn' : 'ok';
    const valueText = `${format(used)} of ${format(limit)}`;

    return (
      <div ref={ref} data-slot="usage-meter" data-tone={tone} className={cn(styles.root, className)} {...props}>
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          <span className={styles.total}>
            <strong>{format(used)}</strong> / {format(limit)}
          </span>
        </div>
        <div
          className={styles.track}
          role="meter"
          aria-label={typeof label === 'string' ? label : 'Usage'}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={used}
          aria-valuetext={valueText}
        >
          {segments.map((segment, index) => (
            <span
              key={segment.label}
              className={styles.segment}
              style={
                {
                  width: `${(Math.max(0, segment.value) / scale) * 100}%`,
                  '--segment-color': segment.color ?? PALETTE[index % PALETTE.length],
                } as CSSProperties
              }
            />
          ))}
          {used > limit ? (
            <span className={styles.limitMark} style={{ left: `${(limit / scale) * 100}%` }} aria-hidden />
          ) : null}
        </div>
        {showLegend ? (
          <ul className={styles.legend}>
            {segments.map((segment, index) => (
              <li key={segment.label} className={styles.legendItem}>
                <span
                  className={styles.swatch}
                  style={{ '--segment-color': segment.color ?? PALETTE[index % PALETTE.length] } as CSSProperties}
                  aria-hidden
                />
                <span>{segment.label}</span>
                <span className={styles.legendValue}>{format(segment.value)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
);

UsageMeter.displayName = 'UsageMeter';
