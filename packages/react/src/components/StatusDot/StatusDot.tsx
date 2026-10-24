import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Presence indicator matching .Status-avatar (Figma node 7201:12): a dot of
// -- Atoms/Status Dot/Size (8px) with a -- Atoms/Status Dot/Border Weight
// (border-weight.thin) stroke in border/muted, filled with a semantic status
// colour per Type. Offline is an empty bg/surface dot with a border/hover stroke.
// DND adds the master's bg/surface minus bar; its geometry (64% × 27%, centred)
// is proportional because the bar's constraints are SCALE. Percentages resolve
// against the padding box, so the stroke is added back to measure the whole dot.
const statusDotStyles = cva(
  'relative inline-block shrink-0 rounded-full border-solid border-[length:var(--border-weight-thin)] size-[var(--size-8)] border-[var(--border-muted)]',
  {
    variants: {
      status: {
        default: 'bg-[var(--status-success-default)]',
        busy: 'bg-[var(--status-danger-default)]',
        away: 'bg-[var(--status-warning-default)]',
        dnd: "bg-[var(--status-danger-border)] after:absolute after:top-1/2 after:left-1/2 after:h-[calc((100%+2*var(--border-weight-thin))*0.27)] after:w-[calc((100%+2*var(--border-weight-thin))*0.64)] after:-translate-1/2 after:bg-[var(--bg-surface)] after:content-['']",
        offline: 'border-[var(--border-hover)] bg-[var(--bg-surface)]',
      },
    },
    defaultVariants: { status: 'default' },
  },
);

export type StatusDotStatus = NonNullable<VariantProps<typeof statusDotStyles>['status']>;

export interface StatusDotProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof statusDotStyles> {
  /** Accessible label (e.g. "Online"). Omit when a sibling already conveys presence. */
  label?: string;
}

export function StatusDot({ status, label, className, ...rest }: StatusDotProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      className={cn(statusDotStyles({ status }), className)}
      {...rest}
    />
  );
}
