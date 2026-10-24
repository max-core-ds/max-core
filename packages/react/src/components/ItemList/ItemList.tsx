'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { Checkbox, type CheckboxProps } from '../Checkbox/Checkbox.js';
import { Divider } from '../Divider/Divider.js';
import { ScrollArea } from '../ScrollArea/ScrollArea.js';
import { SearchBar, type SearchBarProps } from '../SearchBar/SearchBar.js';

// Scrollable list container matching the Figma Item List master (2344:4399):
// an optional size-S Searchbar, an optional "Select all" row, an optional
// Divider, then the content slot (List Item rows) with an optional ScrollBar
// rail. Container Padding Y/Radius/Border Weight/Min Width and Search Padding X
// match -- Molecule/Item List/*; the surface is bg/surface + border/default.
// The rail sits flush at the right edge like the master's absolute ScrollBar.
//
// Deliberate deviations from the master (user request, 2026-10-24): rows are
// 4px apart (the master stacks them flush) with an even 4px inset on every
// side of the options area; that padding lives inside the scroll content, so
// rows scroll down to the border instead of being cut above it, and a fade
// marks more rows below. Container Padding Y (12) only tops the header
// (search / Select all).
const containerStyles = cn(
  'flex min-w-[var(--size-120)] flex-col overflow-hidden',
  'rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
);

const contentStyles = 'flex flex-col gap-[var(--spacing-04)] p-[var(--spacing-04)]';

// Fade the last 24px while more rows sit below the fold.
const fadeEnd =
  'data-[overflow-end]:[mask-image:linear-gradient(to_bottom,black_calc(100%-var(--spacing-24)),transparent)]';

// The "Select all" row is a List Item in Figma with a size-S Checkbox in the
// leading slot. It's a <label> here (not a ListItem <button>) so the checkbox
// isn't nested inside another interactive element; the padding, gap, radius
// and hover fill mirror ListItem; it shares the rows' 4px side inset.
const selectAllStyles = cn(
  'mx-[var(--spacing-04)] flex cursor-pointer items-center gap-[var(--spacing-08)] rounded-[var(--radius-l)]',
  'px-[var(--spacing-12)] py-[var(--spacing-12)] text-xs font-bold text-[var(--text-primary)]',
  'transition-colors hover:bg-[var(--accent-subtle)]',
);

export interface ItemListSelectAllProps
  extends Pick<
    CheckboxProps,
    'checked' | 'defaultChecked' | 'indeterminate' | 'onCheckedChange' | 'disabled'
  > {
  /** Row label. Defaults to "Select all". */
  label?: ReactNode;
}

export interface ItemListProps extends ComponentPropsWithoutRef<'div'> {
  /** Shows the Searchbar (Show search) when set; the props go to a size-S SearchBar. */
  search?: Omit<SearchBarProps, 'size'>;
  /** Shows the "Select all" row (Show Select all) when set. */
  selectAll?: ItemListSelectAllProps;
  /** Divider between the header (search / select all) and the content. Defaults to true. */
  showDivider?: boolean;
  /**
   * Scroll indicator rail (Show ScrollBar). Defaults to true. The content
   * scrolls once the list is height-bounded (e.g. `className="max-h-64"`);
   * the rail only appears while the content overflows.
   */
  showScrollBar?: boolean;
  /** Slot content — typically ListItem rows. */
  children?: ReactNode;
}

export function ItemList({
  search,
  selectAll,
  showDivider = true,
  showScrollBar = true,
  children,
  className,
  ...rest
}: ItemListProps) {
  const hasHeader = Boolean(search || selectAll);
  return (
    <div className={cn(containerStyles, className)} {...rest}>
      {hasHeader ? (
        <div className="flex shrink-0 flex-col pt-[var(--spacing-12)]">
          {search ? (
            <div className="px-[var(--spacing-12)]">
              <SearchBar size="s" {...search} />
            </div>
          ) : null}
          {selectAll ? <SelectAllRow {...selectAll} /> : null}
        </div>
      ) : null}
      {hasHeader && showDivider ? <Divider /> : null}
      {showScrollBar ? (
        <ScrollArea railGap={0} className="min-h-0 flex-1" viewportClassName={fadeEnd}>
          <div className={contentStyles}>{children}</div>
        </ScrollArea>
      ) : (
        <div className={cn('scrollbar-none min-h-0 flex-1 overflow-y-auto', contentStyles)}>
          {children}
        </div>
      )}
    </div>
  );
}

function SelectAllRow({ label = 'Select all', ...checkbox }: ItemListSelectAllProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI checkbox button (a labelable control)
    <label className={cn(selectAllStyles, 'shrink-0')}>
      <Checkbox size="s" {...checkbox} />
      <span className="flex-1">{label}</span>
    </label>
  );
}
