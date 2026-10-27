import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import type {
  ScheduleCalendarLabels,
  ScheduleCalendarProps,
  ScheduleEvent,
  ScheduleEventColor,
  ScheduleHoliday,
  ScheduleSlot,
  ScheduleView,
} from './contracts';
import {
  addDays,
  addMonths,
  dayOfWeek,
  daysInMonth,
  formatHourLabel,
  formatRange,
  formatShort,
  formatTime,
  formatTimeRange,
  formatWeekday,
  fromKey,
  isWeekend,
  isoWeek,
  monthGrid,
  monthName,
  startOfMonth,
  toKey,
  WEEKDAYS_SHORT,
  weekDays,
} from './dates';
import { normalizeEvent, type NormalizedEvent } from './events';
import {
  clamp,
  HOUR_HEIGHT,
  layoutDay,
  MIN_EVENT_MINUTES,
  minutesToPx,
  pxToMinutes,
  snap,
} from './layout';
import styles from './ScheduleCalendar.module.scss';

export type {
  ScheduleCalendarLabels,
  ScheduleCalendarProps,
  ScheduleEvent,
  ScheduleEventColor,
  ScheduleHoliday,
  ScheduleSlot,
  ScheduleView,
} from './contracts';

const VIEWS: ScheduleView[] = ['day', 'week', 'month'];
const HOURS = Array.from({ length: 23 }, (_, index) => index + 1);
const MAX_CHIPS = 3;
const DRAG_THRESHOLD = 4;

const DEFAULT_LABELS: ScheduleCalendarLabels = {
  today: 'Today',
  day: 'Day',
  week: 'Week',
  month: 'Month',
  allDay: 'All day',
  calendar: 'Schedule calendar',
  views: 'Calendar view',
  timeGrid: 'Time grid',
  previous: unit => `Previous ${unit}`,
  next: unit => `Next ${unit}`,
  more: count => `+${count} more`,
  delete: 'Delete',
};

type DragState =
  | { type: 'create'; dayIndex: number; anchor: number; current: number; moved: boolean }
  | {
      type: 'move' | 'resize';
      eventId: string;
      dayIndex: number;
      start: number;
      end: number;
      grabOffset: number;
      moved: boolean;
    };

type ScheduleContextValue = {
  date: string;
  setDate: (date: string) => void;
  view: ScheduleView;
  setView: (view: ScheduleView) => void;
  days: string[];
  events: NormalizedEvent[];
  holidays: ScheduleHoliday[];
  weekStartsOn: 0 | 1;
  timeFormat: '12h' | '24h';
  showWeekends: boolean;
  dayStartHour: number;
  today: string;
  nowMinutes: number;
  selectedEventId: string | null;
  selectEvent: (event: ScheduleEvent | null) => void;
  selectHoliday: (holiday: ScheduleHoliday) => void;
  selectSlot: (slot: ScheduleSlot) => void;
  commitEvent: (event: NormalizedEvent) => void;
  canCreate: boolean;
  canMove: boolean;
  canDelete: boolean;
  deleteSelected: () => void;
  labels: ScheduleCalendarLabels;
  heading: { title: string; subtitle: string };
  step: (direction: -1 | 1) => void;
  goToday: () => void;
};

const ScheduleContext = createContext<ScheduleContextValue | null>(null);

const useSchedule = (): ScheduleContextValue => {
  const value = useContext(ScheduleContext);
  if (!value) throw new Error('ScheduleCalendar parts must render inside ScheduleCalendar');
  return value;
};

const colorClass = (color: ScheduleEventColor): string => {
  switch (color) {
    case 'green':
      return styles.colorGreen;
    case 'purple':
      return styles.colorPurple;
    case 'cyan':
      return styles.colorCyan;
    case 'orange':
      return styles.colorOrange;
    case 'pink':
      return styles.colorPink;
    case 'blue':
      return styles.colorBlue;
    default: {
      const exhaustive: never = color;
      return exhaustive;
    }
  }
};

