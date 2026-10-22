import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { getCountdownParts, toTimestamp, type CountdownParts } from './countdownParts';
import styles from './Countdown.module.scss';

export type { CountdownParts } from './countdownParts';

type Unit = 'days' | 'hours' | 'minutes' | 'seconds';

const DEFAULT_LABELS: Record<Unit, string> = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

export interface CountdownProps extends HTMLAttributes<HTMLDivElement> {
  target: Date | number | string;
  /** Rendered in place of the digits once the target passes. */
  completedContent?: ReactNode;
  onComplete?: () => void;
  /** Hide the days unit when it is zero. */
  hideEmptyDays?: boolean;
  labels?: Partial<Record<Unit, string>>;
  size?: 'sm' | 'md' | 'lg';
  /** Clock source; override in tests or for server-synced time. */
  now?: () => number;
}

export const Countdown = forwardRef<HTMLDivElement, CountdownProps>(
  (
    {
      target,
      completedContent = 'Live now',
      onComplete,
      hideEmptyDays = true,
      labels,
      size = 'md',
      now = Date.now,
      className,
      ...props
    },
    ref
  ) => {
    const targetTime = toTimestamp(target);
    const [parts, setParts] = useState<CountdownParts>(() => getCountdownParts(targetTime, now()));
    const [syncedTarget, setSyncedTarget] = useState(targetTime);
    if (syncedTarget !== targetTime) {
      setSyncedTarget(targetTime);
      setParts(getCountdownParts(targetTime, now()));
    }
    const onCompleteRef = useRef(onComplete);
    const nowRef = useRef(now);

    useEffect(() => {
      onCompleteRef.current = onComplete;
      nowRef.current = now;
    });

    useEffect(() => {
      let completed = false;
      const tick = () => {
        const next = getCountdownParts(targetTime, nowRef.current());
        setParts(next);
        if (next.total === 0 && !completed) {
          completed = true;
          window.clearInterval(id);
          onCompleteRef.current?.();
        }
      };
      const id = window.setInterval(tick, 1000);
      return () => window.clearInterval(id);
    }, [targetTime]);

    const done = parts.total === 0;
    const units: Unit[] = hideEmptyDays && parts.days === 0 ? ['hours', 'minutes', 'seconds'] : ['days', 'hours', 'minutes', 'seconds'];
    const names = { ...DEFAULT_LABELS, ...labels };
    const summary = units.map(unit => `${parts[unit]} ${names[unit].toLowerCase()}`).join(', ');

    return (
      <div
        ref={ref}
        role="timer"
        aria-label={done ? undefined : summary}
        data-slot="countdown"
        data-state={done ? 'complete' : 'running'}
        className={cn(styles.root, styles[size], className)}
        {...props}
      >
        {done ? (
          <span className={styles.complete}>{completedContent}</span>
        ) : (
          units.map(unit => (
            <div key={unit} className={styles.unit} aria-hidden>
              <span className={styles.value} key={parts[unit]}>
                {String(parts[unit]).padStart(2, '0')}
              </span>
              <span className={styles.label}>{names[unit]}</span>
            </div>
          ))
        )}
      </div>
    );
  }
);

Countdown.displayName = 'Countdown';
