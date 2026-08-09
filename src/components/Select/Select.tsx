import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
} from '../Floating/Floating';
import styles from './Select.module.scss';

interface SelectContextValue {
  id: string;
  listboxId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | undefined;
  select: (value: string) => void;
  disabled: boolean;
  labels: Map<string, ReactNode>;
  values: string[];
  activeValue: string | undefined;
  setActiveValue: (value: string | undefined) => void;
  // Kept as an element in state rather than a ref so the context stays render-safe.
  triggerElement: HTMLButtonElement | null;
  setTriggerElement: (element: HTMLButtonElement | null) => void;
  optionId: (value: string) => string;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

const useSelectContext = (component: string): SelectContextValue => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error(`${component} must be used within <Select>`);
  }
  return context;
};

/**
 * Walks the declarative child tree to map item values to their labels. Items only mount
 * while the popup is open, so the trigger cannot read them from mounted descendants.
 */
const collectItems = (children: ReactNode, into: Map<string, ReactNode>): void => {
  Children.forEach(children, child => {
    if (!isValidElement(child)) {
      return;
    }

    const props = child.props as { value?: string; children?: ReactNode; disabled?: boolean };
    if (child.type === SelectItem && typeof props.value === 'string') {
      into.set(props.value, props.children);
      return;
    }

    if (props.children !== undefined) {
      collectItems(props.children, into);
    }
  });
};

const collectDisabledValues = (children: ReactNode, into: Set<string>): void => {
  Children.forEach(children, child => {
    if (!isValidElement(child)) {
      return;
    }

    const props = child.props as { value?: string; children?: ReactNode; disabled?: boolean };
    if (child.type === SelectItem && typeof props.value === 'string') {
      if (props.disabled) {
        into.add(props.value);
      }
      return;
    }

    if (props.children !== undefined) {
      collectDisabledValues(props.children, into);
    }
  });
};

export interface SelectProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** Renders a hidden input so the selection participates in native form submission. */
  name?: string;
  required?: boolean;
  className?: string;
}

export const Select = ({
  children,
  value: valueControlled,
  defaultValue,
  onValueChange,
  disabled = false,
  name,
  required,
  className = '',
}: SelectProps) => {
  const generatedId = useId();
  const id = generatedId;
  const listboxId = `${id}-listbox`;

  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const [open, setOpenState] = useState(false);
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined);
  const [triggerElement, setTriggerElement] = useState<HTMLButtonElement | null>(null);

  const value = valueControlled ?? internal;

  const { labels, values } = useMemo(() => {
    const map = new Map<string, ReactNode>();
    collectItems(children, map);
    const disabledValues = new Set<string>();
    collectDisabledValues(children, disabledValues);
    return {
      labels: map,
      values: [...map.keys()].filter(v => !disabledValues.has(v)),
    };
  }, [children]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled) {
        return;
      }
      setOpenState(next);
      if (!next) {
        setActiveValue(undefined);
        triggerElement?.focus();
      }
    },
    [disabled, triggerElement]
  );

  const select = useCallback(
    (next: string) => {
      if (valueControlled === undefined) {
        setInternal(next);
      }
      onValueChange?.(next);
      setOpen(false);
    },
    [valueControlled, onValueChange, setOpen]
  );

  const optionId = useCallback((v: string) => `${id}-option-${v.replace(/\s+/g, '-')}`, [id]);

  const context = useMemo<SelectContextValue>(
    () => ({
      id,
      listboxId,
      open,
      setOpen,
      value,
      select,
      disabled,
      labels,
      values,
      activeValue,
      setActiveValue,
      triggerElement,
      setTriggerElement,
      optionId,
    }),
    [
      id,
      listboxId,
      open,
      setOpen,
      value,
      select,
      disabled,
      labels,
      values,
      activeValue,
      triggerElement,
      optionId,
    ]
  );

  return (
    <SelectContext.Provider value={context}>
      <div className={`${styles.root} ${className}`} data-slot="select">
        {children}
        {name !== undefined && (
          <input type="hidden" name={name} value={value ?? ''} required={required} />
        )}
      </div>
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  size?: 'sm' | 'md';
}

