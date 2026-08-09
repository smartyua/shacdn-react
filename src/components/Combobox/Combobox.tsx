import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import {
  FloatingPortal,
  composeRefs,
  useDismissLayer,
  useFloatingPosition,
} from '../Floating/Floating';
import styles from './Combobox.module.scss';

export type ComboboxSize = 'sm' | 'md' | 'lg';
export type ComboboxVariant = 'outline' | 'soft';

export interface ComboboxOption {
  value: string;
  label: string;
}

type ComboboxContextValue<T> = {
  id: string;
  listboxId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  size: ComboboxSize;
  variant: ComboboxVariant;
  clearable: boolean;
  showIcon: boolean;
  selected: T | null;
  select: (item: T | null) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  filtered: readonly T[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  itemToStringLabel: (item: T) => string;
  optionId: (index: number) => string;
  anchorRef: RefObject<HTMLElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  isSelected: (item: T) => boolean;
};

const ComboboxContext = createContext<ComboboxContextValue<unknown> | null>(null);

const useCombobox = <T,>(part: string): ComboboxContextValue<T> => {
  const ctx = useContext(ComboboxContext);
  if (!ctx) {
    throw new Error(`${part} must be used within <Combobox>`);
  }
  return ctx as ComboboxContextValue<T>;
};

const defaultItemToStringLabel = <T,>(item: T): string => {
  if (item == null) {
    return '';
  }
  if (typeof item === 'string' || typeof item === 'number') {
    return String(item);
  }
  if (typeof item === 'object' && item !== null && 'label' in item) {
    const label = (item as { label: unknown }).label;
    if (typeof label === 'string') {
      return label;
    }
  }
  return String(item);
};

export interface ComboboxCompoundProps<T> {
  items: readonly T[];
  children: ReactNode;
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  itemToStringLabel?: (item: T) => string;
  size?: ComboboxSize;
  variant?: ComboboxVariant;
  clearable?: boolean;
  /** Chevron toggle; default true */
  icon?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export interface ComboboxLegacyProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  size?: ComboboxSize;
  variant?: ComboboxVariant;
  clearable?: boolean;
  icon?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export type ComboboxProps<T = string> = ComboboxCompoundProps<T> | ComboboxLegacyProps;

const isLegacyProps = <T,>(props: ComboboxProps<T>): props is ComboboxLegacyProps =>
  Array.isArray((props as ComboboxLegacyProps).options);

const ComboboxRoot = <T,>({
  items,
  children,
  value: valueControlled,
  defaultValue = null,
  onValueChange,
  inputValue: inputValueControlled,
  onInputValueChange,
  itemToStringLabel: itemToStringLabelProp,
  size = 'md',
  variant = 'outline',
  clearable = false,
  icon = true,
  disabled = false,
  className = '',
  id: idProp,
  name,
}: ComboboxCompoundProps<T>) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;

  const itemToStringLabel = useMemo(
    () => itemToStringLabelProp ?? defaultItemToStringLabel<T>,
    [itemToStringLabelProp]
  );

  const [internalValue, setInternalValue] = useState<T | null>(defaultValue);
  const [internalInput, setInternalInput] = useState('');
  const [open, setOpenState] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [queryDirty, setQueryDirty] = useState(false);

  const selected = valueControlled !== undefined ? valueControlled : internalValue;
  const selectedLabel = selected != null ? itemToStringLabel(selected) : '';

  const inputValue =
    inputValueControlled !== undefined
      ? inputValueControlled
      : open || queryDirty
        ? internalInput
        : selectedLabel;

  const setInputValue = useCallback(
    (next: string) => {
      if (inputValueControlled === undefined) {
        setInternalInput(next);
      }
      onInputValueChange?.(next);
      setQueryDirty(true);
    },
    [inputValueControlled, onInputValueChange]
  );

  const filtered = useMemo(() => {
    // Show the full list until the user edits the query (typeahead).
    if (!queryDirty) {
      return items;
    }
    const q = inputValue.trim().toLowerCase();
    if (!q) {
      return items;
    }
    return items.filter(item => itemToStringLabel(item).toLowerCase().includes(q));
  }, [items, inputValue, itemToStringLabel, queryDirty]);

  const anchorRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isSelected = useCallback(
    (item: T) => {
      if (selected == null) {
        return false;
      }
      if (selected === item) {
        return true;
      }
      return itemToStringLabel(selected) === itemToStringLabel(item);
    },
    [selected, itemToStringLabel]
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled) {
        return;
      }
      setOpenState(next);
      if (next) {
        const seed =
          inputValueControlled !== undefined ? inputValueControlled : selectedLabel;
        if (inputValueControlled === undefined) {
          setInternalInput(seed);
        }
        setQueryDirty(false);
        const nextFiltered = items.filter(item => {
          const q = seed.trim().toLowerCase();
          if (!q) {
            return true;
          }
          return itemToStringLabel(item).toLowerCase().includes(q);
        });
        const selectedIdx = selected != null
          ? nextFiltered.findIndex(item => item === selected || itemToStringLabel(item) === selectedLabel)
          : -1;
        setActiveIndex(selectedIdx >= 0 ? selectedIdx : nextFiltered.length > 0 ? 0 : -1);
      } else {
        setActiveIndex(-1);
        setQueryDirty(false);
        if (inputValueControlled === undefined) {
          setInternalInput(selectedLabel);
        }
      }
    },
    [
      disabled,
      inputValueControlled,
      selectedLabel,
      items,
      itemToStringLabel,
      selected,
    ]
  );

  const select = useCallback(
    (item: T | null) => {
      if (valueControlled === undefined) {
        setInternalValue(item);
      }
      onValueChange?.(item);
      const label = item != null ? itemToStringLabel(item) : '';
      if (inputValueControlled === undefined) {
        setInternalInput(label);
      }
      onInputValueChange?.(label);
      setQueryDirty(false);
      setOpenState(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [valueControlled, onValueChange, itemToStringLabel, inputValueControlled, onInputValueChange]
  );

  const optionId = useCallback((index: number) => `${id}-option-${index}`, [id]);

  useDismissLayer({
    open: open && !disabled,
    onDismiss: () => setOpen(false),
    contentRef,
    excludeRefs: [anchorRef, inputRef],
    dismissOnEscape: true,
    dismissOnOutsidePointer: true,
  });

  const context = useMemo<ComboboxContextValue<T>>(
    () => ({
      id,
      listboxId,
      open,
      setOpen,
      disabled,
      size,
      variant,
      clearable,
      showIcon: icon,
      selected,
      select,
      inputValue,
      setInputValue,
      filtered,
      activeIndex,
      setActiveIndex,
      itemToStringLabel,
      optionId,
      anchorRef,
      inputRef,
      contentRef,
      isSelected,
    }),
    [
      id,
      listboxId,
      open,
      setOpen,
      disabled,
      size,
      variant,
      clearable,
      icon,
      selected,
      select,
      inputValue,
      setInputValue,
      filtered,
      activeIndex,
      itemToStringLabel,
      optionId,
      isSelected,
    ]
  );

  return (
    <ComboboxContext.Provider value={context as ComboboxContextValue<unknown>}>
      <div className={`${styles.root} ${className}`} data-slot="combobox" id={id}>
        {children}
        {name !== undefined && (
          <input
            type="hidden"
            name={name}
            value={selected != null ? itemToStringLabel(selected) : ''}
          />
        )}
      </div>
    </ComboboxContext.Provider>
  );
};

const LegacyCombobox = ({
  options,
  value: valueControlled,
  defaultValue = '',
  onValueChange,
  placeholder = 'Search...',
  emptyText = 'No results.',
  size,
  variant,
  clearable,
  icon,
  disabled,
  className,
  id,
}: ComboboxLegacyProps) => {
  const handleValueChange = (item: ComboboxOption | null) => {
    onValueChange?.(item?.value ?? '');
  };

  const shared = {
    items: options,
    itemToStringLabel: (item: ComboboxOption) => item.label,
    onValueChange: handleValueChange,
    size,
    variant,
    clearable,
    icon,
    disabled,
    className,
    id,
  } as const;

  const children = (
    <>
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(item: ComboboxOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </>
  );

  if (valueControlled !== undefined) {
    return (
      <ComboboxRoot
        {...shared}
        value={options.find(o => o.value === valueControlled) ?? null}
      >
        {children}
      </ComboboxRoot>
    );
  }

  return (
    <ComboboxRoot
      {...shared}
      defaultValue={options.find(o => o.value === defaultValue) ?? null}
    >
      {children}
    </ComboboxRoot>
  );
};

export const Combobox = <T,>(props: ComboboxProps<T>) => {
  if (isLegacyProps(props)) {
    return <LegacyCombobox {...props} />;
  }
  return <ComboboxRoot {...(props as ComboboxCompoundProps<T>)} />;
};

Combobox.displayName = 'Combobox';

export interface ComboboxInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
  startSlot?: ReactNode;
  endSlot?: ReactNode;
}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  (
    {
      className = '',
      startSlot,
      endSlot,
      disabled: disabledProp,
      onKeyDown,
      onFocus,
      onClick,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const {
      open,
      setOpen,
      disabled: rootDisabled,
      size,
      variant,
      clearable,
      showIcon,
      selected,
      select,
      inputValue,
      setInputValue,
      filtered,
      activeIndex,
      setActiveIndex,
      listboxId,
      optionId,
      anchorRef,
      inputRef,
    } = useCombobox<unknown>('ComboboxInput');

    const disabled = disabledProp ?? rootDisabled;
    const resolvedActive =
      activeIndex >= 0 && activeIndex < filtered.length
        ? activeIndex
        : filtered.length > 0
          ? 0
          : -1;
    const activeOptionId =
      open && resolvedActive >= 0 ? optionId(resolvedActive) : undefined;
    const showClear = clearable && selected != null && !disabled;

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        if (filtered.length > 0) {
          setActiveIndex(
            resolvedActive < 0 ? 0 : (resolvedActive + 1) % filtered.length
          );
        }
        return;
      }

      if (e.key === 'ArrowUp' && open) {
        e.preventDefault();
        if (filtered.length > 0) {
          setActiveIndex(
            resolvedActive <= 0 ? filtered.length - 1 : resolvedActive - 1
          );
        }
        return;
      }

      if (e.key === 'Enter' && open && resolvedActive >= 0 && filtered[resolvedActive] !== undefined) {
        e.preventDefault();
        select(filtered[resolvedActive]);
      }
    };

    const sizeClass =
      size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
    const variantClass = variant === 'soft' ? styles.soft : styles.outline;

    return (
      <div
        ref={node => {
          anchorRef.current = node;
        }}
        className={`${styles.inputFrame} ${sizeClass} ${variantClass} ${className}`}
        data-slot="combobox-input-group"
        data-disabled={disabled || undefined}
        aria-invalid={ariaInvalid}
      >
        {startSlot != null && (
          <span className={styles.slot} data-slot="combobox-start-slot">
            {startSlot}
          </span>
        )}
        <input
          ref={composeRefs(ref, inputRef)}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          value={inputValue}
          className={styles.input}
          data-slot="combobox-input"
          onChange={e => {
            setInputValue(e.target.value);
            setActiveIndex(0);
            if (!open) {
              setOpen(true);
            }
          }}
          onFocus={e => {
            onFocus?.(e);
            setOpen(true);
          }}
          onClick={e => {
            onClick?.(e);
            if (!open) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {endSlot != null && (
          <span className={styles.slot} data-slot="combobox-end-slot">
            {endSlot}
          </span>
        )}
        {showClear && (
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear selection"
            disabled={disabled}
            tabIndex={-1}
            onMouseDown={e => {
              e.preventDefault();
              select(null);
              setInputValue('');
            }}
          >
            <X size={14} strokeWidth={2} aria-hidden />
          </button>
        )}
        {showIcon && (
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Toggle popup"
            aria-expanded={open}
            disabled={disabled}
            tabIndex={-1}
            data-state={open ? 'open' : 'closed'}
            onMouseDown={e => {
              e.preventDefault();
              setOpen(!open);
            }}
          >
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
              aria-hidden
            />
          </button>
        )}
      </div>
    );
  }
);

ComboboxInput.displayName = 'ComboboxInput';

export interface ComboboxContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom';
  sideOffset?: number;
}

