import React, { forwardRef, createContext, useContext } from 'react';
import styles from './RadioGroup.module.scss';

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

export interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className = '', value, defaultValue, onValueChange, name, disabled, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <RadioGroupContext.Provider value={{ value: currentValue, onValueChange: handleChange, name, disabled }}>
        <div
          ref={ref}
          role="radiogroup"
          className={`${styles.radioGroup} ${className}`}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className = '', value, disabled: itemDisabled, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    const isChecked = context.value === value;
    const isDisabled = itemDisabled || context.disabled;

    const handleChange = () => {
      if (!isDisabled) {
        context.onValueChange?.(value);
      }
    };

    return (
      <div className={`${styles.radioItem} ${className}`}>
        <input
          ref={ref}
          type="radio"
          className={styles.input}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          name={context.name}
          onChange={handleChange}
          aria-checked={isChecked}
          {...props}
        />
        <div className={styles.indicator}>
          {isChecked && <div className={styles.dot} />}
        </div>
      </div>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';
