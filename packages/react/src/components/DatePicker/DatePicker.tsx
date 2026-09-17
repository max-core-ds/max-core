'use client';

import { Field } from '@base-ui/react/field';
import { Popover } from '@base-ui/react/popover';
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  type ClassNames,
  type DayButtonProps,
  DayPicker,
  type MonthCaptionProps,
  useDayPicker,
} from 'react-day-picker';
import { cn } from '../../utils/cn.js';
import { fieldSurface } from '../../utils/field.js';
import { focusRing } from '../../utils/focus-ring.js';
import { stateLayer } from '../../utils/state-layer.js';
import { ActionBar } from '../ActionBar/ActionBar.js';
import { Button } from '../Button/Button.js';
import {
  type DateGranularity,
  type DateMatcher,
  type DateRange,
  type DateValue,
  buildMonthGrid,
  buildYearGrid,
  dateToIso,
  formatDateValue,
  isoToDate,
  rangeToRdp,
  rdpToRange,
  toRdpDisabled,
  yearOf,
} from './date.js';

// ── shared props ──────────────────────────────────────────────────────────

interface CalendarBaseProps {
  /** Earliest selectable date (inclusive), canonical "YYYY-MM-DD". */
  minDate?: DateValue;
  /** Latest selectable date (inclusive), canonical "YYYY-MM-DD". */
  maxDate?: DateValue;
  disabledDates?: DateMatcher | DateMatcher[];
  /** 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1;
  /** Render the Clear / Apply footer (Action Bar). */
  showFooter?: boolean;
  disabled?: boolean;
  /** BCP-47 locale for weekday/month labels and formatting. */
  locale?: string;
  className?: string;
  'aria-label'?: string;
}

export interface DatePickerProps extends CalendarBaseProps {
  /** `day` calendar (default), or a `month` / `year` selection grid. */
  granularity?: DateGranularity;
  value?: DateValue | null;
  defaultValue?: DateValue | null;
  onValueChange?: (value: DateValue | null) => void;
  onApply?: (value: DateValue | null) => void;
  onClear?: () => void;
}

export interface DualDatePickerProps extends CalendarBaseProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  /** Months shown side by side (default 2). */
  numberOfMonths?: number;
  onApply?: (value: DateRange) => void;
  onClear?: () => void;
}

export interface DateInputProps extends DatePickerProps {
  /** Label above the trigger field. */
  label?: string;
  /** Helper text shown below the trigger when there is no error. */
  helper?: ReactNode;
  /** Error message shown below the trigger; also flags the field invalid. */
  errorMessage?: ReactNode;
  placeholder?: string;
  /** Show a clear (×) button when a value is set. */
  clearable?: boolean;
  /** Intl options for the formatted trigger text. */
  format?: Intl.DateTimeFormatOptions;
}

// ── controlled/uncontrolled state (generic port of TimePicker's hook) ───────

function useControllable<T>(
  controlled: T | undefined,
  defaultValue: T | undefined,
  onChange: ((value: T) => void) | undefined,
  fallback: T,
) {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue ?? fallback);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : uncontrolled;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue] as const;
}

// ── token-bound styling ─────────────────────────────────────────────────────

// Container Radius (radius.md) + Container Padding (spacing.16), bg/surface.
const paneSurface =
  'rounded-[var(--radius-md)] bg-[var(--bg-surface)] p-[var(--spacing-16)] text-[var(--text-primary)]';

const navButton =
  'inline-grid size-[var(--size-32)] place-items-center rounded-[var(--radius-sm)] ' +
  'text-[var(--text-muted)] outline-none transition-colors hover:bg-[var(--bg-subtle)] ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ' +
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]';

// rdp restyle: element keys → Max Core token utilities. The header (caption + nav)
// is a custom MonthCaption override (below) — rdp's default Nav renders as a sibling
// of the months, not inside the caption, so it can't be anchored there; we hide it
// with `hideNavigation` and render nav inside the caption instead. Selection /
// day-flag visuals live in the DayItem override (via `modifiers`).
const calendarClassNames: Partial<ClassNames> = {
  months: 'flex flex-col gap-[var(--spacing-16)] sm:flex-row',
  month: 'flex flex-col',
  // Picker Grid Rows Gap (spacing.08) between week rows.
  month_grid: 'border-separate [border-spacing:0_var(--spacing-08)]',
  weekday: 'pb-[var(--spacing-08)] text-[0.75rem] font-medium text-[var(--text-muted)]',
  // Day Item Padding (spacing.02) around each cell button.
  day: 'p-[var(--spacing-02)] text-center align-middle',
};

