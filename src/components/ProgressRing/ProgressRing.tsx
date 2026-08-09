import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './ProgressRing.module.scss';

export interface ProgressRingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

export const ProgressRing = forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    {
      value = 0,
      max = 100,
      size = 64,
      strokeWidth = 4,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), max);
    const percentage = max > 0 ? (clampedValue / max) * 100 : 0;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const center = size / 2;

    const { 'aria-label': ariaLabel, ...rest } = props;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clampedValue}
        aria-label={ariaLabel}
        className={`${styles.wrapper} ${className || ''}`}
        style={{ width: size, height: size }}
        {...rest}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={styles.ring}
          aria-hidden="true"
        >
          <circle
            className={styles.track}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            className={styles.indicator}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        {children ? <div className={styles.label}>{children}</div> : null}
      </div>
    );
  }
);

ProgressRing.displayName = 'ProgressRing';
