'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Tab padding + radius match -- Molecule/Tabs/*. Selected tab = data-active; the
// underline is Base UI's Indicator positioned via its --active-tab-* vars.
const tabStyles =
  'relative inline-flex items-center gap-[var(--spacing-08)] rounded-[var(--radius-sm)] ' +
  'px-[var(--spacing-16)] py-[var(--spacing-12)] text-sm font-bold text-[var(--text-secondary)] ' +
  'transition-colors hover:text-[var(--text-primary)] data-[active]:text-[var(--accent-default)] ' +
  'disabled:opacity-[var(--opacity-disabled)] [&_svg]:size-[var(--size-20)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]';

export interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, className }: TabsProps) {
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(v) => onValueChange?.(v as string)}
      className={cn('w-full', className)}
    >
      <BaseTabs.List className="relative flex border-b border-[var(--border-default)]">
        {items.map((item) => (
          <BaseTabs.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={tabStyles}
          >
            {item.icon}
            {item.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator className="absolute bottom-0 left-[var(--active-tab-left)] h-[2px] w-[var(--active-tab-width)] rounded-full bg-[var(--accent-default)] transition-all" />
      </BaseTabs.List>
      {items.map((item) =>
        item.content != null ? (
          <BaseTabs.Panel
            key={item.value}
            value={item.value}
            className="py-[var(--spacing-12)] text-[var(--text-primary)]"
          >
            {item.content}
          </BaseTabs.Panel>
        ) : null,
      )}
    </BaseTabs.Root>
  );
}
