import { Star } from 'lucide-react';
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { cn } from '../../lib/cn';
import { clampRating, fillForStar, ratingFromPointer } from './ratingValue';
import styles from './Rating.module.scss';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  size?: RatingSize;
}

const sizeClass = (size: RatingSize): string => {
  switch (size) {
    case 'sm':
      return styles.sm;
    case 'md':
      return '';
    case 'lg':
      return styles.lg;
    default: {
      const exhaustive: never = size;
      return exhaustive;
    }
  }
};

const StarGlyph = ({ fill }: { fill: number }) => (
  <span className={styles.star} aria-hidden>
    <Star className={cn(styles.glyph, styles.empty)} />
    <span className={styles.fill} style={{ width: `${Math.round(fill * 100)}%` }}>
      <Star className={styles.glyph} fill="currentColor" />
    </span>
  </span>
);

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      defaultValue = 0,
      onValueChange,
      max = 5,
      allowHalf = false,
      readOnly = false,
      disabled = false,
      size = 'md',
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const ceiling = Number.isFinite(max) && max > 0 ? Math.floor(max) : 1;
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const current = clampRating(value ?? uncontrolled, ceiling);
    const step = allowHalf ? 0.5 : 1;
    const label = ariaLabel ?? `${current} out of ${ceiling}`;

    const commit = (next: number) => {
      const clamped = clampRating(next, ceiling);
      if (value === undefined) setUncontrolled(clamped);
      onValueChange?.(clamped);
    };

    const onStarClick = (index: number, event: MouseEvent<HTMLButtonElement>) => {
      if (readOnly || disabled) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      commit(ratingFromPointer(index, event.clientX - bounds.left, bounds.width, allowHalf));
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || disabled) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        commit(current + step);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        commit(current - step);
      } else if (event.key === 'Home') {
        event.preventDefault();
        commit(step);
      } else if (event.key === 'End') {
        event.preventDefault();
        commit(ceiling);
      }
    };

    const stars = Array.from({ length: ceiling }, (_, index) => (
      readOnly ? (
        <span key={index} className={styles.starButton}>
          <StarGlyph fill={fillForStar(current, index)} />
        </span>
      ) : (
        <button
          key={index}
          type="button"
          role="radio"
          className={styles.starButton}
          disabled={disabled}
          aria-checked={Math.ceil(current) === index + 1 && current > 0}
          aria-label={`${index + 1} star${index === 0 ? '' : 's'}`}
          onClick={event => onStarClick(index, event)}
        >
          <StarGlyph fill={fillForStar(current, index)} />
        </button>
      )
    ));

    if (readOnly) {
      return (
        <div
          ref={ref}
          className={cn(styles.group, styles.readOnly, sizeClass(size), className)}
          data-slot="rating"
          role="img"
          {...props}
          aria-label={label}
        >
          {stars}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(styles.group, sizeClass(size), className)}
        data-slot="rating"
        role="radiogroup"
        aria-disabled={disabled || undefined}
        {...props}
        aria-label={label}
        onKeyDown={onKeyDown}
      >
        {stars}
      </div>
    );
  }
);

Rating.displayName = 'Rating';
