import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { composeRefs } from '../Floating/Floating';
import styles from './PasswordToggleField.module.scss';

type PasswordToggleFieldContextValue = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  toggleId: string;
};

const PasswordToggleFieldContext = createContext<PasswordToggleFieldContextValue | null>(null);

const usePasswordToggleField = (): PasswordToggleFieldContextValue => {
  const context = useContext(PasswordToggleFieldContext);
  if (!context) {
    throw new Error('PasswordToggleField parts must be used within PasswordToggleField');
  }
  return context;
};

export interface PasswordToggleFieldProps extends HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  children: ReactNode;
}

export const PasswordToggleField = forwardRef<HTMLDivElement, PasswordToggleFieldProps>(
  (
    {
      visible: visibleControlled,
      defaultVisible = false,
      onVisibleChange,
      className = '',
      children,
      id,
      ...props
    },
    ref
  ) => {
    const [internalVisible, setInternalVisible] = useState(defaultVisible);
    const visible = visibleControlled ?? internalVisible;
    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const reactId = useId();
    const inputId = id ?? `${reactId}-input`;
    const toggleId = `${reactId}-toggle`;

    const setVisible = useCallback(
      (next: boolean) => {
        if (visibleControlled === undefined) {
          setInternalVisible(next);
        }
        onVisibleChange?.(next);
      },
      [onVisibleChange, visibleControlled]
    );

    useEffect(() => {
      const root = rootRef.current;
      if (!root) {
        return;
      }
      const form = root.closest('form');
      if (!form) {
        return;
      }
      const handleSubmit = () => {
        setVisible(false);
      };
      form.addEventListener('submit', handleSubmit);
      return () => {
        form.removeEventListener('submit', handleSubmit);
      };
    }, [setVisible]);

    const contextValue = useMemo(
      () => ({
        visible,
        setVisible,
        inputId,
        inputRef,
        toggleId,
      }),
      [inputId, setVisible, toggleId, visible]
    );

    return (
      <PasswordToggleFieldContext.Provider value={contextValue}>
        <div
          ref={composeRefs(ref, rootRef)}
          data-slot="password-toggle-field"
          className={`${styles.root} ${className}`}
          {...props}
        >
          {children}
        </div>
      </PasswordToggleFieldContext.Provider>
    );
  }
);

PasswordToggleField.displayName = 'PasswordToggleField';

export type PasswordToggleFieldInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const PasswordToggleFieldInput = forwardRef<HTMLInputElement, PasswordToggleFieldInputProps>(
  ({ className = '', id, autoComplete = 'current-password', ...props }, ref) => {
    const { visible, inputId, inputRef } = usePasswordToggleField();

    return (
      <input
        ref={composeRefs(ref, inputRef)}
        id={id ?? inputId}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        data-slot="password-toggle-field-input"
        className={`${styles.input} ${className}`}
        {...props}
      />
    );
  }
);

PasswordToggleFieldInput.displayName = 'PasswordToggleFieldInput';

export type PasswordToggleFieldToggleProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const PasswordToggleFieldToggle = forwardRef<HTMLButtonElement, PasswordToggleFieldToggleProps>(
  ({ className = '', children, onClick, id, 'aria-label': ariaLabel, ...props }, ref) => {
    const { visible, setVisible, inputRef, toggleId } = usePasswordToggleField();
    const label = ariaLabel ?? (visible ? 'Hide password' : 'Show password');

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }
      setVisible(!visible);
      // Pointer clicks have detail > 0; keyboard activation uses detail === 0.
      if (event.detail > 0) {
        inputRef.current?.focus();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        id={id ?? toggleId}
        aria-label={label}
        aria-pressed={visible}
        data-slot="password-toggle-field-toggle"
        data-state={visible ? 'visible' : 'hidden'}
        className={`${styles.toggle} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PasswordToggleFieldToggle.displayName = 'PasswordToggleFieldToggle';

export interface PasswordToggleFieldIconProps {
  visible: ReactNode;
  hidden: ReactNode;
  className?: string;
}

export const PasswordToggleFieldIcon = ({
  visible: visibleIcon,
  hidden: hiddenIcon,
  className = '',
}: PasswordToggleFieldIconProps) => {
  const { visible } = usePasswordToggleField();
  return (
    <span className={className} data-slot="password-toggle-field-icon" aria-hidden="true">
      {visible ? visibleIcon : hiddenIcon}
    </span>
  );
};

PasswordToggleFieldIcon.displayName = 'PasswordToggleFieldIcon';
