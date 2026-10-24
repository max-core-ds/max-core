'use client';

import { Menu } from '@base-ui/react/menu';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { cn } from '../../utils/cn.js';
import { ItemList } from '../ItemList/ItemList.js';
import { listItemOption } from '../ListItem/ListItem.js';

// Figma Dropdown master (2380:9128): a Trigger (instance swap, Entity Card by
// default) with an Item List 4px below it (-- Molecule/Dropdown/Gap), shown
// while Active. The list is the Item List master (no search / Select all /
// divider, ScrollBar on) holding List Item rows with a leading icon, so the
// popup renders ItemList + the List Item row look (`listItemOption`); like the
// Select popup it has no shadow. The list is at least as wide as the trigger:
// the master's left-only Item List Padding (4) reads as a slip, not an offset.
const listStyles =
  'min-w-[var(--anchor-width)] max-h-[var(--available-height)] text-[var(--text-primary)]';

const itemStyles = cn(listItemOption, '[&_svg]:size-[var(--size-20)]');

export interface DropdownItem {
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
  /** Element the list lines up with (and is at least as wide as). Defaults to the trigger. */
  anchor?: RefObject<Element | null>;
  className?: string;
}

/** The Dropdown popup, shared with SplitButton's menu. Render inside a `Menu.Root`. */
export function DropdownMenu({ items, align = 'start', anchor, className }: DropdownMenuProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner sideOffset={4} align={align} anchor={anchor}>
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
                {item.label}
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
