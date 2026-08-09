import {
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import styles from './Bubble.module.scss';

export type BubbleVariant =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'tinted'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type BubbleAlign = 'start' | 'end';
export type BubbleReactionSide = 'top' | 'bottom';
export type BubbleReactionAlign = 'start' | 'end';

export interface BubbleProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BubbleVariant;
  align?: BubbleAlign;
}

export interface BubbleContentProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export interface BubbleReactionsProps extends HTMLAttributes<HTMLDivElement> {
  side?: BubbleReactionSide;
  align?: BubbleReactionAlign;
}

const cx = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(' ');

export const BubbleGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="bubble-group"
      className={cx(styles.group, className)}
      {...props}
    />
  )
);

BubbleGroup.displayName = 'BubbleGroup';

export const Bubble = forwardRef<HTMLDivElement, BubbleProps>(
  ({ variant = 'default', align = 'start', className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cx(
        styles.bubble,
        styles[`variant${variant.charAt(0).toUpperCase()}${variant.slice(1)}`],
        align === 'end' && styles.alignEnd,
        className
      )}
      {...props}
    />
  )
);

Bubble.displayName = 'Bubble';

export const BubbleContent = forwardRef<HTMLDivElement, BubbleContentProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const classes = cx(styles.content, className);

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>;
      return cloneElement(child, {
        ...props,
        className: cx(classes, child.props.className),
        ...( { 'data-slot': 'bubble-content' } as Record<string, string> ),
      });
    }

    return (
      <div
        ref={ref}
        data-slot="bubble-content"
        className={classes}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BubbleContent.displayName = 'BubbleContent';

export const BubbleReactions = forwardRef<HTMLDivElement, BubbleReactionsProps>(
  ({ side = 'bottom', align = 'end', className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="bubble-reactions"
      data-side={side}
      data-align={align}
      className={cx(
        styles.reactions,
        styles[`reactionSide${side.charAt(0).toUpperCase()}${side.slice(1)}`],
        styles[`reactionAlign${align.charAt(0).toUpperCase()}${align.slice(1)}`],
        className
      )}
      {...props}
    />
  )
);

BubbleReactions.displayName = 'BubbleReactions';
