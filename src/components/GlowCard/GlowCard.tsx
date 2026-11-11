import { forwardRef, type HTMLAttributes, type PointerEvent } from 'react';
import { cn } from '../../lib/cn';
import { prefersReducedMotion } from '../../lib/prefersReducedMotion';
import styles from './GlowCard.module.scss';

export type GlowCardProps = HTMLAttributes<HTMLDivElement>;

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, onPointerMove, onPointerLeave, children, ...props }, ref) => {
    const track = (event: PointerEvent<HTMLDivElement>) => {
      if (!prefersReducedMotion()) {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
        event.currentTarget.setAttribute('data-glow', 'true');
      }
      onPointerMove?.(event);
    };

    const leave = (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.removeAttribute('data-glow');
      onPointerLeave?.(event);
    };

    return (
      <div
        ref={ref}
        className={cn(styles.card, className)}
        data-slot="glow-card"
        onPointerMove={track}
        onPointerLeave={leave}
        {...props}
      >
        <div className={styles.body}>{children}</div>
      </div>
    );
  }
);

GlowCard.displayName = 'GlowCard';