export const SelectTrigger = ({
  children,
  className = '',
  size = 'md',
  onKeyDown,
  onClick,
  ...props
}: SelectTriggerProps) => {
  const { setTriggerElement, open, listboxId, disabled, value, values, setActiveValue, setOpen } =
    useSelectContext('SelectTrigger');

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveValue(value ?? values[event.key === 'ArrowUp' ? values.length - 1 : 0]);
      setOpen(true);
    }
  };

  return (
    <button
      ref={setTriggerElement}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-haspopup="listbox"
      disabled={disabled}
      data-slot="select-trigger"
      data-size={size}
      data-state={open ? 'open' : 'closed'}
      className={`${styles.trigger} ${size === 'sm' ? styles.triggerSm : ''} ${className}`}
      onClick={event => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        setActiveValue(value ?? values[0]);
        setOpen(!open);
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
      <svg
        className={styles.triggerIcon}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
};

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const SelectValue = ({ placeholder, className = '', ...props }: SelectValueProps) => {
  const ctx = useSelectContext('SelectValue');
  const label = ctx.value === undefined ? undefined : ctx.labels.get(ctx.value);
  const isPlaceholder = label === undefined;

  return (
    <span
      data-slot="select-value"
      data-placeholder={isPlaceholder ? '' : undefined}
      className={`${styles.value} ${isPlaceholder ? styles.valuePlaceholder : ''} ${className}`}
      {...props}
    >
      {isPlaceholder ? placeholder : label}
    </span>
  );
};

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom';
  sideOffset?: number;
}

export const SelectContent = ({
  children,
  className = '',
  side = 'bottom',
  sideOffset = 4,
  ...props
}: SelectContentProps) => {
  const ctx = useSelectContext('SelectContent');
  const contentRef = useRef<HTMLDivElement>(null);
  const anchorRef = useMemo(() => ({ current: ctx.triggerElement }), [ctx.triggerElement]);

  const { style, floatingProps, isPositioned } = useFloatingPosition({
    anchorRef,
    floatingRef: contentRef,
    open: ctx.open,
    side,
    align: 'start',
    sideOffset,
    sameWidth: true,
  });

  useDismissLayer({
    open: ctx.open,
    onDismiss: () => ctx.setOpen(false),
    contentRef,
    excludeRefs: [anchorRef],
    dismissOnEscape: true,
    dismissOnOutsidePointer: true,
  });

  // The listbox itself takes focus and drives selection through aria-activedescendant.
  // Gated on `isPositioned`: until the first measurement lands the surface is still
  // `visibility: hidden`, and hidden elements silently reject focus().
  useEffect(() => {
    if (ctx.open && isPositioned) {
      contentRef.current?.focus();
    }
  }, [ctx.open, isPositioned]);

  if (!ctx.open) {
    return null;
  }

  const move = (delta: number) => {
    const { values } = ctx;
    if (values.length === 0) {
      return;
    }
    const current = ctx.activeValue === undefined ? -1 : values.indexOf(ctx.activeValue);
    const next = current === -1 ? (delta > 0 ? 0 : values.length - 1) : current + delta;
    ctx.setActiveValue(values[Math.min(Math.max(next, 0), values.length - 1)]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        ctx.setActiveValue(ctx.values[0]);
        break;
      case 'End':
        event.preventDefault();
        ctx.setActiveValue(ctx.values[ctx.values.length - 1]);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (ctx.activeValue !== undefined) {
          ctx.select(ctx.activeValue);
        }
        break;
      case 'Tab':
        ctx.setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <FloatingPortal>
      <div
        ref={contentRef}
        id={ctx.listboxId}
        role="listbox"
        tabIndex={-1}
        aria-activedescendant={ctx.activeValue ? ctx.optionId(ctx.activeValue) : undefined}
        data-slot="select-content"
        className={`${styles.content} ${className}`}
        style={style}
        onKeyDown={handleKeyDown}
        {...floatingProps}
        {...props}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};

export interface SelectItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value: string;
  disabled?: boolean;
}

export const SelectItem = ({
  value,
  disabled = false,
  children,
  className = '',
  ...props
}: SelectItemProps) => {
  const ctx = useSelectContext('SelectItem');
  const selected = ctx.value === value;
  const active = ctx.activeValue === value;

  return (
    <div
      id={ctx.optionId(value)}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-slot="select-item"
      data-state={selected ? 'checked' : 'unchecked'}
      className={`${styles.item} ${active ? styles.itemActive : ''} ${className}`}
      onPointerDown={event => {
        event.preventDefault();
        if (!disabled) {
          ctx.select(value);
        }
      }}
      onPointerMove={() => {
        if (!disabled) {
          ctx.setActiveValue(value);
        }
      }}
      {...props}
    >
      <span className={styles.itemIndicator} aria-hidden="true">
        {selected && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className={styles.itemLabel}>{children}</span>
    </div>
  );
};

export type SelectGroupProps = HTMLAttributes<HTMLDivElement>;

export const SelectGroup = ({ className = '', ...props }: SelectGroupProps) => (
  <div role="group" data-slot="select-group" className={`${styles.group} ${className}`} {...props} />
);

export type SelectLabelProps = HTMLAttributes<HTMLDivElement>;

export const SelectLabel = ({ className = '', ...props }: SelectLabelProps) => (
  <div data-slot="select-label" className={`${styles.label} ${className}`} {...props} />
);

export type SelectSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const SelectSeparator = ({ className = '', ...props }: SelectSeparatorProps) => (
  <div
    role="presentation"
    data-slot="select-separator"
    className={`${styles.separator} ${className}`}
    {...props}
  />
);
