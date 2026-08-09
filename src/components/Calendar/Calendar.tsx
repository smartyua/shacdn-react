import { forwardRef, useState, useCallback, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Calendar.module.scss';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export type CalendarDisabledMatcher = (date: Date) => boolean;

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (date: Date) => void;
  disabled?: CalendarDisabledMatcher;
}

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

function isSameDay(a: Date | undefined, b: Date): boolean {
  if (!a) return false;
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className = '',
      selected,
      onSelect,
      month: monthControlled,
      defaultMonth,
      onMonthChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalMonth, setInternalMonth] = useState<Date>(
      () => defaultMonth ?? selected ?? new Date()
    );

    const viewDate = monthControlled ?? internalMonth;

    const setViewDate = useCallback(
      (next: Date) => {
        if (monthControlled === undefined) {
          setInternalMonth(next);
        }
        onMonthChange?.(next);
      },
      [monthControlled, onMonthChange]
    );

    const changeMonth = (offset: number) => {
      const next = new Date(viewDate);
      next.setMonth(next.getMonth() + offset);
      setViewDate(next);
    };

    const today = new Date();
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const cells: ReactNode[] = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(<div key={`empty-${i}`} className={styles.dayPlaceholder} aria-hidden />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const isSelected = isSameDay(selected, date);
      const isToday =
        isSameDay(today, date);
      const isDisabled = disabled?.(date) ?? false;

      cells.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          className={`${styles.day} ${isSelected ? styles.daySelected : ''} ${isToday ? styles.dayToday : ''} ${
            isDisabled ? styles.dayDisabled : ''
          }`}
          onClick={() => !isDisabled && onSelect?.(date)}
        >
          {day}
        </button>
      );
    }

    return (
      <div ref={ref} className={`${styles.calendar} ${className}`} {...props}>
        <div className={styles.header}>
          <button type="button" className={styles.navButton} onClick={() => changeMonth(-1)} aria-label="Previous month">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path
                d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className={styles.monthYear} aria-live="polite">
            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
          </div>
          <button type="button" className={styles.navButton} onClick={() => changeMonth(1)} aria-label="Next month">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path
                d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div className={styles.weekdays} role="row">
          {WEEKDAYS.map(d => (
            <div key={d} className={styles.weekday} role="columnheader">
              {d}
            </div>
          ))}
        </div>
        <div className={styles.days} role="grid">
          {cells}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';
