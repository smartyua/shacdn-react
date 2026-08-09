import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.scss';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={`${styles.checkbox} ${className || ''}`}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
