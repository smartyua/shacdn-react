import { type HTMLAttributes, forwardRef } from 'react';
import styles from './Empty.module.scss';

export const Empty = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.empty} ${className}`} {...props} />
  )
);
Empty.displayName = 'Empty';

export const EmptyHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.header} ${className}`} {...props} />
  )
);
EmptyHeader.displayName = 'EmptyHeader';

export const EmptyMedia = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.media} ${className}`} {...props} />
  )
);
EmptyMedia.displayName = 'EmptyMedia';

export const EmptyTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h3 ref={ref} className={`${styles.title} ${className}`} {...props} />
  )
);
EmptyTitle.displayName = 'EmptyTitle';

export const EmptyDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`${styles.description} ${className}`} {...props} />
  )
);
EmptyDescription.displayName = 'EmptyDescription';

export const EmptyContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.content} ${className}`} {...props} />
  )
);
EmptyContent.displayName = 'EmptyContent';
