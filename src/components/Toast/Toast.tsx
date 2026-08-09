import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FC,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import styles from './Toast.module.scss';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
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

interface ToastActionsContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface ToastStore {
  subscribe: (listener: () => void) => () => void;
  getToasts: () => Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  dispose: () => void;
}

const DEFAULT_TOAST_DURATION = 5000;

const createToastId = (): string => Math.random().toString(36).substring(7);

const createToastStore = (): ToastStore => {
  let toasts: Toast[] = [];
  const listeners = new Set<() => void>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const emit = (): void => {
    listeners.forEach((listener) => listener());
  };

  const clearTimer = (id: string): void => {
    const timer = timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.delete(id);
    }
  };

  const removeToast = (id: string): void => {
    if (!toasts.some((toast) => toast.id === id)) {
      return;
    }

    clearTimer(id);
    toasts = toasts.filter((toast) => toast.id !== id);
    emit();
  };

  const scheduleDismiss = (id: string, duration: number): void => {
    if (duration <= 0) {
      return;
    }

    clearTimer(id);
    timers.set(
      id,
      setTimeout(() => {
        removeToast(id);
      }, duration),
    );
  };

  const addToast = (toast: Omit<Toast, 'id'>): void => {
    const id = createToastId();
    toasts = [...toasts, { ...toast, id }];
    emit();
    scheduleDismiss(id, toast.duration ?? DEFAULT_TOAST_DURATION);
  };

  const dispose = (): void => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    toasts = [];
    listeners.clear();
  };

  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getToasts: () => toasts,
    addToast,
    removeToast,
    dispose,
  };
};

const ToastActionsContext = createContext<ToastActionsContextType | undefined>(undefined);
const ToastStoreContext = createContext<ToastStore | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useToastActions = (): ToastActionsContextType => {
  const actions = useContext(ToastActionsContext);
  if (!actions) {
    throw new Error('useToastActions must be used within ToastProvider');
  }
  return actions;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextType => {
  const actions = useContext(ToastActionsContext);
  const store = useContext(ToastStoreContext);

  if (!actions || !store) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const toasts = useSyncExternalStore(store.subscribe, store.getToasts, store.getToasts);

  return useMemo(
    (): ToastContextType => ({
      toasts,
      addToast: actions.addToast,
      removeToast: actions.removeToast,
    }),
    [actions, toasts],
  );
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [store] = useState(() => createToastStore());

  const actions = useMemo(
    () => ({
      addToast: (toast: Omit<Toast, 'id'>) => store.addToast(toast),
      removeToast: (id: string) => store.removeToast(id),
    }),
    [store],
  );

  useEffect(() => () => store.dispose(), [store]);

  return (
    <ToastStoreContext.Provider value={store}>
      <ToastActionsContext.Provider value={actions}>
        {children}
        <ToastViewport />
      </ToastActionsContext.Provider>
    </ToastStoreContext.Provider>
  );
};

export const ToastViewport: FC = () => {
  const store = useContext(ToastStoreContext);
  if (!store) {
    throw new Error('ToastViewport must be used within ToastProvider');
  }

  const toasts = useSyncExternalStore(store.subscribe, store.getToasts, store.getToasts);

  const toastsByPosition = toasts.reduce(
    (acc, toast) => {
      const position = toast.position ?? 'bottom-right';
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    },
    {} as Record<ToastPosition, Toast[]>,
  );

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`${styles.toastViewport} ${styles[`viewport--${position}`]}`}
        >
          {positionToasts.map((toast) => (
            <ToastItem
              key={toast.id}
              variant={toast.variant}
              position={toast.position}
              onClose={() => store.removeToast(toast.id)}
            >
              {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
              {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
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
  (
    {
      className = '',
      variant = 'default',
      position = 'bottom-right',
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    const isDestructive = variant === 'destructive';
    const positionClass = styles[`toast--${position}`];

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === 'Escape' && onClose) {
        event.preventDefault();
        onClose();
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.toast} ${styles[`toast--${variant}`]} ${positionClass} ${className}`}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div
          className={styles.toastContent}
          role={isDestructive ? 'alert' : 'status'}
          aria-live={isDestructive ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          {children}
        </div>
        {onClose ? (
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
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
              />
            </svg>
          </button>
        ) : null}
      </div>
    );
  },
);

ToastItem.displayName = 'ToastItem';

export const ToastTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return <div ref={ref} className={`${styles.toastTitle} ${className}`} {...props} />;
  },
);

ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return <div ref={ref} className={`${styles.toastDescription} ${className}`} {...props} />;
  },
);

ToastDescription.displayName = 'ToastDescription';