export const ComboboxContent = ({
  className = '',
  children,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: ComboboxContentProps) => {
  const {
    open,
    disabled,
    size,
    anchorRef,
    contentRef,
    listboxId,
  } = useCombobox<unknown>('ComboboxContent');

  const { style, floatingProps } = useFloatingPosition({
    anchorRef,
    floatingRef: contentRef,
    open: open && !disabled,
    side,
    align: 'start',
    sideOffset,
    sameWidth: true,
  });

  if (!open || disabled) {
    return null;
  }

  const sizeClass =
    size === 'sm' ? styles.contentSm : size === 'lg' ? styles.contentLg : '';

  return (
    <FloatingPortal>
      <div
        ref={contentRef}
        id={listboxId}
        role="listbox"
        data-slot="combobox-content"
        className={`${styles.content} ${sizeClass} ${className}`}
        style={style}
        {...floatingProps}
        {...props}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};

ComboboxContent.displayName = 'ComboboxContent';

export type ComboboxListProps<T = unknown> = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode | ((item: T, index: number) => ReactNode);
};

export const ComboboxList = <T,>({
  className = '',
  children,
  ...props
}: ComboboxListProps<T>) => {
  const { filtered } = useCombobox<T>('ComboboxList');

  return (
    <div className={`${styles.list} ${className}`} data-slot="combobox-list" {...props}>
      {typeof children === 'function'
        ? filtered.map((item, index) => children(item, index))
        : children}
    </div>
  );
};

ComboboxList.displayName = 'ComboboxList';

export type ComboboxEmptyProps = HTMLAttributes<HTMLDivElement>;

export const ComboboxEmpty = ({
  className = '',
  children = 'No results.',
  ...props
}: ComboboxEmptyProps) => {
  const { filtered, open } = useCombobox<unknown>('ComboboxEmpty');

  if (!open || filtered.length > 0) {
    return null;
  }

  return (
    <div
      className={`${styles.empty} ${className}`}
      role="status"
      data-slot="combobox-empty"
      {...props}
    >
      {children}
    </div>
  );
};

ComboboxEmpty.displayName = 'ComboboxEmpty';

export interface ComboboxItemProps<T = unknown>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: T;
}

