import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
} from '../Floating/Floating';
import { Input } from '../Input/Input';
import styles from './Combobox.module.scss';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export const Combobox = ({
  options,
  value: valueControlled,
  defaultValue = '',
  onValueChange,
  placeholder = 'Search...',
  emptyText = 'No results.',
  className = '',
  disabled,
  id: idProp,
}: ComboboxProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;

  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = valueControlled ?? internal;
  const selectedLabel = useMemo(
    () => options.find(o => o.value === selected)?.label ?? '',
    [options, selected]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return options;
    }
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const { style, floatingProps } = useFloatingPosition({
    anchorRef: rootRef,
    floatingRef: listRef,
    open: open && !disabled,
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    sameWidth: true,
  });

  useDismissLayer({
    open: open && !disabled,
    onDismiss: close,
    contentRef: listRef,
    excludeRefs: [rootRef, inputRef],
    dismissOnEscape: true,
    dismissOnOutsidePointer: true,
  });

  const commit = useCallback(
    (v: string, label: string) => {
      if (valueControlled === undefined) {
        setInternal(v);
      }
      onValueChange?.(v);
      setQuery(label);
      close();
      inputRef.current?.focus();
    },
    [valueControlled, onValueChange, close]
  );

  const displayValue = open ? query : selectedLabel;
  const resolvedActiveIndex =
    activeIndex >= 0 && activeIndex < filtered.length ? activeIndex : filtered.length > 0 ? 0 : -1;
  const activeOptionId =
    open && resolvedActiveIndex >= 0 ? `${id}-option-${resolvedActiveIndex}` : undefined;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(filtered.length > 0 ? 0 : -1);
        return;
      }
      if (filtered.length > 0) {
        setActiveIndex(prev => (prev + 1) % filtered.length);
      }
      return;
    }

    if (e.key === 'ArrowUp' && open) {
      e.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex(prev => (prev <= 0 ? filtered.length - 1 : prev - 1));
      }
      return;
    }

    if (e.key === 'Enter' && open && resolvedActiveIndex >= 0 && filtered[resolvedActiveIndex]) {
      e.preventDefault();
      const opt = filtered[resolvedActiveIndex];
      commit(opt.value, opt.label);
    }
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`} id={id} data-slot="combobox">
      <Input
        ref={inputRef}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-activedescendant={open ? activeOptionId : undefined}
        disabled={disabled}
        placeholder={placeholder}
        value={displayValue}
        onChange={e => {
          setQuery(e.target.value);
          setActiveIndex(0);
          if (!open) {
            setOpen(true);
          }
        }}
        onFocus={() => {
          setQuery(selectedLabel);
          setActiveIndex(filtered.length > 0 ? 0 : -1);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        data-slot="combobox-input"
      />
      {open && !disabled && (
        <FloatingPortal>
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            data-slot="combobox-content"
            className={styles.list}
            style={style}
            {...floatingProps}
          >
            {filtered.length === 0 ? (
              <li className={styles.empty} role="presentation">
                {emptyText}
              </li>
            ) : (
              filtered.map((opt, index) => (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={opt.value === selected}
                    className={`${styles.option} ${index === resolvedActiveIndex ? styles.optionActive : ''}`}
                    onMouseDown={e => {
                      e.preventDefault();
                      commit(opt.value, opt.label);
                    }}
                  >
                    {opt.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </FloatingPortal>
      )}
    </div>
  );
};
