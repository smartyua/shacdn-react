import { forwardRef, type HTMLAttributes } from 'react';
import styles from './AspectRatio.module.scss';

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className = '', style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`${styles.root} ${className}`}
      style={{ ...style, aspectRatio: ratio }}
      {...props}
    >
      {children}
    </div>
  )
);

AspectRatio.displayName = 'AspectRatio';
