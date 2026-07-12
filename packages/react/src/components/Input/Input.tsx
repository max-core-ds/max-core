'use client';

import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { fieldSurface } from '../../utils/field.js';
import { focusRingInset } from '../../utils/focus-ring.js';

const inputStyles = cva(
  [
    // Radius and padding-x match -- Molecule/Input/Global/General/*; the shared
    // fill/border/focus/disabled treatment comes from fieldSurface. The focus
    // ring lives on the wrapper frame (focusRingInset), not here.
    'w-full rounded-[var(--radius-md)] px-[var(--spacing-12)]',
    fieldSurface,
  ],
  {
    variants: {
      // Padding-y + min-width match -- Molecule/Input/Global/Size */*. Height is
      // padding-driven (Figma Input has no height token); min-widths are raw px.
      size: {
        s: 'min-w-[160px] py-[var(--spacing-12)] text-xs',
        m: 'min-w-[180px] py-[var(--spacing-12)] text-sm',
        l: 'min-w-[200px] py-[var(--spacing-16)] text-base',
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

export function Input({ label, helper, errorMessage, size, className, ...rest }: InputProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root className="flex flex-col gap-[var(--spacing-04)]" invalid={isInvalid}>
      {label ? (
        <Field.Label className="text-sm font-bold text-[var(--text-primary)]">{label}</Field.Label>
      ) : null}
      {/* Input frame: hosts the inset -3px focus ring (an <input> can't carry a
          ::before). The ring hugs the field and is unaffected by title/helper. */}
      <div className={cn('relative w-full rounded-[var(--radius-md)]', focusRingInset)}>
        <BaseInput className={cn(inputStyles({ size }), className)} {...rest} />
      </div>
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
