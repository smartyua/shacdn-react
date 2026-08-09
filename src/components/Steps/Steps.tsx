import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Check } from 'lucide-react';
import styles from './Steps.module.scss';

interface StepsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  stepValues: string[];
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

const useStepsContext = (): StepsContextValue => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error('StepsItem must be used within Steps');
  }
  return context;
};

export interface StepsProps extends HTMLAttributes<HTMLOListElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Steps = forwardRef<HTMLOListElement, StepsProps>(
  (
    {
      value,
      defaultValue = '',
      onValueChange,
      orientation = 'horizontal',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue);
    const currentValue = value ?? internalValue;

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [onValueChange, value]
    );

    const stepValues = useMemo(() => {
      const values: string[] = [];
      Children.forEach(children, child => {
        if (isValidElement(child) && child.type === StepsItem) {
          const itemProps = child.props as StepsItemProps;
          values.push(itemProps.value);
        }
      });
      return values;
    }, [children]);

    const contextValue = useMemo(
      () => ({
        value: currentValue,
        onValueChange: handleValueChange,
        orientation,
        stepValues,
      }),
      [currentValue, handleValueChange, orientation, stepValues]
    );

    const orientationClass =
      orientation === 'vertical' ? styles.vertical : styles.horizontal;

    return (
      <StepsContext.Provider value={contextValue}>
        <ol
          ref={ref}
          className={`${styles.steps} ${orientationClass} ${className || ''}`}
          {...props}
        >
          {children}
        </ol>
      </StepsContext.Provider>
    );
  }
);

Steps.displayName = 'Steps';

export interface StepsItemProps extends HTMLAttributes<HTMLLIElement> {
  value: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export const StepsItem = forwardRef<HTMLLIElement, StepsItemProps>(
  ({ value, title, description, disabled = false, className, ...props }, ref) => {
    const { value: currentValue, onValueChange, stepValues } = useStepsContext();

    const currentIndex = stepValues.indexOf(currentValue);
    const stepIndex = stepValues.indexOf(value);
    const isCurrent = currentValue === value;
    const isCompleted = stepIndex >= 0 && stepIndex < currentIndex;
    const isUpcoming = stepIndex > currentIndex;
    const isClickable = !disabled && (isCompleted || isUpcoming);

    const handleClick = (e: MouseEvent<HTMLLIElement>) => {
      props.onClick?.(e);
      if (e.defaultPrevented || !isClickable) {
        return;
      }
      onValueChange(value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
      props.onKeyDown?.(e);
      if (e.defaultPrevented || !isClickable) {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onValueChange(value);
      }
    };

    const stateClass = isCurrent
      ? styles.current
      : isCompleted
        ? styles.completed
        : styles.upcoming;

    return (
      <li
        ref={ref}
        className={`${styles.item} ${stateClass} ${disabled ? styles.disabled : ''} ${isClickable ? styles.clickable : ''} ${className || ''}`}
        aria-current={isCurrent ? 'step' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div className={styles.indicator}>
          <span className={styles.circle} aria-hidden="true">
            {isCompleted ? <Check size={14} strokeWidth={2.5} /> : stepIndex + 1}
          </span>
          <span className={styles.connector} aria-hidden="true" />
        </div>
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
          {description ? <span className={styles.description}>{description}</span> : null}
        </div>
      </li>
    );
  }
);

StepsItem.displayName = 'StepsItem';
