'use client';

import { Field } from '@base-ui/react/field';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import {
  fieldBorder,
  fieldError,
  fieldHelper,
  fieldHover,
  fieldInvalid,
  fieldLabel,
  fieldRoot,
} from '../../utils/field.js';

// .Textarea-Options → Input: bg/surface fill (unlike Base Input's bg/default),
// Radius md + Padding X 12 per -- Molecule/Input/Textarea/Size */*; per-size
// Min Width / Min Height are raw px in Figma (160·96 / 180·120 / 200·160).
// The textarea owns the border, so focusBorder (focus-within) applies to it.
const textareaStyles = cva(
  [
    'block w-full resize-y rounded-[var(--radius-md)] px-[calc(var(--spacing-12)-var(--border-weight-thin))]',
    fieldBorder,
  ],
  {
    variants: {
      // Text 12 / 14 / 16 regular (deviation from the master's Caption/300, as Input).
      size: {
        s: 'min-h-[96px] min-w-[160px] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-xs',
        m: 'min-h-[120px] min-w-[180px] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-sm',
        l: 'min-h-[160px] min-w-[200px] py-[calc(var(--spacing-16)-var(--border-weight-thin))] text-base',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface TextareaProps
  extends Omit<ComponentPropsWithoutRef<'textarea'>, 'size' | 'className'>,
    VariantProps<typeof textareaStyles> {
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
  /** Applied to the field wrapper (label + textarea + helper). */
  className?: string;
}

export function Textarea({
  label,
  helper,
  errorMessage,
  size,
  disabled,
  className,
  ...rest
}: TextareaProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root className={cn(fieldRoot, className)} invalid={isInvalid} disabled={disabled}>
      {label ? <Field.Label className={fieldLabel(isInvalid)}>{label}</Field.Label> : null}
      <Field.Control
        render={
          <textarea
            className={cn(
              textareaStyles({ size }),
              isInvalid
                ? [fieldInvalid, 'bg-[var(--status-danger-subtle)]']
                : ['bg-[var(--bg-surface)]', fieldHover],
            )}
            {...rest}
          />
        }
      />
      {errorMessage ? (
        <Field.Error match={true} className={fieldError}>
          {errorMessage}
        </Field.Error>
      ) : helper ? (
        <Field.Description className={fieldHelper}>{helper}</Field.Description>
      ) : null}
    </Field.Root>
  );
}
