import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { InfoIcon, chartTheme } from './StatsCard.js';

// The Stats card internals: _Metric Standard (+ _Metric Headline),
// _Comparison Metric and _Chart Legend. Labels are Caption/700 text/secondary;
// the optional info icon (16, text/primary) is a focusable Tooltip trigger.

const captionBold = 'type-caption-700 text-[var(--text-secondary)]';

function LabelRow({ label, info }: { label: ReactNode; info?: ReactNode }) {
  return (
    <div className="flex items-center gap-[var(--spacing-04)]">
      <span className={captionBold}>{label}</span>
      {info ? (
        <Tooltip content={info}>
          <button
            type="button"
            aria-label="More info"
            className={cn(
              'inline-flex rounded-[var(--radius-full)] text-[var(--text-primary)]',
              focusRing,
            )}
          >
            <InfoIcon className="size-[var(--size-16)]" />
          </button>
        </Tooltip>
      ) : null}
    </div>
  );
}

export interface StatsMetricProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  label: ReactNode;
  /** Tooltip content for the info icon (the master's Show Info). */
  info?: ReactNode;
  /** Headline icon (28, text/primary). */
  icon?: ReactNode;
  /** Headline value (Heading/H5). */
  value?: ReactNode;
  /** Replaces the headline, e.g. an Avatar Group or Entity Item (_Metric Avatars / User). */
  children?: ReactNode;
}

/** _Metric Standard: label row over a headline (icon + H5 value), 4 apart. */
export function StatsMetric({
  label,
  info,
  icon,
  value,
  children,
  className,
  ...rest
}: StatsMetricProps) {
  return (
    <div className={cn('flex flex-col gap-[var(--spacing-04)]', className)} {...rest}>
      <LabelRow label={label} info={info} />
      {children ??
        (value != null ? (
          <div className="flex items-center gap-[var(--spacing-08)]">
            {icon ? (
              <span className="flex text-[var(--text-primary)] [&_svg]:size-[var(--size-28)]">
                {icon}
              </span>
            ) : null}
            <span className="type-h5 text-[var(--text-primary)]">{value}</span>
          </div>
        ) : null)}
    </div>
  );
}

export interface StatsComparisonProps extends ComponentPropsWithoutRef<'div'> {
  label: ReactNode;
  info?: ReactNode;
  /** Value (Heading/H6). */
  value: ReactNode;
  /** Change, e.g. "21.3%" (Body/MD/300, with an arrow). */
  delta?: ReactNode;
  /** Arrow + colour: up = status/success (the master), down = status/danger. */
  trend?: 'up' | 'down';
}

/** _Comparison Metric: label row over value + delta. Lay several out 32 apart (_Comparison Group). */
export function StatsComparison({
  label,
  info,
  value,
  delta,
  trend = 'up',
  className,
  ...rest
}: StatsComparisonProps) {
  return (
    <div className={cn('flex flex-col gap-[var(--spacing-04)]', className)} {...rest}>
      <LabelRow label={label} info={info} />
      <div className="flex items-center gap-[var(--spacing-06)]">
        <span className="type-h6 text-[var(--text-primary)]">{value}</span>
        {delta != null ? (
          <span
            className={cn(
              'flex items-center gap-[var(--spacing-02)] type-body-md-300',
              trend === 'up'
                ? 'text-[var(--status-success-default)]'
                : 'text-[var(--status-danger-default)]',
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
              className="size-[var(--size-16)]"
            >
              {/* lucide arrow-up / arrow-down */}
              {trend === 'up' ? (
                <>
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </>
              ) : (
                <>
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </>
              )}
            </svg>
            <span className="sr-only">{trend === 'up' ? 'Up' : 'Down'}</span>
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export interface ChartLegendItem {
  label: ReactNode;
  /** Dot colour; defaults to the series colour at this index (`chartTheme.series`). */
  color?: string;
}

export interface ChartLegendProps extends ComponentPropsWithoutRef<'ul'> {
  items: ChartLegendItem[];
}

/** _Chart Legend: wrapping row of 8px dots + Caption/XS labels, 12 apart (6 inside an item). */
export function ChartLegend({ items, className, ...rest }: ChartLegendProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-[var(--spacing-12)]', className)} {...rest}>
      {items.map((item, i) => (
        <li
          // biome-ignore lint/suspicious/noArrayIndexKey: legend order is the series order
          key={i}
          className="flex items-center gap-[var(--spacing-06)] type-caption-xs text-[var(--text-secondary)]"
        >
          <span
            aria-hidden="true"
            className="size-[var(--size-8)] shrink-0 rounded-[var(--radius-full)]"
            style={{ background: item.color ?? chartTheme.series[i % chartTheme.series.length] }}
          />
          <span className={capTrim}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
