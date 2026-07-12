import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Message.module.scss';

export type MessageGroupProps = HTMLAttributes<HTMLDivElement>;

export const MessageGroup = forwardRef<HTMLDivElement, MessageGroupProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message-group"
      className={`${styles.group} ${className}`}
      {...props}
    />
  )
);
MessageGroup.displayName = 'MessageGroup';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'end';
};

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ className = '', align = 'start', ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message"
      data-align={align}
      className={`${styles.message} ${className}`}
      {...props}
    />
  )
);
Message.displayName = 'Message';

export type MessageAvatarProps = HTMLAttributes<HTMLDivElement>;

export const MessageAvatar = forwardRef<HTMLDivElement, MessageAvatarProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message-avatar"
      className={`${styles.avatar} ${className}`}
      {...props}
    />
  )
);
MessageAvatar.displayName = 'MessageAvatar';

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message-content"
      className={`${styles.content} ${className}`}
      {...props}
    />
  )
);
MessageContent.displayName = 'MessageContent';

export type MessageHeaderProps = HTMLAttributes<HTMLDivElement>;

export const MessageHeader = forwardRef<HTMLDivElement, MessageHeaderProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message-header"
      className={`${styles.header} ${className}`}
      {...props}
    />
  )
);
MessageHeader.displayName = 'MessageHeader';

export type MessageFooterProps = HTMLAttributes<HTMLDivElement>;

export const MessageFooter = forwardRef<HTMLDivElement, MessageFooterProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message-footer"
      className={`${styles.footer} ${className}`}
      {...props}
    />
  )
);
MessageFooter.displayName = 'MessageFooter';
