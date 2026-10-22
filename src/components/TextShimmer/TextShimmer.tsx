import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './TextShimmer.module.scss';

export interface TextShimmerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Seconds for one sweep. */
  duration?: number;
  /** Stop the sweep (e.g. once the work it signals has finished). */
  paused?: boolean;
}

export const TextShimmer = forwardRef<HTMLElement, TextShimmerProps>(
  ({ as: Component = 'span', duration = 2, paused = false, className, style, children, ...props }, ref) => (
    <Component
      ref={ref}
      data-slot="text-shimmer"
      data-paused={paused || undefined}
      className={cn(styles.shimmer, className)}
      style={{ ...style, '--shimmer-duration': `${duration}s` } as CSSProperties}
      {...props}
    >
      {children}
    </Component>
  )
);

TextShimmer.displayName = 'TextShimmer';
