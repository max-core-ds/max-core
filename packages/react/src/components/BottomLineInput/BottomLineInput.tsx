'use client';

import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Underline field: radius none + a thick bottom border (Bottom Line/Radius =
// none, Stroke = thick). Focus recolors the underline.
const inputStyles = cva(
  [
    'w-full rounded-[var(--radius-none)] bg-transparent px-0',
    'border-0 border-b-2 border-[var(--border-default)]',
    'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
    'transition-colors focus:outline-none focus:border-[var(--border-focus)]',
    'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
    'data-[invalid]:border-[var(--status-danger-default)]',
  ],
  {
    variants: {
      size: {
        s: 'py-[var(--spacing-12)] text-xs',
        m: 'py-[var(--spacing-12)] text-sm',
        l: 'py-[var(--spacing-16)] text-base',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface BottomLineInputProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'size'>,
    VariantProps<typeof inputStyles> {
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
}

export function BottomLineInput({
  label,
  helper,
  errorMessage,
  size,
  className,
  ...rest
}: BottomLineInputProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root className="flex flex-col gap-[var(--spacing-04)]" invalid={isInvalid}>
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
