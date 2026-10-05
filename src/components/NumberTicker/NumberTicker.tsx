import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { prefersReducedMotion } from '../../lib/prefersReducedMotion';
import { formatTicker } from './formatTicker';
import styles from './NumberTicker.module.scss';

export type NumberTickerDirection = 'up' | 'down';

export interface NumberTickerProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  /** Origin of the count. Defaults to 0. */
  start?: number;
  /** Seconds. `0` snaps to the destination. */
  duration?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  /** `up` counts toward `value`. `down` counts from `value` toward `start`. */
  direction?: NumberTickerDirection;
}

const destinationFor = (
  direction: NumberTickerDirection,
  value: number,
  start: number
): number => {
  switch (direction) {
    case 'up':
      return value;
    case 'down':
      return start;
    default: {
      const exhaustive: never = direction;
      return exhaustive;
    }
  }
};

const originFor = (direction: NumberTickerDirection, value: number, start: number): number => {
  switch (direction) {
    case 'up':
      return start;
    case 'down':
      return value;
    default: {
      const exhaustive: never = direction;
      return exhaustive;
    }
  }
};

const easeOut = (t: number): number => 1 - (1 - t) ** 3;

const finite = (n: number, fallback: number): number => (Number.isFinite(n) ? n : fallback);

export const NumberTicker = forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    {
      value,
      start = 0,
      duration = 1.2,
      decimalPlaces = 0,
      prefix = '',
      suffix = '',
      direction = 'up',
      className,
      ...props
    },
    ref
  ) => {
    const safeValue = finite(value, 0);
    const safeStart = finite(start, 0);
    const safeDuration = finite(duration, 0);
    const destination = destinationFor(direction, safeValue, safeStart);
    const origin = originFor(direction, safeValue, safeStart);
    const snap = safeDuration <= 0 || prefersReducedMotion();
    const [animated, setAnimated] = useState(origin);
    const display = snap ? destination : animated;

    useEffect(() => {
      if (safeDuration <= 0 || prefersReducedMotion()) return undefined;
      let frame = 0;
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / (safeDuration * 1000));
        setAnimated(origin + (destination - origin) * easeOut(progress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [destination, origin, safeDuration]);

    return (
      <span
        ref={ref}
        className={cn(styles.ticker, className)}
        data-slot="number-ticker"
        data-direction={direction}
        {...props}
      >
        {formatTicker(display, decimalPlaces, prefix, suffix)}
      </span>
    );
  }
);

NumberTicker.displayName = 'NumberTicker';
