import { forwardRef, useEffect, useRef, useState, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import styles from './CopyButton.module.scss';

export type CopyButtonState = 'idle' | 'copied' | 'failed';

export interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'children' | 'onCopy'> {
  /** Text written to the clipboard. */
  value: string;
  /** Visible label. Omit for an icon-only button (then `aria-label` describes the action). */
  label?: string;
  copiedLabel?: string;
  failedLabel?: string;
  /** Milliseconds before the button returns to its idle state. */
  resetAfter?: number;
  variant?: 'outline' | 'ghost';
  size?: 'sm' | 'md';
  onCopy?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
}

const writeClipboard = async (value: string): Promise<void> => {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard API unavailable');
  }
  await navigator.clipboard.writeText(value);
};

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      label,
      copiedLabel = 'Copied',
      failedLabel = 'Copy failed',
      resetAfter = 1600,
      variant = 'outline',
      size = 'md',
      onCopy,
      onCopyError,
      onClick,
      className,
      'aria-label': ariaLabel,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<CopyButtonState>('idle');
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const settle = (next: CopyButtonState) => {
      setState(next);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setState('idle'), resetAfter);
    };

    const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      try {
        await writeClipboard(value);
        settle('copied');
        onCopy?.(value);
      } catch (error) {
        settle('failed');
        onCopyError?.(error);
      }
    };

    const Icon = state === 'copied' ? Check : state === 'failed' ? X : Copy;
    const status = state === 'copied' ? copiedLabel : state === 'failed' ? failedLabel : '';
    const visibleLabel = label ? (state === 'idle' ? label : status) : undefined;

    return (
      <button
        ref={ref}
        type={type}
        data-slot="copy-button"
        data-state={state}
        aria-label={label ? undefined : (ariaLabel ?? 'Copy to clipboard')}
        className={cn(styles.button, styles[variant], styles[size], !label && styles.iconOnly, className)}
        onClick={handleClick}
        {...props}
      >
        <span className={styles.icon} key={state} aria-hidden>
          <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />
        </span>
        {visibleLabel ? <span className={styles.label}>{visibleLabel}</span> : null}
        <span className={styles.srOnly} role="status" aria-live="polite">
          {label ? '' : status}
        </span>
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';
