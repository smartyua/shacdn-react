import { forwardRef, useId, type CSSProperties, type SVGAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './SpinningText.module.scss';

export interface SpinningTextProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  text: string;
  /** Stage size in pixels. */
  size?: number;
  /** Seconds per revolution. */
  duration?: number;
  reverse?: boolean;
}

const circlePath = (radius: number): string =>
  `M 50 50 m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`;

export const SpinningText = forwardRef<SVGSVGElement, SpinningTextProps>(
  ({ text, size = 128, duration = 12, reverse = false, className, style, ...props }, ref) => {
    const rawId = useId();
    const pathId = `spin-${rawId.replace(/:/g, '')}`;
    const stage = Number.isFinite(size) && size > 0 ? size : 128;
    const seconds = Number.isFinite(duration) && duration > 0 ? duration : 12;

    return (
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        className={cn(styles.svg, reverse && styles.reverse, className)}
        data-slot="spinning-text"
        data-reverse={reverse ? 'true' : 'false'}
        role="img"
        aria-label={text || 'Spinning text'}
        style={
          {
            ...style,
            '--spin-size': `${stage}px`,
            '--spin-duration': `${seconds}s`,
          } as CSSProperties
        }
        {...props}
      >
        <defs>
          <path id={pathId} d={circlePath(36)} fill="none" />
        </defs>
        <text className={styles.text}>
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
    );
  }
);

SpinningText.displayName = 'SpinningText';
