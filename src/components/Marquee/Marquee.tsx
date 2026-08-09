import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Marquee.module.scss';

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  reverse?: boolean;
  duration?: number;
  children: ReactNode;
}

export const Marquee = ({
  pauseOnHover = false,
  reverse = false,
  duration = 40,
  className = '',
  children,
  ...props
}: MarqueeProps) => {
  const style = {
    '--marquee-duration': `${duration}s`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.marquee} ${pauseOnHover ? styles.pauseOnHover : ''} ${reverse ? styles.reverse : ''} ${className}`}
      style={style}
      data-slot="marquee"
      {...props}
    >
      {children}
    </div>
  );
};

export interface MarqueeContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const MarqueeContent = ({
  className = '',
  children,
  ...props
}: MarqueeContentProps) => (
  <div className={`${styles.content} ${className}`} data-slot="marquee-content" {...props}>
    <div className={styles.track} aria-hidden="false">
      {children}
    </div>
    <div className={styles.track} aria-hidden="true">
      {children}
    </div>
  </div>
);
