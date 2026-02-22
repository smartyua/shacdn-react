import React, { forwardRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogProps,
  type DialogContentProps,
} from '../Dialog/Dialog';
import styles from './AlertDialog.module.scss';

export type AlertDialogProps = DialogProps;

export interface AlertDialogContentProps extends Omit<DialogContentProps, 'onClose'> {
  onClose?: () => void;
}

export const AlertDialog = Dialog;

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <DialogContent
        ref={ref}
        className={`${styles.alertDialogContent} ${className}`}
        {...props}
      >
        {children}
      </DialogContent>
    );
  }
);

AlertDialogContent.displayName = 'AlertDialogContent';

export const AlertDialogHeader = DialogHeader;
export const AlertDialogFooter = DialogFooter;
export const AlertDialogTitle = DialogTitle;
export const AlertDialogDescription = DialogDescription;

export const AlertDialogAction = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.alertDialogAction} ${className}`}
        {...props}
      />
    );
  }
);

AlertDialogAction.displayName = 'AlertDialogAction';

export const AlertDialogCancel = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.alertDialogCancel} ${className}`}
        {...props}
      />
    );
  }
);

AlertDialogCancel.displayName = 'AlertDialogCancel';
