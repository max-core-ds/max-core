'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Single-select pill switcher on Base UI ToggleGroup. Container/item padding,
// radius, gap and icon size match -- Molecule/Switcher/*.
const groupStyles =
  'inline-flex items-center gap-[var(--spacing-02)] rounded-[var(--radius-full)] ' +
  'bg-[var(--bg-subtle)] p-[var(--spacing-04)]';

const itemStyles =
  'inline-flex items-center gap-[var(--spacing-08)] rounded-[var(--radius-full)] ' +
  'px-[var(--spacing-16)] py-[var(--spacing-08)] text-sm font-light text-[var(--text-secondary)] ' +
  'transition-colors [&_svg]:size-[var(--size-16)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ' +
  'data-[pressed]:bg-[var(--bg-surface)] data-[pressed]:font-bold data-[pressed]:text-[var(--text-primary)] ' +
  'data-[pressed]:shadow-[var(--effect-shadow-down-sm)] ' +
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]';

export interface SwitcherItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SwitcherProps {
  items: SwitcherItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
}

export function Switcher({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  ...rest
}: SwitcherProps) {
  return (
    <ToggleGroup
      value={value != null ? [value] : undefined}
      defaultValue={defaultValue != null ? [defaultValue] : undefined}
      onValueChange={(groupValue) => {
        const next = groupValue[0];
        if (next != null) onValueChange?.(next);
      }}
      className={cn(groupStyles, className)}
      {...rest}
    >
      {items.map((item) => (
        <Toggle key={item.value} value={item.value} disabled={item.disabled} className={itemStyles}>
          {item.icon}
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
