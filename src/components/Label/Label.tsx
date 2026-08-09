import React, { forwardRef } from 'react';
import styles from './Label.module.scss';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`${styles.label} ${className}`}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';
