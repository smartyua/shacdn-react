import React, { forwardRef, useState } from 'react';
import styles from './Avatar.module.scss';

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'default' | 'lg';
}

export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;

export type AvatarBadgeProps = React.HTMLAttributes<HTMLDivElement>;

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement>;

export type AvatarGroupCountProps = React.HTMLAttributes<HTMLDivElement>;

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = '', size = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.avatar} ${styles[size]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className = '', alt, onError, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setHasError(true);
      onError?.(e);
    };

    if (hasError) return null;

    return (
      <img
        ref={ref}
        alt={alt}
        className={`${styles.avatarImage} ${className}`}
        onError={handleError}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = 'AvatarImage';

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.avatarFallback} ${className}`}
        {...props}
      />
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';

export const AvatarBadge = forwardRef<HTMLDivElement, AvatarBadgeProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.avatarBadge} ${className}`}
        {...props}
      />
    );
  }
);

AvatarBadge.displayName = 'AvatarBadge';

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.avatarGroup} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export const AvatarGroupCount = forwardRef<HTMLDivElement, AvatarGroupCountProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.avatarGroupCount} ${className}`}
        {...props}
      />
    );
  }
);

AvatarGroupCount.displayName = 'AvatarGroupCount';
