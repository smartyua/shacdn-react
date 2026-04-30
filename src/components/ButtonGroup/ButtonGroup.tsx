import { type HTMLAttributes, forwardRef } from 'react';
import styles from './ButtonGroup.module.scss';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement>;

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} role="group" className={`${styles.group} ${className}`} {...props} />
  )
);

ButtonGroup.displayName = 'ButtonGroup';

export type ButtonGroupTextProps = HTMLAttributes<HTMLSpanElement>;

export const ButtonGroupText = forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  ({ className = '', ...props }, ref) => (
    <span ref={ref} className={`${styles.text} ${className}`} {...props} />
  )
);

ButtonGroupText.displayName = 'ButtonGroupText';

export type ButtonGroupSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const ButtonGroupSeparator = forwardRef<HTMLDivElement, ButtonGroupSeparatorProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} role="separator" className={`${styles.separator} ${className}`} {...props} />
  )
);

ButtonGroupSeparator.displayName = 'ButtonGroupSeparator';
