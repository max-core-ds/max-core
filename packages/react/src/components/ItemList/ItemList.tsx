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
// Rows stack flush (the master's item spacing is 0), and the rail sits flush
// at the right edge like the master's absolute ScrollBar.
const containerStyles = cn(
  'flex min-w-[var(--size-120)] flex-col overflow-hidden',
  'rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
  'py-[var(--spacing-12)]',
);

// The "Select all" row is a List Item in Figma with a size-S Checkbox in the
// leading slot. It's a <label> here (not a ListItem <button>) so the checkbox
// isn't nested inside another interactive element; the padding, gap, radius
// and hover fill mirror ListItem.
const selectAllStyles = cn(
  'flex w-full cursor-pointer items-center gap-[var(--spacing-08)] rounded-[var(--radius-l)]',
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
      {search ? (
        <div className="shrink-0 px-[var(--spacing-12)]">
          <SearchBar size="s" {...search} />
        </div>
      ) : null}
      {selectAll ? <SelectAllRow {...selectAll} /> : null}
      {hasHeader && showDivider ? <Divider /> : null}
      {showScrollBar ? (
        <ScrollArea railGap={0} className="min-h-0 flex-1">
          <div className="flex flex-col">{children}</div>
        </ScrollArea>
      ) : (
        <div className="scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto">
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
