'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useRailCollapsed } from '../../utils/rail-context.js';

// The interactive row primitive for Item List / Dropdown / Stacked List menus.
// Padding/gap/icon size/radius match -- Atoms/List Item/*. The label is
// Caption/700 and the optional support text Caption/300, 4px apart (Label Helper
// Gap) — with the 20px icons that gives the master's 44px row. Interactive states
// follow the Figma showcase: Hover=accent/subtle (a wash — text stays
// text/primary; accent/subtle is a pale fill in light mode, so white on-accent
// text would be unreadable), Pressed=accent/active and Active (selected)=
// accent/default carry text/on-accent. Collapsed hides the label + trailing
// indicator for icon-only rails. Level 1/2 add a 12/24px indent spacer before
// the leading icon for nested rows.
//
// Deliberate deviations from the master: Figma keeps the Pressed label on
// text/primary (its icons go text/on-accent) and the Active+Collapsed icon on
// text/primary; we keep the whole Pressed/Active row on text/on-accent, which is
// consistent and readable on the strong accent fills. Support text follows the
// label: text/secondary at rest, text/primary on the pale hover wash (Figma's
// on-accent-muted there is 1.1:1, text/secondary 3.9:1), text/on-accent-muted on
// the pressed/selected accent fills.
const base = cn(
  'group/list-item relative flex w-full items-center gap-[var(--spacing-08)] rounded-[var(--radius-l)]',
  'px-[var(--spacing-12)] py-[var(--spacing-12)] text-left text-xs text-[var(--text-primary)]',
  '[&_svg]:size-[var(--size-20)] transition-colors',
  focusRing,
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
);

// Hover + pressed feedback (pseudo-states). Applied unless the row is selected,
// which owns the fill via `activeStyles`.
const interactive = cn(
  'hover:bg-[var(--accent-subtle)]',
  'active:bg-[var(--accent-active)] active:text-[var(--text-on-accent)]',
);

// Selected/current row — persistent accent/default fill.
const activeStyles = 'bg-[var(--accent-default)] text-[var(--text-on-accent)]';

// Support text tracks the row state: secondary at rest, primary on hover,
// on-accent-muted on the pressed and selected accent fills.
const supportTextStyles = cn(
  'font-light text-[var(--text-secondary)] group-hover/list-item:text-[var(--text-primary)]',
  'group-active/list-item:text-[var(--text-on-accent-muted)]',
);
const supportTextActiveStyles = 'font-light text-[var(--text-on-accent-muted)]';

/**
 * List Item look for listbox options (Select / Combobox items inside an Item
 * List popup): the row geometry + Caption/700 label, highlighted (keyboard or
 * pointer) = the hover wash, pressed = accent/active. Options have no focus ring
 * — the listbox moves `data-highlighted`. `group/option` lets a leading
 * CheckboxMark / RadioMark follow the row's `data-selected`.
 */
export const listItemOption = cn(
  'group/option flex w-full cursor-default select-none items-center gap-[var(--spacing-08)]',
  'rounded-[var(--radius-l)] px-[var(--spacing-12)] py-[var(--spacing-12)]',
  'text-xs font-bold text-[var(--text-primary)] outline-none transition-colors',
  'data-[highlighted]:bg-[var(--accent-subtle)]',
  'active:bg-[var(--accent-active)] active:text-[var(--text-on-accent)]',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
);

// Nested-row indent spacers (Level 1 / Level 2 on the master).
const levelSpacer = {
  1: 'w-[var(--spacing-12)]',
  2: 'w-[var(--spacing-24)]',
} as const;

export interface ListItemProps extends ComponentPropsWithoutRef<'button'> {
  leftIcon?: ReactNode;
  /** Trailing indicator (e.g. a chevron). Hidden when `collapsed`. */
  rightIcon?: ReactNode;
  /** Secondary line under the label (Show support text). */
  supportText?: ReactNode;
  /** Nesting depth — adds a 12px (1) or 24px (2) indent before the leading icon. */
  level?: 0 | 1 | 2;
  /** Selected/current row — renders the persistent accent fill. */
  active?: boolean;
  /**
   * Icon-only rail mode: hides the label + trailing indicator. Defaults to the
   * surrounding rail (e.g. a collapsed SideBar) when omitted.
   */
  collapsed?: boolean;
  children?: ReactNode;
}

export function ListItem({
  leftIcon,
  rightIcon,
  supportText,
  level = 0,
  active = false,
  collapsed,
  children,
  className,
  ...rest
}: ListItemProps) {
  const isCollapsed = useRailCollapsed(collapsed);
  return (
    <button
      type="button"
      aria-current={active || undefined}
      className={cn(
        base,
        isCollapsed && 'justify-center',
        active ? activeStyles : interactive,
        className,
      )}
      {...rest}
    >
      {level ? <span aria-hidden="true" className={cn('shrink-0', levelSpacer[level])} /> : null}
      {leftIcon}
      {!isCollapsed && (
        <span className="flex flex-1 flex-col gap-[var(--spacing-04)]">
          <span className="font-bold">{children}</span>
          {supportText ? (
            <span className={active ? supportTextActiveStyles : supportTextStyles}>
              {supportText}
            </span>
          ) : null}
        </span>
      )}
      {!isCollapsed && rightIcon}
    </button>
  );
}
