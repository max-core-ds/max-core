'use client';

import { Menu } from '@base-ui/react/menu';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Menu popup styled like an Item List. Gap + Item List Padding both = 4.
const popupStyles =
  'flex min-w-[var(--size-120)] flex-col gap-[var(--spacing-04)] rounded-[var(--radius-md)] ' +
  'border border-[var(--border-muted)] bg-[var(--bg-surface)] p-[var(--spacing-04)] ' +
  'text-[var(--text-primary)] shadow-[var(--effect-shadow-down-md)] outline-none';

const itemStyles =
  'flex cursor-default items-center gap-[var(--spacing-08)] rounded-[var(--radius-sm)] ' +
  'px-[var(--spacing-08)] py-[var(--spacing-06)] text-sm outline-none ' +
  'data-[highlighted]:bg-[var(--bg-subtle)] data-[disabled]:opacity-[var(--opacity-disabled)] ' +
  '[&_svg]:size-[var(--size-20)]';

export interface DropdownItem {
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  /** The element that opens the menu. */
  trigger: ReactElement;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Dropdown({ trigger, items, align = 'start', className }: DropdownProps) {
  return (
    <Menu.Root>
      <Menu.Trigger render={trigger} />
      <Menu.Portal>
        <Menu.Positioner sideOffset={4} align={align}>
          <Menu.Popup className={cn(popupStyles, className)}>
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
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
