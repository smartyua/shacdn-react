import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './MotionPause.module.scss';

export interface MotionPauseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  paused: boolean;
  pauseLabel?: string;
  playLabel?: string;
}

export const MotionPauseButton = forwardRef<HTMLButtonElement, MotionPauseButtonProps>(
  (
    { paused, pauseLabel = 'Pause animation', playLabel = 'Play animation', className, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      className={cn(styles.pause, className)}
      aria-pressed={paused}
      {...props}
    >
      {paused ? playLabel : pauseLabel}
    </button>
  )
);

MotionPauseButton.displayName = 'MotionPauseButton';
