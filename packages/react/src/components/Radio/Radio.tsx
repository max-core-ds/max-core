'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

export interface RadioGroupProps extends ComponentPropsWithoutRef<typeof BaseRadioGroup> {}

// Item Gap (8) between radios.
export function RadioGroup({ className, ...rest }: RadioGroupProps) {
  return (
    <BaseRadioGroup className={cn('flex flex-col gap-[var(--spacing-08)]', className)} {...rest} />
  );
}

// Box size from Global/Size (16/24); the accent dot is the box inset by the
// per-size Dot Padding (2 / 4). Radius full.
const boxStyles = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-[var(--radius-full)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
    'transition-colors data-[checked]:border-[var(--accent-default)]',
    focusRing,
    'data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'size-[var(--spacing-16)] p-[var(--spacing-02)]',
        m: 'size-[var(--spacing-24)] p-[var(--spacing-04)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'className'>,
    VariantProps<typeof boxStyles> {
  label?: ReactNode;
  className?: string;
}

export function Radio({ size = 'm', label, className, ...rest }: RadioProps) {
  const box = (
    <BaseRadio.Root className={cn(boxStyles({ size }), !label && className)} {...rest}>
      <BaseRadio.Indicator className="size-full rounded-[var(--radius-full)] bg-[var(--accent-default)]" />
    </BaseRadio.Root>
  );
  if (!label) return box;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI radio button (a labelable control)
    <label className="inline-flex cursor-pointer items-center gap-[var(--spacing-06)] p-[var(--spacing-04)] text-[var(--text-primary)]">
      {box}
      <span>{label}</span>
    </label>
  );
}
