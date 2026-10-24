'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Tab padding, radius and underline weight match -- Molecule/Tabs/*. Label
// Body/SM/300 text/secondary in every state (the master doesn't recolour the
// active label — the underline / accent/surface fill marks it). Radius rounds
// only the outer corners (Figma's Start / End, derived from position here).
// Hover / pressed use the List Item states instead of Figma's overlay/hover +
// white (1.91:1 light) and accent/default + white (2.85:1 dark) — Phase 4.5 decision.
const tabStyles = cva(
  cn(
    'inline-flex items-center gap-[var(--spacing-08)] px-[var(--spacing-16)] py-[var(--spacing-12)] ' +
      'text-sm font-light text-[var(--text-secondary)] transition-colors ' +
      'first:rounded-l-[var(--radius-sm)] last:rounded-r-[var(--radius-sm)] [&_svg]:size-[var(--size-20)] ' +
      'not-data-[active]:hover:bg-[var(--accent-subtle)] not-data-[active]:hover:text-[var(--text-primary)] ' +
      'active:bg-[var(--accent-active)] active:text-[var(--text-on-accent)] ' +
      // Base UI marks a disabled tab with data-disabled, not the disabled attribute.
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
    focusRing,
  ),
  {
    variants: {
      fill: {
        // Each tab carries its own bottom line; the active one turns accent.
        underline:
          'border-0 border-b-[length:var(--border-weight-thin)] border-solid border-[var(--border-muted)] ' +
          'data-[active]:border-[var(--accent-default)]',
        full: 'bg-[var(--bg-default)] data-[active]:bg-[var(--accent-surface)]',
      },
    },
    defaultVariants: { fill: 'underline' },
  },
);

export interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends VariantProps<typeof tabStyles> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, fill, value, defaultValue, onValueChange, className }: TabsProps) {
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(v) => onValueChange?.(v as string)}
      className={cn('w-full', className)}
    >
      {/* The tab bar hugs its tabs, as the Tabs Group master does. */}
      <BaseTabs.List className="inline-flex">
        {items.map((item) => (
          <BaseTabs.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={tabStyles({ fill })}
          >
            {item.icon}
            {item.label}
          </BaseTabs.Tab>
        ))}
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
