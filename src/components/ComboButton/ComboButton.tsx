import { ChevronDown } from 'lucide-react';
import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu/DropdownMenu';
import styles from './ComboButton.module.scss';

type ComboButtonContextValue = {
  disabled?: boolean;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
};

const ComboButtonContext = createContext<ComboButtonContextValue>({});

const useComboButton = (): ComboButtonContextValue => useContext(ComboButtonContext);

export interface ComboButtonProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  children: ReactNode;
}

export const ComboButton = ({
  disabled,
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: ComboButtonProps) => {
  const value = useMemo(
    () => ({ disabled, variant, size }),
    [disabled, variant, size]
  );

  return (
    <ComboButtonContext.Provider value={value}>
      <ButtonGroup
        className={`${styles.comboButton} ${className}`}
        data-slot="combo-button"
        {...props}
      >
        {children}
      </ButtonGroup>
    </ComboButtonContext.Provider>
  );
};

export type ComboButtonActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
};

export const ComboButtonAction = forwardRef<HTMLButtonElement, ComboButtonActionProps>(
  ({ className = '', disabled: disabledProp, variant, size, type = 'button', ...props }, ref) => {
    const ctx = useComboButton();

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant ?? ctx.variant}
        size={size ?? ctx.size}
        disabled={disabledProp ?? ctx.disabled}
        className={`${styles.action} ${className}`}
        data-slot="combo-button-action"
        {...props}
      />
    );
  }
);

ComboButtonAction.displayName = 'ComboButtonAction';

export interface ComboButtonMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
}

export const ComboButtonMenu = ({
  children,
  align = 'end',
  className = '',
  ...props
}: ComboButtonMenuProps) => {
  const { disabled, variant, size } = useComboButton();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size === 'icon' ? 'icon' : size}
          disabled={disabled}
          className={`${styles.menuTrigger} ${className}`}
          aria-label="Open menu"
          data-slot="combo-button-menu-trigger"
        >
          <ChevronDown size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={styles.menuContent} {...props}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
