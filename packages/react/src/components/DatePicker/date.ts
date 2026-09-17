// Boundary adapter for the Date Picker. The public value model is a canonical
// ISO date string ("YYYY-MM-DD"), mirroring the Time Picker's string values.
// react-day-picker works in JS `Date`, so this module converts at the edge and
// owns the small bits rdp doesn't (ISO parsing, matcher/format adapters, and the
// month/year selection grids rdp has no built-in mode for).

import type { Matcher, DateRange as RdpDateRange } from 'react-day-picker';

/** Canonical calendar date, "YYYY-MM-DD" (no time, no zone). */
export type DateValue = string;
/** Inclusive range as canonical strings; either end may be unset. */
export type DateRange = { start: DateValue | null; end: DateValue | null };
export type DateGranularity = 'day' | 'month' | 'year';
/** A single string, an inclusive {from,to} window, or a predicate — like TimeMatcher. */
export type DateMatcher =
  | DateValue
  | { from?: DateValue; to?: DateValue }
  | ((value: DateValue) => boolean);

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

type Parts = { year: number; month: number; day: number; date: Date };

// Parse to a Date at LOCAL NOON — never midnight — so a later toIso() reads back
// the same calendar day regardless of the viewer's timezone/DST.
function parseParts(value: DateValue | null | undefined): Parts | null {
  if (!value) return null;
  const match = value.match(ISO_RE);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  // Reject impossible dates (e.g. 2026-02-30 rolls over to March).
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return { year, month, day, date };
}

export function isValidDateValue(value: unknown): value is DateValue {
  return typeof value === 'string' && parseParts(value) !== null;
}

export function isoToDate(value: DateValue | null | undefined): Date | undefined {
  return parseParts(value)?.date ?? undefined;
}

export function dateToIso(date: Date): DateValue {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function compareDateValues(left: DateValue, right: DateValue): -1 | 0 | 1 {
  const leftParts = parseParts(left);
  const rightParts = parseParts(right);
  if (!leftParts || !rightParts) {
    throw new TypeError('compareDateValues requires valid "YYYY-MM-DD" strings');
  }
  const difference = leftParts.date.getTime() - rightParts.date.getTime();
  return difference === 0 ? 0 : difference < 0 ? -1 : 1;
}

export function todayValue(): DateValue {
  return dateToIso(new Date());
}

// ── range adapters (rdp DateRange uses Date; `from` is required when present) ──

export function rangeToRdp(range: DateRange | null | undefined): RdpDateRange | undefined {
  const from = isoToDate(range?.start);
  if (!from) return undefined;
  return { from, to: isoToDate(range?.end) };
}

export function rdpToRange(range: RdpDateRange | undefined): DateRange {
  return {
    start: range?.from ? dateToIso(range.from) : null,
    end: range?.to ? dateToIso(range.to) : null,
  };
}

// ── availability adapter: our ISO min/max + disabledDates → rdp `disabled` ──
// Partial {from,to} windows become predicates to sidestep rdp's exclusive
// DateBefore/DateAfter edge semantics.

function toRdpMatcher(matcher: DateMatcher): Matcher {
  if (typeof matcher === 'function') return (date: Date) => matcher(dateToIso(date));
  if (typeof matcher === 'string') {
    const date = isoToDate(matcher);
    return date ?? (() => false);
  }
  const { from, to } = matcher;
  if (!from && !to) return () => false;
  return (date: Date) => {
    const iso = dateToIso(date);
    if (from && compareDateValues(iso, from) < 0) return false;
    if (to && compareDateValues(iso, to) > 0) return false;
    return true;
  };
}

export function toRdpDisabled(
  minDate: DateValue | undefined,
  maxDate: DateValue | undefined,
  disabledDates: DateMatcher | DateMatcher[] | undefined,
): Matcher[] {
  const matchers: Matcher[] = [];
  const min = isoToDate(minDate);
  if (min) matchers.push({ before: min });
  const max = isoToDate(maxDate);
  if (max) matchers.push({ after: max });
  const list = disabledDates
    ? Array.isArray(disabledDates)
      ? disabledDates
      : [disabledDates]
    : [];
  for (const matcher of list) matchers.push(toRdpMatcher(matcher));
  return matchers;
}

// ── display formatting for the DateInput trigger ──

export function formatDateValue(
  value: DateValue | null | undefined,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
  locale?: string,
): string {
  const date = isoToDate(value);
  if (!date) return '';
  return new Intl.DateTimeFormat(locale, options).format(date);
}

// ── month/year selection grids (rdp is day-only) ──

export interface GridCell {
  /** Canonical value for the cell: first-of-month for months, first-of-year for years. */
  value: DateValue;
  label: string;
}

/** 12 months of `year`, short-labelled ("Jan"…"Dec"), each → its first day. */
export function buildMonthGrid(year: number, locale?: string): GridCell[] {
  const format = new Intl.DateTimeFormat(locale, { month: 'short' });
  return Array.from({ length: 12 }, (_, month) => ({
    value: `${year}-${pad2(month + 1)}-01`,
    label: format.format(new Date(year, month, 1)),
  }));
}

/** A 12-year page containing `year`, each → its first day. */
export function buildYearGrid(year: number): GridCell[] {
  const start = Math.floor(year / 12) * 12;
  return Array.from({ length: 12 }, (_, index) => {
    const cellYear = start + index;
    return { value: `${cellYear}-01-01`, label: String(cellYear) };
  });
}

/** Year of an ISO value, or the current year when unset — for grid paging. */
export function yearOf(value: DateValue | null | undefined): number {
  return parseParts(value)?.year ?? new Date().getFullYear();
}
