'use client';

import { Menu } from '@base-ui/react/menu';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { type DropdownItem, DropdownMenu } from '../Dropdown/Dropdown.js';
import { StatusDot } from '../StatusDot/StatusDot.js';

// Bar + nav-item padding/radius/icon/gap match -- Organism/Bottom Navigation Bar/*.
// Background sits on the container (not per item) with a top border/default
// stroke and effect/shadow/up/sm. The Items Slot spreads the items
// (SPACE_BETWEEN, 10 min gap).
const barStyles = cn(
  'flex w-full items-center justify-between gap-[var(--spacing-10)]',
  'rounded-[var(--radius-none)] border-t border-[var(--border-default)] bg-[var(--bg-surface)]',
  'px-[var(--spacing-08)] py-[var(--spacing-08)] shadow-[var(--effect-shadow-up-sm)]',
);

// _Nav Item: a fixed 56 tall pill. Default = text/secondary, Hover = bg/subtle,
// Pressed = overlay/pressed fill + accent/subtle content, Active (or its menu
// open) = accent/surface + accent/default, Disabled = opacity/disabled. Label is
// Caption/300. The hover / pressed rules skip the active item, and hover skips
// pressed (variant order). Pressable → focusRing (the master has no focus state).
const itemStyles = cn(
  'relative flex h-[var(--size-56)] flex-col items-center justify-center gap-[var(--spacing-04)]',
  'rounded-[var(--radius-l)] px-[var(--spacing-10)] py-[var(--spacing-04)] transition-colors',
  '[&_svg]:size-[var(--size-24)] text-[var(--text-secondary)]',
  'not-data-[active]:not-data-[popup-open]:not-active:hover:bg-[var(--bg-subtle)]',
  'not-data-[active]:not-data-[popup-open]:active:bg-[var(--overlay-pressed)]',
  'not-data-[active]:not-data-[popup-open]:active:text-[var(--accent-subtle)]',
  'data-[active]:bg-[var(--accent-surface)] data-[active]:text-[var(--accent-default)]',
  'data-[popup-open]:bg-[var(--accent-surface)] data-[popup-open]:text-[var(--accent-default)]',
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  focusRing,
);

const labelStyles = 'text-xs font-light leading-[1.3] tracking-[0.005em]';

export interface BottomNavItem {
  value: string;
  label: ReactNode;
  icon: ReactNode;
  /** Visually hide the label (e.g. the profile Avatar item); it stays the accessible name. */
  hideLabel?: boolean;
  /** Notification dot (the master's Dot: a 12px busy Status Dot on the item's corner). */
  dot?: boolean;
  disabled?: boolean;
  /**
   * Type=More: the item opens this menu (an Item List above the bar) instead of
   * selecting a value. It shows the Active look while open.
   */
  menu?: DropdownItem[];
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
      {items.map((item) => {
        const active = item.value === value;
        const content = (
          <>
            {item.icon}
            <span className={item.hideLabel ? 'sr-only' : labelStyles}>{item.label}</span>
            {item.dot ? (
              // The master pins the dot 2px from the top, 3px from the right (unbound).
              <StatusDot
                status="busy"
                className="absolute top-[2px] right-[3px] size-[var(--size-12)]"
              />
            ) : null}
          </>
        );
        if (item.menu) {
          return (
            <Menu.Root key={item.value}>
              <Menu.Trigger
                disabled={item.disabled}
                data-active={active || undefined}
                className={itemStyles}
              >
                {content}
              </Menu.Trigger>
              {/* The master's list sits 8 above the bar (16 above the item), end-aligned, with shadow up/md. */}
              <DropdownMenu
                items={item.menu}
                side="top"
                sideOffset={16}
                align="end"
                className="shadow-[var(--effect-shadow-up-md)]"
              />
            </Menu.Root>
          );
        }
        return (
          <button
            key={item.value}
            type="button"
            data-active={active || undefined}
            aria-current={active ? 'page' : undefined}
            disabled={item.disabled}
            className={itemStyles}
            onClick={() => onValueChange?.(item.value)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
