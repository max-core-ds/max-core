'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { RailContext, useRail, useRailCollapsed } from '../../utils/rail-context.js';

// Interactive card wrapping Entity Item content (a workspace/user switcher
// trigger). Padding/gap/radius match -- Molecule/Entity Card/*; the interaction
// states (hover/pressed/active/focus) are expressed in CSS. Radius is none (square).
// Interaction states are accent-based per the Figma master: Hover = overlay/hover,
// Pressed = overlay/pressed, Active = accent/subtle. Hover and active are pale
// washes in light mode, so text stays text/primary (which flips per mode) for
// contrast; only pressed carries a dedicated on-accent-muted (itself mode-aware).
// A nested User Entity Item's title is Body/SM/700 in the card and inherits the
// card's state colour; the subtitle and the accent chevron follow it on hover /
// pressed (text/secondary and accent/default on the overlay washes are below AA).
const cardStyles = cn(
  'flex w-full items-center justify-between gap-[var(--spacing-08)] text-left text-[var(--text-primary)]',
  'rounded-[var(--radius-none)] px-[var(--spacing-12)] py-[var(--spacing-12)] transition-colors',
  '[&_[data-entity-title=user]]:text-sm [&_[data-entity-title]]:[color:inherit]',
  'hover:bg-[var(--overlay-hover)]',
  'active:bg-[var(--overlay-pressed)] active:text-[var(--text-on-accent-muted)]',
  'hover:[&_[data-entity-subtitle]]:[color:inherit] active:[&_[data-entity-subtitle]]:[color:inherit]',
  'hover:[&_[data-entity-chevron]]:[color:inherit] active:[&_[data-entity-chevron]]:[color:inherit]',
  focusRing,
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
);

export interface EntityCardProps extends ComponentPropsWithoutRef<'button'> {
  /** Selected/active state (persistent highlight). */
  active?: boolean;
  /** Figma Right Icon: the trailing dropdown chevron (default true). */
  chevron?: boolean;
  /**
   * Figma Collapse: avatar-only square for a minimal rail; hides the labels and
   * the chevron. Defaults to the surrounding rail (e.g. a collapsed SideBar).
   */
  collapsed?: boolean;
  children?: ReactNode;
}

export function EntityCard({
  active,
  chevron = true,
  collapsed,
  children,
  className,
  ...rest
}: EntityCardProps) {
  const rail = useRail();
  const isCollapsed = useRailCollapsed(collapsed);
  return (
    <button
      type="button"
      data-active={active || undefined}
      className={cn(
        cardStyles,
        active && 'bg-[var(--accent-subtle)]',
        isCollapsed && 'w-auto justify-center',
        className,
      )}
      {...rest}
    >
      {/* Hand the resolved state to the nested Entity Item. */}
      <RailContext.Provider value={{ collapsed: isCollapsed, toggle: rail.toggle }}>
        {children}
      </RailContext.Provider>
      {chevron && !isCollapsed && <ChevronDown />}
    </button>
  );
}

// The master's Icon Only Button (Ghost, S): a 32px box with a 20px accent chevron.
// Decorative here — a button can't nest a button, and the whole card is the trigger.
function ChevronDown() {
  return (
    <span
      aria-hidden="true"
      data-entity-chevron=""
      className="inline-flex size-[var(--size-32)] shrink-0 items-center justify-center text-[var(--accent-default)]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="size-[var(--size-20)]"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
