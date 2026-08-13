import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import styles from './Input.module.scss';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(styles.input, type === 'file' && styles.file, className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
