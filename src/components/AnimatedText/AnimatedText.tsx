import {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';
import { prefersReducedMotion } from '../../lib/prefersReducedMotion';
import styles from './AnimatedText.module.scss';

export type AnimatedTextVariant =
  | 'fade'
  | 'blur'
  | 'slide'
  | 'typewriter'
  | 'gradient'
  | 'scramble'
  | 'rotate'
  | 'highlight';

export type AnimatedTextBy = 'word' | 'character';

const SCRAMBLE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const variantClass = (variant: AnimatedTextVariant): string => {
  switch (variant) {
    case 'fade':
      return styles.fade;
    case 'blur':
      return styles.blur;
    case 'slide':
      return styles.slide;
    case 'typewriter':
      return styles.typewriter;
    case 'gradient':
      return styles.gradient;
    case 'scramble':
      return styles.scramble;
    case 'rotate':
      return styles.rotate;
    case 'highlight':
      return styles.highlight;
    default: {
      const exhaustive: never = variant;
      return exhaustive;
    }
  }
};

const splitUnits = (text: string, by: AnimatedTextBy): string[] => {
  if (by === 'character') return Array.from(text);
  return text.split(/(\s+)/).filter(unit => unit.length > 0);
};

export interface AnimatedTextProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  /** Words cycled by the `rotate` variant. */
  words?: string[];
  variant?: AnimatedTextVariant;
  /** Split unit for fade, blur, and slide. */
  by?: AnimatedTextBy;
  /** Seconds for the whole effect. */
  duration?: number;
}

export const AnimatedText = forwardRef<HTMLSpanElement, AnimatedTextProps>(
  (
    {
      text,
      words = [],
      variant = 'fade',
      by = 'word',
      duration = 0.6,
      className,
      ...props
    },
    ref
  ) => {
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
    const cycleKey = words.filter(word => word.length > 0).join('\u0001');
    const cycle = cycleKey.length > 0 ? cycleKey.split('\u0001') : [];
    const [typed, setTyped] = useState('');
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
      if (variant !== 'typewriter' && variant !== 'scramble') return undefined;
      if (safeDuration <= 0 || prefersReducedMotion() || text.length === 0) return undefined;

      let frame = 0;
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / (safeDuration * 1000));
        const count = Math.floor(progress * text.length);
        if (variant === 'typewriter') {
          setTyped(text.slice(0, count));
        } else {
          const revealed = text.slice(0, count);
          const masked = text
            .slice(count)
            .replace(/\S/g, () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)] ?? 'A');
          setTyped(revealed + masked);
        }
        if (progress < 1) frame = requestAnimationFrame(tick);
        else setTyped(text);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [variant, text, safeDuration]);

    useEffect(() => {
      if (variant !== 'rotate' || cycleKey.length === 0) return undefined;
      const total = cycleKey.split('\u0001').length;
      if (total < 2 || prefersReducedMotion() || safeDuration <= 0) return undefined;
      const id = window.setInterval(() => {
        setWordIndex(index => (index + 1) % total);
      }, safeDuration * 1000);
      return () => window.clearInterval(id);
    }, [variant, safeDuration, cycleKey]);

    const shown =
      variant === 'typewriter' || variant === 'scramble'
        ? safeDuration <= 0 || prefersReducedMotion() || text.length === 0
          ? text
          : typed
        : text;

    const rotating = variant === 'rotate' && cycle.length > 0
      ? cycle[wordIndex % cycle.length]
      : shown;

    const staggered = variant === 'fade' || variant === 'blur' || variant === 'slide';
    const units = staggered ? splitUnits(text, by) : [];
    let stagger = 0;

    return (
      <span
        ref={ref}
        className={cn(styles.root, variantClass(variant), className)}
        data-slot="animated-text"
        data-variant={variant}
        style={{ '--text-duration': `${safeDuration || 0.6}s` } as CSSProperties}
        {...props}
      >
        {variant === 'rotate' ? (
          <span key={rotating} className={styles.rotateWord}>
            {rotating}
          </span>
        ) : null}
        {staggered
          ? units.map((unit, index) => {
              const animate = unit.trim().length > 0;
              const delay = animate ? stagger : 0;
              if (animate) stagger += 1;
              return (
                <span
                  key={`${unit}-${index}`}
                  className={styles.unit}
                  style={{ animationDelay: `${delay * 80}ms` }}
                >
                  {unit}
                </span>
              );
            })
          : null}
        {variant !== 'rotate' && !staggered ? shown : null}
      </span>
    );
  }
);

AnimatedText.displayName = 'AnimatedText';
