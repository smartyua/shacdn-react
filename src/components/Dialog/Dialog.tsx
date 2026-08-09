import {
  forwardRef,
  useEffect,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  ModalPortal,
  ModalProvider,
  useModalContext,
  useModalDescription,
  useModalDismiss,
  useModalFocus,
  useModalTitle,
  useOptionalModalContext,
} from '../Modal/modalLayer';
import styles from './Dialog.module.scss';

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

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, defaultOpen, onOpenChange, children, ...props }, ref) => (
    <ModalProvider
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      variant="dialog"
      dismissOnOverlayClick
      dismissOnEscape
      layerSlot="dialog"
    >
      <div ref={ref} data-slot="dialog-root" {...props}>
        {children}
      </div>
    </ModalProvider>
  )
);

Dialog.displayName = 'Dialog';

export const DialogOverlay = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
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
        className={`${styles.dialogOverlay} ${className}`}
        data-slot="dialog-overlay"
        onClick={handleClick}
        {...props}
      />
    );
  }
);

DialogOverlay.displayName = 'DialogOverlay';

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className = '', onClose, children, ...props }, ref) => {
    const {
      open,
      requestClose,
      contentRef,
      dismissOnEscape,
      preferCancelFocus,
      setOnCloseCallback,
      titleId,
      descriptionId,
      variant,
    } = useModalContext();

    useEffect(() => {
      setOnCloseCallback(onClose);
      return () => setOnCloseCallback(undefined);
    }, [onClose, setOnCloseCallback]);

    useModalFocus(open, contentRef, preferCancelFocus);
    useModalDismiss(open, requestClose, dismissOnEscape);

    const ariaProps: Record<string, string | boolean> = {
      role: variant === 'alertdialog' ? 'alertdialog' : 'dialog',
      'aria-modal': true,
    };
    if (titleId) {
      ariaProps['aria-labelledby'] = titleId;
    }
    if (descriptionId) {
      ariaProps['aria-describedby'] = descriptionId;
    }

    return (
      <ModalPortal className={styles.dialogRoot}>
        <DialogOverlay />
        <div
          ref={composeRefsLocal(ref, contentRef)}
          className={`${styles.dialogContent} ${className}`}
          data-slot="dialog-content"
          tabIndex={-1}
          {...ariaProps}
          {...props}
        >
          {children}
          {onClose && (
            <button
              type="button"
              className={styles.dialogClose}
              data-slot="dialog-close"
              onClick={() => requestClose()}
              aria-label="Close"
            >
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
            </button>
          )}
        </div>
      </ModalPortal>
    );
  }
);

DialogContent.displayName = 'DialogContent';

export const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.dialogHeader} ${className}`} data-slot="dialog-header" {...props} />
  )
);

DialogHeader.displayName = 'DialogHeader';

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.dialogFooter} ${className}`} data-slot="dialog-footer" {...props} />
  )
);

DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', id: idProp, ...props }, ref) => {
    const id = useModalTitle(idProp);

    return (
      <h2
        ref={ref}
        id={id}
        className={`${styles.dialogTitle} ${className}`}
        data-slot="dialog-title"
        {...props}
      />
    );
  }
);

DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className = '', id: idProp, ...props }, ref) => {
  const id = useModalDescription(idProp);

  return (
    <p
      ref={ref}
      id={id}
      className={`${styles.dialogDescription} ${className}`}
      data-slot="dialog-description"
      {...props}
    />
  );
});

DialogDescription.displayName = 'DialogDescription';
