import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import styles from './ThinkingLoader.module.scss';

const DEFAULT_PHASES = ['Thinking', 'Searching the web', 'Reading sources', 'Writing response'];

export interface ThinkingLoaderProps extends HTMLAttributes<HTMLDivElement> {
  phases?: string[];
  interval?: number;
  phase?: number;
  loop?: boolean;
  done?: boolean;
  doneLabel?: string | ((seconds: number) => string);
  size?: 'sm' | 'md';
  variant?: 'pill' | 'plain';
}

const clampIndex = (index: number, length: number): number => {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
};

const RaySpinner = () => (
  <svg className={styles.rays} viewBox="0 0 16 16" aria-hidden>
    {Array.from({ length: 8 }, (_, index) => (
      <line
        key={index}
        x1="8"
        y1="1.4"
        x2="8"
        y2="3.6"
        className={styles.ray}
        style={{ animationDelay: `${index * 0.1}s` }}
        transform={`rotate(${index * 45} 8 8)`}
      />
    ))}
  </svg>
);

const DrawnCheck = () => (
  <svg className={styles.check} viewBox="0 0 16 16" aria-hidden>
    <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
  </svg>
);

export const ThinkingLoader = forwardRef<HTMLDivElement, ThinkingLoaderProps>(
  (
    {
      phases = DEFAULT_PHASES,
      interval = 2200,
      phase,
      loop = false,
      done = false,
      doneLabel = (seconds: number) => `Thought for ${seconds}s`,
      size = 'md',
      variant = 'pill',
      className = '',
      ...props
    },
    ref
  ) => {
    const labels = phases.length > 0 ? phases : DEFAULT_PHASES;
    const controlled = phase !== undefined;
    const [internal, setInternal] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const startedAtRef = useRef(0);
    const wasDoneRef = useRef(false);
    const index = controlled ? clampIndex(phase, labels.length) : clampIndex(internal, labels.length);
    const visible = done
      ? typeof doneLabel === 'function'
        ? doneLabel(seconds)
        : doneLabel
      : labels[index];

    useEffect(() => {
      if (!done) {
        startedAtRef.current = Date.now();
        return;
      }
      const elapsed = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
      setSeconds(elapsed);
    }, [done]);

    useEffect(() => {
      if (wasDoneRef.current && !done && !controlled) {
        setInternal(0);
      }
      wasDoneRef.current = done;
    }, [controlled, done]);

    useEffect(() => {
      if (controlled || done) return;
      const step = interval > 0 ? interval : 2200;
      const id = window.setInterval(() => {
        setInternal(current => {
          const last = labels.length - 1;
          if (current >= last) return loop ? 0 : current;
          return current + 1;
        });
      }, step);
      return () => window.clearInterval(id);
    }, [controlled, done, interval, labels.length, loop]);

    return (
      <div
        ref={ref}
        {...props}
        className={`${styles.root} ${styles[variant]} ${styles[size]} ${className}`}
        data-variant={variant}
        data-size={size}
        data-done={done ? 'true' : 'false'}
        role="status"
        aria-live="polite"
      >
        <span className={styles.mark} aria-hidden>
          {done ? <DrawnCheck /> : <RaySpinner />}
        </span>
        <span key={visible} className={done ? styles.label : styles.labelShimmer} aria-hidden>
          {visible}
        </span>
        <span className={styles.srOnly}>{visible}</span>
      </div>
    );
  }
);

ThinkingLoader.displayName = 'ThinkingLoader';
