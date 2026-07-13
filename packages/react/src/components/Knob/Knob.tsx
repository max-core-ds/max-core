import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// The circular draggable handle reused by Range / Slider. Size/padding/radius
// match -- Atoms/Knob/*; a surface container (`group`) holds an inner handle
// whose fill is state-specific (Figma: State=Default/Hover/Pressed × Disabled):
//   Default → neutral/subtle · Hover → accent · Pressed → hollow border ring.
// By default the handle reacts to real hover/press (also while dragging inside a
// slider thumb); pass `state` to force a specific look for showcases.
const containerStyles =
  'group inline-flex size-[var(--size-24)] items-center justify-center rounded-[var(--radius-full)] ' +
  'bg-[var(--bg-surface)] p-[var(--spacing-04)] shadow-[var(--effect-shadow-down-sm)]';

const handleBase = 'size-full rounded-[var(--radius-full)] transition-colors';

// Fully-written literals (Tailwind must see them verbatim).
const staticHandle = {
  default: 'bg-[var(--neutral-subtle)]',
  hover: 'bg-[var(--accent-default)]',
  pressed: 'border-2 border-[var(--border-default)] bg-transparent',
} as const;

const interactiveHandle =
  'bg-[var(--neutral-subtle)] ' +
  'group-hover:bg-[var(--accent-default)] ' +
  'group-active:border-2 group-active:border-[var(--border-default)] group-active:bg-transparent';

export interface KnobProps extends ComponentPropsWithoutRef<'span'> {
  /** Force a specific state; omit for interactive (hover/press) behavior. */
  state?: keyof typeof staticHandle;
  disabled?: boolean;
}

export function Knob({ state, disabled, className, ...rest }: KnobProps) {
  const handle = disabled ? staticHandle.default : state ? staticHandle[state] : interactiveHandle;
  return (
    <span
      data-disabled={disabled || undefined}
      className={cn(containerStyles, disabled && 'opacity-[var(--opacity-disabled)]', className)}
      {...rest}
    >
      <span className={cn(handleBase, handle)} />
    </span>
  );
}
