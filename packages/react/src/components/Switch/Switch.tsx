'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { type Validation, switchValidation } from '../../utils/validation.js';

// Track width from Switch/Width (32/40); Knob Padding (2) insets the thumb;
// radius full. Track height and thumb size follow the Tailwind scale (Figma
// does not tokenize them). Track color comes from the Validation axis (neutral
// when off, validation color when on). Thumb travel = width − 2·padding − thumb.
const trackStyles = cva(
  [
    'relative inline-flex shrink-0 items-center rounded-[var(--radius-full)] p-[var(--spacing-02)]',
    'transition-colors',
    focusRing,
    'data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'h-5 w-[var(--size-32)]',
        m: 'h-6 w-[var(--size-40)]',
      },
      validation: switchValidation,
    },
    defaultVariants: { size: 'm', validation: 'default' },
  },
);

const thumbStyles = cva(
  [
    'block rounded-[var(--radius-full)] bg-[var(--bg-surface)]',
    'shadow-[var(--effect-shadow-down-sm)] transition-transform',
  ],
  {
    variants: {
      size: {
        s: 'size-4 data-[checked]:translate-x-3',
        m: 'size-5 data-[checked]:translate-x-4',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseSwitch.Root>, 'className'>,
    VariantProps<typeof trackStyles> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  validation?: Validation;
  className?: string;
}

export function Switch({
  size = 'm',
  validation = 'default',
  label,
  helperText,
  errorMessage,
  className,
  ...rest
}: SwitchProps) {
  // An error message forces the error color and takes precedence over helperText.
  const effectiveValidation: Validation = errorMessage ? 'error' : validation;
  const hasText = Boolean(label || helperText || errorMessage);
  const track = (
    <BaseSwitch.Root
      className={cn(trackStyles({ size, validation: effectiveValidation }), !hasText && className)}
      {...rest}
    >
      <BaseSwitch.Thumb className={thumbStyles({ size })} />
    </BaseSwitch.Root>
  );
  if (!hasText) return track;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI switch button (a labelable control)
    <label className="inline-flex cursor-pointer items-start gap-[var(--spacing-08)] p-[var(--spacing-04)]">
      {track}
      <span className="flex flex-col gap-[var(--spacing-06)]">
        {label ? <span className="text-[var(--text-primary)]">{label}</span> : null}
        {errorMessage ? (
          <span className="text-sm text-[var(--status-danger-default)]">{errorMessage}</span>
        ) : helperText ? (
          <span className="text-sm text-[var(--text-muted)]">{helperText}</span>
        ) : null}
      </span>
    </label>
  );
}
