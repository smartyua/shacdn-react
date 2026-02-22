import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Alert.module.scss';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    const variantClass = variant === 'destructive' ? styles.destructive : '';
    
    return (
      <div
        ref={ref}
        role="alert"
        className={`${styles.alert} ${variantClass} ${className || ''}`}
        {...props}
      />
    );
  }
);

Alert.displayName = 'Alert';

export const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={`${styles.title} ${className || ''}`}
        {...props}
      />
    );
  }
);

AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.description} ${className || ''}`}
        {...props}
      />
    );
  }
);

AlertDescription.displayName = 'AlertDescription';

export const AlertAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.action} ${className || ''}`}
        {...props}
      />
    );
  }
);

AlertAction.displayName = 'AlertAction';
