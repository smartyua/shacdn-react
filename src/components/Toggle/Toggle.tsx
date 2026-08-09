import {
  forwardRef,
  useCallback,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from 'react';
import styles from './Toggle.module.scss';

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className = '',
      pressed: pressedControlled,
      defaultPressed = false,
      onPressedChange,
      variant = 'default',
      size = 'default',
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultPressed);
    const pressed = pressedControlled ?? internal;

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) {
          return;
        }
        const next = !pressed;
        if (pressedControlled === undefined) {
          setInternal(next);
        }
        onPressedChange?.(next);
      },
      [disabled, onClick, onPressedChange, pressed, pressedControlled]
    );

    const variantClass = variant === 'outline' ? styles.variantOutline : styles.variantDefault;
    const sizeClass =
      size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeDefault;

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        data-slot="toggle"
        disabled={disabled}
        className={`${styles.toggle} ${variantClass} ${sizeClass} ${className}`}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

Toggle.displayName = 'Toggle';
