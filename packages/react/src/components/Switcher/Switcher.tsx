'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useControllableState } from '../../utils/use-controllable-state.js';

// Single-select pill switcher on Base UI ToggleGroup. Container Padding / Radius /
// Gap and Item Padding X/Y / Radius / Gap / Icon Size are -- Molecule/Switcher/*.
const groupStyles =
  'inline-flex items-center gap-(--switcher-container-gap) rounded-(--switcher-container-radius) ' +
  'bg-[var(--bg-subtle)] p-(--switcher-container-padding)';

// Label Body/SM/300 text/secondary, cap-trimmed. The master's item is 8 + 16 + 8 = 32
// because of its 16px icon; the row keeps at least Icon Size tall without one, so
// items with and without icons stay 32 (a hugging Figma item drops to 26).
// Hover = neutral/subtle fill, label unchanged; Pressed = neutral/subtle +
// text/primary; Active = bg/surface + shadow/down/sm + Body/SM/700 text/primary —
// all as bound in the master (neutral/subtle equals the container's bg/subtle in
// dark mode, so there hover shows no change).
const itemStyles = cn(
  'inline-flex items-center gap-(--switcher-item-gap) rounded-(--switcher-item-radius) ' +
    'px-(--switcher-item-padding-x) py-(--switcher-item-padding-y) type-body-sm-300 text-[var(--text-secondary)] ' +
    'min-h-[calc(var(--switcher-item-icon-size)+var(--switcher-item-padding-y)*2)] ' +
    'transition-colors [&_svg]:size-(--switcher-item-icon-size) ' +
    'not-data-[pressed]:hover:bg-[var(--neutral-subtle)] not-data-[pressed]:active:bg-[var(--neutral-subtle)] active:text-[var(--text-primary)] ' +
    'data-[pressed]:bg-[var(--bg-surface)] data-[pressed]:font-bold data-[pressed]:text-[var(--text-primary)] ' +
    'data-[pressed]:shadow-[var(--effect-shadow-down-sm)] ' +
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  focusRing,
);

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
