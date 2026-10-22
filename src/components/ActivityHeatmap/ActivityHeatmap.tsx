import { forwardRef, useMemo, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { buildHeatmapWeeks, parseDateKey, type HeatmapDatum } from './heatmapGrid';
import styles from './ActivityHeatmap.module.scss';

export type { HeatmapDatum } from './heatmapGrid';

export interface ActivityHeatmapProps extends HTMLAttributes<HTMLDivElement> {
  data: HeatmapDatum[];
  /** Last day shown; defaults to today. */
  endDate?: Date;
  weeks?: number;
  weekStart?: 0 | 1;
  /** Number of color steps including "none". */
  levels?: number;
  locale?: string;
  /** Cell tooltip text. */
  formatCell?: (count: number, date: Date) => string;
  showLegend?: boolean;
  legendLabels?: { less: string; more: string };
}

export const ActivityHeatmap = forwardRef<HTMLDivElement, ActivityHeatmapProps>(
  (
    {
      data,
      endDate,
      weeks = 53,
      weekStart = 0,
      levels = 5,
      locale,
      formatCell,
      showLegend = true,
      legendLabels = { less: 'Less', more: 'More' },
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const endKey = (endDate ?? new Date()).toDateString();
    const grid = useMemo(
      () => buildHeatmapWeeks(data, { end: new Date(endKey), weeks, weekStart, levels }),
      [data, endKey, weeks, weekStart, levels]
    );

    const monthFormat = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'short' }), [locale]);
    const dayFormat = useMemo(
      () => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }),
      [locale]
    );
    const describe =
      formatCell ?? ((count: number, date: Date) => `${count} ${count === 1 ? 'contribution' : 'contributions'} on ${dayFormat.format(date)}`);

    const total = grid.flat().reduce((sum, cell) => sum + (cell.outside ? 0 : cell.count), 0);
    const monthLabels = grid.map((week, index) => {
      const month = parseDateKey(week[0].date).getMonth();
      const previous = index > 0 ? parseDateKey(grid[index - 1][0].date).getMonth() : null;
      return month !== previous && index < grid.length - 2 ? monthFormat.format(parseDateKey(week[0].date)) : '';
    });

    return (
      <div
        ref={ref}
        data-slot="activity-heatmap"
        className={cn(styles.root, className)}
        style={{ '--weeks': weeks } as CSSProperties}
        {...props}
      >
        <div
          className={styles.scroller}
          role="img"
          aria-label={ariaLabel ?? `${new Intl.NumberFormat(locale).format(total)} contributions in the last ${weeks} weeks`}
        >
          <div className={styles.months} aria-hidden>
            {monthLabels.map((label, index) => (
              <span key={grid[index][0].date}>{label}</span>
            ))}
          </div>
          <div className={styles.grid} aria-hidden>
            {grid.map(week =>
              week.map(cell => (
                <span
                  key={cell.date}
                  className={styles.cell}
                  data-level={cell.level}
                  data-outside={cell.outside || undefined}
                  title={cell.outside ? undefined : describe(cell.count, parseDateKey(cell.date))}
                />
              ))
            )}
          </div>
        </div>
        {showLegend ? (
          <div className={styles.legend} aria-hidden>
            <span>{legendLabels.less}</span>
            {Array.from({ length: levels }, (_, level) => (
              <span key={level} className={styles.cell} data-level={level} />
            ))}
            <span>{legendLabels.more}</span>
          </div>
        ) : null}
      </div>
    );
  }
);

ActivityHeatmap.displayName = 'ActivityHeatmap';
