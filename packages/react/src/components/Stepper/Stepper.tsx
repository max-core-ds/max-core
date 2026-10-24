'use client';

import { Field } from '@base-ui/react/field';
import { NumberField } from '@base-ui/react/number-field';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import {
  fieldBorder,
  fieldError,
  fieldHelper,
  fieldHover,
  fieldInvalid,
  fieldLabel,
  fieldRoot,
} from '../../utils/field.js';
import { stateLayer } from '../../utils/state-layer.js';

// One uniform surface (bg/surface) across the whole control — the ± buttons have
// no fill of their own; they share the group's surface and only paint a state
// layer on hover/press. The group owns the field border: hover → border/hover,
// pressing a ± button → accent/default (the master's State=Pressed), focus →
// focusBorder (border/focus 2px).
//
// -- Molecule/Input/Stepper/Size {S,M,L}: Padding X (12) and Items Gap (8) are
// uniform across sizes, so they bind here on the group; Radius = md. Padding X
// insets the ± buttons from the surface edge and Items Gap separates the three
// segments; the buttons add their own Hit Area Padding X internally
// (glyph-to-edge = Padding X + Hit Area Padding X). Per-size tokens live on the
// buttons (Hit Area Padding X, Icon Size) and the field (Number Min Width, Padding Y).
const groupStyles = `inline-flex items-stretch overflow-hidden rounded-[var(--radius-md)] gap-[var(--spacing-08)] px-[calc(var(--spacing-12)-var(--border-weight-thin))] ${fieldBorder} has-[button:active]:border-[var(--accent-default)]`;

// Hit Area Padding X (4/6/8) and Icon Size (16/20/24) per size; icons text/secondary.
const buttonStyles = cva(
  [
    'relative isolate inline-flex select-none items-center justify-center',
    'text-[var(--text-secondary)]',
    stateLayer,
    'disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'px-[var(--spacing-04)] [&_svg]:size-[var(--size-16)]',
        m: 'px-[var(--spacing-06)] [&_svg]:size-[var(--size-20)]',
        l: 'px-[var(--spacing-08)] [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Number Min Width (40/48/56) and Padding Y (12/12/16) per size — the group's
// vertical extent follows the field (the ± buttons stretch to match).
const inputStyles = cva(
  // field-sizing-content hugs the value (the master's Number-Width hugs above its
  // min width); browsers without it fall back to the default input width.
  [
    'field-sizing-content bg-transparent text-center tabular-nums text-[var(--text-primary)] outline-none',
  ],
  {
    variants: {
      size: {
        s: 'min-w-[var(--size-40)] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-xs',
        m: 'min-w-[var(--size-48)] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-sm',
        l: 'min-w-[var(--size-56)] py-[calc(var(--spacing-16)-var(--border-weight-thin))] text-base',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// The Stepper title scales with Size (unlike the other inputs' Body/MD/700):
// S Caption/700, M Body/SM/700, L Body/MD/700.
const labelSize = { s: 'text-xs', m: 'text-sm', l: 'text-base' } as const;

export interface StepperProps
  extends Omit<ComponentPropsWithoutRef<typeof NumberField.Root>, 'className'>,
    VariantProps<typeof buttonStyles> {
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
  /** Applied to the field wrapper (label + control + helper). */
  className?: string;
}

export function Stepper({
  size,
  label,
  helper,
  errorMessage,
  disabled,
  className,
  ...rest
}: StepperProps) {
  const isInvalid = Boolean(errorMessage);
  const sizeKey = size ?? 'm';
  return (
    <Field.Root
      className={cn(fieldRoot, 'inline-flex', className)}
      invalid={isInvalid}
      disabled={disabled}
    >
      {label ? (
        <Field.Label className={cn(fieldLabel(isInvalid), labelSize[sizeKey])}>{label}</Field.Label>
      ) : null}
      <NumberField.Root disabled={disabled} {...rest}>
        <NumberField.Group
          className={cn(
            groupStyles,
            isInvalid
              ? [fieldInvalid, 'bg-[var(--status-danger-subtle)]']
              : ['bg-[var(--bg-surface)]', fieldHover],
          )}
        >
          <NumberField.Decrement className={buttonStyles({ size })} aria-label="Decrease">
            <MinusIcon />
          </NumberField.Decrement>
          <NumberField.Input className={inputStyles({ size })} />
          <NumberField.Increment className={buttonStyles({ size })} aria-label="Increase">
            <PlusIcon />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
      {errorMessage ? (
        <Field.Error match={true} className={fieldError}>
          {errorMessage}
        </Field.Error>
      ) : helper ? (
        <Field.Description className={fieldHelper}>{helper}</Field.Description>
      ) : null}
    </Field.Root>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}
