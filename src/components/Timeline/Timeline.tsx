import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
  type ReactNode,
} from 'react';
import { Check } from 'lucide-react';
import styles from './Timeline.module.scss';

export type TimelineStatus = 'complete' | 'current' | 'upcoming';

type TimelineItemContextValue = {
  status: TimelineStatus;
};

const TimelineItemContext = createContext<TimelineItemContextValue | null>(null);

const useTimelineItem = (part: string): TimelineItemContextValue => {
  const ctx = useContext(TimelineItemContext);
  if (!ctx) {
    throw new Error(`${part} must be used within TimelineItem`);
  }
  return ctx;
};

export type TimelineProps = OlHTMLAttributes<HTMLOListElement>;

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(
  ({ className = '', children, ...props }, ref) => (
    <ol
      ref={ref}
      className={`${styles.timeline} ${className}`}
      data-slot="timeline"
      {...props}
    >
      {children}
    </ol>
  )
);

Timeline.displayName = 'Timeline';

export interface TimelineItemProps extends LiHTMLAttributes<HTMLLIElement> {
  status?: TimelineStatus;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ status = 'upcoming', className = '', children, ...props }, ref) => (
    <TimelineItemContext.Provider value={{ status }}>
      <li
        ref={ref}
        className={`${styles.item} ${styles[status]} ${className}`}
        data-slot="timeline-item"
        data-status={status}
        aria-current={status === 'current' ? 'step' : undefined}
        {...props}
      >
        {children}
      </li>
    </TimelineItemContext.Provider>
  )
);

TimelineItem.displayName = 'TimelineItem';

export interface TimelineIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const TimelineIndicator = forwardRef<HTMLDivElement, TimelineIndicatorProps>(
  ({ className = '', children, ...props }, ref) => {
    const { status } = useTimelineItem('TimelineIndicator');

    return (
      <div
        ref={ref}
        className={`${styles.rail} ${className}`}
        data-slot="timeline-indicator"
        aria-hidden={children == null ? true : undefined}
        {...props}
      >
        <span className={styles.marker}>
          {children ??
            (status === 'complete' ? (
              <Check size={12} strokeWidth={2.5} />
            ) : null)}
        </span>
        <span className={styles.connector} />
      </div>
    );
  }
);

TimelineIndicator.displayName = 'TimelineIndicator';

export type TimelineContentProps = HTMLAttributes<HTMLDivElement>;

export const TimelineContent = forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`${styles.content} ${className}`}
      data-slot="timeline-content"
      {...props}
    />
  )
);

TimelineContent.displayName = 'TimelineContent';

export type TimelineTitleProps = HTMLAttributes<HTMLSpanElement>;

export const TimelineTitle = forwardRef<HTMLSpanElement, TimelineTitleProps>(
  ({ className = '', ...props }, ref) => (
    <span
      ref={ref}
      className={`${styles.title} ${className}`}
      data-slot="timeline-title"
      {...props}
    />
  )
);

TimelineTitle.displayName = 'TimelineTitle';

/** Optional small muted note under a step's title (e.g. courier name, tracking id). Omit when not needed. */
export type TimelineDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const TimelineDescription = forwardRef<HTMLParagraphElement, TimelineDescriptionProps>(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`${styles.description} ${className}`}
      data-slot="timeline-description"
      {...props}
    />
  )
);

TimelineDescription.displayName = 'TimelineDescription';

export type TimelineTimeProps = HTMLAttributes<HTMLTimeElement>;

export const TimelineTime = forwardRef<HTMLTimeElement, TimelineTimeProps>(
  ({ className = '', ...props }, ref) => (
    <time
      ref={ref}
      className={`${styles.time} ${className}`}
      data-slot="timeline-time"
      {...props}
    />
  )
);

TimelineTime.displayName = 'TimelineTime';
