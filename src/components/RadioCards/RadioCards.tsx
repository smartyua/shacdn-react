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
import styles from './RadioCards.module.scss';

export type RadioCardsSize = 'sm' | 'md' | 'lg';
export type RadioCardsVariant = 'surface' | 'outline';
export type RadioCardsColumns = 1 | 2 | 3 | 4;

type RadioCardsContextValue = {
  name: string;
  value: string;
  disabled: boolean;
  size: RadioCardsSize;
  variant: RadioCardsVariant;
  onValueChange: (next: string) => void;
};

const RadioCardsContext = createContext<RadioCardsContextValue | null>(null);

const useRadioCards = (): RadioCardsContextValue => {
  const context = useContext(RadioCardsContext);
  if (!context) {
    throw new Error('RadioCardsItem must be used within RadioCards');
  }
  return context;
};

export interface RadioCardsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  size?: RadioCardsSize;
  variant?: RadioCardsVariant;
  columns?: RadioCardsColumns;
  children?: ReactNode;
}

export const RadioCards = forwardRef<HTMLDivElement, RadioCardsProps>(
  (
    {
      className = '',
      value: valueControlled,
      defaultValue = '',
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
    const generatedName = useId();
    const fieldName = name ?? generatedName;
    const [internal, setInternal] = useState(defaultValue);
    const value = valueControlled ?? internal;

    const handleValueChange = useCallback(
      (next: string) => {
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
        name: fieldName,
        value,
        disabled,
        size,
        variant,
        onValueChange: handleValueChange,
      }),
      [disabled, fieldName, handleValueChange, size, value, variant]
    );

    return (
      <RadioCardsContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="radiogroup"
          data-slot="radio-cards"
          data-columns={columns}
          className={cn(styles.root, className)}
          {...props}
        >
          {children}
        </div>
      </RadioCardsContext.Provider>
    );
  }
);

RadioCards.displayName = 'RadioCards';

export interface RadioCardsItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'name'> {
  value: string;
}

export const RadioCardsItem = forwardRef<HTMLInputElement, RadioCardsItemProps>(
  ({ className = '', value, disabled: itemDisabled, children, id, ...props }, ref) => {
    const context = useRadioCards();
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const checked = context.value === value;
    const disabled = itemDisabled || context.disabled;

    return (
      <label
        data-slot="radio-cards-item"
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
          type="radio"
          className={styles.input}
          name={context.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => context.onValueChange(value)}
          {...props}
        />
        <span className={styles.indicator} aria-hidden>
          {checked ? <span className={styles.dot} /> : null}
        </span>
        <span className={styles.body}>{children}</span>
      </label>
    );
  }
);

RadioCardsItem.displayName = 'RadioCardsItem';
