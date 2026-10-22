import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { arcPath, clampRatio, GAUGE_SWEEP } from './gaugeGeometry';
import styles from './Gauge.module.scss';

export type GaugeTone = 'default' | 'success' | 'warning' | 'destructive';

export interface GaugeThreshold {
  /** Value at or above which the tone applies. */
  from: number;
  tone: GaugeTone;
}

export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  min?: number;
  max?: number;
  label?: ReactNode;
  /** Tones by value; the highest matching `from` wins. */
  thresholds?: GaugeThreshold[];
  format?: (value: number) => string;
  size?: number;
  thickness?: number;
}

const VIEW = 100;

export const Gauge = forwardRef<HTMLDivElement, GaugeProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      label,
      thresholds = [],
      format = v => new Intl.NumberFormat().format(v),
      size = 160,
      thickness = 10,
      className,
      style,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const ratio = clampRatio(value, min, max);
    const tone =
      [...thresholds].sort((a, b) => b.from - a.from).find(threshold => value >= threshold.from)?.tone ?? 'default';
    const r = (VIEW - thickness) / 2;
    const c = VIEW / 2;
    const arcLength = (2 * Math.PI * r * GAUGE_SWEEP) / 360;
    const track = arcPath(c, c, r, 0, 1);

    return (
      <div
        ref={ref}
        role="meter"
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        data-slot="gauge"
        data-tone={tone}
        className={cn(styles.root, className)}
        style={{ ...style, width: size }}
        {...props}
      >
        <svg viewBox={`0 0 ${VIEW} ${VIEW * 0.86}`} className={styles.svg} aria-hidden>
          <path d={track} className={styles.track} strokeWidth={thickness} />
          <path
            d={track}
            className={styles.indicator}
            strokeWidth={thickness}
            strokeDasharray={arcLength}
            strokeDashoffset={arcLength * (1 - ratio)}
          />
        </svg>
        <div className={styles.readout}>
          <span className={styles.value}>{format(value)}</span>
          {label ? <span className={styles.label}>{label}</span> : null}
        </div>
      </div>
    );
  }
);

Gauge.displayName = 'Gauge';
