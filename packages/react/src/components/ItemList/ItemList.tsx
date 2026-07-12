import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Bordered container that stacks List Item rows. Gap/radius/padding/min-width and
// the optional label-helper gap match -- Molecule/Item List/*.
const containerStyles = cn(
  'flex min-w-[var(--size-120)] flex-col gap-[var(--spacing-08)]',
  'rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
  'py-[var(--spacing-12)]',
);

export interface ItemListProps extends ComponentPropsWithoutRef<'div'> {
  label?: ReactNode;
  helper?: ReactNode;
  children?: ReactNode;
}

export function ItemList({ label, helper, children, className, ...rest }: ItemListProps) {
  return (
    <div className={cn(containerStyles, className)} {...rest}>
      {label || helper ? (
        <div className="flex flex-col gap-[var(--spacing-04)] px-[var(--spacing-12)]">
          {label ? (
            <span className="text-sm font-bold text-[var(--text-primary)]">{label}</span>
          ) : null}
          {helper ? <span className="text-xs text-[var(--text-muted)]">{helper}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
