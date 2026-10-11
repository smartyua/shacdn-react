import { forwardRef, type HTMLAttributes } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table/Table';
import styles from './FinancialTable.module.scss';

export type FinancialTone = 'auto' | 'neutral' | 'positive' | 'negative';

export type FinancialColumn = {
  id: string;
  label: string;
};

export type FinancialCell =
  | number
  | {
      value: number;
      tone?: FinancialTone;
    };

export type FinancialRow = {
  id: string;
  label: string;
  /** Bold total row. Color still follows the cell tone. */
  emphasis?: boolean;
  cells: Record<string, FinancialCell>;
};

export type FinancialTableProps = HTMLAttributes<HTMLTableElement> & {
  columns: FinancialColumn[];
  rows: FinancialRow[];
  /** Column id drawn with the accent background — the scenario in focus. */
  activeColumnId?: string;
  /** Top-left header, for example "Over the hold". */
  cornerLabel?: string;
  caption?: string;
  formatValue?: (value: number, tone: FinancialTone) => string;
};

const groupThousands = (value: number): string =>
  Math.abs(Math.round(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const formatFinancialAmount = (value: number, tone: FinancialTone): string => {
  const body = `${groupThousands(value)} €`;
  if (value < 0) return `−${body}`;
  if (tone === 'auto' && value > 0) return `+${body}`;
  return body;
};

const resolveCell = (cell: FinancialCell | undefined): { value: number; tone: FinancialTone } | null => {
  if (cell === undefined) return null;
  if (typeof cell === 'number') return { value: cell, tone: 'auto' };
  return { value: cell.value, tone: cell.tone ?? 'auto' };
};

const toneClass = (tone: FinancialTone, value: number): string => {
  switch (tone) {
    case 'neutral':
      return '';
    case 'positive':
      return styles.positive;
    case 'negative':
      return styles.negative;
    case 'auto':
      if (value > 0) return styles.positive;
      if (value < 0) return styles.negative;
      return '';
    default: {
      const exhaustive: never = tone;
      return exhaustive;
    }
  }
};

export const FinancialTable = forwardRef<HTMLTableElement, FinancialTableProps>(
  (
    {
      columns,
      rows,
      activeColumnId,
      cornerLabel = '',
      caption,
      formatValue = formatFinancialAmount,
      className = '',
      ...props
    },
    ref
  ) => (
    <Table ref={ref} className={`${styles.table} ${className}`} {...props}>
      {caption ? <TableCaption className={styles.caption}>{caption}</TableCaption> : null}
      <TableHeader>
        <TableRow>
          <TableHead scope="col">{cornerLabel}</TableHead>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              scope="col"
              className={`${styles.numeric} ${column.id === activeColumnId ? styles.active : ''}`}
              data-active={column.id === activeColumnId ? 'true' : undefined}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} className={row.emphasis ? styles.emphasis : undefined}>
            <TableHead scope="row" className={row.emphasis ? styles.emphasisLabel : styles.rowLabel}>
              {row.label}
            </TableHead>
            {columns.map((column) => {
              const cell = resolveCell(row.cells[column.id]);
              const active = column.id === activeColumnId;
              if (!cell) {
                return (
                  <TableCell
                    key={column.id}
                    className={`${styles.numeric} ${active ? styles.active : ''}`}
                    data-active={active ? 'true' : undefined}
                  >
                    —
                  </TableCell>
                );
              }
              return (
                <TableCell
                  key={column.id}
                  className={`${styles.numeric} ${toneClass(cell.tone, cell.value)} ${active ? styles.active : ''}`}
                  data-active={active ? 'true' : undefined}
                  data-tone={cell.tone}
                >
                  {formatValue(cell.value, cell.tone)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
);

FinancialTable.displayName = 'FinancialTable';
