import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Marker.module.scss';

export type MarkerVariant = 'default' | 'separator' | 'border';

export interface MarkerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: MarkerVariant;
}

const cx = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' ');

export const Marker = forwardRef<HTMLDivElement, MarkerProps>(
  ({ variant = 'default', className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="marker"
      data-variant={variant}
      className={cx(
        styles.marker,
        styles[`variant${variant.charAt(0).toUpperCase()}${variant.slice(1)}`],
        className
      )}
      {...props}
    />
  )
);

Marker.displayName = 'Marker';

export const MarkerIcon = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="marker-icon"
      aria-hidden="true"
      className={cx(styles.icon, className)}
      {...props}
    />
  )
);

MarkerIcon.displayName = 'MarkerIcon';

export const MarkerContent = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="marker-content"
      className={cx(styles.content, className)}
      {...props}
    />
  )
);

MarkerContent.displayName = 'MarkerContent';
