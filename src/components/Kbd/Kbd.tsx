import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Kbd.module.scss';

export const Kbd = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd ref={ref} className={`${styles.kbd} ${className || ''}`} {...props} />
  )
);
Kbd.displayName = 'Kbd';

export const KbdGroup = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={`${styles.group} ${className || ''}`} {...props} />
  )
);
KbdGroup.displayName = 'KbdGroup';
