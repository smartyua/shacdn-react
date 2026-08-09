import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Bento.module.scss';

export const Bento = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.bento} ${className || ''}`}
        {...props}
      />
    );
  }
);

Bento.displayName = 'Bento';

export interface BentoItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
}

export const BentoItem = forwardRef<HTMLDivElement, BentoItemProps>(
  ({ span = 1, rowSpan = 1, className, ...props }, ref) => {
    const spanClass = styles[`span${span}` as keyof typeof styles] ?? '';
    const rowSpanClass = styles[`rowSpan${rowSpan}` as keyof typeof styles] ?? '';

    return (
      <div
        ref={ref}
        className={`${styles.item} ${spanClass} ${rowSpanClass} ${className || ''}`}
        {...props}
      />
    );
  }
);

BentoItem.displayName = 'BentoItem';
