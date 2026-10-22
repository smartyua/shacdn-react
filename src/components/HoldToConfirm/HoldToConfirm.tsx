import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './HoldToConfirm.module.scss';

export type HoldToConfirmState = 'idle' | 'holding' | 'confirmed';

export interface HoldToConfirmProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'> {
  /** Called once the hold completes. */
  onConfirm: () => void;
  children: ReactNode;
  confirmedLabel?: ReactNode;
  /** Hold duration in milliseconds. */
  duration?: number;
  /** Milliseconds the confirmed state stays visible before the button resets. */
  resetAfter?: number;
  hint?: string;
  variant?: 'destructive' | 'default';
}

const HOLD_KEYS = new Set([' ', 'Enter']);

export const HoldToConfirm = forwardRef<HTMLButtonElement, HoldToConfirmProps>(
  (
    {
      onConfirm,
      children,
      confirmedLabel = 'Done',
      duration = 1200,
      resetAfter = 1800,
      hint = 'Press and hold to confirm',
      variant = 'destructive',
      disabled,
      className,
      style,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      onKeyDown,
      onKeyUp,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<HoldToConfirmState>('idle');
    const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const hintId = useId();

    useEffect(
      () => () => {
        clearTimeout(holdTimer.current);
        clearTimeout(resetTimer.current);
      },
      []
    );

    const start = () => {
      if (disabled || state !== 'idle') return;
      setState('holding');
      holdTimer.current = setTimeout(() => {
        setState('confirmed');
        onConfirm();
        resetTimer.current = setTimeout(() => setState('idle'), resetAfter);
      }, duration);
    };

    const cancel = () => {
      if (state !== 'holding') return;
      clearTimeout(holdTimer.current);
      setState('idle');
    };

    return (
      <>
        <button
          ref={ref}
          type="button"
          data-slot="hold-to-confirm"
          data-state={state}
          disabled={disabled}
          aria-describedby={hintId}
          className={cn(styles.button, styles[variant], className)}
          style={{ ...style, '--hold-duration': `${duration}ms` } as CSSProperties}
          onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
            onPointerDown?.(event);
            if (event.button === 0) start();
          }}
          onPointerUp={(event: PointerEvent<HTMLButtonElement>) => {
            onPointerUp?.(event);
            cancel();
          }}
          onPointerLeave={(event: PointerEvent<HTMLButtonElement>) => {
            onPointerLeave?.(event);
            cancel();
          }}
          onPointerCancel={(event: PointerEvent<HTMLButtonElement>) => {
            onPointerCancel?.(event);
            cancel();
          }}
          onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
            onKeyDown?.(event);
            if (!HOLD_KEYS.has(event.key)) return;
            event.preventDefault();
            if (!event.repeat) start();
          }}
          onKeyUp={(event: KeyboardEvent<HTMLButtonElement>) => {
            onKeyUp?.(event);
            if (HOLD_KEYS.has(event.key)) cancel();
          }}
          onBlur={event => {
            onBlur?.(event);
            cancel();
          }}
          {...props}
        >
          <span className={styles.fill} aria-hidden />
          <span className={styles.label} aria-live="polite">
            {state === 'confirmed' ? confirmedLabel : children}
          </span>
        </button>
        <span id={hintId} className={styles.srOnly}>
          {hint}
        </span>
      </>
    );
  }
);

HoldToConfirm.displayName = 'HoldToConfirm';
