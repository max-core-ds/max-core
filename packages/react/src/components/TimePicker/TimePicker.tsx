'use client';

import { Field } from '@base-ui/react/field';
import { Popover } from '@base-ui/react/popover';
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { fieldHover, fieldSurface } from '../../utils/field.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useControllableState } from '../../utils/use-controllable-state.js';
import {
  HOURS_12,
  HOURS_24,
  PERIODS,
  type TimeFormat,
  type TimeMatcher,
  type TimeStep,
  type TimeValue,
  type TimeValueParts,
  formatTimeValue,
  getSelectableValue,
  nowValue,
  pad,
  parseTimeValue,
  stepOptions,
} from './time.js';

type UnitView = 'hours' | 'minutes' | 'seconds';
type Period = (typeof PERIODS)[number];

export interface TimePickerProps {
  /** `popover` (default) renders a field that opens the wheel; `inline` renders the wheel directly. */
  mode?: 'popover' | 'inline';
  /** Controlled value — canonical 24-hour "HH:mm" or "HH:mm:ss". */
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onValueChange?: (value: TimeValue | null) => void;
  /** Display system for the hour column and the trigger text. */
  format?: TimeFormat;
  minuteStep?: TimeStep;
  secondStep?: TimeStep;
  showSeconds?: boolean;
  /** Earliest selectable time (inclusive), canonical 24-hour string. */
  minTime?: TimeValue;
  /** Latest selectable time (inclusive), canonical 24-hour string. */
  maxTime?: TimeValue;
  disabledTimes?: TimeMatcher | TimeMatcher[];
  disabled?: boolean;
  /** popover mode: label rendered above the trigger field. */
  label?: string;
  /** popover mode: helper text shown below the trigger when there is no error. */
  helper?: ReactNode;
  /** popover mode: error message shown below the trigger; also flags the field invalid. */
  errorMessage?: ReactNode;
  /** popover mode: text shown when there is no value. */
  placeholder?: string;
  /** popover mode: show a clear (×) button when a value is set. */
  clearable?: boolean;
  className?: string;
  'aria-label'?: string;
}

const WHEEL_OFFSETS = [-2, -1, 0, 1, 2] as const;
const WHEEL_STEP_THRESHOLD = 40;

// Row treatment by distance from the centre (selected) row, per the master: the
// centre is Body/MD/700 in text/accent on the accent/subtle bar; ±1 rows are
// Body/SM/300 text/secondary @ opacity/dim; ±2 rows Caption/300 @ opacity/disabled.
// The AM/PM column uses the same ramp (as the master now does).
// Deliberate deviation: the master stacks cap-trimmed text (9 / 10 / 12 tall),
// which would make 9px-tall click targets. Rows keep line-box heights
// (16 / 20 / 24) as tap targets, with the label cap-trimmed and centred inside.
const rowByDistance = [
  'h-(--size-24) type-body-md-700 text-(--text-accent)',
  'h-(--size-20) type-body-sm-300 text-(--text-secondary) opacity-(--opacity-dim)',
  'h-(--size-16) type-caption-300 text-(--text-secondary) opacity-(--opacity-disabled)',
];
const spacerByDistance = ['h-(--size-24)', 'h-(--size-20)', 'h-(--size-16)'];

// Hover on a non-selected row (not in Figma): text/accent at full opacity, so the
// faded row lights up without looking selected (no bar, no bold). text/accent is
// the text-role accent — 6.29 light / 7.34 dark on bg/surface (accent/hover is a
// pale fill, ~2:1 as text).
const rowHover =
  'transition-[color,opacity] enabled:hover:text-(--text-accent) enabled:hover:opacity-100';

// -- Atoms/Time Picker/*: Radius, Container Padding X/Y, Gap (between columns),
// Items Gap (between rows), Border Weight (`none` — kept so a theme can switch the
// border/default stroke on). The selector bar is full-bleed via a negative inset
// matching Container Padding X.
const surfaceStyles =
  'rounded-(--time-picker-radius) bg-(--bg-surface) px-(--time-picker-container-padding-x) py-(--time-picker-container-padding-y) ' +
  'border-solid border-(length:--time-picker-border-weight) border-(--border-default)';

// Next enabled option in `direction`, wrapping; undefined if none available.
function nextWheelValue<T>(
  options: readonly T[],
  selected: T,
  direction: 1 | -1,
  isDisabled?: (value: T) => boolean,
): T | undefined {
  const count = options.length;
  const start = options.indexOf(selected);
  if (start < 0 || count === 0) return undefined;
  for (let move = 1; move <= count; move += 1) {
    const value = options[(((start + direction * move) % count) + count) % count];
    if (value !== undefined && !isDisabled?.(value)) return value;
  }
  return undefined;
}

