import { Children, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './AnimatedList.module.scss';

export interface AnimatedListProps extends HTMLAttributes<HTMLDivElement> {
  /** Delay between each child, in milliseconds. */
  delay?: number;
  children: ReactNode;
}

export const AnimatedList = forwardRef<HTMLDivElement, AnimatedListProps>(
  ({ delay = 100, className, children, ...props }, ref) => {
    const items = Children.toArray(children);
    const step = Number.isFinite(delay) && delay > 0 ? delay : 0;

    return (
      <div
        ref={ref}
        className={cn(styles.list, className)}
        data-slot="animated-list"
        {...props}
      >
        {items.map((child, index) => (
          <div
            key={index}
            className={styles.item}
            style={{ animationDelay: `${index * step}ms` }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);

AnimatedList.displayName = 'AnimatedList';
