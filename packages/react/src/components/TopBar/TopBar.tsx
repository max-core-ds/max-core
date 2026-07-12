import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Padding/item gap/radius match -- Organism/Top Bar/*. Desktop uses radius xl;
// Mobile is a pill (radius full) with 24px icon buttons.
const topBarStyles = cva(
  [
    'flex w-full items-center gap-[var(--spacing-24)]',
    'border-b border-[var(--border-default)] bg-[var(--bg-surface)]',
    'px-[var(--spacing-24)] py-[var(--spacing-12)]',
  ],
  {
    variants: {
      variant: {
        desktop: 'rounded-[var(--radius-xl)]',
        mobile: 'rounded-[var(--radius-full)] [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { variant: 'desktop' },
  },
);

export interface TopBarProps
  extends ComponentPropsWithoutRef<'header'>,
    VariantProps<typeof topBarStyles> {
  leading?: ReactNode;
  center?: ReactNode;
  trailing?: ReactNode;
}

export function TopBar({ variant, leading, center, trailing, className, ...rest }: TopBarProps) {
  return (
    <header className={cn(topBarStyles({ variant }), className)} {...rest}>
      <div className="flex items-center gap-[var(--spacing-24)]">{leading}</div>
      <div className="flex flex-1 items-center justify-center">{center}</div>
      <div className="flex items-center gap-[var(--spacing-24)]">{trailing}</div>
    </header>
  );
}
