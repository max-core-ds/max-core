'use client';

import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react';
import { cn } from '../../utils/cn.js';
import { Checkbox } from '../Checkbox/index.js';

// Data Table — a column-config driven table plus the low-level primitives it is
// built from (Table / HeaderCell / TableRow / TableCell), exported for fully
// custom tables. Dimensions match -- Organism/Data Table/*:
//   Header Cell: height 40, padding Y 08, label gap 04, sort icon 12
//   Table Cell:  height 56, horizontal padding = Global/Padding (16)
//   Outer radius xl, thin bottom borders, footer padding 16 / gap 10.
// Colours are semantic tokens; header text is secondary, body text primary,
// hovered rows bg/subtle and selected rows accent/subtle (text/primary flips
// per mode, so both read in light and dark).

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

type Align = keyof typeof alignClass;

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export interface TableProps extends ComponentPropsWithoutRef<'table'> {}

/** Bordered, rounded table surface. Wrap in the shell yourself, or use DataTable. */
export function Table({ className, children, ...rest }: TableProps) {
  return (
    <table
      className={cn('w-full border-collapse text-sm text-[var(--text-primary)]', className)}
      {...rest}
    >
      {children}
    </table>
  );
}

export type SortDirection = 'asc' | 'desc';

export interface HeaderCellProps extends Omit<ComponentPropsWithoutRef<'th'>, 'onClick'> {
  align?: Align;
  /** Renders the sort affordance + toggles on click. */
  sortable?: boolean;
  /** Current sort direction for this column, or null when it is not the sort key. */
  sortDirection?: SortDirection | null;
  onSort?: () => void;
}

export function HeaderCell({
  align = 'left',
  sortable = false,
  sortDirection = null,
  onSort,
  className,
  children,
  ...rest
}: HeaderCellProps) {
  const base = cn(
    'h-[var(--size-40)] min-w-[93px] border-b border-[var(--border-muted)] bg-[var(--bg-surface)]',
    'px-[var(--spacing-16)] py-[var(--spacing-08)]',
    'text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]',
    alignClass[align],
    className,
  );
  if (!sortable) {
    return (
      <th scope="col" className={base} {...rest}>
        {children}
      </th>
    );
  }
  return (
    <th
      scope="col"
      aria-sort={
        sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none'
      }
      className={base}
      {...rest}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          'inline-flex items-center gap-[var(--spacing-04)] uppercase tracking-wide',
          'transition-colors hover:text-[var(--text-primary)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
          align === 'right' && 'flex-row-reverse',
        )}
      >
        {children}
        <SortIcon direction={sortDirection} />
      </button>
    </th>
  );
}

export interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  /** Persistent highlight (accent/subtle fill). */
  selected?: boolean;
  /** Enables hover feedback + pointer affordance. */
  interactive?: boolean;
}

export function TableRow({ selected, interactive, className, children, ...rest }: TableRowProps) {
  return (
    <tr
      aria-selected={selected || undefined}
      className={cn(
        'transition-colors',
        interactive && 'cursor-pointer hover:bg-[var(--bg-subtle)]',
        selected && 'bg-[var(--accent-subtle)]',
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  );
}

export interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  align?: Align;
}

export function TableCell({ align = 'left', className, children, ...rest }: TableCellProps) {
  return (
    <td
      className={cn(
        'h-[var(--size-56)] min-w-[93px] border-b border-[var(--border-muted)]',
        'px-[var(--spacing-16)] align-middle',
        alignClass[align],
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          'flex items-center gap-[var(--spacing-10)]',
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end',
        )}
      >
        {children}
      </div>
    </td>
  );
}

// ---------------------------------------------------------------------------
// Column-config table
// ---------------------------------------------------------------------------

export interface DataTableColumn<Row> {
  /** Stable id; also the default value accessor (`row[key]`). */
  key: string;
  header: ReactNode;
  align?: Align;
  sortable?: boolean;
  /** Fixed column width (e.g. 120 or '20%'). */
  width?: number | string;
  /** Custom cell content. Falls back to `row[key]` when omitted. */
  cell?: (row: Row, index: number) => ReactNode;
  /** Value used for client-side sorting. Falls back to `row[key]`. */
  sortAccessor?: (row: Row) => string | number;
}

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface DataTableProps<Row> extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  columns: DataTableColumn<Row>[];
  data: Row[];
  /** Stable row id; defaults to the row index. Drives selection + keys. */
  getRowId?: (row: Row, index: number) => string | number;
  /** Controlled sort. Omit for built-in client-side sorting. */
  sort?: SortState | null;
  onSortChange?: (sort: SortState) => void;
  /** Initial sort for the uncontrolled case. */
  defaultSort?: SortState | null;
  selectedRowId?: string | number;
  onRowClick?: (row: Row, index: number) => void;
  /** Adds a leading checkbox column with a select-all header. */
  selectable?: boolean;
  /** Controlled multi-row selection (row ids). Omit for built-in state. */
  selectedRowIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  /** Initial selection for the uncontrolled case. */
  defaultSelectedRowIds?: (string | number)[];
  /** Header area (e.g. a title, stats, tabs, or a filter), rendered above the table. */
  header?: ReactNode;
  /** Footer area (e.g. a <Pagination/>), rendered below the table. */
  footer?: ReactNode;
  /** Accessible table caption (visually hidden). */
  caption?: ReactNode;
}

