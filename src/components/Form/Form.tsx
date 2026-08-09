import {
  forwardRef,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type LabelHTMLAttributes,
} from 'react';
import styles from './Form.module.scss';

export const Form = forwardRef<HTMLFormElement, FormHTMLAttributes<HTMLFormElement>>(
  ({ className = '', ...props }, ref) => (
    <form ref={ref} className={`${styles.form} ${className}`} {...props} />
  )
);
Form.displayName = 'Form';

export const FormField = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.field} ${className}`} {...props} />
  )
);
FormField.displayName = 'FormField';

export const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.item} ${className}`} {...props} />
  )
);
FormItem.displayName = 'FormItem';

export const FormLabel = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', ...props }, ref) => (
    <label ref={ref} className={`${styles.label} ${className}`} {...props} />
  )
);
FormLabel.displayName = 'FormLabel';

export const FormDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`${styles.description} ${className}`} {...props} />
  )
);
FormDescription.displayName = 'FormDescription';

export const FormMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} role="alert" className={`${styles.message} ${className}`} {...props} />
  )
);
FormMessage.displayName = 'FormMessage';
