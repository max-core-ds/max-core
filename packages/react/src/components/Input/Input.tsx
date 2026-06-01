'use client';

import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

const inputStyles = cva(
  [
    'w-full',
    'rounded-[var(--radius-l)]',
    'bg-[var(--bg-surface)] text-[var(--text-primary)]',
    'border border-[var(--border-default)]',
    'placeholder:text-[var(--text-muted)]',
    'transition-colors',
    'focus:outline-none focus:border-[var(--border-focus)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-default)]',
    'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed',
    'data-[invalid]:border-[var(--status-danger-default)]',
  ],
  {
    variants: {
      size: {
        s: 'h-[var(--size-32)] px-[var(--spacing-12)] text-xs',
        m: 'h-[var(--size-40)] px-[var(--spacing-16)] text-sm',
        l: 'h-[var(--size-48)] px-[var(--spacing-20)] text-base',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  },
);

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'size'>,
    VariantProps<typeof inputStyles> {
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
}

export function Input({
  label,
  helper,
  errorMessage,
  size,
  className,
  ...rest
}: InputProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root
      className="flex flex-col gap-[var(--spacing-04)]"
      invalid={isInvalid}
    >
      {label ? (
        <Field.Label className="text-sm font-bold text-[var(--text-primary)]">{label}</Field.Label>
      ) : null}
      <BaseInput className={cn(inputStyles({ size }), className)} {...rest} />
      {errorMessage ? (
        <Field.Error className="text-xs text-[var(--status-danger-default)]">
          {errorMessage}
        </Field.Error>
      ) : helper ? (
        <Field.Description className="text-xs text-[var(--text-muted)]">{helper}</Field.Description>
      ) : null}
    </Field.Root>
  );
}
