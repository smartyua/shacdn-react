import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './CheckboxGroup.module.scss';

type CheckboxGroupContextValue = {
  name?: string;
  value: string[];
  disabled: boolean;
  onValueChange: (next: string[]) => void;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

const useCheckboxGroup = (): CheckboxGroupContextValue => {
  const context = useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error('CheckboxGroupItem must be used within CheckboxGroup');
  }
  return context;
};

const toList = (value: string[] | undefined): string[] => (Array.isArray(value) ? value : []);

export interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  name?: string;
  disabled?: boolean;
  children?: ReactNode;
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      className = '',
      value: valueControlled,
      defaultValue,
      onValueChange,
      name,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(() => toList(defaultValue));
    const value = valueControlled !== undefined ? toList(valueControlled) : internal;

    const handleValueChange = useCallback(
      (next: string[]) => {
        if (disabled) {
          return;
        }
        if (valueControlled === undefined) {
          setInternal(next);
        }
        onValueChange?.(next);
      },
      [disabled, onValueChange, valueControlled]
    );

    const contextValue = useMemo(
      () => ({
        name,
        value,
        disabled,
        onValueChange: handleValueChange,
      }),
      [disabled, handleValueChange, name, value]
    );

    return (
      <CheckboxGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-slot="checkbox-group"
          className={cn(styles.root, className)}
          {...props}
        >
          {children}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

export interface CheckboxGroupItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'name'> {
  value: string;
}

export const CheckboxGroupItem = forwardRef<HTMLInputElement, CheckboxGroupItemProps>(
  ({ className = '', value, disabled: itemDisabled, children, id, ...props }, ref) => {
    const context = useCheckboxGroup();
    const checked = context.value.includes(value);
    const disabled = itemDisabled || context.disabled;

    const handleChange = () => {
      const next = checked
        ? context.value.filter((item) => item !== value)
        : [...context.value, value];
      context.onValueChange(next);
    };

    return (
      <label
        data-slot="checkbox-group-item"
        className={cn(styles.item, disabled && styles.disabled, className)}
      >
        <Checkbox
          ref={ref}
          id={id}
          name={context.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        {children ? <span className={styles.text}>{children}</span> : null}
      </label>
    );
  }
);

CheckboxGroupItem.displayName = 'CheckboxGroupItem';
