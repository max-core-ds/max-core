'use client';

import { Menu } from '@base-ui/react/menu';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { cn } from '../../utils/cn.js';
import { ItemList } from '../ItemList/ItemList.js';
import { listItemOption } from '../ListItem/ListItem.js';

// Figma Dropdown master (2380:9128): a Trigger (instance swap, Entity Card by
// default) with an Item List 4px below it (-- Molecule/Dropdown/Gap — a numeric
// sideOffset, since the positioner takes px), shown
// while Active. The list is the Item List master (no search / Select all /
// divider, ScrollBar on) holding List Item rows with a leading icon, so the
// popup renders ItemList + the List Item row look (`listItemOption`), with the
// Item List's shadow. The list is at least as wide as the trigger:
// the master's left-only Item List Padding (4) reads as a slip, not an offset.
const listStyles =
  'min-w-[var(--anchor-width)] max-h-[var(--available-height)] text-[var(--text-primary)]';

const itemStyles = cn(listItemOption, '[&_svg]:size-(--list-item-icon-size)');

export interface DropdownItem {
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
  /** Which side of the anchor the list opens on (Bottom Navigation's More opens upward). */
  side?: 'top' | 'bottom';
  /** Distance from the anchor in px. Defaults to the Dropdown Gap (4). */
  sideOffset?: number;
  /** Element the list lines up with (and is at least as wide as). Defaults to the trigger. */
  anchor?: RefObject<Element | null>;
  className?: string;
}

/** The Dropdown popup, shared with SplitButton's menu. Render inside a `Menu.Root`. */
export function DropdownMenu({
  items,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  anchor,
  className,
}: DropdownMenuProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner side={side} sideOffset={sideOffset} align={align} anchor={anchor}>
        <Menu.Popup className="outline-none">
          <ItemList className={cn(listStyles, className)}>
            {items.map((item, i) => (
              <Menu.Item
                // biome-ignore lint/suspicious/noArrayIndexKey: menu is a static, ordered list
                key={i}
                className={itemStyles}
                disabled={item.disabled}
                onClick={item.onClick}
              >
                {item.icon}
                <span>{item.label}</span>
              </Menu.Item>
            ))}
          </ItemList>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export interface DropdownProps extends Omit<DropdownMenuProps, 'anchor'> {
  /** The element that opens the menu (the master's Trigger swap). */
  trigger: ReactElement;
  /** Controlled open state (the master's Active). */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dropdown({ trigger, open, defaultOpen, onOpenChange, ...menu }: DropdownProps) {
  return (
    <Menu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
    >
      <Menu.Trigger render={trigger} />
      <DropdownMenu {...menu} />
    </Menu.Root>
  );
}
