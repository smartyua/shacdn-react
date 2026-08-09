import React, { forwardRef } from 'react';
import styles from './Spinner.module.scss';

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'default' | 'lg';
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className = '', size = 'default', 'aria-label': ariaLabel = 'Loading', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={`${styles.spinner} ${styles[size]} ${className}`}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.icon}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className={styles.srOnly}>{ariaLabel}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
