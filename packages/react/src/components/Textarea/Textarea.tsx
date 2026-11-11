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
import { useFormGroupSize } from '../../utils/form-group-size.js';

// .Textarea-Options → Input: bg/surface fill (unlike Base Input's bg/default);
// every dimension from -- Molecule/Input/Textarea/Size */* (Min Height 96 / 120 /
// 160). Text per size as the other fields (Caption/300, Body/SM/300, Body/MD/300).
// The textarea owns the border, so focusBorder (focus-within) applies to it.
const textareaStyles = cva(['block w-full resize-y', fieldBorder], {
  variants: {
    size: {
      s: 'min-h-(--input-textarea-size-s-min-height) min-w-(--input-textarea-size-s-min-width) rounded-(--input-textarea-size-s-radius) border-(length:--input-textarea-size-s-stroke-weight) px-[calc(var(--input-textarea-size-s-padding-x)-var(--input-textarea-size-s-stroke-weight))] py-[calc(var(--input-textarea-size-s-padding-y)-var(--input-textarea-size-s-stroke-weight))] type-caption-300',
      m: 'min-h-(--input-textarea-size-m-min-height) min-w-(--input-textarea-size-m-min-width) rounded-(--input-textarea-size-m-radius) border-(length:--input-textarea-size-m-stroke-weight) px-[calc(var(--input-textarea-size-m-padding-x)-var(--input-textarea-size-m-stroke-weight))] py-[calc(var(--input-textarea-size-m-padding-y)-var(--input-textarea-size-m-stroke-weight))] type-body-sm-300',
      l: 'min-h-(--input-textarea-size-l-min-height) min-w-(--input-textarea-size-l-min-width) rounded-(--input-textarea-size-l-radius) border-(length:--input-textarea-size-l-stroke-weight) px-[calc(var(--input-textarea-size-l-padding-x)-var(--input-textarea-size-l-stroke-weight))] py-[calc(var(--input-textarea-size-l-padding-y)-var(--input-textarea-size-l-stroke-weight))] type-body-md-300',
    },
  },
  defaultVariants: { size: 'm' },
});

const itemsGap = {
  s: 'gap-(--input-textarea-size-s-items-gap)',
  m: 'gap-(--input-textarea-size-m-items-gap)',
  l: 'gap-(--input-textarea-size-l-items-gap)',
} as const;

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
  size: sizeProp,
  disabled,
  className,
  ...rest
}: TextareaProps) {
  const size = useFormGroupSize(sizeProp);
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root
      className={cn(fieldRoot, itemsGap[size ?? 'm'], className)}
      invalid={isInvalid}
      disabled={disabled}
    >
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
