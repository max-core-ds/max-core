'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useControllableState } from '../../utils/use-controllable-state.js';

// Single-select segmented control on Base UI ToggleGroup (multiple defaults to
// false). Radius, padding, gap and border weight are its own Figma tokens
// (-- Atoms/Segmented Control/Main/* and Item/*). Strokes are Figma INSIDE
// strokes, drawn as inset rings so they never add to the hugged size (42 / 26).
const groupStyles =
  'inline-flex items-center gap-(--segmented-control-main-gap) rounded-(--segmented-control-main-radius) ' +
  'inset-ring-(length:--segmented-control-main-border-weight) inset-ring-[var(--border-default)] ' +
  'bg-[var(--bg-subtle)] p-(--segmented-control-main-padding)';

// Active item = accent/default fill + text/on-accent label + a `border/default`
// stroke at Item/Border Weight (none today), no shadow. Label Body/SM/300 in a
// cap-trimmed span, so an item is Padding + cap height + Padding (26px) as the
// master. Inactive label text/secondary. Item gap (icon ↔ label) = Item/Padding,
// as the master binds it.
const itemStyles = cn(
  'inline-flex items-center gap-(--segmented-control-item-padding) rounded-(--segmented-control-item-radius) ' +
    'inset-ring-(length:--segmented-control-item-border-weight) inset-ring-transparent ' +
    'p-(--segmented-control-item-padding) type-body-sm-300 text-[var(--text-secondary)] transition-colors ' +
    'data-[pressed]:inset-ring-[var(--border-default)] data-[pressed]:bg-[var(--accent-default)] data-[pressed]:text-[var(--text-on-accent)] ' +
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
      // Base UI puts aria-orientation on its role="group", where ARIA doesn't allow it
      // (axe aria-allowed-attr); data-orientation stays for styling.
      aria-orientation={undefined}
      {...rest}
    >
      {items.map((item) => (
        <Toggle key={item.value} value={item.value} disabled={item.disabled} className={itemStyles}>
          {item.icon}
          <span className={capTrim}>{item.label}</span>
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
