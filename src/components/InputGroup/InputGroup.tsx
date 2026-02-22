import React, { forwardRef } from 'react';
import styles from './InputGroup.module.scss';

export type InputGroupProps = React.HTMLAttributes<HTMLDivElement>;

export type InputGroupAddonProps = React.HTMLAttributes<HTMLDivElement>;

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`${styles.inputGroup} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

InputGroup.displayName = 'InputGroup';

export const InputGroupAddon = forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.inputGroupAddon} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

InputGroupAddon.displayName = 'InputGroupAddon';
