import { forwardRef, type HTMLAttributes, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import styles from './Pagination.module.scss';

export const Pagination = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} role="navigation" aria-label="pagination" className={`${styles.pagination} ${className || ''}`} {...props} />
  )
);
Pagination.displayName = 'Pagination';

export const PaginationList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={`${styles.list} ${className || ''}`} {...props} />
  )
);
PaginationList.displayName = 'PaginationList';

export const PaginationItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={`${styles.item} ${className || ''}`} {...props} />
  )
);
PaginationItem.displayName = 'PaginationItem';

export interface PaginationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
}

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => (
    <a 
      ref={ref} 
      className={`${styles.link} ${isActive ? styles.active : ''} ${className || ''}`}
      aria-current={isActive ? 'page' : undefined}
      {...props} 
    />
  )
);
PaginationLink.displayName = 'PaginationLink';

export interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction?: 'previous' | 'next';
}

export const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, direction, children, ...props }, ref) => (
    <button ref={ref} className={`${styles.link} ${className || ''}`} {...props}>
      {children || (direction === 'previous' ? '←' : '→')}
    </button>
  )
);
PaginationButton.displayName = 'PaginationButton';

export const PaginationEllipsis = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden className={`${styles.ellipsis} ${className || ''}`} {...props} />
  )
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
