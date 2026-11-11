'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Tab Padding X/Y, Radius and Underline Border Weight are -- Molecule/Tabs/*.
// Label Body/SM/300 (cap-trimmed, so a tab is 12 + 10 + 12 = 34 like the master):
// text/secondary, text/primary on the active tab. Radius rounds only the outer
// corners (Figma's Start / End, derived from position here). The icon slot
// (gap 8, 20px) is React-only — Tab Item has none. Hover / pressed use the List
// Item states instead of Figma's overlay/hover + white (1.91:1 light) and
// accent/default + white (2.85:1 dark) — Phase 4.5 decision.
const tabStyles = cva(
  cn(
    'inline-flex items-center gap-[var(--spacing-08)] px-(--tabs-padding-x) py-(--tabs-padding-y) ' +
      'type-body-sm-300 text-[var(--text-secondary)] data-[active]:text-[var(--text-primary)] transition-colors ' +
      'first:rounded-l-(--tabs-radius) last:rounded-r-(--tabs-radius) [&_svg]:size-[var(--size-20)] ' +
      'not-data-[active]:hover:bg-[var(--accent-subtle)] not-data-[active]:hover:text-[var(--text-primary)] ' +
      'active:bg-[var(--accent-active)] active:text-[var(--text-on-accent)] ' +
      // Base UI marks a disabled tab with data-disabled, not the disabled attribute.
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
    focusRing,
  ),
  {
    variants: {
      fill: {
        // Each tab carries its own bottom line (Underline Border Weight, border/muted);
        // the active one is - Border Weight -/thick border/accent, as the master's
        // Active variant. Figma strokes sit inside, so the bottom padding gives the
        // line's weight back and the tab stays 34 tall.
        underline:
          'border-0 border-solid border-[var(--border-muted)] ' +
          'border-b-(length:--tabs-underline-border-weight) pb-[calc(var(--tabs-padding-y)-var(--tabs-underline-border-weight))] ' +
          'data-[active]:border-b-(length:--border-weight-thick) data-[active]:pb-[calc(var(--tabs-padding-y)-var(--border-weight-thick))] ' +
          'data-[active]:border-[var(--border-accent)]',
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
            <span className={capTrim}>{item.label}</span>
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
