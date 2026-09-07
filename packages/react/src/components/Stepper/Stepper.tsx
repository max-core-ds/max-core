'use client';

import { NumberField } from '@base-ui/react/number-field';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { stateLayer } from '../../utils/state-layer.js';

// One uniform surface (bg/surface) across the whole control — the ± buttons have
// no fill of their own; they share the group's surface and only paint a state
// layer on hover/press. Border reacts on hover (border/hover) and focus.
//
// Padding X (12) insets the ± buttons from the surface edge and Items Gap (8)
// separates the three segments; the buttons then add their own Hit Area Padding X
// internally (glyph-to-edge = Padding X + Hit Area Padding X). NB: Figma also
// scopes Padding X / Items Gap per size, but the token export currently only
// ships Hit Area Padding X + Number Min Width per size — these use the Size S
// values (12 / 8) until the export carries the rest.
const groupStyles =
  'inline-flex items-stretch overflow-hidden rounded-[var(--radius-md)] ' +
  'gap-[var(--spacing-08)] px-[var(--spacing-12)] ' +
  'border border-[var(--border-default)] bg-[var(--bg-surface)] ' +
  'hover:border-[var(--border-hover)] focus-within:border-[var(--border-focus)] transition-colors';

// Hit Area Padding X per size (4/6/8) on the ± buttons. Fill is inherited from
// the group; hover/press are the mode-aware overlay/state-layer (see stateLayer).
const buttonStyles = cva(
  [
    'relative isolate inline-flex select-none items-center justify-center',
    'text-[var(--text-primary)]',
    stateLayer,
    'disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'px-[var(--spacing-04)]',
        m: 'px-[var(--spacing-06)]',
        l: 'px-[var(--spacing-08)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Number Min Width per size (40/48/56).
const inputStyles = cva(
  ['bg-transparent text-center tabular-nums text-[var(--text-primary)] outline-none'],
  {
    variants: {
      size: {
        s: 'min-w-[var(--size-40)] py-[var(--spacing-12)] text-xs',
        m: 'min-w-[var(--size-48)] py-[var(--spacing-12)] text-sm',
        l: 'min-w-[var(--size-56)] py-[var(--spacing-16)] text-base',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface StepperProps
  extends Omit<ComponentPropsWithoutRef<typeof NumberField.Root>, 'className'>,
    VariantProps<typeof buttonStyles> {
  label?: ReactNode;
  className?: string;
}

export function Stepper({ size = 'm', label, className, ...rest }: StepperProps) {
  return (
    <NumberField.Root className="inline-flex flex-col gap-[var(--spacing-04)]" {...rest}>
      {label ? <span className="text-sm font-bold text-[var(--text-primary)]">{label}</span> : null}
      <NumberField.Group className={cn(groupStyles, className)}>
        <NumberField.Decrement className={buttonStyles({ size })} aria-label="Decrease">
          −
        </NumberField.Decrement>
        <NumberField.Input className={inputStyles({ size })} />
        <NumberField.Increment className={buttonStyles({ size })} aria-label="Increase">
          +
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
