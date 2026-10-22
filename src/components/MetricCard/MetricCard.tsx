import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Sparkline } from '../Chart/Chart';
import styles from './MetricCard.module.scss';

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Change versus the comparison period, in percent (e.g. 12.5 for +12.5%). */
  delta?: number;
  /** Context for the delta, e.g. "vs last month". */
  deltaLabel?: ReactNode;
  /** Set when a decrease is good news (latency, churn, cost). */
  invertDelta?: boolean;
  trend?: number[];
  icon?: ReactNode;
  footer?: ReactNode;
}

const formatDelta = (delta: number) =>
  `${delta > 0 ? '+' : ''}${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(delta)}%`;

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  ({ label, value, delta, deltaLabel, invertDelta = false, trend, icon, footer, className, ...props }, ref) => {
    const direction = delta === undefined || delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down';
    const good = direction === 'flat' ? undefined : (direction === 'up') !== invertDelta;
    const DeltaIcon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus;

    return (
      <div ref={ref} data-slot="metric-card" className={cn(styles.card, className)} {...props}>
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          {icon ? (
            <span className={styles.icon} aria-hidden>
              {icon}
            </span>
          ) : null}
        </div>
        <div className={styles.value}>{value}</div>
        {delta !== undefined || deltaLabel ? (
          <div className={styles.meta}>
            {delta !== undefined ? (
              <span
                className={styles.delta}
                data-direction={direction}
                data-sentiment={good === undefined ? 'neutral' : good ? 'positive' : 'negative'}
              >
                <DeltaIcon size={14} aria-hidden />
                {formatDelta(delta)}
              </span>
            ) : null}
            {deltaLabel ? <span className={styles.deltaLabel}>{deltaLabel}</span> : null}
          </div>
        ) : null}
        {trend && trend.length > 1 ? (
          <Sparkline className={styles.sparkline} data={trend} aria-hidden />
        ) : null}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    );
  }
);

MetricCard.displayName = 'MetricCard';
