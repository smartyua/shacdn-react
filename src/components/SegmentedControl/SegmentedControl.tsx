import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './SegmentedControl.module.scss';

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md';
  /** Stretch segments to fill the container width. */
  fullWidth?: boolean;
  disabled?: boolean;
}

interface IndicatorBox {
  x: number;
  width: number;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      size = 'md',
      fullWidth = false,
      disabled = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultValue ?? options[0]?.value ?? '');
    const current = value ?? internal;
    const segmentRefs = useRef(new Map<string, HTMLButtonElement>());
    const [box, setBox] = useState<IndicatorBox | null>(null);

    useLayoutEffect(() => {
      const measure = () => {
        const node = segmentRefs.current.get(current);
        setBox(node ? { x: node.offsetLeft, width: node.offsetWidth } : null);
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      segmentRefs.current.forEach(node => observer.observe(node));
      return () => observer.disconnect();
    }, [current, options]);

    const select = (next: string) => {
      if (next === current) return;
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };

    const enabled = options.filter(option => !option.disabled && !disabled);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const index = enabled.findIndex(option => option.value === current);
      const keyMoves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let target: SegmentedControlOption | undefined;
      if (event.key in keyMoves) {
        target = enabled[(index + keyMoves[event.key] + enabled.length) % enabled.length];
      } else if (event.key === 'Home') {
        target = enabled[0];
      } else if (event.key === 'End') {
        target = enabled[enabled.length - 1];
      }
      if (!target) return;
      event.preventDefault();
      select(target.value);
      segmentRefs.current.get(target.value)?.focus();
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        data-slot="segmented-control"
        aria-disabled={disabled || undefined}
        className={cn(styles.root, styles[size], fullWidth && styles.fullWidth, className)}
        style={
          {
            ...style,
            '--indicator-x': `${box?.x ?? 0}px`,
            '--indicator-width': `${box?.width ?? 0}px`,
          } as CSSProperties
        }
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className={styles.indicator} data-ready={box && box.width > 0 ? '' : undefined} aria-hidden />
        {options.map(option => {
          const checked = option.value === current;
          return (
            <button
              key={option.value}
              ref={node => {
                if (node) segmentRefs.current.set(option.value, node);
                else segmentRefs.current.delete(option.value);
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              disabled={disabled || option.disabled}
              data-state={checked ? 'on' : 'off'}
              className={styles.segment}
              onClick={() => select(option.value)}
            >
              {option.icon ? <span className={styles.icon}>{option.icon}</span> : null}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';
