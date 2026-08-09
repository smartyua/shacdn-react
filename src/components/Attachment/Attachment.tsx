import {
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import styles from './Attachment.module.scss';

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';
export type AttachmentSize = 'default' | 'sm' | 'xs';
export type AttachmentOrientation = 'horizontal' | 'vertical';
export type AttachmentMediaVariant = 'icon' | 'image';

export interface AttachmentProps extends HTMLAttributes<HTMLDivElement> {
  state?: AttachmentState;
  size?: AttachmentSize;
  orientation?: AttachmentOrientation;
}

export interface AttachmentMediaProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AttachmentMediaVariant;
}

type AttachmentActionSize = ButtonProps['size'] | 'icon-xs';

export type AttachmentActionProps = Omit<ButtonProps, 'size'> & {
  size?: AttachmentActionSize;
};

type AttachmentTriggerBaseProps = {
  asChild?: boolean;
  className?: string;
};

export type AttachmentTriggerProps = AttachmentTriggerBaseProps &
  (
    | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof AttachmentTriggerBaseProps> & {
        href?: undefined;
      })
    | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof AttachmentTriggerBaseProps> & {
        href: string;
      })
  );

const cx = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' ');

const resolveActionSize = (size: AttachmentActionSize = 'icon-xs'): NonNullable<ButtonProps['size']> => {
  if (size === 'icon-xs') {
    return 'iconSm';
  }
  return size;
};

export const AttachmentGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="attachment-group"
      className={cx(styles.group, className)}
      {...props}
    />
  )
);

AttachmentGroup.displayName = 'AttachmentGroup';

export const Attachment = forwardRef<HTMLDivElement, AttachmentProps>(
  ({ state = 'done', size = 'default', orientation = 'horizontal', className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cx(
        styles.attachment,
        styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
        styles[`orientation${orientation.charAt(0).toUpperCase()}${orientation.slice(1)}`],
        className
      )}
      {...props}
    />
  )
);

Attachment.displayName = 'Attachment';

export const AttachmentMedia = forwardRef<HTMLDivElement, AttachmentMediaProps>(
  ({ variant = 'icon', className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="attachment-media"
      data-variant={variant}
      className={cx(
        styles.media,
        variant === 'image' && styles.mediaImage,
        className
      )}
      {...props}
    />
  )
);

AttachmentMedia.displayName = 'AttachmentMedia';

export const AttachmentContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="attachment-content"
      className={cx(styles.content, className)}
      {...props}
    />
  )
);

AttachmentContent.displayName = 'AttachmentContent';

export const AttachmentTitle = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="attachment-title"
      className={cx(styles.title, className)}
      {...props}
    />
  )
);

AttachmentTitle.displayName = 'AttachmentTitle';

export const AttachmentDescription = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="attachment-description"
      className={cx(styles.description, className)}
      {...props}
    />
  )
);

AttachmentDescription.displayName = 'AttachmentDescription';

export const AttachmentActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="attachment-actions"
      className={cx(styles.actions, className)}
      {...props}
    />
  )
);

AttachmentActions.displayName = 'AttachmentActions';

export const AttachmentAction = forwardRef<HTMLButtonElement | HTMLAnchorElement, AttachmentActionProps>(
  (props, ref) => {
    const { className, variant, size = 'icon-xs', href, ...rest } = props;
    const sharedProps = {
      'data-slot': 'attachment-action',
      variant: variant ?? 'ghost',
      size: resolveActionSize(size),
      className: cx(className),
    };

    if (href !== undefined) {
      return (
        <Button
          ref={ref}
          href={href}
          {...sharedProps}
          {...(rest as Omit<Extract<ButtonProps, { href: string }>, keyof typeof sharedProps | 'href'>)}
        />
      );
    }

    return (
      <Button
        ref={ref}
        {...sharedProps}
        {...(rest as Omit<Extract<ButtonProps, { href?: undefined }>, keyof typeof sharedProps>)}
      />
    );
  }
);

AttachmentAction.displayName = 'AttachmentAction';

export const AttachmentTrigger = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  AttachmentTriggerProps
>(({ asChild = false, className, children, href, type, ...props }, ref) => {
  const classes = cx(styles.trigger, className);

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      ...props,
      className: cx(classes, child.props.className),
      ...( { 'data-slot': 'attachment-trigger' } as Record<string, string> ),
    });
  }

  if (href !== undefined) {
    const anchorProps = props as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        data-slot="attachment-trigger"
        className={classes}
        {...anchorProps}
      />
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type ?? 'button'}
      data-slot="attachment-trigger"
      className={classes}
      {...buttonProps}
    />
  );
});

AttachmentTrigger.displayName = 'AttachmentTrigger';
