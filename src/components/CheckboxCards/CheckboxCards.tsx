import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './CheckboxCards.module.scss';

export type CheckboxCardsSize = 'sm' | 'md' | 'lg';
export type CheckboxCardsVariant = 'surface' | 'outline';
export type CheckboxCardsColumns = 1 | 2 | 3 | 4;

type CheckboxCardsContextValue = {
  name?: string;
  value: string[];
  disabled: boolean;
  size: CheckboxCardsSize;
  variant: CheckboxCardsVariant;
  onValueChange: (next: string[]) => void;
};

const CheckboxCardsContext = createContext<CheckboxCardsContextValue | null>(null);

const useCheckboxCards = (): CheckboxCardsContextValue => {
  const context = useContext(CheckboxCardsContext);
  if (!context) {
    throw new Error('CheckboxCardsItem must be used within CheckboxCards');
  }
  return context;
};

const toList = (value: string[] | undefined): string[] => (Array.isArray(value) ? value : []);

export interface CheckboxCardsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  name?: string;
  disabled?: boolean;
  size?: CheckboxCardsSize;
  variant?: CheckboxCardsVariant;
  columns?: CheckboxCardsColumns;
  children?: ReactNode;
}

export const CheckboxCards = forwardRef<HTMLDivElement, CheckboxCardsProps>(
  (
    {
      className = '',
      value: valueControlled,
      defaultValue,
      onValueChange,
      name,
      disabled = false,
      size = 'md',
      variant = 'surface',
      columns = 1,
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
        size,
        variant,
        onValueChange: handleValueChange,
      }),
      [disabled, handleValueChange, name, size, value, variant]
    );

    return (
      <CheckboxCardsContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-slot="checkbox-cards"
          data-columns={columns}
          className={cn(styles.root, className)}
          {...props}
        >
          {children}
        </div>
      </CheckboxCardsContext.Provider>
    );
  }
);

CheckboxCards.displayName = 'CheckboxCards';

export interface CheckboxCardsItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'name'> {
  value: string;
}

export const CheckboxCardsItem = forwardRef<HTMLInputElement, CheckboxCardsItemProps>(
  ({ className = '', value, disabled: itemDisabled, children, id, ...props }, ref) => {
    const context = useCheckboxCards();
    const generatedId = useId();
    const inputId = id ?? generatedId;
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
        data-slot="checkbox-cards-item"
        data-state={checked ? 'checked' : 'unchecked'}
        className={cn(
          styles.item,
          styles[context.variant],
          styles[context.size],
          disabled && styles.disabled,
          className
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={styles.input}
          name={context.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        <span className={styles.indicator} aria-hidden />
        <span className={styles.body}>{children}</span>
      </label>
    );
  }
);

CheckboxCardsItem.displayName = 'CheckboxCardsItem';
