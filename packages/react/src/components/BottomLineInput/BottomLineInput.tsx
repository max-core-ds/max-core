'use client';

import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { fieldError, fieldHelper, fieldLabel, fieldRoot, fieldText } from '../../utils/field.js';
import { useFormGroupSize } from '../../utils/form-group-size.js';
import { FieldIcon } from '../Input/Input.js';

// Underline frame (.Bottom-Line-Input-Options → Input): no fill, a bottom stroke
// only, every dimension from -- Molecule/Input/Bottom Line/Size */* (Radius none,
// Stroke Weight thick = 2px, Padding X 12, Inner Gap 8). Focus recolours the
// underline to border/focus (it's already 2px, so the hybrid focusBorder has
// nothing to add); hover → border/hover. The stroke is INSIDE in Figma, so the
// bottom padding gives it back; the row is Icon Size tall → 40 / 44 / 56 (the S
// master reads 44, a copy of M — flagged for Max).
const frameStyles = cva(
  [
    'flex w-full items-center bg-transparent border-0 border-solid border-[var(--border-default)]',
    'text-[var(--text-primary)] transition-colors focus-within:border-[var(--border-focus)]',
  ],
  {
    variants: {
      size: {
        s: 'min-w-(--input-bottom-line-size-s-min-width) gap-(--input-bottom-line-size-s-inner-gap) rounded-(--input-bottom-line-size-s-radius) border-b-(length:--input-bottom-line-size-s-stroke-weight) px-(--input-bottom-line-size-s-padding-x) pt-(--input-bottom-line-size-s-padding-y) pb-[calc(var(--input-bottom-line-size-s-padding-y)-var(--input-bottom-line-size-s-stroke-weight))] [&_svg]:size-(--input-bottom-line-size-s-icon-size)',
        m: 'min-w-(--input-bottom-line-size-m-min-width) gap-(--input-bottom-line-size-m-inner-gap) rounded-(--input-bottom-line-size-m-radius) border-b-(length:--input-bottom-line-size-m-stroke-weight) px-(--input-bottom-line-size-m-padding-x) pt-(--input-bottom-line-size-m-padding-y) pb-[calc(var(--input-bottom-line-size-m-padding-y)-var(--input-bottom-line-size-m-stroke-weight))] [&_svg]:size-(--input-bottom-line-size-m-icon-size)',
        l: 'min-w-(--input-bottom-line-size-l-min-width) gap-(--input-bottom-line-size-l-inner-gap) rounded-(--input-bottom-line-size-l-radius) border-b-(length:--input-bottom-line-size-l-stroke-weight) px-(--input-bottom-line-size-l-padding-x) pt-(--input-bottom-line-size-l-padding-y) pb-[calc(var(--input-bottom-line-size-l-padding-y)-var(--input-bottom-line-size-l-stroke-weight))] [&_svg]:size-(--input-bottom-line-size-l-icon-size)',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

const inputHeight = {
  s: 'h-(--input-bottom-line-size-s-icon-size)',
  m: 'h-(--input-bottom-line-size-m-icon-size)',
  l: 'h-(--input-bottom-line-size-l-icon-size)',
} as const;

const itemsGap = {
  s: 'gap-(--input-bottom-line-size-s-items-gap)',
  m: 'gap-(--input-bottom-line-size-m-items-gap)',
  l: 'gap-(--input-bottom-line-size-l-items-gap)',
} as const;

export interface BottomLineInputProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'size' | 'className'>,
    VariantProps<typeof frameStyles> {
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
  /** Icon before the value (Figma: Show Leading / Left Icon). */
  leadingIcon?: ReactNode;
  /** Icon after the value (Figma: Show Trailing / Right Icon). */
  trailingIcon?: ReactNode;
  /** Applied to the field wrapper (label + frame + helper). */
  className?: string;
}

export function BottomLineInput({
  label,
  helper,
  errorMessage,
  size: sizeProp,
  leadingIcon,
  trailingIcon,
  disabled,
  className,
  ...rest
}: BottomLineInputProps) {
  const size = useFormGroupSize(sizeProp);
  const isInvalid = Boolean(errorMessage);
  const sizeKey = size ?? 'm';
  return (
    <Field.Root
      className={cn(fieldRoot, itemsGap[sizeKey], className)}
      invalid={isInvalid}
      disabled={disabled}
    >
      {label ? <Field.Label className={fieldLabel(isInvalid)}>{label}</Field.Label> : null}
      <div
        className={cn(
          frameStyles({ size }),
          isInvalid
            ? 'border-[var(--status-danger-border)]'
            : 'hover:not-focus-within:not-has-[:disabled]:border-[var(--border-hover)]',
        )}
      >
        {leadingIcon ? (
          <FieldIcon className={isInvalid ? 'text-[var(--status-danger-default)]' : undefined}>
            {leadingIcon}
          </FieldIcon>
        ) : null}
        <BaseInput
          className={cn(
            'min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed',
            isInvalid
              ? 'placeholder:text-[var(--status-danger-default)]'
              : 'placeholder:text-[var(--text-muted)]',
            fieldText[sizeKey],
            inputHeight[sizeKey],
          )}
          {...rest}
        />
        {trailingIcon ? <FieldIcon>{trailingIcon}</FieldIcon> : null}
      </div>
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
