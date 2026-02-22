import React, { forwardRef, useState, useEffect, useRef } from 'react';
import styles from './DropdownMenu.module.scss';

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export type DropdownMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} className={styles.dropdownMenu}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child as React.ReactElement<{ onClick?: () => void }>, {
              onClick: () => setOpen(!open),
            });
          }
          if (child.type === DropdownMenuContent) {
            return React.cloneElement(child as React.ReactElement<{ open?: boolean; onClose?: () => void }>, {
              open,
              onClose: () => setOpen(false),
            });
          }
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`${styles.dropdownMenuTrigger} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

interface DropdownMenuContentPropsInternal extends DropdownMenuContentProps {
  open?: boolean;
  onClose?: () => void;
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentPropsInternal>(
  ({ className = '', align = 'end', sideOffset = 4, open, onClose, children, ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={`${styles.dropdownMenuContent} ${styles[`align-${align}`]} ${className}`}
        style={{ marginTop: `${sideOffset}px` }}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === DropdownMenuItem) {
            return React.cloneElement(child as React.ReactElement<{ onClose?: () => void }>, { onClose });
          }
          return child;
        })}
      </div>
    );
  }
);

DropdownMenuContent.displayName = 'DropdownMenuContent';

interface DropdownMenuItemPropsInternal extends DropdownMenuItemProps {
  onClose?: () => void;
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemPropsInternal>(
  ({ className = '', disabled, onClick, onClose, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
      onClose?.();
    };

    return (
      <div
        ref={ref}
        className={`${styles.dropdownMenuItem} ${disabled ? styles.disabled : ''} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.dropdownMenuSeparator} ${className}`}
        {...props}
      />
    );
  }
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuLabel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.dropdownMenuLabel} ${className}`}
        {...props}
      />
    );
  }
);

DropdownMenuLabel.displayName = 'DropdownMenuLabel';
