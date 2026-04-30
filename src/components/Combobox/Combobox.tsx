import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
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

export function Combobox({
  options,
  value: valueControlled,
  defaultValue = '',
  onValueChange,
  placeholder = 'Search...',
  emptyText = 'No results.',
  className = '',
  disabled,
  id,
}: ComboboxProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = valueControlled ?? internal;
  const selectedLabel = useMemo(
    () => options.find(o => o.value === selected)?.label ?? '',
    [options, selected]
  );

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const commit = useCallback(
    (v: string, label: string) => {
      if (valueControlled === undefined) {
        setInternal(v);
      }
      onValueChange?.(v);
      setQuery(label);
      setOpen(false);
    },
    [valueControlled, onValueChange]
  );

  const displayValue = open ? query : selectedLabel;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
    if (e.key === 'ArrowDown' && !open) {
      setOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`} id={id}>
      <Input
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={`${id ?? 'combobox'}-listbox`}
        disabled={disabled}
        placeholder={placeholder}
        value={displayValue}
        onChange={e => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setQuery(selectedLabel);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />
      {open && !disabled && (
        <ul id={`${id ?? 'combobox'}-listbox`} role="listbox" className={styles.list}>
          {filtered.length === 0 ? (
            <li className={styles.empty} role="presentation">
              {emptyText}
            </li>
          ) : (
            filtered.map(opt => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === selected}
                  className={styles.option}
                  onClick={() => commit(opt.value, opt.label)}
                >
                  {opt.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
