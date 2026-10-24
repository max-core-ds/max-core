'use client';

import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { fieldError, fieldHelper, fieldLabel, fieldRoot } from '../../utils/field.js';
import { useFormGroupSize } from '../../utils/form-group-size.js';
import { FieldIcon } from '../Input/Input.js';

// Underline frame (.Bottom-Line-Input-Options → Input): no fill, radius none, a
// bottom stroke of -- Molecule/Input/Bottom Line/Size */Stroke Weight (thick, 2px).
// Padding X 12 and Inner Gap 8 at every size. Focus recolours the underline to
// border/focus (it's already 2px, so the hybrid focusBorder has nothing to add);
// hover → border/hover. The stroke is INSIDE in Figma, so the bottom padding
// gives back the 2px underline.
const frameStyles = cva(
  [
    'flex w-full items-center gap-[var(--spacing-08)] rounded-[var(--radius-none)] bg-transparent px-[var(--spacing-12)]',
    'border-0 border-b-[length:var(--border-weight-thick)] border-solid border-[var(--border-default)]',
    'text-[var(--text-primary)] transition-colors focus-within:border-[var(--border-focus)]',
  ],
  {
    variants: {
      size: {
        s: 'min-w-[160px] pt-[var(--spacing-12)] pb-[calc(var(--spacing-12)-var(--border-weight-thick))] [&_svg]:size-[var(--size-16)]',
        m: 'min-w-[180px] pt-[var(--spacing-12)] pb-[calc(var(--spacing-12)-var(--border-weight-thick))] [&_svg]:size-[var(--size-20)]',
        l: 'min-w-[200px] pt-[var(--spacing-16)] pb-[calc(var(--spacing-16)-var(--border-weight-thick))] [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Value + placeholder 12 / 14 / 16 regular (deviation from Caption/700, as Input).
const textSize = { s: 'text-xs', m: 'text-sm', l: 'text-base' } as const;

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
  return (
    <Field.Root className={cn(fieldRoot, className)} invalid={isInvalid} disabled={disabled}>
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
            textSize[size ?? 'm'],
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
