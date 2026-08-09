import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogContentProps,
  type DialogProps,
} from '../Dialog/Dialog';
import { ModalProvider, useModalContext } from '../Modal/modalLayer';
import styles from './AlertDialog.module.scss';

export type AlertDialogProps = DialogProps;

export interface AlertDialogContentProps extends Omit<DialogContentProps, 'onClose'> {
  onClose?: () => void;
}

export const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(
  ({ open, defaultOpen, onOpenChange, children, ...props }, ref) => (
    <ModalProvider
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      variant="alertdialog"
      dismissOnOverlayClick={false}
      dismissOnEscape
      preferCancelFocus
      layerSlot="alert-dialog"
    >
      <div ref={ref} data-slot="alert-dialog-root" {...props}>
        {children}
      </div>
    </ModalProvider>
  )
);

AlertDialog.displayName = 'AlertDialog';

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className = '', children, onClose, ...props }, ref) => (
    <DialogContent
      ref={ref}
      className={`${styles.alertDialogContent} ${className}`}
      data-slot="alert-dialog-content"
      onClose={onClose}
      {...props}
    >
      {children}
    </DialogContent>
  )
);

AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <DialogHeader ref={ref} data-slot="alert-dialog-header" {...props} />
);

AlertDialogHeader.displayName = 'AlertDialogHeader';

export const AlertDialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <DialogFooter ref={ref} data-slot="alert-dialog-footer" {...props} />
);

AlertDialogFooter.displayName = 'AlertDialogFooter';

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ ...props }, ref) => <DialogTitle ref={ref} data-slot="alert-dialog-title" {...props} />
);

AlertDialogTitle.displayName = 'AlertDialogTitle';

export const AlertDialogDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ ...props }, ref) => (
  <DialogDescription ref={ref} data-slot="alert-dialog-description" {...props} />
));

AlertDialogDescription.displayName = 'AlertDialogDescription';

export const AlertDialogAction = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', disabled, onClick, ...props }, ref) => {
  const { requestClose } = useModalContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) {
      return;
    }
    requestClose();
  };

  return (
    <button
      ref={ref}
      className={`${styles.alertDialogAction} ${className}`}
      data-slot="alert-dialog-action"
      type="button"
      {...props}
      disabled={disabled}
      onClick={handleClick}
    />
  );
});

AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', disabled, onClick, ...props }, ref) => {
  const { requestClose } = useModalContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) {
      return;
    }
    requestClose();
  };

  return (
    <button
      ref={ref}
      className={`${styles.alertDialogCancel} ${className}`}
      data-slot="alert-dialog-cancel"
      type="button"
      {...props}
      disabled={disabled}
      onClick={handleClick}
    />
  );
});

AlertDialogCancel.displayName = 'AlertDialogCancel';
