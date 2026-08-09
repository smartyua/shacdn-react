import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  ModalPortal,
  ModalProvider,
  useModalContext,
  useModalDismiss,
  useModalFocus,
  useOptionalModalContext,
} from '../Modal/modalLayer';
import styles from './Lightbox.module.scss';

const composeRefsLocal =
  <T,>(...refs: Array<React.Ref<T> | undefined>) =>
  (node: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };

export interface LightboxProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export const Lightbox = forwardRef<HTMLDivElement, LightboxProps>(
  ({ open, defaultOpen, onOpenChange, children, ...props }, ref) => (
    <ModalProvider
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      variant="dialog"
      dismissOnOverlayClick
      dismissOnEscape
      layerSlot="lightbox"
    >
      <div ref={ref} data-slot="lightbox-root" {...props}>
        {children}
      </div>
    </ModalProvider>
  )
);

Lightbox.displayName = 'Lightbox';

export type LightboxTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export const LightboxTrigger = forwardRef<HTMLElement, LightboxTriggerProps>(
  ({ asChild = false, className = '', children, onClick, ...props }, ref) => {
    const ctx = useOptionalModalContext();
    const setOpen = ctx?.setOpen;

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      onClick?.(e as MouseEvent<HTMLButtonElement>);
      if (!e.defaultPrevented) {
        setOpen?.(true);
      }
    };

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        onClick?: (e: MouseEvent<HTMLElement>) => void;
        ref?: RefObject<HTMLElement | null>;
      }>;

      return cloneElement(child, {
        ...props,
        ref,
        className: `${styles.trigger} ${child.props.className ?? ''} ${className}`.trim(),
        'data-slot': 'lightbox-trigger',
        onClick: (e: MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          handleClick(e);
        },
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={`${styles.trigger} ${className}`}
        data-slot="lightbox-trigger"
        onClick={handleClick as (e: MouseEvent<HTMLButtonElement>) => void}
        {...props}
      >
        {children}
      </button>
    );
  }
);

LightboxTrigger.displayName = 'LightboxTrigger';

export const LightboxOverlay = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', onClick, ...props }, ref) => {
    const ctx = useOptionalModalContext();
    const dismissOnOverlayClick = ctx?.dismissOnOverlayClick ?? true;
    const requestClose = ctx?.requestClose;

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || !dismissOnOverlayClick) {
        return;
      }
      requestClose?.();
    };

    return (
      <div
        ref={ref}
        className={`${styles.overlay} ${className}`}
        data-slot="lightbox-overlay"
        onClick={handleClick}
        {...props}
      />
    );
  }
);

LightboxOverlay.displayName = 'LightboxOverlay';

export const LightboxContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    const { open, requestClose, contentRef, dismissOnEscape } = useModalContext();

    useModalFocus(open, contentRef, false);
    useModalDismiss(open, requestClose, dismissOnEscape);

    return (
      <ModalPortal className={styles.lightboxRoot}>
        <LightboxOverlay />
        <div
          ref={composeRefsLocal(ref, contentRef)}
          role="dialog"
          aria-modal="true"
          className={`${styles.content} ${className}`}
          data-slot="lightbox-content"
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </ModalPortal>
    );
  }
);

LightboxContent.displayName = 'LightboxContent';

export const LightboxClose = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(
  ({ className = '', children, onClick, ...props }, ref) => {
    const ctx = useOptionalModalContext();
    const requestClose = ctx?.requestClose;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        requestClose?.();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={`${styles.close} ${className}`}
        aria-label="Close lightbox"
        data-slot="lightbox-close"
        onClick={handleClick}
        {...props}
      >
        {children ?? (
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    );
  }
);

LightboxClose.displayName = 'LightboxClose';
