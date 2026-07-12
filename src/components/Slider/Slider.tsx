import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import styles from './Slider.module.scss';

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const getStepPrecision = (step: number): number => {
  const stepString = step.toString();
  if (stepString.includes('e-')) {
    return Number.parseInt(stepString.split('e-')[1] ?? '0', 10);
  }
  const decimal = stepString.split('.')[1];
  return decimal ? decimal.length : 0;
};

const snapToStep = (raw: number, min: number, max: number, step: number): number => {
  const precision = getStepPrecision(step);
  const stepped = min + Math.round((raw - min) / step) * step;
  return Number(Math.min(max, Math.max(min, stepped)).toFixed(precision));
};

const getPageStep = (min: number, max: number, step: number): number => {
  const rangeStep = Math.round((max - min) / 10 / step) * step;
  return Math.max(step, rangeStep);
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = min,
      onValueChange,
      className,
      disabled,
      orientation = 'horizontal',
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const trackRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const isDragging = useRef(false);
    const activePointerId = useRef<number | null>(null);

    const currentValue = value !== undefined ? value : internalValue;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    const commitValue = useCallback(
      (next: number) => {
        const clamped = snapToStep(next, min, max, step);
        if (value === undefined) {
          setInternalValue(clamped);
        }
        onValueChange?.(clamped);
      },
      [max, min, onValueChange, step, value]
    );

    const updateValueFromPointer = useCallback(
      (clientX: number) => {
        if (disabled || !trackRef.current) {
          return;
        }

        const rect = trackRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawValue = min + percent * (max - min);
        commitValue(rawValue);
      },
      [commitValue, disabled, max, min]
    );

    const stopDragging = useCallback((target: HTMLElement | null, pointerId?: number) => {
      isDragging.current = false;
      activePointerId.current = null;
      if (target && pointerId !== undefined && target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId);
      }
    }, []);

    useEffect(() => {
      return () => {
        isDragging.current = false;
        activePointerId.current = null;
      };
    }, []);

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled || e.button !== 0) {
        return;
      }

      e.preventDefault();
      isDragging.current = true;
      activePointerId.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);
      updateValueFromPointer(e.clientX);
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e);
      if (e.defaultPrevented || !isDragging.current || activePointerId.current !== e.pointerId) {
        return;
      }
      updateValueFromPointer(e.clientX);
    };

    const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
      onPointerUp?.(e);
      if (activePointerId.current !== e.pointerId) {
        return;
      }
      stopDragging(e.currentTarget, e.pointerId);
    };

    const handlePointerCancel = (e: PointerEvent<HTMLDivElement>) => {
      onPointerCancel?.(e);
      if (activePointerId.current !== e.pointerId) {
        return;
      }
      stopDragging(e.currentTarget, e.pointerId);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) {
        return;
      }

      const pageStep = getPageStep(min, max, step);

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          commitValue(currentValue - step);
          return;
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          commitValue(currentValue + step);
          return;
        case 'Home':
          e.preventDefault();
          commitValue(min);
          return;
        case 'End':
          e.preventDefault();
          commitValue(max);
          return;
        case 'PageDown':
          e.preventDefault();
          commitValue(currentValue - pageStep);
          return;
        case 'PageUp':
          e.preventDefault();
          commitValue(currentValue + pageStep);
          return;
        default:
          return;
      }
    };

    const setRefs = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div
        ref={setRefs}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        data-slot="slider"
        data-disabled={disabled ? '' : undefined}
        className={`${styles.slider} ${disabled ? styles.disabled : ''} ${className || ''}`}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        {...props}
      >
        <div ref={trackRef} className={styles.track} data-slot="slider-track">
          <div className={styles.range} style={{ width: `${percentage}%` }} data-slot="slider-range" />
        </div>
        <div
          className={styles.thumb}
          style={{ left: `${percentage}%` }}
          data-slot="slider-thumb"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