// ── internals (Figma _Internals — not exported) ─────────────────────────────

/** `components.DayButton` override — the Figma `_Day Item`, styled from modifiers. */
function DayItem(props: DayButtonProps) {
  const { modifiers, className, ...buttonProps } = props;
  const ref = useRef<HTMLButtonElement>(null);
  // Preserve rdp's roving focus (keyboard grid navigation).
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isRangeCap = modifiers.range_start || modifiers.range_end;
  return (
    <button
      ref={ref}
      {...buttonProps}
      className={cn(
        // Today Item Size (size.40) + Day Item Radius (radius.sm).
        'relative isolate grid size-[var(--size-40)] place-items-center rounded-[var(--radius-sm)]',
        'text-sm tabular-nums outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
        !modifiers.selected && !isRangeCap && !modifiers.disabled && stateLayer,
        // Today Radius (radius.full) ring when today and not selected.
        modifiers.today &&
          !modifiers.selected &&
          !isRangeCap &&
          'rounded-[var(--radius-full)] ring-1 ring-[var(--border-accent)]',
        modifiers.range_middle &&
          'rounded-none bg-[var(--accent-surface)] text-[var(--text-primary)]',
        (modifiers.selected || isRangeCap) &&
          'bg-[var(--accent-default)] text-[var(--text-on-accent)]',
        modifiers.outside && 'text-[var(--text-muted)]',
        modifiers.disabled && 'text-[var(--text-muted)] opacity-[var(--opacity-disabled)]',
        className,
      )}
    />
  );
}

// A subtle text button for the clickable month / year labels in the header.
const labelButton =
  'rounded-[var(--radius-sm)] px-[var(--spacing-04)] py-[var(--spacing-02)] text-sm font-bold ' +
  'text-[var(--text-primary)] outline-none transition-colors hover:bg-[var(--bg-subtle)] ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]';

/**
 * `components.MonthCaption` override — the Figma header: month-year label on the
 * left, prev/next nav on the right. Navigation comes from the rdp context (so it
 * works for one or two months); with two months, prev shows on the first caption
 * and next on the last. When `onOpenView` is provided the month and year become
 * buttons that open the month / year picker (drill-down). Header Padding Y
 * (spacing.12) + Month Year Action Gap (spacing.04).
 */
