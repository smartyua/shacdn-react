import { forwardRef, type HTMLAttributes } from 'react';
import styles from './ScrollArea.module.scss';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both';
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className = '', orientation = 'vertical', children, ...props }, ref) => (
    <div
      ref={ref}
      data-orientation={orientation}
      className={`${styles.root} ${orientation === 'horizontal' ? styles.horizontal : ''} ${orientation === 'both' ? styles.both : ''} ${className}`}
      {...props}
    >
      <div className={styles.viewport}>{children}</div>
    </div>
  )
);

ScrollArea.displayName = 'ScrollArea';
