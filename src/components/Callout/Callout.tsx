import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Callout.module.scss';

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'warning' | 'success' | 'danger';
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    const variantClass = variant !== 'default' ? styles[variant] : '';

    return (
      <div
        ref={ref}
        role="note"
        className={`${styles.callout} ${variantClass} ${className || ''}`}
        {...props}
      />
    );
  }
);

Callout.displayName = 'Callout';

export const CalloutTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`${styles.title} ${className || ''}`}
        {...props}
      />
    );
  }
);

CalloutTitle.displayName = 'CalloutTitle';

export const CalloutDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.description} ${className || ''}`}
        {...props}
      />
    );
  }
);

CalloutDescription.displayName = 'CalloutDescription';