function CalendarCaption({
  calendarMonth,
  displayIndex,
  className,
  locale,
  onOpenView,
}: MonthCaptionProps & { locale?: string; onOpenView?: (view: 'month' | 'year') => void }) {
  const { months, nextMonth, previousMonth, goToMonth } = useDayPicker();
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long' }).format(calendarMonth.date);
  const yearLabel = new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(calendarMonth.date);
  const showPrev = displayIndex === 0;
  const showNext = displayIndex === months.length - 1;
  return (
    <div className={cn('flex items-center justify-between py-[var(--spacing-12)]', className)}>
      {onOpenView ? (
        <span className="flex items-center gap-[var(--spacing-04)]">
          <button type="button" onClick={() => onOpenView('month')} className={labelButton}>
            {monthLabel}
          </button>
          <button type="button" onClick={() => onOpenView('year')} className={labelButton}>
            {yearLabel}
          </button>
        </span>
      ) : (
        <span className="text-sm font-bold text-[var(--text-primary)]">
          {monthLabel} {yearLabel}
        </span>
      )}
      <div className="flex items-center gap-[var(--spacing-04)]">
        {showPrev ? (
          <button
            type="button"
            aria-label="Previous month"
            disabled={!previousMonth}
            onClick={() => previousMonth && goToMonth(previousMonth)}
            className={navButton}
          >
            <ChevronLeftIcon className="size-[var(--size-16)]" />
          </button>
        ) : null}
        {showNext ? (
          <button
            type="button"
            aria-label="Next month"
            disabled={!nextMonth}
            onClick={() => nextMonth && goToMonth(nextMonth)}
            className={navButton}
          >
            <ChevronRightIcon className="size-[var(--size-16)]" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Stable `components` map for the rdp DayPicker, memoized on `locale` + `onOpenView`. */
function useCalendarComponents(locale?: string, onOpenView?: (view: 'month' | 'year') => void) {
  return useMemo(
    () => ({
      DayButton: DayItem,
      MonthCaption: (props: MonthCaptionProps) => (
        <CalendarCaption {...props} locale={locale} onOpenView={onOpenView} />
      ),
    }),
    [locale, onOpenView],
  );
}

/** Clear / Apply footer — composes the shared Action Bar (Figma refactor). */
function DatePickerFooter({ onClear, onApply }: { onClear: () => void; onApply: () => void }) {
  return (
    <ActionBar
      direction="horizontal"
      // Footer Padding Y (spacing.12) + Footer Gap (spacing.08).
      className="mt-[var(--spacing-12)] gap-[var(--spacing-08)] pt-[var(--spacing-12)]"
    >
      <Button variant="ghost" onClick={onClear}>
        Clear
      </Button>
      <Button variant="primary" onClick={onApply}>
        Apply
      </Button>
    </ActionBar>
  );
}

/**
 * Month / Year selection grid (rdp has no such mode). Controlled by `displayYear`
 * so it shares the pane's displayed period; used both as a base selection view and
 * as a drill-down navigation view. In month mode the year label is a button
 * (`onOpenYear`) that opens the year picker. NOTE: the Figma master renders these
 * as scroll wheels (like the Time Picker), not grids — a lean-v1 grid ships here by
 * decision; wheel parity is a deferred follow-up.
 */
function MonthYearGrid({
  mode,
  displayYear,
  value,
  minDate,
  maxDate,
  locale,
  onPageYear,
  onPick,
  onOpenYear,
}: {
  mode: 'month' | 'year';
  displayYear: number;
  /** Highlighted value, only when this grid is the committing selection. */
  value: DateValue | null;
  minDate?: DateValue;
  maxDate?: DateValue;
  locale?: string;
  onPageYear: (nextYear: number) => void;
  onPick: (value: DateValue) => void;
  onOpenYear?: () => void;
}) {
  const cells = mode === 'month' ? buildMonthGrid(displayYear, locale) : buildYearGrid(displayYear);
  const sliceEnd = mode === 'month' ? 7 : 4; // "YYYY-MM" vs "YYYY"
  const step = mode === 'month' ? 1 : 12;
  const label =
    mode === 'month' ? String(displayYear) : `${cells[0]?.label}–${cells[cells.length - 1]?.label}`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-[var(--spacing-12)]">
        {onOpenYear ? (
          <button type="button" onClick={onOpenYear} className={labelButton}>
            {label}
          </button>
        ) : (
          <span className="px-[var(--spacing-04)] text-sm font-bold text-[var(--text-primary)]">
            {label}
          </span>
        )}
        <div className="flex items-center gap-[var(--spacing-04)]">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => onPageYear(displayYear - step)}
            className={navButton}
          >
            <ChevronLeftIcon className="size-[var(--size-16)]" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => onPageYear(displayYear + step)}
            className={navButton}
          >
            <ChevronRightIcon className="size-[var(--size-16)]" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[var(--spacing-08)]">
        {cells.map((cell) => {
          const key = cell.value.slice(0, sliceEnd);
          const selected = value != null && value.slice(0, sliceEnd) === key;
          const disabled =
            (minDate != null && key < minDate.slice(0, sliceEnd)) ||
            (maxDate != null && key > maxDate.slice(0, sliceEnd));
          return (
            <button
              key={cell.value}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onPick(cell.value)}
              className={cn(
                // Today Padding (spacing.06) as the cell's internal padding.
                'relative isolate grid place-items-center rounded-[var(--radius-sm)] p-[var(--spacing-06)]',
                'text-sm outline-none transition-colors',
                'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
                !selected && !disabled && stateLayer,
                selected && 'bg-[var(--accent-default)] text-[var(--text-on-accent)]',
                disabled && 'text-[var(--text-muted)] opacity-[var(--opacity-disabled)]',
              )}
            >
              {cell.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── public components ───────────────────────────────────────────────────────

/** Inline calendar pane. `granularity` picks day / month / year selection. */
export function DatePicker({
  granularity = 'day',
  value: controlledValue,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  disabledDates,
  weekStartsOn = 1,
  showFooter = false,
  onApply,
  onClear,
  disabled = false,
  locale,
  className,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const [value, setValue] = useControllable<DateValue | null>(
    controlledValue,
    defaultValue,
    onValueChange,
    null,
  );
  // `view` = which pane is showing (starts at the selection granularity, then the
  // header lets you drill up to month/year and back). `displayMonth` is the shared
  // displayed period, so the day grid and the month/year grids stay in sync.
  const [view, setView] = useState<DateGranularity>(granularity);
  const [displayMonth, setDisplayMonth] = useState<Date>(() => isoToDate(value) ?? new Date());
  const displayYear = displayMonth.getFullYear();

  const openView = useCallback((next: 'month' | 'year') => setView(next), []);
  const components = useCalendarComponents(locale, granularity === 'day' ? openView : undefined);

  // A pick in a month/year grid: commit when it's the selection granularity,
  // otherwise treat it as navigation and drill back down to the base view.
  const pickFromGrid = (gridMode: 'month' | 'year', iso: DateValue) => {
    if (gridMode === granularity) {
      setValue(iso);
      return;
    }
    if (gridMode === 'year') {
      setDisplayMonth(new Date(yearOf(iso), displayMonth.getMonth(), 1, 12));
    } else {
      setDisplayMonth(isoToDate(iso) ?? displayMonth);
    }
    setView(granularity);
  };

  let body: ReactNode;
  if (view === 'day') {
    body = (
      <DayPicker
        mode="single"
        selected={isoToDate(value)}
        onSelect={(date) => setValue(date ? dateToIso(date) : null)}
        month={displayMonth}
        onMonthChange={setDisplayMonth}
        startMonth={isoToDate(minDate)}
        endMonth={isoToDate(maxDate)}
        disabled={toRdpDisabled(minDate, maxDate, disabledDates)}
        weekStartsOn={weekStartsOn}
        showOutsideDays
        hideNavigation
        classNames={calendarClassNames}
        components={components}
      />
    );
  } else {
    body = (
      <MonthYearGrid
        mode={view}
        displayYear={displayYear}
        value={granularity === view ? value : null}
        minDate={minDate}
        maxDate={maxDate}
        locale={locale}
        onPageYear={(nextYear) =>
          setDisplayMonth(new Date(nextYear, displayMonth.getMonth(), 1, 12))
        }
        onPick={(iso) => pickFromGrid(view, iso)}
        onOpenYear={view === 'month' ? () => setView('year') : undefined}
      />
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        'inline-flex min-w-[308px] flex-col',
        paneSurface,
        disabled && 'pointer-events-none opacity-[var(--opacity-disabled)]',
        className,
      )}
    >
      {body}
      {showFooter ? (
        <DatePickerFooter
          onClear={() => {
            setValue(null);
            onClear?.();
          }}
          onApply={() => onApply?.(value)}
        />
      ) : null}
    </div>
  );
}

/** Two-month range calendar. */
export function DualDatePicker({
  value: controlledValue,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  disabledDates,
  weekStartsOn = 1,
  showFooter = false,
  numberOfMonths = 2,
  onApply,
  onClear,
  disabled = false,
  locale,
  className,
  'aria-label': ariaLabel,
}: DualDatePickerProps) {
  const [range, setRange] = useControllable<DateRange>(
    controlledValue,
    defaultValue,
    onValueChange,
    {
      start: null,
      end: null,
    },
  );
  const components = useCalendarComponents(locale);

  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        'inline-flex flex-col',
        paneSurface,
        disabled && 'pointer-events-none opacity-[var(--opacity-disabled)]',
        className,
      )}
    >
      <DayPicker
        mode="range"
        numberOfMonths={numberOfMonths}
        selected={rangeToRdp(range)}
        onSelect={(next) => setRange(rdpToRange(next))}
        defaultMonth={isoToDate(range.start)}
        startMonth={isoToDate(minDate)}
        endMonth={isoToDate(maxDate)}
        disabled={toRdpDisabled(minDate, maxDate, disabledDates)}
        weekStartsOn={weekStartsOn}
        showOutsideDays
        hideNavigation
        classNames={calendarClassNames}
        components={components}
      />
      {showFooter ? (
        <DatePickerFooter
          onClear={() => {
            setRange({ start: null, end: null });
            onClear?.();
          }}
          onApply={() => onApply?.(range)}
        />
      ) : null}
    </div>
  );
}

/** Field that opens a DatePicker in a popover (Figma Input Date Picker). */
export function DateInput({
  granularity,
  value: controlledValue,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  disabledDates,
  weekStartsOn,
  showFooter,
  disabled = false,
  locale,
  label,
  helper,
  errorMessage,
  placeholder = 'Select date',
  clearable = true,
  format,
  className,
  'aria-label': ariaLabel,
}: DateInputProps) {
  const [value, setValue] = useControllable<DateValue | null>(
    controlledValue,
    defaultValue,
    onValueChange,
    null,
  );
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const formatted = formatDateValue(value, format, locale);
  const isInvalid = Boolean(errorMessage);

  return (
    <Field.Root
      className={cn('inline-flex flex-col gap-[var(--spacing-06)]', className)}
      invalid={isInvalid}
      disabled={disabled}
    >
      {label ? (
        <Field.Label htmlFor={triggerId} className="text-sm text-[var(--text-secondary)]">
          {label}
        </Field.Label>
      ) : null}
      {/* Input Date Picker Gap (spacing.12) between the field icon and text. */}
      <div className="relative w-[var(--size-240)] max-w-full">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger
            id={triggerId}
            disabled={disabled}
            aria-label={ariaLabel ?? label ?? 'Select date'}
            className={cn(
              'inline-flex w-full items-center gap-[var(--spacing-12)]',
              'rounded-[var(--radius-md)] px-[var(--spacing-12)] py-[var(--spacing-12)] text-sm',
              fieldSurface,
              focusRing,
              isInvalid && 'border-[var(--status-danger-default)]',
              '[&_svg]:size-[var(--size-20)] [&_svg]:text-[var(--text-muted)]',
            )}
          >
            <CalendarIcon />
            <span className={cn('flex-1 text-left', !formatted && 'text-[var(--text-muted)]')}>
              {formatted || placeholder}
            </span>
          </Popover.Trigger>
          {clearable && value && !disabled ? (
            <button
              type="button"
              aria-label="Clear date"
              onClick={() => setValue(null)}
              className={cn(
                'absolute inset-y-0 right-[var(--spacing-08)] my-auto grid size-[var(--size-24)] place-items-center',
                'rounded-[var(--radius-sm)] text-[var(--text-muted)] outline-none',
                'hover:bg-[var(--bg-subtle)] focus-visible:bg-[var(--bg-subtle)]',
                '[&_svg]:size-[var(--size-16)]',
              )}
            >
              <XIcon />
            </button>
          ) : null}
          <Popover.Portal>
            <Popover.Positioner side="bottom" align="start" sideOffset={8} className="isolate z-50">
              <Popover.Popup className="shadow-[var(--effect-shadow-down-md)] outline-none">
                <DatePicker
                  granularity={granularity}
                  value={value}
                  onValueChange={(next) => {
                    setValue(next);
                    if (next) setOpen(false);
                  }}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDates={disabledDates}
                  weekStartsOn={weekStartsOn}
                  showFooter={showFooter}
                  locale={locale}
                />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
      {errorMessage ? (
        <Field.Error match={true} className="text-xs text-[var(--status-danger-default)]">
          {errorMessage}
        </Field.Error>
      ) : helper ? (
        <Field.Description className="text-xs text-[var(--text-muted)]">{helper}</Field.Description>
      ) : null}
    </Field.Root>
  );
}

// ── inline icons (no icon package — every component draws its own) ───────────

function ChevronLeftIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={cn('shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={cn('shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon(): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
