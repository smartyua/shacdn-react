import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatTime, from12Hour, padTime, parseTime, to12Hour, wrap, type TimeParts } from './timeValue';
import styles from './TimePicker.module.scss';

type Segment = 'hour' | 'minute' | 'period';

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 24-hour "HH:mm", or null when empty. */
  value?: string | null;
  defaultValue?: string | null;
  /** Fires with "HH:mm" once both hour and minute are set, or null when cleared. */
  onValueChange?: (value: string | null) => void;
  hourCycle?: 12 | 24;
  /** Step for arrow keys on the minute segment. */
  minuteStep?: number;
  disabled?: boolean;
  labels?: { hour?: string; minute?: string; period?: string };
}

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      defaultValue = null,
      onValueChange,
      hourCycle = 24,
      minuteStep = 1,
      disabled = false,
      labels,
      className,
      ...props
    },
    ref
  ) => {
    const [parts, setParts] = useState<TimeParts>(() => parseTime(value ?? defaultValue));
    const [syncedValue, setSyncedValue] = useState(value);
    if (value !== undefined && value !== syncedValue) {
      setSyncedValue(value);
      setParts(parseTime(value));
    }

    const buffer = useRef('');
    const segmentRefs = useRef<Partial<Record<Segment, HTMLSpanElement | null>>>({});
    const order: Segment[] = hourCycle === 12 ? ['hour', 'minute', 'period'] : ['hour', 'minute'];
    const pm = (parts.hour ?? 0) >= 12;

    const update = (next: TimeParts) => {
      setParts(next);
      const formatted = formatTime(next);
      const previous = formatTime(parts);
      if (formatted !== previous && (formatted !== null || previous !== null)) {
        onValueChange?.(formatted);
      }
    };

    const focusSegment = (segment: Segment | undefined) => {
      buffer.current = '';
      if (segment) segmentRefs.current[segment]?.focus();
    };

    const advance = (from: Segment) => focusSegment(order[order.indexOf(from) + 1]);

    const typeDigit = (segment: Exclude<Segment, 'period'>, digit: number) => {
      const typed = Number(buffer.current + digit);
      const isHour = segment === 'hour';
      const limit = isHour ? (hourCycle === 12 ? 12 : 23) : 59;
      const firstDigitCap = isHour ? (hourCycle === 12 ? 1 : 2) : 5;
      const fresh = buffer.current === '' || typed > limit;
      const entry = fresh ? digit : typed;

      const asHour = (n: number) => (hourCycle === 12 ? from12Hour(n === 0 ? 12 : n, pm) : n);
      update(isHour ? { ...parts, hour: asHour(entry) } : { ...parts, minute: entry });

      if (!fresh || digit > firstDigitCap) {
        advance(segment);
      } else {
        buffer.current = String(digit);
      }
    };

    const handleKeyDown = (segment: Segment) => (event: KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;
      const index = order.indexOf(segment);
      const { key } = event;

      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        event.preventDefault();
        focusSegment(order[index + (key === 'ArrowRight' ? 1 : -1)]);
        return;
      }

      if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault();
        buffer.current = '';
        const dir = key === 'ArrowUp' ? 1 : -1;
        if (segment === 'hour') update({ ...parts, hour: parts.hour === null ? (dir > 0 ? 0 : 23) : wrap(parts.hour + dir, 24) });
        if (segment === 'minute') {
          const base = parts.minute === null ? (dir > 0 ? -minuteStep : 60) : parts.minute;
          update({ ...parts, minute: wrap(Math.round((base + dir * minuteStep) / minuteStep) * minuteStep, 60) });
        }
        if (segment === 'period') update({ ...parts, hour: wrap((parts.hour ?? 0) + 12, 24) });
        return;
      }

      if (key === 'Backspace' || key === 'Delete') {
        event.preventDefault();
        buffer.current = '';
        if (segment !== 'period') update({ ...parts, [segment]: null });
        return;
      }

      if (segment === 'period') {
        const lower = key.toLowerCase();
        if (lower === 'a' || lower === 'p') {
          event.preventDefault();
          const wantPm = lower === 'p';
          if (wantPm !== pm) update({ ...parts, hour: wrap((parts.hour ?? 0) + 12, 24) });
        }
        return;
      }

      if (/^\d$/.test(key)) {
        event.preventDefault();
        typeDigit(segment, Number(key));
      }
    };

    const hourText =
      parts.hour === null ? '--' : padTime(hourCycle === 12 ? to12Hour(parts.hour) : parts.hour);
    const minuteText = parts.minute === null ? '--' : padTime(parts.minute);

    const segmentProps = (segment: Segment) => ({
      ref: (node: HTMLSpanElement | null) => {
        segmentRefs.current[segment] = node;
      },
      role: 'spinbutton' as const,
      tabIndex: disabled ? -1 : 0,
      'aria-disabled': disabled || undefined,
      className: styles.segment,
      onKeyDown: handleKeyDown(segment),
      onBlur: () => {
        buffer.current = '';
      },
    });

    return (
      <div
        ref={ref}
        role="group"
        data-slot="time-picker"
        data-disabled={disabled || undefined}
        className={cn(styles.root, className)}
        {...props}
      >
        <Clock className={styles.icon} size={14} aria-hidden />
        <span
          {...segmentProps('hour')}
          aria-label={labels?.hour ?? 'Hours'}
          aria-valuemin={hourCycle === 12 ? 1 : 0}
          aria-valuemax={hourCycle === 12 ? 12 : 23}
          aria-valuenow={parts.hour === null ? undefined : hourCycle === 12 ? to12Hour(parts.hour) : parts.hour}
          aria-valuetext={parts.hour === null ? 'Empty' : hourText}
          data-placeholder={parts.hour === null || undefined}
        >
          {hourText}
        </span>
        <span className={styles.separator} aria-hidden>
          :
        </span>
        <span
          {...segmentProps('minute')}
          aria-label={labels?.minute ?? 'Minutes'}
          aria-valuemin={0}
          aria-valuemax={59}
          aria-valuenow={parts.minute ?? undefined}
          aria-valuetext={parts.minute === null ? 'Empty' : minuteText}
          data-placeholder={parts.minute === null || undefined}
        >
          {minuteText}
        </span>
        {hourCycle === 12 ? (
          <span
            {...segmentProps('period')}
            className={cn(styles.segment, styles.period)}
            aria-label={labels?.period ?? 'AM/PM'}
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={pm ? 1 : 0}
            aria-valuetext={pm ? 'PM' : 'AM'}
          >
            {pm ? 'PM' : 'AM'}
          </span>
        ) : null}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';
