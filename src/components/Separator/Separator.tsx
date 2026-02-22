import React, { forwardRef } from 'react';
import styles from './Separator.module.scss';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className = '', orientation = 'horizontal', decorative = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={`${styles.separator} ${styles[orientation]} ${className}`}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';
