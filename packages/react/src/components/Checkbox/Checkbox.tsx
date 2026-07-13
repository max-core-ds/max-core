'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { type Validation, checkboxValidation } from '../../utils/validation.js';

// Box size from Selection Control/Global/Size (16/24); radius xs; border thin.
// Color comes from the Validation axis (Default/Error/Warning/Success). A
// <label> wraps the button so clicking the text/helper toggles it.
const boxStyles = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-[var(--radius-xs)] border',
    'text-[var(--text-on-accent)] transition-colors',
    focusRing,
    'data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      // The Checkbox Figma size token aliases to Spacing (not Size) — bind
      // spacing-16/24 to stay conformant with the token spec.
      size: {
        s: 'size-[var(--spacing-16)]',
        m: 'size-[var(--spacing-24)]',
      },
      validation: checkboxValidation,
    },
    defaultVariants: { size: 'm', validation: 'default' },
  },
);

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'className'>,
    VariantProps<typeof boxStyles> {
  label?: ReactNode;
  helperText?: ReactNode;
  validation?: Validation;
  className?: string;
}

export function Checkbox({
  size = 'm',
  validation = 'default',
  label,
  helperText,
  className,
  ...rest
}: CheckboxProps) {
  const box = (
    <BaseCheckbox.Root
      className={cn(boxStyles({ size, validation }), !label && !helperText && className)}
      {...rest}
    >
      {/* Indicator mirrors the root state as data-* attrs; show a dash for
          indeterminate, a check otherwise. */}
      <BaseCheckbox.Indicator className="group/ind flex items-center justify-center text-current">
        <CheckIcon className="group-data-[indeterminate]/ind:hidden" />
        <DashIcon className="hidden group-data-[indeterminate]/ind:block" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
  if (!label && !helperText) return box;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI checkbox button (a labelable control)
    <label
      className={cn(
        'inline-flex cursor-pointer items-start gap-[var(--spacing-08)] p-[var(--spacing-04)]',
        className,
      )}
    >
      {box}
      <span className="flex flex-col gap-[var(--spacing-06)]">
        {label ? <span className="text-[var(--text-primary)]">{label}</span> : null}
        {helperText ? <span className="text-sm text-[var(--text-muted)]">{helperText}</span> : null}
      </span>
    </label>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className={cn('size-3/4', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className={cn('size-3/4', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
