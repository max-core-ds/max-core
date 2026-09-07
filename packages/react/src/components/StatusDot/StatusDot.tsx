import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Presence indicator matching .Status-avatar (Figma node 7201:12): an 8px dot
// (border-weight.thin border in border/muted) whose fill maps to a semantic
// status color per Type. Offline is an empty bg/surface dot. Composed inside
// Avatar to show availability; sizing within an avatar comes from Avatar tokens.
const statusDotStyles = cva(
  'inline-block shrink-0 rounded-full border size-[var(--size-8)] border-[var(--border-muted)]',
  {
    variants: {
      status: {
        default: 'bg-[var(--status-success-default)]',
        busy: 'bg-[var(--status-danger-default)]',
        away: 'bg-[var(--status-warning-default)]',
        dnd: 'bg-[var(--status-danger-border)]',
        offline: 'bg-[var(--bg-surface)]',
      },
    },
    defaultVariants: { status: 'default' },
  },
);

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
