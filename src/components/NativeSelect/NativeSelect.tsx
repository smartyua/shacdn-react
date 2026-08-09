import { forwardRef, type SelectHTMLAttributes } from 'react';
import styles from './NativeSelect.module.scss';

export type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        data-slot="native-select"
        className={`${styles.nativeSelect} ${className || ''}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

NativeSelect.displayName = 'NativeSelect';
