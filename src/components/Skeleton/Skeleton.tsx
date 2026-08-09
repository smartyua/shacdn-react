import React, { forwardRef } from 'react';
import styles from './Skeleton.module.scss';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.skeleton} ${className}`}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
