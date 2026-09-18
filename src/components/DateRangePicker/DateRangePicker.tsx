import { forwardRef, useCallback, useRef, useState } from 'react';
import {
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
} from '../Floating/Floating';
import { Calendar, type DateRange } from '../Calendar/Calendar';
import styles from './DateRangePicker.module.scss';

export type { DateRange };

export interface DateRangePickerProps {
  label?: string;
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatShortDate = (date: Date): string =>
  `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;

const formatRangeLabel = (range: DateRange | undefined, placeholder: string): string => {
  if (!range?.from) {
    return placeholder;
  }
  if (!range.to) {
    return formatShortDate(range.from);
  }
  return `${formatShortDate(range.from)} - ${formatShortDate(range.to)}`;
};

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      className = '',
      label,
      value,
      defaultValue,
      onValueChange,
      disabled,
      placeholder = 'Pick a date range',
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<DateRange | undefined>(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const selectedRange = value !== undefined ? value : internalValue;

    const close = useCallback(() => {
      setIsOpen(false);
      triggerRef.current?.focus();
    }, []);

    const { style, floatingProps } = useFloatingPosition({
      anchorRef: triggerRef,
      floatingRef: contentRef,
      open: isOpen && !disabled,
      side: 'bottom',
      align: 'end',
      sideOffset: 4,
      sameWidth: false,
    });

    useDismissLayer({
      open: isOpen && !disabled,
      onDismiss: close,
      contentRef,
      excludeRefs: [triggerRef],
      dismissOnEscape: true,
      dismissOnOutsidePointer: true,
    });

    const handleRangeSelect = (range: DateRange) => {
      if (value === undefined) {
        setInternalValue(range);
      }
      onValueChange?.(range);
      if (range.from && range.to) {
        close();
      }
    };

    const display = formatRangeLabel(selectedRange, placeholder);

    return (
      <div ref={ref} className={`${styles.wrapper} ${className}`} data-slot="date-range-picker">
        {label ? <span className={styles.label}>{label}</span> : null}
        <div className={styles.container}>
          <button
            ref={triggerRef}
            type="button"
            className={styles.trigger}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-label="Date range"
            data-slot="date-range-picker-trigger"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path
                d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3H5V3.5C5 3.77614 4.77614 4 4.5 4C4.22386 4 4 3.77614 4 3.5V3H2.5C2.22386 3 2 3.22386 2 3.5V5H13V3.5C13 3.22386 12.7761 3 12.5 3H11V3.5C11 3.77614 10.7761 4 10.5 4C10.2239 4 10 3.77614 10 3.5V3ZM13 6H2V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            <span>{display}</span>
          </button>

          {isOpen && !disabled ? (
            <FloatingPortal>
              <div
                ref={contentRef}
                className={styles.popover}
                role="dialog"
                aria-label="Choose date range"
                data-slot="date-range-picker-content"
                style={style}
                {...floatingProps}
              >
                <Calendar
                  mode="range"
                  selected={selectedRange}
                  onSelect={handleRangeSelect}
                  defaultMonth={selectedRange?.from}
                />
              </div>
            </FloatingPortal>
          ) : null}
        </div>
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
