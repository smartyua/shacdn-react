import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { MotionPauseButton } from '../MotionPause/MotionPause';
import { useMotionPause, type MotionPauseProps } from '../MotionPause/useMotionPause';
import styles from './Aurora.module.scss';

export interface AuroraProps extends HTMLAttributes<HTMLDivElement>, MotionPauseProps {}

export const Aurora = forwardRef<HTMLDivElement, AuroraProps>(
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
      ...props
    },
    ref
  ) => {
    const motion = useMotionPause(paused, defaultPaused, onPausedChange);

    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        data-slot="aurora"
        data-paused={motion.paused || undefined}
        {...props}
      >
        <div className={styles.panel}>
          <div className={styles.wash} aria-hidden>
            <span className={styles.blobA} />
            <span className={styles.blobB} />
            <span className={styles.blobC} />
          </div>
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

Aurora.displayName = 'Aurora';
