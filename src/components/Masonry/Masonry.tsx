import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Masonry.module.scss';

export interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export const Masonry = forwardRef<HTMLDivElement, MasonryProps>(
  ({ columns = 3, gap = 'md', className, ...props }, ref) => {
    const columnsClass =
      columns === 2 ? styles.columns2 : columns === 4 ? styles.columns4 : styles.columns3;
    const gapClass = gap === 'sm' ? styles.gapSm : gap === 'lg' ? styles.gapLg : styles.gapMd;

    return (
      <div
        ref={ref}
        className={`${styles.masonry} ${columnsClass} ${gapClass} ${className || ''}`}
        {...props}
      />
    );
  }
);

Masonry.displayName = 'Masonry';

export const MasonryItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.item} ${className || ''}`}
        {...props}
      />
    );
  }
);

MasonryItem.displayName = 'MasonryItem';
