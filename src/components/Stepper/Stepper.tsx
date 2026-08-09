import { forwardRef, useCallback, useState, type HTMLAttributes } from 'react';
import { Minus, Plus } from 'lucide-react';
import styles from './Stepper.module.scss';

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      value,
      defaultValue = 0,
      onValueChange,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      disabled = false,
      id,
      'aria-label': ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue);
    const currentValue = value ?? internalValue;

    const clamp = useCallback(
      (next: number) => Math.min(max, Math.max(min, next)),
      [max, min]
    );

    const updateValue = useCallback(
      (next: number) => {
        const clamped = clamp(next);
        if (value === undefined) {
          setInternalValue(clamped);
        }
        onValueChange?.(clamped);
      },
      [clamp, onValueChange, value]
    );

    const decrement = () => updateValue(currentValue - step);
    const increment = () => updateValue(currentValue + step);

    const canDecrement = !disabled && currentValue - step >= min;
    const canIncrement = !disabled && currentValue + step <= max;

    return (
      <div
        ref={ref}
        id={id}
        role="group"
        aria-label={ariaLabel}
        className={`${styles.stepper} ${disabled ? styles.disabled : ''} ${className || ''}`}
        {...props}
      >
        <button
          type="button"
          className={styles.button}
          aria-label="Decrease value"
          disabled={!canDecrement}
          onClick={decrement}
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <span className={styles.value} aria-live="polite">
          {currentValue}
        </span>
        <button
          type="button"
          className={styles.button}
          aria-label="Increase value"
          disabled={!canIncrement}
          onClick={increment}
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';
