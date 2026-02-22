import { forwardRef, type TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.scss';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${styles.textarea} ${className || ''}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
