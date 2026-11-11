'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useCallback } from 'react';
import { cn } from '../../utils/cn.js';
import { RailContext } from '../../utils/rail-context.js';
import { useControllableState } from '../../utils/use-controllable-state.js';

// Width Expanded / Collapsed, Gap, Padding, Body items gap, Radius, Border Weight and
// Background opacity are -- Organism/Side Bar/*. The shell is the master's glass:
// bg/surface at Background opacity (20%) + effect/blur/md, as the Top Bar (Max, round
// 1: was bg/brand, no blur) with a Border Weight OUTSIDE stroke, a border/accent →
// border/focus gradient at 40%. On the long edges the
// ramp runs ~40% → 97% (one palette step apart in light, identical in dark), so it
// renders as border/focus; a spread shadow keeps it outside like Figma's stroke.
// Collapsed: 24 top/bottom, no side padding, slot gap 16 (the master binds it to
// Expanded Padding).
// `overflow-hidden` keeps the collapsed rail from spilling sideways; the collapsed
// state is broadcast to slotted items (ListItem/EntityItem/EntityCard) via
// RailContext so they render icon-only.
const sideBarStyles = cva(
  [
    'flex h-full flex-col overflow-hidden rounded-(--side-bar-radius) backdrop-blur-effect-md',
    'bg-[color-mix(in_srgb,var(--bg-surface)_calc(var(--side-bar-background-opacity)*100%),transparent)]',
    'shadow-[0_0_0_var(--side-bar-border-weight)_color-mix(in_srgb,var(--border-focus)_40%,transparent)]',
  ],
  {
    variants: {
      collapsed: {
        true: 'w-(--side-bar-width-collapsed) items-center gap-(--side-bar-expanded-padding) py-[var(--spacing-24)]',
        false: 'w-(--side-bar-width-expanded) gap-(--side-bar-gap) p-(--side-bar-padding)',
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
              'flex w-full items-center gap-[var(--spacing-24)] px-(--side-bar-padding)',
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
            'styled-scrollbar -m-[var(--spacing-04)] flex min-h-0 flex-1 flex-col gap-(--side-bar-body-items-gap) overflow-y-auto p-[var(--spacing-04)]',
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
