'use client';

import { Field } from '@base-ui/react/field';
import { Popover } from '@base-ui/react/popover';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  type ClassNames,
  type DayButtonProps,
  DayPicker,
  type MonthCaptionProps,
  useDayPicker,
} from 'react-day-picker';
import { cn } from '../../utils/cn.js';
import {
  fieldBorder,
  fieldError,
  fieldFill,
  fieldHelper,
  fieldHover,
  fieldInvalidFill,
  fieldLabel,
  fieldRoot,
} from '../../utils/field.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useFormGroupSize } from '../../utils/form-group-size.js';
import { useControllableState } from '../../utils/use-controllable-state.js';
import { ActionBar } from '../ActionBar/ActionBar.js';
import { Button } from '../Button/Button.js';
import { IconOnlyButton } from '../IconOnlyButton/IconOnlyButton.js';
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

export interface DateInputProps extends DatePickerProps, VariantProps<typeof triggerStyles> {
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

// ── token-bound styling ─────────────────────────────────────────────────────

// Figma Date Picker (2486:6242): Container Radius (radius.md), bg/surface, no
// border (Container Border Weight = none) and no padding — the header, weekday
// row, day grid and footer run edge to edge and carry their own padding.
const paneSurface = 'rounded-[var(--radius-md)] bg-[var(--bg-surface)] text-[var(--text-primary)]';

// rdp restyle: element keys → Max Core token utilities. The header (caption + nav)
// is a custom MonthCaption override (below) — rdp's default Nav renders as a sibling
// of the months, not inside the caption, so it can't be anchored there; we hide it
// with `hideNavigation` and render nav inside the caption instead. Selection /
// day-flag visuals live in the DayItem override (via `modifiers`). Rows stack
// flush (the master's 44px _Day Item = 2px Day Item Padding around a 40px day);
// columns share the pane width. Range cells drop the padding on the side that
// joins the band, so start → middle → end reads as one strip.
const calendarClassNames: Partial<ClassNames> = {
  months: 'flex flex-col gap-[var(--spacing-08)] sm:flex-row',
  month: 'flex flex-col',
  month_grid: 'w-full border-collapse',
  // _Weekday Header cell: Caption/300 text/secondary, 10px top/bottom.
  weekday: 'py-[var(--spacing-10)] text-xs font-light text-[var(--text-secondary)]',
  day: 'p-[var(--spacing-02)] text-center align-middle',
  range_start: 'pr-0',
  range_end: 'pl-0',
  range_middle: 'px-0',
};

// Input Date Picker's field: a Base Input frame (Select-style trigger) with a
// leading calendar icon. Padding Y, Min Width and Icon Size per
// -- Molecule/Input/Base Input/Size {S,M,L}; text 12 / 14 / 16 regular, as the
// other fields. Open = border/accent (the popup's anchor).
const triggerStyles = cva(
  [
    'inline-flex w-full items-center gap-[var(--spacing-08)]',
    'rounded-[var(--radius-md)] px-[calc(var(--spacing-12)-var(--border-weight-thin))] text-left',
    fieldBorder,
    'data-[popup-open]:border-[var(--border-accent)]',
  ],
  {
    variants: {
      size: {
        s: 'min-w-[160px] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-xs [&_svg]:size-[var(--size-16)]',
        m: 'min-w-[180px] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-sm [&_svg]:size-[var(--size-20)]',
        l: 'min-w-[200px] py-[calc(var(--spacing-16)-var(--border-weight-thin))] text-base [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Reserve room for the clear button so the value never runs under it.
const clearPad = { s: 'pr-[var(--size-32)]', m: 'pr-[var(--size-40)]', l: 'pr-[var(--size-48)]' };

// ── internals (Figma _Internals — not exported) ─────────────────────────────

/**
 * `components.DayButton` override — the Figma `_Day Item`, styled from modifiers:
 * Caption/700; Hover = accent/subtle + text/primary (decision), Pressed =
 * accent/active + text/on-accent;
 * Today = a 1px accent/default circle (Today Radius full, Today Item Size 40) with
 * text/accent; Active (selected) and range Start/End = accent/default; Middle =
 * the accent/surface band with text/accent.
 */
function DayItem(props: DayButtonProps) {
  const { modifiers, className, ...buttonProps } = props;
  const ref = useRef<HTMLButtonElement>(null);
  // Preserve rdp's roving focus (keyboard grid navigation).
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isStart = Boolean(modifiers.range_start);
  const isEnd = Boolean(modifiers.range_end);
  const isSingleCap = isStart && isEnd;
  const isMiddle = Boolean(modifiers.range_middle);
  const isSelected = Boolean(modifiers.selected) || isStart || isEnd;
  const isToday = Boolean(modifiers.today) && !isSelected && !isMiddle;
  return (
    <button
      ref={ref}
      {...buttonProps}
      className={cn(
        'relative grid h-[var(--size-40)] place-items-center text-xs font-bold tabular-nums transition-colors',
        focusRing,
        (isStart || isEnd || isMiddle) && !isSingleCap
          ? 'w-full'
          : 'mx-auto w-[var(--size-40)] rounded-[var(--radius-sm)]',
        // Hover = the List Item wash (accent/subtle + text/primary), not the master's
        // accent/hover + white (1.91:1 in light) — decision, flagged. Pressed keeps
        // the master's accent/active. The selected fill doesn't react to hover.
        !modifiers.disabled &&
          !isSelected && [
            'hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]',
            'active:bg-[var(--accent-active)] active:text-[var(--text-on-accent)]',
          ],
        isToday &&
          'rounded-[var(--radius-full)] text-[var(--text-accent)] ring-1 ring-[var(--accent-default)] ring-inset',
        isSelected && 'bg-[var(--accent-default)] text-[var(--text-on-accent)]',
        isStart && !isSingleCap && 'rounded-l-[var(--radius-sm)]',
        isEnd && !isSingleCap && 'rounded-r-[var(--radius-sm)]',
        isMiddle && 'bg-[var(--accent-surface)] text-[var(--text-accent)]',
        modifiers.disabled && 'pointer-events-none opacity-[var(--opacity-disabled)]',
        className,
      )}
    />
  );
}

// Header month / year labels: the master's ghost Button S with a chevron
// (Caption/700 text/primary). Two buttons — month, then year — each opening its
// picker (decision: keep both; the master shows the month only).
const labelButtonClass = 'text-[var(--text-primary)] [&_svg]:text-[var(--text-secondary)]';
// The master's header icons (chevrons, prev / next) are text/secondary.
const headerIconClass = 'text-[var(--text-secondary)]';

function NavButtons({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  prevLabel = 'Previous month',
  nextLabel = 'Next month',
}: {
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
}) {
  // Header action section: ghost Icon Only S buttons, 8px apart.
  return (
    <div className="flex items-center gap-[var(--spacing-08)]">
      {onPrev ? (
        <IconOnlyButton
          variant="ghost"
          size="s"
          aria-label={prevLabel}
          className={headerIconClass}
          disabled={prevDisabled}
          onClick={onPrev}
          icon={<ChevronLeftIcon />}
        />
      ) : null}
      {onNext ? (
        <IconOnlyButton
          variant="ghost"
          size="s"
          aria-label={nextLabel}
          className={headerIconClass}
          disabled={nextDisabled}
          onClick={onNext}
          icon={<ChevronRightIcon />}
        />
      ) : null}
    </div>
  );
}

/**
 * `components.MonthCaption` override — the Figma Calendar Pane: month-year label
 * on the left, prev/next nav on the right. Navigation comes from the rdp context
 * (so it works for one or two months); with two months, prev shows on the first
 * caption and next on the last. When `onOpenView` is provided the month and year
 * become buttons that open the month / year picker (drill-down). Header Padding
 * X/Y (spacing.16 / .12) + Month Year Action Gap (spacing.04).
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
    <div
      className={cn(
        'flex items-center justify-between px-[var(--spacing-16)] py-[var(--spacing-12)]',
        className,
      )}
    >
      {onOpenView ? (
        <span className="flex items-center gap-[var(--spacing-04)]">
          <Button
            variant="ghost"
            size="s"
            className={labelButtonClass}
            rightIcon={<ChevronDownIcon />}
            onClick={() => onOpenView('month')}
          >
            {monthLabel}
          </Button>
          <Button
            variant="ghost"
            size="s"
            className={labelButtonClass}
            rightIcon={<ChevronDownIcon />}
            onClick={() => onOpenView('year')}
          >
            {yearLabel}
          </Button>
        </span>
      ) : (
        <span className="text-xs font-bold text-[var(--text-primary)]">
          {monthLabel} {yearLabel}
        </span>
      )}
      <NavButtons
        onPrev={showPrev ? () => previousMonth && goToMonth(previousMonth) : undefined}
        onNext={showNext ? () => nextMonth && goToMonth(nextMonth) : undefined}
        prevDisabled={!previousMonth}
        nextDisabled={!nextMonth}
      />
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

/**
 * Clear / Apply footer — the master's _Date Picker Footer: an Action Bar of S
 * buttons (Ghost Clear, Primary Apply) with 12px padding (as rendered; the
 * Footer Padding X/Y tokens are unbound) and Footer Gap (spacing.08). The
 * buttons share the width, so the Action Bar's 160px minimum is lifted.
 */
function DatePickerFooter({ onClear, onApply }: { onClear: () => void; onApply: () => void }) {
  return (
    <ActionBar
      direction="horizontal"
      className="gap-[var(--spacing-08)] p-[var(--spacing-12)] [&>*]:min-w-0"
    >
      <Button variant="ghost" size="s" onClick={onClear}>
        Clear
      </Button>
      <Button variant="primary" size="s" onClick={onApply}>
        Apply
      </Button>
    </ActionBar>
  );
}

/** Short weekday names ("Mon"), as the master's _Weekday Header. */
function useWeekdayFormatter(locale?: string) {
  return useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    return { formatWeekdayName: (date: Date) => fmt.format(date) };
  }, [locale]);
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
      <div className="flex items-center justify-between px-[var(--spacing-16)] py-[var(--spacing-12)]">
        {onOpenYear ? (
          <Button
            variant="ghost"
            size="s"
            className={labelButtonClass}
            rightIcon={<ChevronDownIcon />}
            onClick={onOpenYear}
          >
            {label}
          </Button>
        ) : (
          <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>
        )}
        <NavButtons
          onPrev={() => onPageYear(displayYear - step)}
          onNext={() => onPageYear(displayYear + step)}
          prevLabel="Previous"
          nextLabel="Next"
        />
      </div>
      {/* Picker Grid Rows Gap (spacing.08). */}
      <div className="grid grid-cols-3 gap-[var(--spacing-08)] px-[var(--spacing-16)] pb-[var(--spacing-12)]">
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
                // Today Padding (spacing.06) as the cell's internal padding; the
                // day-item look (Caption/700, wash hover, accent pressed / selected).
                'grid place-items-center rounded-[var(--radius-sm)] p-[var(--spacing-06)]',
                'text-xs font-bold transition-colors',
                focusRing,
                selected
                  ? 'bg-[var(--accent-default)] text-[var(--text-on-accent)]'
                  : [
                      'hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]',
                      'active:bg-[var(--accent-active)] active:text-[var(--text-on-accent)]',
                    ],
                disabled && 'pointer-events-none opacity-[var(--opacity-disabled)]',
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
  const [value, setValue] = useControllableState<DateValue | null>(
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
  const formatters = useWeekdayFormatter(locale);

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
        hideNavigation
        classNames={calendarClassNames}
        components={components}
        formatters={formatters}
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
  const [range, setRange] = useControllableState<DateRange>(
    controlledValue,
    defaultValue,
    onValueChange,
    {
      start: null,
      end: null,
    },
  );
  const components = useCalendarComponents(locale);
  const formatters = useWeekdayFormatter(locale);

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
        hideNavigation
        classNames={calendarClassNames}
        components={components}
        formatters={formatters}
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

/**
 * Field that opens a DatePicker in a popover (Figma Input Date Picker): a Base
 * Input-style trigger on the shared field model, with the calendar 12px below
 * (Input Date Picker Gap). No shadow, like the other floating lists; the pane
 * gets a 1px border/default so it stands off the page (the master has none —
 * decision, flagged).
 */
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
  size: sizeProp,
  className,
  'aria-label': ariaLabel,
}: DateInputProps) {
  const size = useFormGroupSize(sizeProp) ?? 'm';
  const [value, setValue] = useControllableState<DateValue | null>(
    controlledValue,
    defaultValue,
    onValueChange,
    null,
  );
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const formatted = formatDateValue(value, format, locale);
  const isInvalid = Boolean(errorMessage);
  const showClear = clearable && Boolean(value) && !disabled;

  return (
    <Field.Root className={cn(fieldRoot, className)} invalid={isInvalid} disabled={disabled}>
      {label ? (
        <Field.Label htmlFor={triggerId} className={fieldLabel(isInvalid)}>
          {label}
        </Field.Label>
      ) : null}
      <div className="relative w-full">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger
            id={triggerId}
            disabled={disabled}
            aria-label={ariaLabel ?? label ?? 'Select date'}
            className={cn(
              triggerStyles({ size }),
              showClear && clearPad[size],
              isInvalid
                ? ['border-[var(--status-danger-border)]', fieldInvalidFill.primary]
                : [fieldFill.primary, fieldHover],
            )}
          >
            <span
              className={cn(
                'flex shrink-0',
                isInvalid ? 'text-[var(--status-danger-default)]' : 'text-[var(--text-muted)]',
              )}
            >
              <CalendarIcon />
            </span>
            <span
              className={cn(
                'min-w-0 flex-1 truncate',
                !formatted &&
                  (isInvalid ? 'text-[var(--status-danger-default)]' : 'text-[var(--text-muted)]'),
              )}
            >
              {formatted || placeholder}
            </span>
          </Popover.Trigger>
          {showClear ? (
            <button
              type="button"
              aria-label="Clear date"
              onClick={() => setValue(null)}
              className={cn(
                'absolute inset-y-0 right-[var(--spacing-08)] my-auto grid size-[var(--size-24)] place-items-center',
                'rounded-[var(--radius-sm)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]',
                focusRing,
                size === 's' ? '[&_svg]:size-[var(--size-16)]' : '[&_svg]:size-[var(--size-20)]',
              )}
            >
              <XIcon />
            </button>
          ) : null}
          <Popover.Portal>
            <Popover.Positioner
              side="bottom"
              align="start"
              sideOffset={12}
              className="isolate z-50"
            >
              <Popover.Popup className="outline-none">
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
                  className="min-w-[max(308px,var(--anchor-width))] border border-[var(--border-default)]"
                />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
      {errorMessage ? (
        <Field.Error match={true} className={fieldError}>
          {errorMessage}
        </Field.Error>
      ) : helper ? (
        <Field.Description className={fieldHelper}>{helper}</Field.Description>
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

function ChevronDownIcon(): ReactNode {
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
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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
