'use client';

import { NumberField } from '@base-ui/react/number-field';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

const groupStyles =
  'inline-flex items-stretch overflow-hidden rounded-[var(--radius-md)] ' +
  'border border-[var(--border-default)] bg-[var(--bg-surface)] ' +
  'focus-within:border-[var(--border-focus)] transition-colors';

// Hit Area Padding X per size (4/6/8) on the ± buttons.
const buttonStyles = cva(
  [
    'inline-flex select-none items-center justify-center',
    'bg-[var(--bg-subtle)] text-[var(--text-primary)] transition-colors',
    'hover:bg-[var(--neutral-subtle)] disabled:opacity-[var(--opacity-disabled)]',
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
