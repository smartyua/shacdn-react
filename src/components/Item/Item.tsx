import { type HTMLAttributes, forwardRef } from 'react';
import styles from './Item.module.scss';

export const Item = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.item} ${className}`} {...props} />
  )
);
Item.displayName = 'Item';

export const ItemMedia = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.media} ${className}`} {...props} />
  )
);
ItemMedia.displayName = 'ItemMedia';

export const ItemContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.content} ${className}`} {...props} />
  )
);
ItemContent.displayName = 'ItemContent';

export const ItemTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.title} ${className}`} {...props} />
  )
);
ItemTitle.displayName = 'ItemTitle';

export const ItemDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.description} ${className}`} {...props} />
  )
);
ItemDescription.displayName = 'ItemDescription';
