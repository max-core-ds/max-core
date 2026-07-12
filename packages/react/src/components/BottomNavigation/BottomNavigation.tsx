'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Bar + nav-item padding/radius/icon/gap match -- Organism/Bottom Navigation Bar/*.
// Background sits on the container (not per item); elevation uses shadow up.
const barStyles = cn(
  'flex w-full items-center justify-around gap-[var(--spacing-04)]',
  'rounded-[var(--radius-none)] border-t border-[var(--border-default)] bg-[var(--bg-surface)]',
  'px-[var(--spacing-08)] py-[var(--spacing-08)] shadow-[var(--effect-shadow-up-md)]',
);

const itemStyles = cn(
  'flex flex-col items-center gap-[var(--spacing-04)] rounded-[var(--radius-l)]',
  'px-[var(--spacing-10)] py-[var(--spacing-04)] text-xs transition-colors',
  '[&_svg]:size-[var(--size-24)] text-[var(--text-secondary)]',
  'hover:text-[var(--text-primary)] data-[active]:text-[var(--accent-default)]',
  focusRing,
);

export interface BottomNavItem {
  value: string;
  label: ReactNode;
  icon: ReactNode;
}

export interface BottomNavigationProps extends ComponentPropsWithoutRef<'nav'> {
  items: BottomNavItem[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export function BottomNavigation({
  items,
  value,
  onValueChange,
  className,
  ...rest
}: BottomNavigationProps) {
  return (
    <nav className={cn(barStyles, className)} {...rest}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          data-active={item.value === value || undefined}
          aria-current={item.value === value ? 'page' : undefined}
          className={itemStyles}
          onClick={() => onValueChange?.(item.value)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
