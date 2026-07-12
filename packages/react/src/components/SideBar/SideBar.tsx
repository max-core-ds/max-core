import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Widths, gap, padding, radius match -- Organism/Side Bar/*.
const sideBarStyles = cva(
  [
    'flex h-full flex-col gap-[var(--spacing-48)]',
    'rounded-[var(--radius-3xl)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
    'p-[var(--spacing-16)]',
  ],
  {
    variants: {
      collapsed: {
        true: 'w-[var(--size-64)] items-center',
        false: 'w-[var(--size-280)]',
      },
    },
    defaultVariants: { collapsed: false },
  },
);

export interface SideBarProps
  extends ComponentPropsWithoutRef<'aside'>,
    VariantProps<typeof sideBarStyles> {
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export function SideBar({ collapsed, header, footer, children, className, ...rest }: SideBarProps) {
  return (
    <aside className={cn(sideBarStyles({ collapsed }), className)} {...rest}>
      {header}
      <nav className="flex flex-1 flex-col gap-[var(--spacing-24)]">{children}</nav>
      {footer}
    </aside>
  );
}
