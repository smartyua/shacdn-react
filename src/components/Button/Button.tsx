import {
  forwardRef,
  type Ref,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';
import styles from './Button.module.scss';

interface BaseButtonShared {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'iconSm' | 'iconLg';
}

type ButtonVariant = NonNullable<BaseButtonShared['variant']>;
type ButtonSize = NonNullable<BaseButtonShared['size']>;

interface ButtonNativeProps extends BaseButtonShared, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonShared> {
  href?: undefined;
}

interface AnchorButtonProps extends BaseButtonShared, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonShared> {
  href: string;
}

export type ButtonProps = ButtonNativeProps | AnchorButtonProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    { variant = 'default', size = 'md', className, children, ...props },
    ref
  ) => {
    const variantClass = styles[variant as ButtonVariant];
    const sizeClass = styles[size as ButtonSize];
    const classes = `${styles.button} ${variantClass} ${sizeClass} ${className || ''}`;

    if ('href' in props && props.href !== undefined) {
      const { href, ...anchorRest } = props;
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }

    const buttonProps = props as ButtonNativeProps;

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={buttonProps.type ?? 'button'}
        className={classes}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
