'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Box size comes from the shared Global/Size tokens (16/24); radius is xs.
// A <label> is a labelable wrapper so clicking the text toggles the button.
const boxStyles = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
    'text-[var(--text-on-accent)] transition-colors',
    'data-[checked]:border-[var(--accent-default)] data-[checked]:bg-[var(--accent-default)]',
    'data-[indeterminate]:border-[var(--accent-default)] data-[indeterminate]:bg-[var(--accent-default)]',
    focusRing,
    'data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'size-[var(--spacing-16)]',
        m: 'size-[var(--spacing-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'className'>,
    VariantProps<typeof boxStyles> {
  label?: ReactNode;
  className?: string;
}

export function Checkbox({ size = 'm', label, className, ...rest }: CheckboxProps) {
  const box = (
    <BaseCheckbox.Root className={cn(boxStyles({ size }), !label && className)} {...rest}>
      <BaseCheckbox.Indicator className="flex items-center justify-center text-current">
        <CheckIcon />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
  if (!label) return box;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI checkbox button (a labelable control)
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-[var(--spacing-06)] p-[var(--spacing-04)] text-[var(--text-primary)]',
        className,
      )}
    >
      {box}
      <span>{label}</span>
    </label>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className="size-3/4"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
