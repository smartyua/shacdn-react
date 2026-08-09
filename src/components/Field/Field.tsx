import { type HTMLAttributes, type LabelHTMLAttributes, forwardRef } from 'react';
import styles from './Field.module.scss';

export const Field = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.field} ${className}`} {...props} />
  )
);
Field.displayName = 'Field';

export const FieldLabel = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', ...props }, ref) => (
    <label ref={ref} className={`${styles.label} ${className}`} {...props} />
  )
);
FieldLabel.displayName = 'FieldLabel';

export const FieldDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`${styles.description} ${className}`} {...props} />
  )
);
FieldDescription.displayName = 'FieldDescription';

export const FieldError = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} role="alert" className={`${styles.error} ${className}`} {...props} />
  )
);
FieldError.displayName = 'FieldError';

export interface FieldGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'responsive';
}

export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className = '', orientation = 'vertical', ...props }, ref) => {
    const oriClass =
      orientation === 'horizontal'
        ? styles.oriHorizontal
        : orientation === 'responsive'
          ? styles.oriResponsive
          : styles.oriVertical;
    return (
      <div
        ref={ref}
        data-orientation={orientation}
        className={`${styles.group} ${oriClass} ${className}`}
        {...props}
      />
    );
  }
);
FieldGroup.displayName = 'FieldGroup';
