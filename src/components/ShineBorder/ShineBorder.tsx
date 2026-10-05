import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './ShineBorder.module.scss';

export interface ShineBorderProps extends HTMLAttributes<HTMLDivElement> {
  /** Border thickness in pixels. */
  borderWidth?: number;
  /** Seconds per revolution. */
  duration?: number;
  children: ReactNode;
}

export const ShineBorder = forwardRef<HTMLDivElement, ShineBorderProps>(
  ({ borderWidth = 1, duration = 8, className, style, children, ...props }, ref) => {
    const width = Number.isFinite(borderWidth) && borderWidth > 0 ? borderWidth : 1;
    const seconds = Number.isFinite(duration) && duration > 0 ? duration : 8;

    return (
      <div
        ref={ref}
        className={cn(styles.frame, className)}
        data-slot="shine-border"
        style={
          {
            ...style,
            '--shine-width': `${width}px`,
            '--shine-duration': `${seconds}s`,
          } as CSSProperties
        }
        {...props}
      >
        <div className={styles.inner}>{children}</div>
      </div>
    );
  }
);

ShineBorder.displayName = 'ShineBorder';
