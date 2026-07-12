import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Padding/spacing/radius match -- Organism/Stats card/*. Big uses the Global
// padding/spacing; Compact uses the tighter Compact values.
const cardStyles = cva(
  [
    'flex flex-col rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
  ],
  {
    variants: {
      variant: {
        big: 'p-[var(--spacing-16)] gap-[var(--spacing-16)]',
        compact: 'p-[var(--spacing-12)] gap-[var(--spacing-12)]',
      },
    },
    defaultVariants: { variant: 'big' },
  },
);

export interface StatsCardProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>,
    VariantProps<typeof cardStyles> {
  title: ReactNode;
  value: ReactNode;
  /** A trend badge/indicator shown in the header. */
  delta?: ReactNode;
  /** Optional chart/visual area rendered below the value. */
  chart?: ReactNode;
}

export function StatsCard({
  variant,
  title,
  value,
  delta,
  chart,
  className,
  ...rest
}: StatsCardProps) {
  return (
    <div className={cn(cardStyles({ variant }), className)} {...rest}>
      <div className="flex items-center justify-between gap-[var(--spacing-12)]">
        <span className="text-sm text-[var(--text-secondary)]">{title}</span>
        {delta}
      </div>
      <div className="flex flex-col gap-[var(--spacing-06)]">
        <span className="text-3xl font-black text-[var(--text-primary)]">{value}</span>
      </div>
      {chart ? <div className="pb-[var(--spacing-08)]">{chart}</div> : null}
    </div>
  );
}