function WheelColumn<T>({
  options,
  selected,
  ariaLabel,
  disabled,
  render,
  onSelect,
  isDisabled,
}: {
  options: readonly T[];
  selected: T;
  ariaLabel: string;
  disabled: boolean;
  render: (value: T) => ReactNode;
  onSelect: (value: T) => void;
  isDisabled?: (value: T) => boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const accumulated = useRef(0);
  const selectedIndex = options.indexOf(selected);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (disabled) return;
      const next = nextWheelValue(options, selected, direction, isDisabled);
      if (next !== undefined) onSelect(next);
    },
    [disabled, options, selected, isDisabled, onSelect],
  );

  // Native, non-passive wheel listener: React's synthetic onWheel is passive and
  // cannot preventDefault the page scroll. Accumulate delta so one notch = ±1 for
  // both a mouse wheel and a trackpad flick.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      accumulated.current += event.deltaY;
      while (accumulated.current >= WHEEL_STEP_THRESHOLD) {
        accumulated.current -= WHEEL_STEP_THRESHOLD;
        step(1);
      }
      while (accumulated.current <= -WHEEL_STEP_THRESHOLD) {
        accumulated.current += WHEEL_STEP_THRESHOLD;
        step(-1);
      }
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [step]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      step(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const columns = Array.from(
        event.currentTarget
          .closest('[data-time-wheel]')
          ?.querySelectorAll<HTMLElement>('[data-wheel-column]') ?? [],
      );
      const index = columns.indexOf(event.currentTarget);
      if (index < 0) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      columns[(index + direction + columns.length) % columns.length]?.focus();
    }
  };

  return (
    <div
      ref={ref}
      data-wheel-column
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        // Columns hug their values like the master; min 2ch keeps a 12h hour
        // column from narrowing when every visible hour is one digit.
        'relative z-[1] flex min-w-[2ch] flex-col items-center gap-(--time-picker-items-gap)',
        'rounded-[var(--radius-sm)]',
        focusRing,
      )}
    >
      {WHEEL_OFFSETS.map((offset) => {
        const count = options.length;
        let value: T | undefined;
        if (count >= WHEEL_OFFSETS.length) {
          value = options[(((selectedIndex + offset) % count) + count) % count];
        } else {
          // Small lists (AM/PM, coarse steps): centre the selection and pad with
          // blanks rather than repeating values.
          const index = selectedIndex + offset;
          value = index >= 0 && index < count ? options[index] : undefined;
        }
        const distance = Math.abs(offset);
        if (value === undefined) {
          return <span key={offset} aria-hidden="true" className={spacerByDistance[distance]} />;
        }
        const isCentre = offset === 0;
        return (
          <button
            key={offset}
            type="button"
            role="option"
            aria-selected={isCentre}
            tabIndex={-1}
            disabled={disabled || (isDisabled?.(value) ?? false)}
            onClick={() => onSelect(value)}
            className={cn(
              'grid place-items-center bg-transparent tabular-nums outline-none',
              'disabled:cursor-not-allowed disabled:opacity-30',
              rowByDistance[distance],
              !isCentre && rowHover,
            )}
          >
            <span className={capTrim}>{render(value)}</span>
          </button>
        );
      })}
    </div>
  );
}

interface WheelModel {
  parts: TimeValueParts;
  format: TimeFormat;
  showSeconds: boolean;
  disabled: boolean;
  minuteOptions: number[];
  secondOptions: number[];
  selectUnit: (unit: number, view: UnitView) => void;
  setPeriod: (period: Period) => void;
  optionDisabled: (unit: number, view: UnitView) => boolean;
}

