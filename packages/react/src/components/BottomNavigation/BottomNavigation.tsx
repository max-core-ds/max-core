'use client';

import { Menu } from '@base-ui/react/menu';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { type DropdownItem, DropdownMenu } from '../Dropdown/Dropdown.js';
import { StatusDot } from '../StatusDot/StatusDot.js';

// Bar Padding X/Y, Radius, Border Weight, Items Gap and the nav item's Padding X/Y,
// Gap, Radius, Icon Size and Dot Size are -- Organism/Bottom Navigation Bar/*.
// Background sits on the container (not per item) with a top border/default
// stroke and effect/shadow/up/sm. The Items Slot spreads the items
// (SPACE_BETWEEN, 10 min gap).
const barStyles = cn(
  'flex w-full items-center justify-between gap-(--bottom-navigation-bar-items-gap)',
  'rounded-(--bottom-navigation-bar-radius) border-0 border-t-(length:--bottom-navigation-bar-border-weight) border-solid border-[var(--border-default)] bg-[var(--bg-surface)]',
  // Figma's stroke sits inside: the top padding gives it back, so the bar stays 72.
  'px-(--bottom-navigation-bar-padding-x) pt-[calc(var(--bottom-navigation-bar-padding-y)-var(--bottom-navigation-bar-border-weight))] pb-(--bottom-navigation-bar-padding-y)',
  'shadow-[var(--effect-shadow-up-sm)]',
);

// _Nav Item: a fixed 56 tall pill. Default = text/secondary, Hover = bg/subtle,
// Pressed = overlay/pressed fill + accent/subtle content, Active (or its menu
// open) = accent/surface + text/accent (round-1 sweep; readable in dark), Disabled = opacity/disabled. Label is
// Caption/300 (cap-trimmed). The hover / pressed rules skip the active item, and hover skips
// pressed (variant order). Pressable → focusRing (the master has no focus state).
const itemStyles = cn(
  'relative flex h-[var(--size-56)] flex-col items-center justify-center gap-(--bottom-navigation-bar-nav-item-gap)',
  'rounded-(--bottom-navigation-bar-nav-item-radius) px-(--bottom-navigation-bar-nav-item-padding-x) py-(--bottom-navigation-bar-nav-item-padding-y) transition-colors',
  '[&_svg]:size-(--bottom-navigation-bar-icon-size) text-[var(--text-secondary)]',
  'not-data-[active]:not-data-[popup-open]:not-active:hover:bg-[var(--bg-subtle)]',
  'not-data-[active]:not-data-[popup-open]:active:bg-[var(--overlay-pressed)]',
  'not-data-[active]:not-data-[popup-open]:active:text-[var(--accent-subtle)]',
  'data-[active]:bg-[var(--accent-surface)] data-[active]:text-[var(--text-accent)]',
  'data-[popup-open]:bg-[var(--accent-surface)] data-[popup-open]:text-[var(--text-accent)]',
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  focusRing,
);

const labelStyles = 'type-caption-300';

export interface BottomNavItem {
  value: string;
  label: ReactNode;
  icon: ReactNode;
  /** Visually hide the label (e.g. the profile Avatar item); it stays the accessible name. */
  hideLabel?: boolean;
  /** Notification dot (the master's Dot: a 12px busy Status Dot on the item's corner). */
  dot?: boolean;
  /**
   * What the dot means, read after the label by screen readers ("Inbox, New activity").
   * Defaults to "New activity"; the dot itself is decorative.
   */
  dotLabel?: string;
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
            {item.dot ? <span className="sr-only">, {item.dotLabel ?? 'New activity'}</span> : null}
            {item.dot ? (
              // The master pins the dot 2px from the top, 3px from the right (unbound).
              <StatusDot
                status="busy"
                className="absolute top-[2px] right-[3px] size-(--bottom-navigation-bar-dot-size)"
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
