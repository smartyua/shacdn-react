import {
  forwardRef,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import styles from './ImageCompare.module.scss';

export interface ImageCompareProps extends HTMLAttributes<HTMLDivElement> {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Divider position in percent (0–100). */
  position?: number;
  defaultPosition?: number;
  onPositionChange?: (position: number) => void;
  /** CSS aspect-ratio, e.g. "16 / 9". */
  aspectRatio?: string;
  sliderLabel?: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export const ImageCompare = forwardRef<HTMLDivElement, ImageCompareProps>(
  (
    {
      beforeSrc,
      afterSrc,
      beforeAlt,
      afterAlt,
      beforeLabel = 'Before',
      afterLabel = 'After',
      position,
      defaultPosition = 50,
      onPositionChange,
      aspectRatio = '16 / 9',
      sliderLabel = 'Comparison divider',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(clamp(defaultPosition));
    const current = position === undefined ? internal : clamp(position);
    const frameRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    const update = (next: number) => {
      const value = Math.round(clamp(next) * 10) / 10;
      if (value === current) return;
      if (position === undefined) setInternal(value);
      onPositionChange?.(value);
    };

    const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
      const rect = frameRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      update(((event.clientX - rect.left) / rect.width) * 100);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 10 : 2;
      const moves: Record<string, number> = {
        ArrowLeft: current - step,
        ArrowDown: current - step,
        ArrowRight: current + step,
        ArrowUp: current + step,
        PageDown: current - 10,
        PageUp: current + 10,
        Home: 0,
        End: 100,
      };
      if (!(event.key in moves)) return;
      event.preventDefault();
      update(moves[event.key]);
    };

    return (
      <div
        ref={ref}
        data-slot="image-compare"
        className={cn(styles.root, className)}
        style={{ ...style, aspectRatio, '--position': `${current}%` } as CSSProperties}
        {...props}
      >
        <div
          ref={frameRef}
          className={styles.frame}
          onPointerDown={event => {
            dragging.current = true;
            event.currentTarget.setPointerCapture?.(event.pointerId);
            fromPointer(event);
          }}
          onPointerMove={event => {
            if (dragging.current) fromPointer(event);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <img className={styles.image} src={afterSrc} alt={afterAlt} draggable={false} />
          <img className={cn(styles.image, styles.before)} src={beforeSrc} alt={beforeAlt} draggable={false} />
          <span className={cn(styles.tag, styles.tagBefore)} aria-hidden>
            {beforeLabel}
          </span>
          <span className={cn(styles.tag, styles.tagAfter)} aria-hidden>
            {afterLabel}
          </span>
          <div
            role="slider"
            tabIndex={0}
            aria-label={sliderLabel}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={current}
            aria-valuetext={`${Math.round(current)}% ${beforeLabel.toLowerCase()}`}
            className={styles.divider}
            onKeyDown={handleKeyDown}
          >
            <span className={styles.handle} aria-hidden>
              <ChevronsLeftRight size={14} />
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ImageCompare.displayName = 'ImageCompare';
