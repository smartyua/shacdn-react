import { ChevronDown, X } from 'lucide-react';
import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
} from '../Floating/Floating';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './MultiSelect.module.scss';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const MultiSelect = ({
  options,
  value: valueControlled,
  defaultValue = [],
  onValueChange,
  placeholder = 'Select options...',
  disabled,
  className = '',
  id: idProp,
}: MultiSelectProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;

  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = valueControlled ?? internal;

  const optionMap = useMemo(
    () => new Map(options.map(o => [o.value, o])),
    [options]
  );

  const selectedOptions = useMemo(
    () => selected.map(v => optionMap.get(v)).filter(Boolean) as MultiSelectOption[],
    [selected, optionMap]
  );

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const { style, floatingProps } = useFloatingPosition({
    anchorRef: triggerRef,
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
    excludeRefs: [triggerRef],
    dismissOnEscape: true,
    dismissOnOutsidePointer: true,
  });

  const updateValue = useCallback(
    (next: string[]) => {
      if (valueControlled === undefined) {
        setInternal(next);
      }
      onValueChange?.(next);
    },
    [valueControlled, onValueChange]
  );

  const toggleOption = useCallback(
    (optionValue: string) => {
      const next = selected.includes(optionValue)
        ? selected.filter(v => v !== optionValue)
        : [...selected, optionValue];
      updateValue(next);
    },
    [selected, updateValue]
  );

  const removeOption = useCallback(
    (optionValue: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      updateValue(selected.filter(v => v !== optionValue));
    },
    [selected, updateValue]
  );

  const enabledOptions = useMemo(
    () => options.filter(o => !o.disabled),
    [options]
  );

  const resolvedActiveIndex =
    activeIndex >= 0 && activeIndex < options.length ? activeIndex : options.length > 0 ? 0 : -1;

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(options.length > 0 ? 0 : -1);
        return;
      }
      if (options.length > 0) {
        setActiveIndex(prev => (prev + 1) % options.length);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(options.length > 0 ? options.length - 1 : -1);
        return;
      }
      if (options.length > 0) {
        setActiveIndex(prev => (prev <= 0 ? options.length - 1 : prev - 1));
      }
      return;
    }

    if ((e.key === 'Enter' || e.key === ' ') && open && resolvedActiveIndex >= 0) {
      e.preventDefault();
      const opt = options[resolvedActiveIndex];
      if (opt && !opt.disabled) {
        toggleOption(opt.value);
      }
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      triggerRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (options.length > 0) {
        setActiveIndex(prev => (prev + 1) % options.length);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (options.length > 0) {
        setActiveIndex(prev => (prev <= 0 ? options.length - 1 : prev - 1));
      }
      return;
    }

    if ((e.key === 'Enter' || e.key === ' ') && resolvedActiveIndex >= 0) {
      e.preventDefault();
      const opt = options[resolvedActiveIndex];
      if (opt && !opt.disabled) {
        toggleOption(opt.value);
      }
    }
  };

  return (
    <div className={`${styles.root} ${className}`} data-slot="multi-select">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={styles.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        data-state={open ? 'open' : 'closed'}
        onClick={() => {
          if (!disabled) {
            setOpen(prev => !prev);
            if (!open) {
              setActiveIndex(enabledOptions.length > 0 ? options.indexOf(enabledOptions[0]) : 0);
            }
          }
        }}
        onKeyDown={onTriggerKeyDown}
        data-slot="multi-select-trigger"
      >
        <span className={styles.triggerContent}>
          {selectedOptions.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            selectedOptions.map(opt => (
              <span key={opt.value} className={styles.chip}>
                <span className={styles.chipLabel}>{opt.label}</span>
                <span
                  role="button"
                  className={styles.chipRemove}
                  aria-label={`Remove ${opt.label}`}
                  aria-disabled={disabled || undefined}
                  onClick={e => {
                    if (!disabled) {
                      removeOption(opt.value, e);
                    }
                  }}
                  onKeyDown={e => {
                    if (disabled) {
                      return;
                    }
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      removeOption(opt.value);
                    }
                  }}
                  tabIndex={-1}
                >
                  <X size={12} aria-hidden="true" />
                </span>
              </span>
            ))
          )}
        </span>
        <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
      </button>

      {open && !disabled && (
        <FloatingPortal>
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            data-slot="multi-select-content"
            className={styles.list}
            style={style}
            tabIndex={-1}
            onKeyDown={onListKeyDown}
            {...floatingProps}
          >
            {options.map((opt, index) => {
              const isSelected = selected.includes(opt.value);
              const isActive = index === resolvedActiveIndex;
              return (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled || undefined}
                    disabled={opt.disabled}
                    className={`${styles.option} ${isActive ? styles.optionActive : ''} ${opt.disabled ? styles.optionDisabled : ''}`}
                    onMouseDown={e => {
                      e.preventDefault();
                      if (!opt.disabled) {
                        toggleOption(opt.value);
                      }
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={opt.disabled}
                      tabIndex={-1}
                      readOnly
                      aria-hidden="true"
                      className={styles.optionCheckbox}
                    />
                    <span>{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FloatingPortal>
      )}
    </div>
  );
};
