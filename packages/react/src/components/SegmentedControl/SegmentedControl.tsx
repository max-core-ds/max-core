'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useControllableState } from '../../utils/use-controllable-state.js';

// Single-select segmented control on Base UI ToggleGroup (multiple defaults to
// false). Container/item radius, padding and gap match -- Atoms/Segmented Control/*.
const groupStyles =
  'inline-flex items-center gap-[var(--spacing-16)] rounded-[var(--radius-full)] ' +
  'border border-[var(--border-default)] bg-[var(--bg-subtle)] p-[var(--spacing-08)]';

// Active item = accent/default fill + text/on-accent label (no shadow), matching
// the Figma showcase — not the iOS-style white surface pill. Label Body/SM/300.
// Inactive text/secondary on the bg/subtle container is 3.86:1 (light) — below
// AA, kept to match Figma by decision (Phase 4.5 audit); flagged to the designer.
const itemStyles = cn(
  'inline-flex items-center gap-[var(--spacing-08)] rounded-[var(--radius-full)] border-0 ' +
    'p-[var(--spacing-08)] text-sm font-light text-[var(--text-secondary)] transition-colors ' +
    'data-[pressed]:bg-[var(--accent-default)] data-[pressed]:text-[var(--text-on-accent)] ' +
    '[&_svg]:size-[var(--size-20)] ' +
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  focusRing,
);

export interface SegmentedItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  items: SegmentedItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
}

export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  ...rest
}: SegmentedControlProps) {
  // The group is always controlled here so clicking the active segment can't
  // deselect it (ToggleGroup would emit []) — a segmented control always has
  // exactly one selection.
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange, '');
  return (
    <ToggleGroup
      value={selected ? [selected] : []}
      onValueChange={(groupValue) => {
        const next = groupValue[0];
        if (next != null) setSelected(next);
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
