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
import { useFormGroupSize } from '../../utils/form-group-size.js';
import { stateLayer } from '../../utils/state-layer.js';

// One uniform surface (bg/surface) across the whole control — the ± buttons have
// no fill of their own; they share the group's surface and only paint a state
// layer on hover/press. The group owns the field border: hover → border/hover,
// pressing a ± button → accent/default (the master's State=Pressed), focus →
// focusBorder (border/focus 2px).
//
// Every dimension is -- Molecule/Input/Stepper/Size */*. The group carries Padding
// X (insets the ± from the edge), Inner Gap (between the three segments), Radius
// and Stroke Weight; the buttons add Hit Area Padding X around an Icon Size icon;
// the number carries Number Min Width and Padding Y.
const groupBase = `inline-flex items-stretch overflow-hidden ${fieldBorder} has-[button:active]:border-[var(--accent-default)]`;
const groupSize = {
  s: 'gap-(--input-stepper-size-s-inner-gap) rounded-(--input-stepper-size-s-radius) border-(length:--input-stepper-size-s-stroke-weight) px-[calc(var(--input-stepper-size-s-padding-x)-var(--input-stepper-size-s-stroke-weight))]',
  m: 'gap-(--input-stepper-size-m-inner-gap) rounded-(--input-stepper-size-m-radius) border-(length:--input-stepper-size-m-stroke-weight) px-[calc(var(--input-stepper-size-m-padding-x)-var(--input-stepper-size-m-stroke-weight))]',
  l: 'gap-(--input-stepper-size-l-inner-gap) rounded-(--input-stepper-size-l-radius) border-(length:--input-stepper-size-l-stroke-weight) px-[calc(var(--input-stepper-size-l-padding-x)-var(--input-stepper-size-l-stroke-weight))]',
} as const;

// Icons text/secondary.
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
        s: 'px-(--input-stepper-size-s-hit-area-padding-x) [&_svg]:size-(--input-stepper-size-s-icon-size)',
        m: 'px-(--input-stepper-size-m-hit-area-padding-x) [&_svg]:size-(--input-stepper-size-m-icon-size)',
        l: 'px-(--input-stepper-size-l-hit-area-padding-x) [&_svg]:size-(--input-stepper-size-l-icon-size)',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// The number is Caption/700 text/primary at every size (the master). Its content
// box is Icon Size tall + Padding Y each side, so the group is 40 / 44 / 56 and the
// ± buttons stretch to match.
const inputStyles = cva(
  // field-sizing-content hugs the value (the master's Number-Width hugs above its
  // min width); browsers without it fall back to the default input width.
  [
    'box-content field-sizing-content bg-transparent text-center tabular-nums type-caption-700 text-[var(--text-primary)] outline-none',
  ],
  {
    variants: {
      size: {
        s: 'min-w-(--input-stepper-size-s-number-min-width) h-(--input-stepper-size-s-icon-size) py-[calc(var(--input-stepper-size-s-padding-y)-var(--input-stepper-size-s-stroke-weight))]',
        m: 'min-w-(--input-stepper-size-m-number-min-width) h-(--input-stepper-size-m-icon-size) py-[calc(var(--input-stepper-size-m-padding-y)-var(--input-stepper-size-m-stroke-weight))]',
        l: 'min-w-(--input-stepper-size-l-number-min-width) h-(--input-stepper-size-l-icon-size) py-[calc(var(--input-stepper-size-l-padding-y)-var(--input-stepper-size-l-stroke-weight))]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

const itemsGap = {
  s: 'gap-(--input-stepper-size-s-items-gap)',
  m: 'gap-(--input-stepper-size-m-items-gap)',
  l: 'gap-(--input-stepper-size-l-items-gap)',
} as const;

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
  size: sizeProp,
  label,
  helper,
  errorMessage,
  disabled,
  className,
  ...rest
}: StepperProps) {
  const size = useFormGroupSize(sizeProp);
  const isInvalid = Boolean(errorMessage);
  const sizeKey = size ?? 'm';
  return (
    <Field.Root
      className={cn(fieldRoot, 'inline-flex', itemsGap[sizeKey], className)}
      invalid={isInvalid}
      disabled={disabled}
    >
      {label ? <Field.Label className={fieldLabel(isInvalid)}>{label}</Field.Label> : null}
      <NumberField.Root disabled={disabled} {...rest}>
        <NumberField.Group
          className={cn(
            groupBase,
            groupSize[sizeKey],
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
