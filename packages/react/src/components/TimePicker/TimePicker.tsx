import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Row styling keyed by distance from the centered (selected) row, matching the
// Figma master (-- Atoms/Time Picker, node 2166:40): center = accent/default
// Body/MD/700; ±1 = text/secondary Body/SM/300 @ 60% (opacity/dim); ±2 =
// text/secondary Caption/300 @ 40% (opacity/disabled).
const rowByDistance = [
  'text-base font-bold text-[var(--accent-default)]',
  'text-sm font-light text-[var(--text-secondary)] opacity-[var(--opacity-dim)]',
  'text-xs font-light text-[var(--text-secondary)] opacity-[var(--opacity-disabled)]',
];

// ±2 window around `value`, wrapping within [0, count).
function windowAround(value: number, count: number): number[] {
  return [-2, -1, 0, 1, 2].map((d) => (((value + d) % count) + count) % count);
}

export interface TimePickerProps extends ComponentPropsWithoutRef<'div'> {
  /** Selected hour, 1–12. */
  hour?: number;
  /** Selected minute, 0–59. */
  minute?: number;
  /** Selected period. */
  period?: 'AM' | 'PM';
}

/**
 * Scroll-wheel style time display with Hour, Minute and AM/PM columns. Presentational
 * (matches the standalone Figma component — no scroll interaction): renders a ±2 window
 * around each selected value with the centered row highlighted by an accent bar.
 */
export function TimePicker({
  hour = 4,
  minute = 10,
  period = 'PM',
  className,
  ...rest
}: TimePickerProps) {
  const hours = windowAround((((hour - 1) % 12) + 12) % 12, 12).map((h) => String(h + 1));
  const minutes = windowAround(minute, 60).map((m) => m.toString().padStart(2, '0'));
  // Period has only two values, positioned so the selected one lands on the center row.
  const periods = period === 'PM' ? [null, 'AM', 'PM', null, null] : [null, null, 'AM', 'PM', null];

  const rows = [0, 1, 2, 3, 4].map((i) => [hours[i], minutes[i], periods[i]]);

  return (
    <div
      role="img"
      aria-label={`${hour}:${minute.toString().padStart(2, '0')} ${period}`}
      className={cn(
        'relative inline-grid grid-cols-3 items-center justify-items-center overflow-hidden',
        'gap-x-[var(--spacing-16)] gap-y-[var(--spacing-16)]',
        'rounded-[var(--radius-l)] bg-[var(--bg-surface)] px-[var(--spacing-24)] py-[var(--spacing-16)]',
        className,
      )}
      {...rest}
    >
      {/* Center highlight bar (accent/subtle), full-bleed across the middle row. */}
      <div
        aria-hidden
        className="pointer-events-none col-span-3 col-start-1 row-start-3 -mx-[var(--spacing-24)] self-stretch bg-[var(--accent-subtle)]"
      />
      {rows.flatMap((cells, i) =>
        cells.map((cell, col) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed 5×3 positional grid
            key={`${i}-${col}`}
            aria-hidden
            className={cn('tabular-nums', rowByDistance[Math.abs(i - 2)])}
          >
            {cell}
          </span>
        )),
      )}
    </div>
  );
}
