import { forwardRef, useState, useRef, useEffect } from 'react';
import styles from './DatePicker.module.scss';

export interface DatePickerProps {
  label?: string;
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ className = '', label, value, defaultValue, onValueChange, disabled }, ref) => {
    const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value || defaultValue || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDate = value !== undefined ? value : internalValue;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleDateSelect = (date: Date) => {
      if (value === undefined) {
        setInternalValue(date);
      }
      onValueChange?.(date);
      setIsOpen(false);
    };

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date: Date | undefined) => {
      if (!date) return 'Pick a date';
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const isSameDay = (date1: Date | undefined, date2: Date) => {
      if (!date1) return false;
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    };

    const isToday = (date: Date) => {
      const today = new Date();
      return isSameDay(today, date);
    };

    const renderCalendar = () => {
      const daysInMonth = getDaysInMonth(viewDate);
      const firstDay = getFirstDayOfMonth(viewDate);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className={styles.calendarDay} />);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const isSelected = isSameDay(selectedDate, date);
        const isTodayDate = isToday(date);

        days.push(
          <button
            key={day}
            type="button"
            className={`${styles.calendarDay} ${isSelected ? styles.selected : ''} ${isTodayDate ? styles.today : ''}`}
            onClick={() => handleDateSelect(date)}
          >
            {day}
          </button>
        );
      }

      return days;
    };

    const changeMonth = (offset: number) => {
      const newDate = new Date(viewDate);
      newDate.setMonth(newDate.getMonth() + offset);
      setViewDate(newDate);
    };

    return (
      <div ref={ref} className={`${styles.datePickerWrapper} ${className}`}>
        {label && <label className={styles.datePickerLabel}>{label}</label>}
        <div ref={containerRef} className={styles.datePickerContainer}>
          <button
            type="button"
            className={styles.datePickerTrigger}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span>{formatDate(selectedDate)}</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {isOpen && (
            <div className={styles.calendarPopover}>
              <div className={styles.calendarHeader}>
                <button
                  type="button"
                  className={styles.calendarNavButton}
                  onClick={() => changeMonth(-1)}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <div className={styles.calendarHeaderTitle}>
                  <button
                    type="button"
                    className={styles.calendarHeaderButton}
                    onClick={() => setIsOpen(true)}
                  >
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.calendarNavButton}
                  onClick={() => changeMonth(1)}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>

              <div className={styles.calendarGrid}>
                <div className={styles.calendarWeekdays}>
                  {DAYS.map(day => (
                    <div key={day} className={styles.calendarWeekday}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className={styles.calendarDays}>
                  {renderCalendar()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
