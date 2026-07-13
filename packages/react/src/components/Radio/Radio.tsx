'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { type Validation, radioValidation } from '../../utils/validation.js';

export interface RadioGroupProps extends ComponentPropsWithoutRef<typeof BaseRadioGroup> {}

// Item Gap (8) between radios.
export function RadioGroup({ className, ...rest }: RadioGroupProps) {
  return (
    <BaseRadioGroup className={cn('flex flex-col gap-[var(--spacing-08)]', className)} {...rest} />
  );
}

// Box size from Selection Control/Global/Size (16/24); the dot is the box inset
// by the per-size Dot Padding (2 / 4) and takes the box's `text-` color
// (bg-current). Color + border come from the Validation axis. Radius full.
const boxStyles = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-[var(--radius-full)] border',
    'transition-colors',
    focusRing,
    'data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'size-[var(--size-16)] p-[var(--spacing-02)]',
        m: 'size-[var(--size-24)] p-[var(--spacing-04)]',
      },
      validation: radioValidation,
    },
    defaultVariants: { size: 'm', validation: 'default' },
  },
);

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'className'>,
    VariantProps<typeof boxStyles> {
  label?: ReactNode;
  helperText?: ReactNode;
  validation?: Validation;
  className?: string;
}

export function Radio({
  size = 'm',
  validation = 'default',
  label,
  helperText,
  className,
  ...rest
}: RadioProps) {
  const box = (
    <BaseRadio.Root
      className={cn(boxStyles({ size, validation }), !label && !helperText && className)}
      {...rest}
    >
      <BaseRadio.Indicator className="size-full rounded-[var(--radius-full)] bg-current" />
    </BaseRadio.Root>
  );
  if (!label && !helperText) return box;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI radio button (a labelable control)
    <label className="inline-flex cursor-pointer items-start gap-[var(--spacing-08)] p-[var(--spacing-04)]">
      {box}
      <span className="flex flex-col gap-[var(--spacing-06)]">
        {label ? <span className="text-[var(--text-primary)]">{label}</span> : null}
        {helperText ? <span className="text-sm text-[var(--text-muted)]">{helperText}</span> : null}
      </span>
    </label>
  );
}
