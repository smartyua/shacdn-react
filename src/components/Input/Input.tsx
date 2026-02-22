import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, className, ...props }, ref) => {
    const fileClass = type === 'file' ? styles.file : '';
    
    return (
      <input
        ref={ref}
        type={type}
        className={`${styles.input} ${fileClass} ${className || ''}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