const viewLabel = (view: ScheduleView, labels: ScheduleCalendarLabels): string => {
  switch (view) {
    case 'day':
      return labels.day;
    case 'week':
      return labels.week;
    case 'month':
      return labels.month;
    default: {
      const exhaustive: never = view;
      return exhaustive;
    }
  }
};

const Chevron = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {direction === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
  </svg>
);

const CalendarHeader = () => {
  const { heading, view, setView, step, goToday, labels, canDelete, deleteSelected, selectedEventId, events } = useSchedule();
  const selected = events.find(event => event.id === selectedEventId);
  const unit = viewLabel(view, labels).toLowerCase();
  const activeIndex = VIEWS.indexOf(view);

  const onTabsKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const move = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!move) return;
    event.preventDefault();
    event.stopPropagation();
    const next = VIEWS[(activeIndex + move + VIEWS.length) % VIEWS.length];
    setView(next);
  };

  return (
    <div className={styles.header}>
      <div className={styles.titles}>
        <p className={styles.title}>{heading.title}</p>
        <p className={styles.subtitle}>{heading.subtitle}</p>
      </div>
      <button type="button" className={styles.today} onClick={goToday}>
        {labels.today}
      </button>
      {canDelete && selected ? (
        <button
          type="button"
          className={styles.delete}
          aria-label={`${labels.delete} ${selected.title}`}
          onClick={deleteSelected}
        >
          {labels.delete}
        </button>
      ) : null}
      <div className={styles.stepper}>
        <button type="button" className={styles.step} aria-label={labels.previous(unit)} onClick={() => step(-1)}>
          <Chevron direction="left" />
        </button>
        <span className={styles.stepRule} aria-hidden />
        <button type="button" className={styles.step} aria-label={labels.next(unit)} onClick={() => step(1)}>
          <Chevron direction="right" />
        </button>
      </div>
      <div
        className={styles.views}
        role="tablist"
        aria-label={labels.views}
        style={{ '--view-index': activeIndex } as CSSProperties}
        onKeyDown={onTabsKeyDown}
      >
        <span className={styles.viewIndicator} aria-hidden />
        {VIEWS.map(item => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={view === item}
            className={styles.viewTab}
            onClick={() => setView(item)}
          >
            {viewLabel(item, labels)}
          </button>
        ))}
      </div>
    </div>
  );
};

type MonthChip = {
  key: string;
  label: string;
  color: ScheduleEventColor;
  sort: number;
  selected: boolean;
  onClick: () => void;
};

