import React, { createContext, useContext, useState, forwardRef, useEffect } from 'react';
import styles from './Toast.module.scss';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  duration?: number;
  onClose?: () => void;
}

export type ToastPosition = 'top-center' | 'top-right' | 'bottom-right' | 'bottom-center';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  position?: ToastPosition;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
};

export const ToastViewport: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'bottom-right';
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, Toast[]>);

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div key={position} className={`${styles.toastViewport} ${styles[`viewport--${position}`]}`}>
          {positionToasts.map(toast => (
            <ToastItem
              key={toast.id}
              variant={toast.variant}
              duration={toast.duration}
              position={toast.position}
              onClose={() => removeToast(toast.id)}
            >
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            </ToastItem>
          ))}
        </div>
      ))}
    </>
  );
};

interface ToastItemProps extends ToastProps {
  position?: ToastPosition;
}

export const ToastItem = forwardRef<HTMLDivElement, ToastItemProps>(
  ({ className = '', variant = 'default', duration = 5000, position = 'bottom-right', onClose, children, ...props }, ref) => {
    useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const positionClass = styles[`toast--${position}`];

    return (
      <div
        ref={ref}
        className={`${styles.toast} ${styles[`toast--${variant}`]} ${positionClass} ${className}`}
        {...props}
      >
        <div className={styles.toastContent}>{children}</div>
        {onClose && (
          <button
            type="button"
            className={styles.toastClose}
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

ToastItem.displayName = 'ToastItem';

export const ToastTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return <div ref={ref} className={`${styles.toastTitle} ${className}`} {...props} />;
  }
);

ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return <div ref={ref} className={`${styles.toastDescription} ${className}`} {...props} />;
  }
);

ToastDescription.displayName = 'ToastDescription';
