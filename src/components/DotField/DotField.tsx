import { forwardRef, type HTMLAttributes, type PointerEvent } from 'react';
import { cn } from '../../lib/cn';
import { prefersReducedMotion } from '../../lib/prefersReducedMotion';
import { MotionPauseButton } from '../MotionPause/MotionPause';
import { useMotionPause, type MotionPauseProps } from '../MotionPause/useMotionPause';
import styles from './DotField.module.scss';

export interface DotFieldProps extends HTMLAttributes<HTMLDivElement>, MotionPauseProps {}

export const DotField = forwardRef<HTMLDivElement, DotFieldProps>(
  (
    {
      paused,
      defaultPaused = false,
      onPausedChange,
      controls = true,
      pauseLabel,
      playLabel,
      className,
      children,
      onPointerMove,
      ...props
    },
    ref
  ) => {
    const motion = useMotionPause(paused, defaultPaused, onPausedChange);

    const track = (event: PointerEvent<HTMLDivElement>) => {
      if (!prefersReducedMotion() && !motion.paused) {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }
      onPointerMove?.(event);
    };

    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        data-slot="dot-field"
        data-paused={motion.paused || undefined}
        {...props}
      >
        <div className={styles.field} onPointerMove={track}>
          <div className={styles.spot} aria-hidden />
          <div className={styles.content}>{children}</div>
        </div>
        {controls && !motion.reduced ? (
          <MotionPauseButton
            paused={motion.explicit}
            pauseLabel={pauseLabel}
            playLabel={playLabel}
            onClick={motion.toggle}
          />
        ) : null}
      </div>
    );
  }
);

DotField.displayName = 'DotField';
