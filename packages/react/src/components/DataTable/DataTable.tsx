'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useControllableState } from '../../utils/use-controllable-state.js';
import { Checkbox } from '../Checkbox/index.js';

// Data Table — a column-config driven table plus the low-level primitives it is
// built from (Table / HeaderCell / TableRow / TableCell), exported for fully
// custom tables. Dimensions match -- Organism/Data Table/*:
//   Header Cell: height 40, padding Y 08, label gap 04, sort icon 12
//   Table Cell:  height 56, horizontal padding = Global/Padding (16)
//   Outer radius xl, thin bottom borders, footer padding 16 / gap 10.
// Table Builder (Desktop): no outer stroke — the Table Header rounds the top and
// the Footer the bottom (Global/Radius); the header row is bg/default with
// border/muted lines, body cells bg/surface with border/default lines. Header
// labels Body/SM/700 text/secondary, cell text Body/MD/300 text/primary; hovered
// rows bg/subtle, selected rows accent/subtle (text/primary flips per mode).

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
      className={cn(
        // Cells default to Body/MD/300 (Phase 4.5); the bare _Cell Item master is
        // Caption/300 — flagged to Max.
        'w-full border-collapse type-body-md-300 text-[var(--text-primary)]',
        className,
      )}
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
    // _Header Cell: Height, Min Width, Global Padding × Padding Y, a bottom Border
    // Weight border/muted line; label Body/SM/700 text/secondary.
    'h-(--data-table-header-cell-height) min-w-(--data-table-header-cell-min-width) bg-[var(--bg-default)]',
    'border-0 border-b-(length:--data-table-header-cell-border-weight) border-solid border-[var(--border-muted)]',
    'px-(--data-table-global-padding) py-(--data-table-header-cell-padding-y)',
    'type-body-sm-700 text-[var(--text-secondary)]',
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
          'inline-flex items-center gap-(--data-table-header-cell-label-gap) rounded-[var(--radius-sm)]',
          'transition-colors hover:text-[var(--text-primary)]',
          focusRing,
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
        // _Table Cell: Height, Min Width, Global Padding X, a bottom Border Weight
        // line in border/muted (the master's colour since round 1; was border/default).
        'h-(--data-table-table-cell-height) min-w-(--data-table-table-cell-min-width) align-middle',
        'border-0 border-b-(length:--data-table-table-cell-border-weight) border-solid border-[var(--border-muted)]',
        'px-(--data-table-global-padding)',
        alignClass[align],
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          // Gap between a cell's items (the master's Empty Gap, 10).
          'flex items-center gap-(--data-table-table-cell-empty-gap)',
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
  /** Footer area, right side (e.g. a <Pagination/>), rendered below the table. */
  footer?: ReactNode;
  /** Footer text, left side (e.g. "Showing 1–10 of 100"; Body/SM/300). */
  footerInfo?: ReactNode;
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
  footerInfo,
  caption,
  className,
  ...rest
}: DataTableProps<Row>) {
  // `isControlled` stays a separate flag — it also gates client-side sorting below.
  const isControlled = sort !== undefined;
  const [activeSort, setSort] = useControllableState<SortState | null>(
    sort,
    defaultSort,
    // `setSort` is only ever called with a defined SortState; widening is safe.
    onSortChange as ((value: SortState | null) => void) | undefined,
    null,
  );

  const [selectedIds, commitSelection] = useControllableState<(string | number)[]>(
    selectedRowIds,
    defaultSelectedRowIds,
    onSelectionChange,
    [],
  );
  const selectedSet = new Set(selectedIds);
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
    setSort(next);
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
        'overflow-hidden rounded-(--data-table-global-radius) bg-[var(--bg-surface)]',
        className,
      )}
      {...rest}
    >
      {header != null ? (
        <div className="px-(--data-table-global-padding) py-(--data-table-global-padding-y)">
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
      {footer != null || footerInfo != null ? (
        // _Table Footer (Desktop): Padding X / Y, Desktop Gap; the info text is the
        // master's 12px light (unstyled there) → Caption/300.
        <div className="flex items-center justify-between gap-(--data-table-footer-desktop-gap) px-(--data-table-footer-padding-x) py-(--data-table-footer-padding-y)">
          <span className="type-caption-300 text-[var(--text-primary)]">{footerInfo}</span>
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

/**
 * Read-only star rating (_Cell Item / Rating Group): lucide outline stars in
 * text/secondary, rounded to halves — Full, Half (star-half) and Empty
 * (`- opacity -/faint`, bound in round 1). Rating Group Gap + Stars Icon Size.
 */
export function RatingStars({ value, max = 5, className, ...rest }: RatingStarsProps) {
  const halves = Math.round(value * 2);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-(--data-table-table-cell-cell-item-rating-group-gap)',
        className,
      )}
      role="img"
      aria-label={`${value} out of ${max}`}
      {...rest}
    >
      {Array.from({ length: max }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star list, order is stable
        <Star
          key={i}
          fill={halves >= (i + 1) * 2 ? 'full' : halves === i * 2 + 1 ? 'half' : 'empty'}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Inline icons (the react package carries no icon dependency)
// ---------------------------------------------------------------------------

// lucide chevrons-up-down (12, text/muted); the inactive half dims to show the direction.
function SortIcon({ direction }: { direction: SortDirection | null }) {
  return (
    <svg
      className="size-(--data-table-header-cell-sort-icon-size) shrink-0 text-[var(--text-muted)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m7 9 5-5 5 5" opacity={direction === 'desc' ? 0.3 : 1} />
      <path d="m7 15 5 5 5-5" opacity={direction === 'asc' ? 0.3 : 1} />
    </svg>
  );
}

const STAR =
  'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z';
const STAR_HALF =
  'M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2';

// lucide star / star-half, as the master's li:star / li:star-half.
function Star({ fill }: { fill: 'full' | 'half' | 'empty' }) {
  return (
    <svg
      className={cn(
        'size-(--data-table-table-cell-cell-item-stars-icon-size) shrink-0 text-[var(--text-secondary)]',
        fill === 'empty' && 'opacity-[var(--opacity-faint)]',
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={fill === 'half' ? STAR_HALF : STAR} />
    </svg>
  );
}
