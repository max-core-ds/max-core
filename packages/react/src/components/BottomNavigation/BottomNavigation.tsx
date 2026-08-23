'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Bar + nav-item padding/radius/icon/gap match -- Organism/Bottom Navigation Bar/*.
// Background sits on the container (not per item); elevation uses shadow up.
const barStyles = cn(
  'flex w-full items-center justify-around gap-[var(--spacing-04)]',
  'rounded-[var(--radius-none)] border-t border-[var(--border-default)] bg-[var(--bg-surface)]',
  'px-[var(--spacing-08)] py-[var(--spacing-08)] shadow-[var(--effect-shadow-up-md)]',
);

// _Nav Item states (mobile-only — no focus ring): Hover=bg/subtle,
// Pressed=accent/subtle, Active=accent/surface fill + accent/default text with
// slightly wider padding for emphasis, Disabled dimmed to opacity/disabled.
const itemStyles = cn(
  'relative flex flex-col items-center gap-[var(--spacing-04)] rounded-[var(--radius-l)]',
  'px-[var(--spacing-10)] py-[var(--spacing-04)] text-xs transition-colors',
  '[&_svg]:size-[var(--size-24)] text-[var(--text-secondary)]',
  'hover:bg-[var(--bg-subtle)] active:bg-[var(--accent-subtle)]',
  'data-[active]:bg-[var(--accent-surface)] data-[active]:text-[var(--accent-default)]',
  'data-[active]:px-[var(--spacing-12)]',
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
);

export interface BottomNavItem {
  value: string;
  label: ReactNode;
  icon: ReactNode;
  /** Notification dot indicator on the icon. */
  dot?: boolean;
  disabled?: boolean;
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
          disabled={item.disabled}
          className={itemStyles}
          onClick={() => onValueChange?.(item.value)}
        >
          <span className="relative">
            {item.icon}
            {item.dot ? (
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-[var(--radius-full)] bg-[var(--status-danger-default)]" />
            ) : null}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
