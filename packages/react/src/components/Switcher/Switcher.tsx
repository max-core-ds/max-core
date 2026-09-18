'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../utils/use-controllable-state.js';

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
  // `setValue` is only ever called with a defined value (empty selections are
  // guarded below), so widening the callback to accept `undefined` is safe.
  const [current, setValue] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onValueChange as ((value: string | undefined) => void) | undefined,
    undefined,
  );

  return (
    <ToggleGroup
      // Always drive ToggleGroup as controlled so it never clears its own state:
      // a switcher keeps exactly one item selected.
      value={current != null ? [current] : []}
      onValueChange={(groupValue) => {
        const next = groupValue[0];
        // Clicking the active item emits an empty selection — ignore it so the
        // current item stays selected instead of being toggled off.
        if (next == null) return;
        setValue(next);
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