function defaultAccessor<Row>(col: DataTableColumn<Row>, row: Row): string | number {
  if (col.sortAccessor) return col.sortAccessor(row);
  const v = (row as Record<string, unknown>)[col.key];
  return typeof v === 'number' ? v : String(v ?? '');
}

export function DataTable<Row>({
  columns,
  data,
  getRowId = (_row, index) => index,
  sort,
  onSortChange,
  defaultSort = null,
  selectedRowId,
  onRowClick,
  selectable = false,
  selectedRowIds,
  onSelectionChange,
  defaultSelectedRowIds = [],
  header,
  footer,
  caption,
  className,
  ...rest
}: DataTableProps<Row>) {
  const isControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState<SortState | null>(defaultSort);
  const activeSort = isControlled ? sort : internalSort;

  const selectionControlled = selectedRowIds !== undefined;
  const [internalSelected, setInternalSelected] =
    useState<(string | number)[]>(defaultSelectedRowIds);
  const selectedIds = selectionControlled ? selectedRowIds : internalSelected;
  const selectedSet = new Set(selectedIds);
  const commitSelection = (ids: (string | number)[]) => {
    if (!selectionControlled) setInternalSelected(ids);
    onSelectionChange?.(ids);
  };
  const toggleRow = (id: string | number) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    commitSelection([...next]);
  };

  const toggleSort = (key: string) => {
    const next: SortState =
      activeSort?.key === key
        ? { key, direction: activeSort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' };
    if (isControlled) onSortChange?.(next);
    else setInternalSort(next);
  };

  // Client-side sort only when uncontrolled (a controlled caller sorts its own data).
  let rows = data;
  if (!isControlled && activeSort) {
    const col = columns.find((c) => c.key === activeSort.key);
    if (col) {
      const dir = activeSort.direction === 'asc' ? 1 : -1;
      rows = [...data].sort((a, b) => {
        const av = defaultAccessor(col, a);
        const bv = defaultAccessor(col, b);
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }
  }

  const rowIds = rows.map((row, index) => getRowId(row, index));
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selectedSet.has(id));
  const someSelected = !allSelected && rowIds.some((id) => selectedSet.has(id));
  const toggleAll = () => commitSelection(allSelected ? [] : rowIds);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
        className,
      )}
      {...rest}
    >
      {header != null ? (
        <div className="border-b border-[var(--border-muted)] px-[var(--spacing-16)] py-[var(--spacing-16)]">
          {header}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <Table>
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr>
              {selectable ? (
                <HeaderCell align="center" className="w-px min-w-0">
                  <span className="flex items-center justify-center">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all rows"
                    />
                  </span>
                </HeaderCell>
              ) : null}
              {columns.map((col) => (
                <HeaderCell
                  key={col.key}
                  align={col.align}
                  sortable={col.sortable}
                  sortDirection={activeSort?.key === col.key ? activeSort.direction : null}
                  onSort={() => toggleSort(col.key)}
                  style={col.width != null ? { width: col.width } : undefined}
                >
                  {col.header}
                </HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const id = getRowId(row, index);
              return (
                <TableRow
                  key={id}
                  selected={
                    (selectedRowId != null && selectedRowId === id) ||
                    (selectable && selectedSet.has(id))
                  }
                  interactive={onRowClick != null}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                >
                  {selectable ? (
                    <TableCell
                      align="center"
                      className="w-px min-w-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedSet.has(id)}
                        onCheckedChange={() => toggleRow(id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.cell
                        ? col.cell(row, index)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </div>
      {footer != null ? (
        <div className="flex items-center justify-end gap-[var(--spacing-10)] px-[var(--spacing-16)] py-[var(--spacing-16)]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cell helpers
// ---------------------------------------------------------------------------

export interface RatingStarsProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  value: number;
  max?: number;
}

/** Read-only star rating for a rating cell. */
export function RatingStars({ value, max = 5, className, ...rest }: RatingStarsProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-[var(--spacing-04)]', className)}
      role="img"
      aria-label={`${value} out of ${max}`}
      {...rest}
    >
      {Array.from({ length: max }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star list, order is stable
        <Star key={i} filled={i < Math.round(value)} />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Inline icons (the react package carries no icon dependency)
// ---------------------------------------------------------------------------

function SortIcon({ direction }: { direction: SortDirection | null }) {
  return (
    <svg
      className="size-[var(--size-12)] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8 9 4-4 4 4" opacity={direction === 'desc' ? 0.3 : 1} />
      <path d="m16 15-4 4-4-4" opacity={direction === 'asc' ? 0.3 : 1} />
    </svg>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className="size-[var(--size-20)] shrink-0 text-[var(--status-warning-default)]"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
