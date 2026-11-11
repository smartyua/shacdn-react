import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { MotionPauseButton } from '../MotionPause/MotionPause';
import { useMotionPause, type MotionPauseProps } from '../MotionPause/useMotionPause';
import styles from './FluidOrb.module.scss';

export type FluidOrbState = 'idle' | 'listening' | 'speaking';
export type FluidOrbSize = 'sm' | 'md' | 'lg';

export interface FluidOrbProps extends HTMLAttributes<HTMLDivElement>, MotionPauseProps {
  state?: FluidOrbState;
  size?: FluidOrbSize;
  /** Accessible name when the orb has no visible text. */
  label?: string;
  children?: ReactNode;
}

export const FluidOrb = forwardRef<HTMLDivElement, FluidOrbProps>(
  (
    {
      state = 'idle',
      size = 'md',
      label,
      paused,
      defaultPaused = false,
      onPausedChange,
      controls = true,
      pauseLabel,
      playLabel,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const motion = useMotionPause(paused, defaultPaused, onPausedChange);
    const named = Boolean(label) && !children;

    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        data-slot="fluid-orb"
        data-paused={motion.paused || undefined}
        data-state={state}
        {...props}
      >
        <div
          className={cn(styles.orb, styles[size])}
          role={named ? 'img' : undefined}
          aria-label={named ? label : undefined}
          aria-hidden={named || children ? undefined : true}
        >
          <span className={styles.blobA} aria-hidden />
          <span className={styles.blobB} aria-hidden />
          <span className={styles.blobC} aria-hidden />
          {children ? <span className={styles.center}>{children}</span> : null}
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

FluidOrb.displayName = 'FluidOrb';
