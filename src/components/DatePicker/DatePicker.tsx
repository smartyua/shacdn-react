import { forwardRef, useCallback, useRef, useState } from 'react';
import {
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
} from '../Floating/Floating';
import { Calendar } from '../Calendar/Calendar';
import styles from './DatePicker.module.scss';

export interface DatePickerProps {
  label?: string;
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ className = '', label, value, defaultValue, onValueChange, disabled }, ref) => {
    const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const selectedDate = value !== undefined ? value : internalValue;

    const close = useCallback(() => {
      setIsOpen(false);
      triggerRef.current?.focus();
    }, []);

    const { style, floatingProps } = useFloatingPosition({
      anchorRef: triggerRef,
      floatingRef: contentRef,
      open: isOpen && !disabled,
      side: 'bottom',
      align: 'start',
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

    const handleDateSelect = (date: Date) => {
      if (value === undefined) {
        setInternalValue(date);
      }
      onValueChange?.(date);
      close();
    };

    const formatDate = (date: Date | undefined) => {
      if (!date) {
        return 'Pick a date';
      }
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
      <div ref={ref} className={`${styles.datePickerWrapper} ${className}`} data-slot="date-picker">
        {label && <span className={styles.datePickerLabel}>{label}</span>}
        <div className={styles.datePickerContainer}>
          <button
            ref={triggerRef}
            type="button"
            className={styles.datePickerTrigger}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            data-slot="date-picker-trigger"
          >
            <span>{formatDate(selectedDate)}</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {isOpen && !disabled && (
            <FloatingPortal>
              <div
                ref={contentRef}
                className={styles.calendarPopover}
                role="dialog"
                aria-label="Choose date"
                data-slot="date-picker-content"
                style={style}
                {...floatingProps}
              >
                <Calendar
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  defaultMonth={selectedDate}
                />
              </div>
            </FloatingPortal>
          )}
        </div>
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
