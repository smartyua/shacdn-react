import { forwardRef, type HTMLAttributes } from 'react';
import { X } from 'lucide-react';
import styles from './Banner.module.scss';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'warning' | 'success' | 'danger';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = 'default', dismissible = false, onDismiss, className, children, ...props }, ref) => {
    const variantClass = variant !== 'default' ? styles[variant] : '';

    return (
      <div
        ref={ref}
        role="region"
        className={`${styles.banner} ${variantClass} ${className || ''}`}
        {...props}
      >
        <div className={styles.content}>{children}</div>
        {dismissible ? (
          <button
            type="button"
            className={styles.dismiss}
            aria-label="Dismiss"
            onClick={onDismiss}
          >
            <X size={16} strokeWidth={2} />
          </button>
        ) : null}
      </div>
    );
  }
);

Banner.displayName = 'Banner';

export const BannerTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`${styles.title} ${className || ''}`}
        {...props}
      />
    );
  }
);

BannerTitle.displayName = 'BannerTitle';

export const BannerAction = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
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

BannerAction.displayName = 'BannerAction';
