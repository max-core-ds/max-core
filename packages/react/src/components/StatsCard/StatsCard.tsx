import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Stats card — the Figma "Stats card big / small / compact" masters as layout
// components. The DS draws no charts (decision 2026-10-25): the `chart` slot takes
// any rendering (a third-party chart themed with `chartTheme`, an image, a
// sparkline) and the card sizes it. Tokens: -- Organism/Stats card/*.
//
// Shell (every family): bg/surface, 1px border/muted stroke (Border Weight thin),
// radius md, effect/shadow/down/sm. Big + Small: Padding 16, Item Spacing 16, and
// the master's fixed heights (480 / 350, unbound) with the chart filling what is
// left. Compact: Padding 12, Item Spacing 12, hugging its content.

/**
 * Chart colours and strokes from the Figma Chart master, as CSS values any SVG
 * chart library can take directly (they follow light / dark mode). Series run
 * accent → success → warning → danger → info, as the legend dots.
 */
export const chartTheme = {
  series: [
    'var(--accent-default)',
    'var(--status-success-default)',
    'var(--status-warning-default)',
    'var(--status-danger-default)',
    'var(--status-info-default)',
  ],
  /** Grid lines (border/muted at Chart/Grid Stroke). */
  grid: 'var(--border-muted)',
  gridWidth: 'var(--stats-card-chart-grid-stroke)',
  /** Axis labels (text/muted, Caption/300). */
  axis: 'var(--text-muted)',
  /** Gap between the plot and its axis labels (Chart/Axis Gap). */
  axisGap: 'var(--stats-card-chart-axis-gap)',
  /** Line / spark-line stroke (Chart/Line Stroke). */
  lineWidth: 'var(--stats-card-chart-line-stroke)',
} as const;

// Shell: Global Radius + Border Weight (border/muted), bg/surface, shadow/down/sm;
// Global Padding + Item Spacing (big / small) or Compact Padding + Item Spacing.
// Figma strokes sit inside, so the padding gives the stroke back.
// -- Organism/Stats card/*.
const cardStyles = cva(
  [
    'flex flex-col rounded-(--stats-card-global-radius) bg-[var(--bg-surface)] text-[var(--text-primary)]',
    'border-solid border-(length:--stats-card-global-border-weight) border-[var(--border-muted)] shadow-[var(--effect-shadow-down-sm)]',
  ],
  {
    variants: {
      variant: {
        big: 'h-[480px] gap-(--stats-card-global-item-spacing) p-[calc(var(--stats-card-global-padding)-var(--stats-card-global-border-weight))]',
        small:
          'h-[350px] gap-(--stats-card-global-item-spacing) p-[calc(var(--stats-card-global-padding)-var(--stats-card-global-border-weight))]',
        compact:
          'gap-(--stats-card-compact-item-spacing) p-[calc(var(--stats-card-compact-padding)-var(--stats-card-global-border-weight))]',
      },
    },
    defaultVariants: { variant: 'small' },
  },
);

const rule = 'h-(--stats-card-global-border-weight) w-full shrink-0 bg-[var(--border-muted)]';

export interface StatsCardProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>,
    VariantProps<typeof cardStyles> {
  /** Big only: the Desktop layout, or Mobile (icon actions, filter + tabs stacked). */
  size?: 'desktop' | 'mobile';
  /** Compact only: Vertical (heading over chart) or Horizontal (heading beside chart). */
  orientation?: 'vertical' | 'horizontal';
  /** Small / Compact top row: leading icon (24, text/primary). */
  icon?: ReactNode;
  /** Small / Compact top row: trailing menu trigger. */
  menu?: ReactNode;
  /** The metric — usually a `StatsMetric`. */
  heading?: ReactNode;
  /** Big: actions beside the heading (an Action Bar; Icon Only Buttons on Mobile). */
  actions?: ReactNode;
  /** Big: second header row, left (Tabs). */
  tabs?: ReactNode;
  /** Big: second header row, right (a Dropdown filter). */
  filter?: ReactNode;
  /** Series legend — usually a `ChartLegend`. */
  legend?: ReactNode;
  /** The chart. The card sizes it; render anything that fills its box. */
  chart?: ReactNode;
  /** Big footer: status text after an info icon (e.g. "Updated 5 min ago"). */
  info?: ReactNode;
  /** Small: the Action Bar footer. Big: the footer action (a Link Button). */
  footer?: ReactNode;
}