export const ComboboxItem = <T,>({
  value,
  className = '',
  children,
  disabled,
  onMouseDown,
  ...props
}: ComboboxItemProps<T>) => {
  const {
    filtered,
    activeIndex,
    setActiveIndex,
    select,
    isSelected,
    optionId,
    itemToStringLabel,
  } = useCombobox<T>('ComboboxItem');

  const index = filtered.findIndex(
    item => item === value || itemToStringLabel(item) === itemToStringLabel(value)
  );
  const active = index >= 0 && index === activeIndex;
  const selected = isSelected(value);

  return (
    <button
      type="button"
      id={index >= 0 ? optionId(index) : undefined}
      role="option"
      aria-selected={selected}
      disabled={disabled}
      data-slot="combobox-item"
      data-active={active || undefined}
      className={`${styles.item} ${active ? styles.itemActive : ''} ${className}`}
      onMouseEnter={() => {
        if (index >= 0 && !disabled) {
          setActiveIndex(index);
        }
      }}
      onMouseDown={e => {
        e.preventDefault();
        onMouseDown?.(e);
        if (!disabled) {
          select(value);
        }
      }}
      {...props}
    >
      <span className={styles.itemLabel}>{children ?? itemToStringLabel(value)}</span>
      {selected && (
        <Check size={14} strokeWidth={2} className={styles.check} aria-hidden />
      )}
    </button>
  );
};

ComboboxItem.displayName = 'ComboboxItem';
