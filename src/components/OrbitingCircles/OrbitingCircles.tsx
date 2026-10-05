import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './OrbitingCircles.module.scss';

export interface OrbitingCirclesProps extends HTMLAttributes<HTMLDivElement> {
  /** Stage size in pixels. */
  size?: number;
  children: ReactNode;
}

export const OrbitingCircles = forwardRef<HTMLDivElement, OrbitingCirclesProps>(
  ({ size = 256, className, style, children, ...props }, ref) => {
    const stage = Number.isFinite(size) && size > 0 ? size : 256;
    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        data-slot="orbiting-circles"
        style={{ ...style, '--orbit-size': `${stage}px` } as CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

OrbitingCircles.displayName = 'OrbitingCircles';

export interface OrbitingCirclesItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Orbit radius in pixels. */
  radius?: number;
  /** Seconds per revolution. */
  duration?: number;
  /** Start offset in seconds. */
  delay?: number;
  reverse?: boolean;
  /** Draw the dashed orbit path. */
  path?: boolean;
}

export const OrbitingCirclesItem = forwardRef<HTMLDivElement, OrbitingCirclesItemProps>(
  (
    {
      radius = 80,
      duration = 20,
      delay = 0,
      reverse = false,
      path = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const orbit = Number.isFinite(radius) && radius > 0 ? radius : 80;
    const seconds = Number.isFinite(duration) && duration > 0 ? duration : 20;
    const offset = Number.isFinite(delay) ? delay : 0;
    const vars = {
      ...style,
      '--orbit-radius': `${orbit}px`,
      '--orbit-duration': `${seconds}s`,
      '--orbit-delay': `${offset}s`,
    } as CSSProperties;

    return (
      <>
        {path ? <span className={styles.path} style={{ '--orbit-radius': `${orbit}px` } as CSSProperties} aria-hidden /> : null}
        <div
          ref={ref}
          className={cn(styles.item, reverse && styles.reverse, className)}
          data-slot="orbiting-circles-item"
          data-reverse={reverse ? 'true' : 'false'}
          style={vars}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

OrbitingCirclesItem.displayName = 'OrbitingCirclesItem';
