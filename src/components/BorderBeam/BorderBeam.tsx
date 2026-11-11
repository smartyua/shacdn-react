import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { MotionPauseButton } from '../MotionPause/MotionPause';
import { useMotionPause, type MotionPauseProps } from '../MotionPause/useMotionPause';
import styles from './BorderBeam.module.scss';

export interface BorderBeamProps extends HTMLAttributes<HTMLDivElement>, MotionPauseProps {
  /** Border thickness in pixels. */
  borderWidth?: number;
  /** Seconds for one trip around the frame. */
  duration?: number;
  children: ReactNode;
}

export const BorderBeam = forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      borderWidth = 1,
      duration = 6,
      paused,
      defaultPaused = false,
      onPausedChange,
      controls = true,
      pauseLabel,
      playLabel,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const motion = useMotionPause(paused, defaultPaused, onPausedChange);
    const width = Number.isFinite(borderWidth) && borderWidth > 0 ? borderWidth : 1;
    const seconds = Number.isFinite(duration) && duration > 0 ? duration : 6;

    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        data-slot="border-beam"
        data-paused={motion.paused || undefined}
        {...props}
      >
        <div
          className={styles.frame}
          style={
            {
              ...style,
              '--beam-width': `${width}px`,
              '--beam-duration': `${seconds}s`,
            } as CSSProperties
          }
        >
          <div className={styles.inner}>{children}</div>
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

BorderBeam.displayName = 'BorderBeam';
