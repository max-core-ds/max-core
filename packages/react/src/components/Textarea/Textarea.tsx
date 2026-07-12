'use client';

import { Field } from '@base-ui/react/field';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { fieldSurface } from '../../utils/field.js';
import { focusRingInset } from '../../utils/focus-ring.js';

// Radius/padding follow the Input Global tokens; per-size Min Height is a raw
// px value in Figma (96/120/160).
const textareaStyles = cva(
  ['w-full resize-y rounded-[var(--radius-md)] px-[var(--spacing-12)]', fieldSurface],
  {
    variants: {
      size: {
        s: 'min-h-[96px] py-[var(--spacing-12)] text-xs',
        m: 'min-h-[120px] py-[var(--spacing-12)] text-sm',
        l: 'min-h-[160px] py-[var(--spacing-16)] text-base',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface TextareaProps
  extends Omit<ComponentPropsWithoutRef<'textarea'>, 'size'>,
    VariantProps<typeof textareaStyles> {
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
}

export function Textarea({ label, helper, errorMessage, size, className, ...rest }: TextareaProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root className="flex flex-col gap-[var(--spacing-04)]" invalid={isInvalid}>
      {label ? (
        <Field.Label className="text-sm font-bold text-[var(--text-primary)]">{label}</Field.Label>
      ) : null}
      {/* Input frame hosts the inset -3px focus ring (focus-within on this wrapper). */}
      <div className={cn('relative w-full rounded-[var(--radius-md)]', focusRingInset)}>
        <Field.Control
          render={<textarea className={cn(textareaStyles({ size }), className)} {...rest} />}
        />
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
