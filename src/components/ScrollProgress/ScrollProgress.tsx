import { forwardRef, useLayoutEffect, useState, type ProgressHTMLAttributes, type RefObject } from 'react';
import { cn } from '../../lib/cn';
import styles from './ScrollProgress.module.scss';

export interface ScrollProgressProps extends ProgressHTMLAttributes<HTMLProgressElement> {
  /** Element that scrolls. Defaults to the document. */
  target?: RefObject<HTMLElement | null>;
  label?: string;
}

const readRatio = (scroller: HTMLElement | null) => {
  const max = scroller
    ? scroller.scrollHeight - scroller.clientHeight
    : document.documentElement.scrollHeight - window.innerHeight;
  const top = scroller ? scroller.scrollTop : window.scrollY || document.documentElement.scrollTop;
  const ratio = max > 0 ? top / max : 0;
  return Math.round(Math.min(1, Math.max(0, ratio)) * 100);
};

export const ScrollProgress = forwardRef<HTMLProgressElement, ScrollProgressProps>(
  ({ target, label = 'Reading progress', className, ...props }, ref) => {
    const [progress, setProgress] = useState(0);

    useLayoutEffect(() => {
      const read = () => {
        const next = readRatio(target?.current ?? null);
        setProgress(prev => (prev === next ? prev : next));
      };

      const source: HTMLElement | Window = target?.current ?? window;
      source.addEventListener('scroll', read, { passive: true });
      window.addEventListener('resize', read);
      const frame = window.requestAnimationFrame(read);
      const later = window.setTimeout(read, 150);
      return () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(later);
        source.removeEventListener('scroll', read);
        window.removeEventListener('resize', read);
      };
    }, [target]);

    return (
      <progress
        {...props}
        ref={ref}
        className={cn(styles.bar, className)}
        data-slot="scroll-progress"
        max={100}
        value={progress}
        aria-label={label}
      />
    );
  }
);

ScrollProgress.displayName = 'ScrollProgress';