function Wheel({ model, className }: { model: WheelModel; className?: string }) {
  const { parts, format, showSeconds, disabled, minuteOptions, secondOptions } = model;
  const hour = format === '12h' ? parts.hour % 12 || 12 : parts.hour;
  const period: Period = parts.hour >= 12 ? 'PM' : 'AM';

  return (
    <div
      data-time-wheel
      className={cn('relative flex justify-center gap-(--time-picker-gap)', className)}
    >
      {/* Full-bleed selector bar behind the centre row (bleeds past Container
          Padding X); it sits below the ±2 (16) and ±1 (20) rows and two Items Gaps. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute z-0 h-(--size-24) bg-(--accent-subtle)',
          'left-[calc(-1*var(--time-picker-container-padding-x))] right-[calc(-1*var(--time-picker-container-padding-x))]',
          'top-[calc(var(--size-16)+var(--size-20)+2*var(--time-picker-items-gap))]',
        )}
      />
      <WheelColumn
        options={format === '12h' ? HOURS_12 : HOURS_24}
        selected={hour}
        ariaLabel="Hour"
        disabled={disabled}
        render={(value) => (format === '12h' ? value : pad(value))}
        onSelect={(value) => model.selectUnit(value, 'hours')}
        isDisabled={(value) => model.optionDisabled(value, 'hours')}
      />
      <WheelColumn
        options={minuteOptions}
        selected={parts.minute}
        ariaLabel="Minute"
        disabled={disabled}
        render={(value) => pad(value)}
        onSelect={(value) => model.selectUnit(value, 'minutes')}
        isDisabled={(value) => model.optionDisabled(value, 'minutes')}
      />
      {showSeconds ? (
        <WheelColumn
          options={secondOptions}
          selected={parts.second}
          ariaLabel="Second"
          disabled={disabled}
          render={(value) => pad(value)}
          onSelect={(value) => model.selectUnit(value, 'seconds')}
          isDisabled={(value) => model.optionDisabled(value, 'seconds')}
        />
      ) : null}
      {format === '12h' ? (
        <WheelColumn
          options={PERIODS}
          selected={period}
          ariaLabel="AM or PM"
          disabled={disabled}
          render={(value) => value}
          onSelect={model.setPeriod}
        />
      ) : null}
    </div>
  );
}

export function TimePicker({
  mode = 'popover',
  value: controlledValue,
  defaultValue,
  onValueChange,
  format = '12h',
  minuteStep = 1,
  secondStep = 1,
  showSeconds = false,
  minTime,
  maxTime,
  disabledTimes,
  disabled = false,
  label,
  helper,
  errorMessage,
  placeholder = 'Select time',
  clearable = true,
  className,
  'aria-label': ariaLabel,
}: TimePickerProps) {
  const [value, setValue] = useControllableState<TimeValue | null>(
    controlledValue,
    defaultValue,
    onValueChange,
    null,
  );
  const [open, setOpen] = useState(false);
  const triggerId = useId();

  // Display parts: the value, or "now" (snapped to the step grid) as a starting
  // point so the wheel always shows something. Nothing is emitted until a pick.
  const parts = parseTimeValue(value) ??
    parseTimeValue(nowValue(showSeconds, minuteStep, secondStep)) ?? {
      hour: 0,
      minute: 0,
      second: 0,
    };

  const candidateFor = useCallback(
    (nextParts: TimeValueParts, view: UnitView) =>
      getSelectableValue(
        nextParts,
        showSeconds,
        minuteStep,
        secondStep,
        minTime,
        maxTime,
        disabledTimes,
        view === 'hours',
        view !== 'seconds',
      ),
    [showSeconds, minuteStep, secondStep, minTime, maxTime, disabledTimes],
  );

  const partsForUnit = (unit: number, view: UnitView): TimeValueParts => {
    if (view === 'hours') {
      const periodOffset = parts.hour >= 12 ? 12 : 0;
      const hour = format === '12h' ? ((unit % 12) + periodOffset) % 24 : unit;
      return { ...parts, hour };
    }
    if (view === 'minutes') return { ...parts, minute: unit };
    return { ...parts, second: unit };
  };

  const model: WheelModel = {
    parts,
    format,
    showSeconds,
    disabled,
    minuteOptions: stepOptions(minuteStep),
    secondOptions: stepOptions(secondStep),
    selectUnit: (unit, view) => {
      const candidate = candidateFor(partsForUnit(unit, view), view);
      if (candidate) setValue(candidate);
    },
    setPeriod: (period) => {
      const hour =
        period === 'PM'
          ? parts.hour < 12
            ? parts.hour + 12
            : parts.hour
          : parts.hour >= 12
            ? parts.hour - 12
            : parts.hour;
      const candidate = candidateFor({ ...parts, hour }, 'hours');
      if (candidate) setValue(candidate);
    },
    optionDisabled: (unit, view) => !candidateFor(partsForUnit(unit, view), view),
  };

  if (mode === 'inline') {
    return (
      <div
        aria-label={ariaLabel}
        className={cn(
          'inline-block',
          surfaceStyles,
          disabled && 'opacity-[var(--opacity-disabled)]',
          className,
        )}
      >
        <Wheel model={model} />
      </div>
    );
  }

  const formatted = formatTimeValue(value, { format, showSeconds });
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
      <div className="relative w-[var(--size-240)] max-w-full">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger
            id={triggerId}
            disabled={disabled}
            aria-label={ariaLabel ?? label ?? 'Select time'}
            className={cn(
              'inline-flex w-full items-center gap-[var(--spacing-08)]',
              'rounded-[var(--radius-md)] px-[var(--spacing-12)] py-[var(--spacing-12)] text-sm',
              fieldSurface,
              isInvalid ? 'border-[var(--status-danger-border)]' : fieldHover,
              '[&_svg]:size-[var(--size-20)] [&_svg]:text-[var(--text-muted)]',
            )}
          >
            <ClockIcon />
            <span className={cn('flex-1 text-left', !formatted && 'text-[var(--text-muted)]')}>
              {formatted || placeholder}
            </span>
          </Popover.Trigger>
          {clearable && value && !disabled ? (
            <button
              type="button"
              aria-label="Clear time"
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
              <Popover.Popup
                className={cn(
                  surfaceStyles,
                  'shadow-[var(--effect-shadow-down-md)] text-[var(--text-primary)] outline-none',
                )}
              >
                <Wheel model={model} />
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

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
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
