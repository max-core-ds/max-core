'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// The interactive row primitive for Item List / Dropdown / Stacked List menus.
// Padding/gap/icon size/radius match -- Atoms/List Item/*. Interactive states
// follow the Figma showcase: Hover=accent/subtle, Pressed=accent/active,
// Active (selected)=accent/default — all with text/on-accent. Collapsed hides
// the label + trailing indicator for icon-only rails.
const base = cn(
  'relative flex w-full items-center gap-[var(--spacing-08)] rounded-[var(--radius-l)]',
  'px-[var(--spacing-12)] py-[var(--spacing-12)] text-left font-bold text-[var(--text-primary)]',
  '[&_svg]:size-[var(--size-20)] transition-colors',
  focusRing,
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
);

// Hover + pressed feedback (pseudo-states). Applied unless the row is selected,
// which owns the fill via `activeStyles`.
const interactive = cn(
  'hover:bg-[var(--accent-subtle)] hover:text-[var(--text-on-accent)]',
  'active:bg-[var(--accent-active)] active:text-[var(--text-on-accent)]',
);

// Selected/current row — persistent accent/default fill.
const activeStyles = 'bg-[var(--accent-default)] text-[var(--text-on-accent)]';

export interface ListItemProps extends ComponentPropsWithoutRef<'button'> {
  leftIcon?: ReactNode;
  /** Trailing indicator (e.g. a chevron). Hidden when `collapsed`. */
  rightIcon?: ReactNode;
  /** Selected/current row — renders the persistent accent fill. */
  active?: boolean;
  /** Icon-only rail mode: hides the label + trailing indicator. */
  collapsed?: boolean;
  children?: ReactNode;
}

export function ListItem({
  leftIcon,
  rightIcon,
  active = false,
  collapsed = false,
  children,
  className,
  ...rest
}: ListItemProps) {
  return (
    <button
      type="button"
      aria-current={active || undefined}
      className={cn(
        base,
        collapsed && 'justify-center',
        active ? activeStyles : interactive,
        className,
      )}
      {...rest}
    >
      {leftIcon}
      {!collapsed && <span className="flex-1">{children}</span>}
      {!collapsed && rightIcon}
    </button>
  );
}
