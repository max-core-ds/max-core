'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { RailContext } from '../../utils/rail-context.js';
import { useControllableState } from '../../utils/use-controllable-state.js';

// Widths, gap, padding, radius match -- Organism/Side Bar/*. `overflow-hidden`
// on the shell keeps the collapsed rail from spilling sideways; the collapsed
// state is broadcast to slotted items (ListItem/EntityItem) via RailContext so
// they render icon-only.
const sideBarStyles = cva(
  [
    'flex h-full flex-col gap-[var(--spacing-48)] overflow-hidden',
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
  /**
   * Collapsed (icon-only) rail. Omit for an uncontrolled rail that manages its
   * own state (see `defaultCollapsed`); pass a boolean to drive it externally.
   */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. Defaults to `false`. */
  defaultCollapsed?: boolean;
  /** Fires whenever the collapsed state changes (toggle or controlled update). */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Slot 1 — logo + collapse toggle row. */
  topBar?: ReactNode;
  /** Slot 2 — workspace switcher / primary header. */
  header?: ReactNode;
  /** Slot 3 — secondary header row (e.g. a label or context switcher). */
  subHeader?: ReactNode;
  /** Slot 5 — footer (e.g. the user profile). */
  footer?: ReactNode;
  /** Slot 4 — free Body container (nav items). */
  children?: ReactNode;
}

export function SideBar({
  collapsed,
  defaultCollapsed,
  onCollapsedChange,
  topBar,
  header,
  subHeader,
  footer,
  children,
  className,
  ...rest
}: SideBarProps) {
  const [isCollapsed, setCollapsed] = useControllableState(
    collapsed ?? undefined,
    defaultCollapsed,
    onCollapsedChange,
    false,
  );
  const toggle = useCallback(() => setCollapsed(!isCollapsed), [isCollapsed, setCollapsed]);

  return (
    <RailContext.Provider value={{ collapsed: isCollapsed, toggle }}>
      <aside className={cn(sideBarStyles({ collapsed: isCollapsed }), className)} {...rest}>
        {topBar}
        {header}
        {subHeader}
        {/* min-h-0 lets the nav shrink below its content height so it scrolls
            instead of pushing the footer past the shell (vertical overflow). */}
        <nav className="styled-scrollbar flex min-h-0 flex-1 flex-col gap-[var(--spacing-24)] overflow-y-auto">
          {children}
        </nav>
        {footer}
      </aside>
    </RailContext.Provider>
  );
}