export function StatsCard({
  variant = 'small',
  size = 'desktop',
  orientation = 'vertical',
  icon,
  menu,
  heading,
  actions,
  tabs,
  filter,
  legend,
  chart,
  info,
  footer,
  className,
  ...rest
}: StatsCardProps) {
  const top =
    icon || menu ? (
      <div
        className={cn(
          'flex items-center justify-between [&_svg]:size-[var(--size-24)]',
          variant === 'compact' ? 'gap-[var(--spacing-08)]' : 'gap-[var(--spacing-12)]',
        )}
      >
        {icon ? <span className="flex text-[var(--text-primary)]">{icon}</span> : <span />}
        {menu}
      </div>
    ) : null;
  const chartBox = (extra?: string) =>
    chart ? <div className={cn('flex min-h-0 min-w-0 flex-col', extra)}>{chart}</div> : null;

  let body: ReactNode;
  if (variant === 'compact') {
    body =
      orientation === 'horizontal' ? (
        <>
          {top}
          <div className="flex items-center gap-[var(--spacing-12)]">
            {heading}
            {chartBox('h-[80px] flex-1')}
          </div>
          {legend}
        </>
      ) : (
        <>
          {top}
          {heading}
          {legend}
          {chartBox('h-[60px]')}
        </>
      );
  } else if (variant === 'small') {
    body = (
      <>
        {top}
        {heading}
        {legend || chart ? (
          <div className="flex min-h-0 flex-1 flex-col gap-[var(--spacing-24)]">
            {legend}
            {chartBox('flex-1')}
          </div>
        ) : null}
        {footer}
      </>
    );
  } else {
    const mobile = size === 'mobile';
    const level2 = tabs || filter;
    body = (
      <>
        <div className="flex flex-col gap-(--stats-card-global-header-item-spacing)">
          <div className="flex items-center gap-(--stats-card-global-header-item-spacing)">
            <div className="min-w-0 flex-1">{heading}</div>
            {actions ? (
              <div
                className={cn(
                  'flex justify-end',
                  mobile ? 'gap-[var(--spacing-04)]' : 'min-w-0 flex-1',
                )}
              >
                {actions}
              </div>
            ) : null}
          </div>
          {level2 ? (
            <>
              <div className={rule} />
              {mobile ? (
                <div className="flex flex-col gap-(--stats-card-global-header-item-spacing)">
                  {filter}
                  {tabs}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-(--stats-card-global-header-item-spacing)">
                  {tabs}
                  {filter}
                </div>
              )}
            </>
          ) : null}
        </div>
        {legend ? (
          <div className="pb-(--stats-card-global-legend-bottom-padding)">{legend}</div>
        ) : null}
        {chartBox('flex-1')}
        {info || footer ? (
          <>
            <div className={rule} />
            <div className="flex items-center justify-between gap-[var(--spacing-08)]">
              {info ? (
                <span
                  className={cn(
                    'flex items-center gap-(--stats-card-global-info-group-gap) text-[var(--text-secondary)]',
                  )}
                >
                  <InfoIcon className="size-[var(--size-24)] shrink-0 text-[var(--text-primary)]" />
                  <span className="type-caption-xs">{info}</span>
                </span>
              ) : (
                <span />
              )}
              {footer}
            </div>
          </>
        ) : null}
      </>
    );
  }

  return (
    <div className={cn(cardStyles({ variant }), className)} {...rest}>
      {body}
    </div>
  );
}

// lucide `info`, as the master's li:info.
export function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
