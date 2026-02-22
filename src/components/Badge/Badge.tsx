import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Badge.module.scss';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    const variantClass = styles[variant];
    
    return (
      <div
        ref={ref}
        className={`${styles.badge} ${variantClass} ${className || ''}`}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
