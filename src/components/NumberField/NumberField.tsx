import {
  forwardRef,
  useMemo,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { clampToStep, parseLocaleNumber } from './numberValue';
import styles from './NumberField.module.scss';

export interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'min' | 'max' | 'step'> {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Multiplier for PageUp / PageDown. */
  largeStep?: number;
  locale?: string;
  formatOptions?: Intl.NumberFormatOptions;
  size?: 'sm' | 'md';
  decrementLabel?: string;
  incrementLabel?: string;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      value,
      defaultValue = null,
      onValueChange,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      largeStep = 10,
      locale,
      formatOptions,
      size = 'md',
      disabled,
      readOnly,
      decrementLabel = 'Decrease',
      incrementLabel = 'Increase',
      className,
      onBlur,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const formatter = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
    const [internal, setInternal] = useState<number | null>(defaultValue);
    const current = value === undefined ? internal : value;
    const [draft, setDraft] = useState<string | null>(null);

    const commit = (next: number | null) => {
      const settled = next === null ? null : clampToStep(next, { min, max, step });
      setDraft(null);
      if (settled === current) return;
      if (value === undefined) setInternal(settled);
      onValueChange?.(settled);
    };

    const nudge = (delta: number) => {
      const base = current ?? (Number.isFinite(min) ? min : 0);
      commit(current === null && delta > 0 && Number.isFinite(min) ? min : base + delta);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || readOnly) return;
      const actions: Record<string, () => void> = {
        ArrowUp: () => nudge(step),
        ArrowDown: () => nudge(-step),
        PageUp: () => nudge(step * largeStep),
        PageDown: () => nudge(-step * largeStep),
        Home: () => Number.isFinite(min) && commit(min),
        End: () => Number.isFinite(max) && commit(max),
        Enter: () => draft !== null && commit(parseLocaleNumber(draft, locale)),
      };
      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };

    const canDecrement = !disabled && !readOnly && (current === null || current > min);
    const canIncrement = !disabled && !readOnly && (current === null || current < max);
    const display = draft ?? (current === null ? '' : formatter.format(current));

    return (
      <div
        className={cn(styles.root, styles[size], disabled && styles.disabled, className)}
        data-slot="number-field"
      >
        <button
          type="button"
          tabIndex={-1}
          className={styles.stepButton}
          aria-label={decrementLabel}
          disabled={!canDecrement}
          onClick={() => nudge(-step)}
        >
          <Minus size={14} aria-hidden />
        </button>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          autoComplete="off"
          className={styles.input}
          value={display}
          disabled={disabled}
          readOnly={readOnly}
          aria-valuenow={current ?? undefined}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuetext={current === null ? undefined : formatter.format(current)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={event => {
            onBlur?.(event);
            if (draft !== null) commit(parseLocaleNumber(draft, locale));
          }}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          className={styles.stepButton}
          aria-label={incrementLabel}
          disabled={!canIncrement}
          onClick={() => nudge(step)}
        >
          <Plus size={14} aria-hidden />
        </button>
      </div>
    );
  }
);

NumberField.displayName = 'NumberField';
