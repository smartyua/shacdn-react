import { forwardRef, type SelectHTMLAttributes } from 'react';
import styles from './Select.module.scss';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`${styles.select} ${styles.selectNative} ${className || ''}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