const MonthView = () => {
  const {
    date,
    setDate,
    setView,
    events,
    holidays,
    weekStartsOn,
    showWeekends,
    timeFormat,
    today,
    selectEvent,
    selectHoliday,
    selectSlot,
    canCreate,
    labels,
    selectedEventId,
  } = useSchedule();

  const cells = useMemo(() => {
    const all = monthGrid(date, weekStartsOn);
    return showWeekends ? all : all.filter(day => !isWeekend(day));
  }, [date, weekStartsOn, showWeekends]);
  const cols = showWeekends ? 7 : 5;
  const month = date.slice(0, 7);
  const headers = cells.slice(0, cols).map(day => WEEKDAYS_SHORT[dayOfWeek(day)]);

  const byDay = useMemo(() => {
    const map = new Map<string, MonthChip[]>();
    const push = (day: string, chip: MonthChip) => {
      map.set(day, [...(map.get(day) ?? []), chip]);
    };
    for (const holiday of holidays) {
      push(holiday.date, {
        key: holiday.id,
        label: holiday.name,
        color: 'purple',
        sort: -2,
        selected: false,
        onClick: () => selectHoliday(holiday),
      });
    }
    for (const event of events) {
      push(event.date, {
        key: event.id,
        label: event.allDay ? event.title : `${formatTime(event.start, timeFormat)} ${event.title}`,
        color: event.color,
        sort: event.allDay ? -1 : event.start,
        selected: selectedEventId === event.id,
        onClick: () => selectEvent(event),
      });
    }
    for (const list of map.values()) list.sort((a, b) => a.sort - b.sort);
    return map;
  }, [events, holidays, selectEvent, selectHoliday, selectedEventId, timeFormat]);

  const openDay = (day: string) => {
    setDate(day);
    setView('day');
  };

  return (
    <div className={styles.month}>
      <div className={styles.weekdayRow} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {headers.map(header => (
          <div key={header} className={styles.weekday}>
            {header}
          </div>
        ))}
      </div>
      <div
        className={styles.monthGrid}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((day, index) => {
          const items = byDay.get(day) ?? [];
          const inMonth = day.startsWith(month);
          const hidden = items.length - MAX_CHIPS;
          return (
            <div
              key={day}
              className={cn(styles.dayCell, index % cols !== 0 && styles.cellDivider, !inMonth && styles.outside)}
              onDoubleClick={event => {
                if (!canCreate || event.target !== event.currentTarget) return;
                selectSlot({ date: day, start: 9 * 60, end: 10 * 60, allDay: false });
              }}
            >
              <button
                type="button"
                className={cn(
                  styles.dayButton,
                  day === date && styles.selectedNumber,
                  day !== date && day === today && styles.todayNumber,
                  day !== date && day !== today && !inMonth && styles.mutedNumber,
                )}
                aria-label={fromKey(day).toDateString()}
                aria-pressed={day === date}
                onClick={event => {
                  event.stopPropagation();
                  if (day === date) openDay(day);
                  else setDate(day);
                }}
              >
                {fromKey(day).getDate()}
              </button>
              {items.slice(0, MAX_CHIPS).map(item => (
                <button
                  key={item.key}
                  type="button"
                  className={cn(styles.chip, colorClass(item.color), item.selected && styles.selected)}
                  onClick={event => {
                    event.stopPropagation();
                    item.onClick();
                  }}
                >
                  <span className={styles.chipLabel}>{item.label}</span>
                </button>
              ))}
              {hidden > 0 && (
                <button type="button" className={styles.more} onClick={() => openDay(day)}>
                  {labels.more(hidden)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EventBlock = ({
  event,
  column,
  count,
  dragging,
}: {
  event: NormalizedEvent;
  column: number;
  count: number;
  dragging: boolean;
}) => {
  const { timeFormat, selectedEventId, canMove, selectEvent } = useSchedule();
  const height = Math.max(minutesToPx(event.end - event.start) - 2, 14);
  const compact = height < 44;
  const time = formatTimeRange(event.start, event.end, timeFormat);
  const movable = canMove && !event.locked;

  return (
    <div
      data-event-id={event.id}
      data-locked={event.locked || undefined}
      role="button"
      tabIndex={0}
      aria-pressed={selectedEventId === event.id}
      aria-label={`${event.title}, ${time}${event.location ? `, ${event.location}` : ''}${event.note ? `, ${event.note}` : ''}`}
      title={event.note ? `${event.title} — ${event.note}` : event.title}
      className={cn(
        styles.event,
        colorClass(event.color),
        movable && styles.grab,
        dragging && styles.dragging,
        selectedEventId === event.id && styles.selected,
      )}
      style={{
        top: minutesToPx(event.start) + 1,
        height,
        left: `calc((100% - 5px) * ${column / count} + 2px)`,
        width: `calc((100% - 5px) / ${count} - ${count > 1 ? 2 : 0}px)`,
        zIndex: dragging ? 30 : 10 + column,
      }}
      onClick={eventClick => {
        eventClick.stopPropagation();
        selectEvent(event);
      }}
      onKeyDown={eventKey => {
        if (eventKey.key === 'Enter' || eventKey.key === ' ') {
          eventKey.preventDefault();
          selectEvent(event);
        }
      }}
    >
      {compact ? (
        <div className={styles.eventInline}>
          <p className={styles.eventTitle}>{event.title}</p>
        </div>
      ) : (
        <div className={styles.eventBody}>
          <p className={cn(styles.eventTitle, height >= 60 && styles.clamp)}>{event.title}</p>
          <p className={styles.eventMeta}>{time}</p>
          {event.note && height >= 72 ? <p className={styles.eventMeta}>{event.note}</p> : null}
        </div>
      )}
      {movable ? <span data-resize aria-hidden className={styles.resize} /> : null}
    </div>
  );
};

const TimeGrid = () => {
  const schedule = useSchedule();
  const { days, events, holidays, timeFormat, dayStartHour, today, nowMinutes, labels, canCreate, canMove, selectEvent, selectHoliday, selectSlot, commitEvent, setDate, setView, date } = schedule;
  const scrollRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const [drag, setDrag] = useState<DragState | null>(null);

  const updateDrag = (next: DragState | null) => {
    dragRef.current = next;
    setDrag(next);
  };

  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = dayStartHour * HOUR_HEIGHT;
  }, [dayStartHour, days]);

  const columns = useMemo(() => {
    const preview = drag && drag.type !== 'create' && drag.moved
      ? { id: drag.eventId, date: days[drag.dayIndex], start: drag.start, end: drag.end }
      : null;
    return days.map(day => {
      const dayEvents = events
        .map(event => (preview && event.id === preview.id && preview.date ? { ...event, ...preview } : event))
        .filter(event => !event.allDay && event.date === day);
      return layoutDay(dayEvents);
    });
  }, [days, events, drag]);

  const allDay = useMemo(
    () =>
      days.map(day => ({
        day,
        holidays: holidays.filter(holiday => holiday.date === day),
        events: events.filter(event => event.allDay && event.date === day),
      })),
    [days, events, holidays],
  );
  const laneCount = Math.max(1, ...allDay.map(column => column.holidays.length + column.events.length));

  const pointToSlot = (clientX: number, clientY: number) => {
    const rect = bodyRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || days.length === 0) return { dayIndex: 0, minutes: 0 };
    return {
      dayIndex: clamp(Math.floor((clientX - rect.left) / (rect.width / days.length)), 0, days.length - 1),
      minutes: clamp(pxToMinutes(clientY - rect.top), 0, 1440),
    };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.target as Element;
    const eventEl = target.closest<HTMLElement>('[data-event-id]');
    const slot = pointToSlot(event.clientX, event.clientY);
    originRef.current = { x: event.clientX, y: event.clientY };

    if (eventEl) {
      if (!canMove || eventEl.dataset.locked === 'true') return;
      const current = events.find(item => item.id === eventEl.dataset.eventId);
      if (!current) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      updateDrag({
        type: target.closest('[data-resize]') ? 'resize' : 'move',
        eventId: current.id,
        dayIndex: Math.max(0, days.indexOf(current.date)),
        start: current.start,
        end: current.end,
        grabOffset: slot.minutes - current.start,
        moved: false,
      });
      return;
    }

    if (!canCreate) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const anchor = snap(slot.minutes - 15 / 2);
    updateDrag({ type: 'create', dayIndex: slot.dayIndex, anchor, current: anchor, moved: false });
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = dragRef.current;
    const origin = originRef.current;
    if (!current || !origin) return;
    const moved = current.moved || Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > DRAG_THRESHOLD;
    if (!moved) return;
    const slot = pointToSlot(event.clientX, event.clientY);
    if (current.type === 'create') {
      updateDrag({ ...current, moved, current: snap(slot.minutes) });
      return;
    }
    if (current.type === 'move') {
      const length = current.end - current.start;
      const start = clamp(snap(slot.minutes - current.grabOffset), 0, 1440 - length);
      updateDrag({ ...current, moved, dayIndex: slot.dayIndex, start, end: start + length });
      return;
    }
    updateDrag({ ...current, moved, end: clamp(snap(slot.minutes), current.start + MIN_EVENT_MINUTES, 1440) });
  };

  const onPointerUp = () => {
    const current = dragRef.current;
    originRef.current = null;
    updateDrag(null);
    if (!current) return;
    if (current.type === 'create' || current.moved) {
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    }
    const day = days[current.dayIndex];
    if (!day) return;
    if (current.type === 'create') {
      if (!current.moved) {
        const start = clamp(Math.floor(current.anchor / 30) * 30, 0, 1380);
        selectSlot({ date: day, start, end: start + 60, allDay: false });
        return;
      }
      const start = Math.min(current.anchor, current.current);
      selectSlot({
        date: day,
        start,
        end: Math.max(current.anchor, current.current, start + MIN_EVENT_MINUTES),
        allDay: false,
      });
      return;
    }
    if (!current.moved) return;
    const source = events.find(item => item.id === current.eventId);
    if (!source) return;
    if (source.date === day && source.start === current.start && source.end === current.end) return;
    commitEvent({ ...source, date: day, start: current.start, end: current.end, allDay: false });
  };

  const createGhost = drag?.type === 'create'
    ? {
        dayIndex: drag.dayIndex,
        start: drag.moved ? Math.min(drag.anchor, drag.current) : clamp(Math.floor(drag.anchor / 30) * 30, 0, 1380),
        end: drag.moved
          ? Math.max(drag.anchor, drag.current, Math.min(drag.anchor, drag.current) + MIN_EVENT_MINUTES)
          : clamp(Math.floor(drag.anchor / 30) * 30, 0, 1380) + 60,
      }
    : null;
  const todayIndex = days.indexOf(today);

  return (
    <div ref={scrollRef} className={styles.scroller} tabIndex={0} aria-label={labels.timeGrid}>
      <div className={styles.gridFrame}>
        <div className={styles.stickyHead}>
          <div className={styles.dayHead}>
            <div className={styles.axisSpace} />
            {days.map(day => {
              const selected = day === date;
              const isToday = day === today;
              return (
                <button
                  key={day}
                  type="button"
                  className={styles.columnHead}
                  aria-pressed={selected}
                  aria-label={fromKey(day).toDateString()}
                  onClick={() => {
                    if (selected) setView('day');
                    else setDate(day);
                  }}
                >
                  <span className={styles.dayName}>{WEEKDAYS_SHORT[dayOfWeek(day)]}</span>
                  <span className={cn(styles.dayNumber, selected && styles.selectedNumber, !selected && isToday && styles.todayNumber)}>
                    {fromKey(day).getDate()}
                  </span>
                </button>
              );
            })}
          </div>
          <div className={styles.allDay} style={{ minHeight: 12 + laneCount * 28 + (laneCount - 1) * 4 }}>
            <div className={styles.axisSpace}>
              <span className={styles.allDayLabel}>{labels.allDay}</span>
            </div>
            {allDay.map(column => (
              <div
                key={column.day}
                className={styles.allDayColumn}
                onClick={event => {
                  if (!canCreate || event.target !== event.currentTarget) return;
                  selectSlot({ date: column.day, start: 0, end: 1440, allDay: true });
                }}
              >
                {column.holidays.map(holiday => (
                  <button
                    key={holiday.id}
                    type="button"
                    className={cn(styles.allDayChip, styles.colorPurple)}
                    onClick={() => selectHoliday(holiday)}
                  >
                    <span className={styles.chipLabel}>{holiday.name}</span>
                  </button>
                ))}
                {column.events.map(event => (
                  <button
                    key={event.id}
                    type="button"
                    className={cn(styles.allDayChip, colorClass(event.color), schedule.selectedEventId === event.id && styles.selected)}
                    aria-pressed={schedule.selectedEventId === event.id}
                    onClick={() => selectEvent(event)}
                  >
                    <span className={styles.chipLabel}>{event.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.body} style={{ height: 24 * HOUR_HEIGHT }}>
          <div className={styles.lines} aria-hidden>
            {HOURS.map(hour => (
              <div key={hour} className={styles.hourLine} style={{ top: hour * HOUR_HEIGHT }} />
            ))}
          </div>
          <div className={styles.axis} aria-hidden>
            {HOURS.map(hour => (
              <span key={hour} className={styles.hourLabel} style={{ top: hour * HOUR_HEIGHT }}>
                {formatHourLabel(hour, timeFormat)}
              </span>
            ))}
          </div>
          <div
            ref={bodyRef}
            className={styles.columns}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              originRef.current = null;
              updateDrag(null);
            }}
            onClick={event => {
              if (suppressClick.current) {
                suppressClick.current = false;
                return;
              }
              if (!canCreate || (event.target as HTMLElement).closest('[data-event-id]')) return;
              const slot = pointToSlot(event.clientX, event.clientY);
              const start = clamp(Math.floor(slot.minutes / 30) * 30, 0, 1380);
              const day = days[slot.dayIndex];
              if (day) selectSlot({ date: day, start, end: start + 60, allDay: false });
            }}
          >
            {days.map((day, index) => (
              <div key={day} className={styles.column} role="group" aria-label={`${fromKey(day).toDateString()} schedule`}>
                {columns[index].map(item => (
                  <EventBlock
                    key={item.event.id}
                    event={item.event}
                    column={item.column}
                    count={item.columns}
                    dragging={Boolean(drag && drag.type !== 'create' && drag.eventId === item.event.id && drag.moved)}
                  />
                ))}
                {createGhost?.dayIndex === index ? (
                  <div
                    className={styles.ghost}
                    style={{
                      top: minutesToPx(createGhost.start) + 1,
                      height: Math.max(minutesToPx(createGhost.end - createGhost.start) - 2, 14),
                      left: 2,
                      right: 3,
                    }}
                  >
                    {formatTimeRange(createGhost.start, createGhost.end, timeFormat)}
                  </div>
                ) : null}
                {index === todayIndex && nowMinutes >= 0 && nowMinutes <= 1440 ? (
                  <div className={styles.now} style={{ top: minutesToPx(nowMinutes) }} role="img" aria-label={`Now, ${formatTime(nowMinutes, timeFormat)}`}>
                    <span className={styles.nowDot} />
                    <span className={styles.nowLine} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const useControllable = <T,>(controlled: T | undefined, defaultValue: T, onChange?: (next: T) => void) => {
  const [internal, setInternal] = useState(defaultValue);
  const current = controlled !== undefined ? controlled : internal;
  const set = (next: T) => {
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
  };
  return [current, set] as const;
};

export const ScheduleCalendar = forwardRef<HTMLDivElement, ScheduleCalendarProps>(
  (
    {
      events = [],
      holidays = [],
      date: dateProp,
      defaultDate,
      onDateChange,
      view: viewProp,
      defaultView = 'week',
      onViewChange,
      weekStartsOn = 0,
      timeFormat = '24h',
      showWeekends = true,
      dayStartHour = 6,
      selectedEventId: selectedProp,
      onEventSelect,
      onEventChange,
      onEventDelete,
      onHolidaySelect,
      onSlotSelect,
      readOnly = false,
      labels: labelsProp,
      className,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const [clock, setClock] = useState(() => new Date());
    const [date, setDate] = useControllable(dateProp, defaultDate ?? toKey(clock), onDateChange);
    const [view, setView] = useControllable(viewProp, defaultView, onViewChange);
    const [selectedId, setSelectedId] = useControllable<string | null>(selectedProp, null, next => {
      onEventSelect?.(next ? events.find(item => item.id === next) ?? null : null);
    });

    useEffect(() => {
      const timer = window.setInterval(() => setClock(new Date()), 60_000);
      return () => window.clearInterval(timer);
    }, []);

    const normalized = useMemo(() => events.map(normalizeEvent), [events]);
    const days = useMemo(() => {
      if (view === 'month') return [];
      if (view === 'day') return [date];
      const all = weekDays(date, weekStartsOn);
      return showWeekends ? all : all.filter(day => !isWeekend(day));
    }, [view, date, weekStartsOn, showWeekends]);

    const heading = useMemo(() => {
      const title = `${monthName(date)}, ${fromKey(date).getFullYear()}`;
      switch (view) {
        case 'month': {
          const first = startOfMonth(date);
          return { title, subtitle: formatRange(first, addDays(first, daysInMonth(date) - 1)) };
        }
        case 'day':
          return { title, subtitle: `Week ${isoWeek(date)} · ${formatWeekday(date)}, ${formatShort(date)}` };
        case 'week': {
          const all = weekDays(date, weekStartsOn);
          const anchor = weekStartsOn === 0 ? all[1] : all[0];
          const visible = days.length > 0 ? days : all;
          return { title, subtitle: `Week ${isoWeek(anchor)} · ${formatRange(visible[0], visible[visible.length - 1])}` };
        }
        default: {
          const exhaustive: never = view;
          return exhaustive;
        }
      }
    }, [view, date, weekStartsOn, days]);

    const selectEvent = (event: ScheduleEvent | null) => setSelectedId(event?.id ?? null);
    const selectedEvent = normalized.find(event => event.id === selectedId) ?? null;
    const canDelete = Boolean(selectedEvent) && !readOnly && Boolean(onEventDelete);
    const deleteSelected = () => {
      if (!selectedEvent || readOnly || !onEventDelete) return;
      onEventDelete(selectedEvent);
      selectEvent(null);
    };
    const step = (direction: -1 | 1) => {
      switch (view) {
        case 'day':
          setDate(addDays(date, direction));
          return;
        case 'week':
          setDate(addDays(date, direction * 7));
          return;
        case 'month':
          setDate(addMonths(date, direction));
          return;
        default: {
          const exhaustive: never = view;
          return exhaustive;
        }
      }
    };

    const context: ScheduleContextValue = {
      date,
      setDate,
      view,
      setView,
      days,
      events: normalized,
      holidays,
      weekStartsOn,
      timeFormat,
      showWeekends,
      dayStartHour,
      today: toKey(clock),
      nowMinutes: clock.getHours() * 60 + clock.getMinutes(),
      selectedEventId: selectedId,
      selectEvent,
      selectHoliday: holiday => onHolidaySelect?.(holiday),
      selectSlot: slot => onSlotSelect?.(slot),
      commitEvent: event => onEventChange?.(event),
      canCreate: !readOnly && Boolean(onSlotSelect),
      canMove: !readOnly && Boolean(onEventChange),
      canDelete,
      deleteSelected,
      labels,
      heading,
      step,
      goToday: () => setDate(toKey(new Date())),
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if ((event.key === 'Delete' || event.key === 'Backspace') && canDelete) {
        event.preventDefault();
        deleteSelected();
        return;
      }
      if (target.closest('[role="tablist"]') || target !== event.currentTarget) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 't' || event.key === 'T') {
        event.preventDefault();
        setDate(toKey(new Date()));
      } else if (event.key === 'd' || event.key === 'D') {
        setView('day');
      } else if (event.key === 'w' || event.key === 'W') {
        setView('week');
      } else if (event.key === 'm' || event.key === 'M') {
        setView('month');
      }
    };

    let body: ReactNode;
    switch (view) {
      case 'month':
        body = <MonthView />;
        break;
      case 'day':
      case 'week':
        body = <TimeGrid key={view} />;
        break;
      default: {
        const exhaustive: never = view;
        body = exhaustive;
      }
    }

    return (
      <ScheduleContext.Provider value={context}>
        <section
          ref={ref}
          data-slot="schedule-calendar"
          aria-label={labels.calendar}
          aria-keyshortcuts="ArrowLeft ArrowRight t d w m"
          tabIndex={0}
          className={cn(styles.root, className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          <CalendarHeader />
          {body}
        </section>
      </ScheduleContext.Provider>
    );
  },
);

ScheduleCalendar.displayName = 'ScheduleCalendar';
