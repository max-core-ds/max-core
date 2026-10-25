'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { RailContext } from '../../utils/rail-context.js';
import { useControllableState } from '../../utils/use-controllable-state.js';

// Widths, gap, padding, radius match -- Organism/Side Bar/*. The shell is the
// master's glass: bg/brand @ 20% (no blur, unlike the Top Bar) with a 1px OUTSIDE
// stroke, a border/accent → border/focus gradient at 40%. On the long edges the
// ramp runs ~40% → 97% (one palette step apart in light, identical in dark), so it
// renders as border/focus; a spread shadow keeps it outside like Figma's stroke.
// Collapsed: 24 top/bottom, no side padding, slot gap 16 (bound to Expanded Padding).
// `overflow-hidden` keeps the collapsed rail from spilling sideways; the collapsed
// state is broadcast to slotted items (ListItem/EntityItem/EntityCard) via
// RailContext so they render icon-only.
const sideBarStyles = cva(
  [
    'flex h-full flex-col overflow-hidden rounded-[var(--radius-3xl)] bg-[var(--bg-brand)]/20',
    'shadow-[0_0_0_var(--border-weight-thin)_color-mix(in_srgb,var(--border-focus)_40%,transparent)]',
  ],
  {
    variants: {
      collapsed: {
        true: 'w-[var(--size-64)] items-center gap-[var(--spacing-16)] py-[var(--spacing-24)]',
        false: 'w-[var(--size-280)] gap-[var(--spacing-48)] p-[var(--spacing-16)]',
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
  const railInset = isCollapsed && 'px-[var(--spacing-12)]';
  const toggle = useCallback(() => setCollapsed(!isCollapsed), [isCollapsed, setCollapsed]);

  return (
    <RailContext.Provider value={{ collapsed: isCollapsed, toggle }}>
      <aside className={cn(sideBarStyles({ collapsed: isCollapsed }), className)} {...rest}>
        {/* The Top Bar slot is padded by Side Bar/Padding: a row when expanded,
            a centred column (logo over toggle) when collapsed. */}
        {topBar ? (
          <div
            className={cn(
              'flex w-full items-center gap-[var(--spacing-24)] px-[var(--spacing-16)]',
              isCollapsed ? 'flex-col' : 'justify-between',
            )}
          >
            {topBar}
          </div>
        ) : null}
        {/* Collapsed, the header slots get the footer's 12px inset (the master
            lets them FILL the 64 rail), so a slotted card's outset focus ring
            isn't clipped by the shell's overflow. */}
        {header ? <div className={cn('w-full', railInset)}>{header}</div> : null}
        {subHeader ? <div className={cn('w-full', railInset)}>{subHeader}</div> : null}
        {/* min-h-0 lets the nav shrink below its content height so it scrolls
            instead of pushing the footer past the shell (vertical overflow).
            The 4px negative margin + padding pair leaves room for the items'
            outset focus ring, which the scroll container would otherwise clip. */}
        <nav
          className={cn(
            'styled-scrollbar -m-[var(--spacing-04)] flex min-h-0 flex-1 flex-col gap-[var(--spacing-24)] overflow-y-auto p-[var(--spacing-04)]',
            isCollapsed && 'items-center',
          )}
        >
          {children}
        </nav>
        {/* Footer slot: the master insets it 12 on each side. */}
        {footer ? <div className="w-full px-[var(--spacing-12)]">{footer}</div> : null}
      </aside>
    </RailContext.Provider>
  );
}
