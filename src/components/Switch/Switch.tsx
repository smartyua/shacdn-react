import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Switch.module.scss';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: 'default' | 'sm';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ size = 'default', className, ...props }, ref) => {
    const sizeClass = size === 'sm' ? styles.sm : '';
    
    return (
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={`${styles.switch} ${sizeClass} ${className || ''}`}
        {...props}
      />
    );
  }
);

Switch.displayName = 'Switch';
