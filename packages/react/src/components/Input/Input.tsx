'use client';

import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import {
  type FieldVariant,
  fieldBorder,
  fieldError,
  fieldFill,
  fieldHelper,
  fieldHover,
  fieldInvalid,
  fieldInvalidFill,
  fieldLabel,
  fieldRoot,
  fieldText,
} from '../../utils/field.js';
import { useFormGroupSize } from '../../utils/form-group-size.js';

// Input frame (.Base-Input-Options → Input): owns the border, fill and focus
// border; the <input> inside is bare. Every dimension is -- Molecule/Input/Base
// Input/Size */*. Figma strokes are INSIDE the frame, so the padding gives back
// the stroke; the row is Icon Size tall (the <input> gets it too), so the frame
// is Padding Y + Icon Size + Padding Y = 40 / 44 / 56 as the master.
const frameStyles = cva(['flex w-full items-center', fieldBorder], {
  variants: {
    size: {
      s: 'min-w-(--input-base-input-size-s-min-width) gap-(--input-base-input-size-s-inner-gap) rounded-(--input-base-input-size-s-radius) border-(length:--input-base-input-size-s-stroke-weight) px-[calc(var(--input-base-input-size-s-padding-x)-var(--input-base-input-size-s-stroke-weight))] py-[calc(var(--input-base-input-size-s-padding-y)-var(--input-base-input-size-s-stroke-weight))] [&_svg]:size-(--input-base-input-size-s-icon-size)',
      m: 'min-w-(--input-base-input-size-m-min-width) gap-(--input-base-input-size-m-inner-gap) rounded-(--input-base-input-size-m-radius) border-(length:--input-base-input-size-m-stroke-weight) px-[calc(var(--input-base-input-size-m-padding-x)-var(--input-base-input-size-m-stroke-weight))] py-[calc(var(--input-base-input-size-m-padding-y)-var(--input-base-input-size-m-stroke-weight))] [&_svg]:size-(--input-base-input-size-m-icon-size)',
      l: 'min-w-(--input-base-input-size-l-min-width) gap-(--input-base-input-size-l-inner-gap) rounded-(--input-base-input-size-l-radius) border-(length:--input-base-input-size-l-stroke-weight) px-[calc(var(--input-base-input-size-l-padding-x)-var(--input-base-input-size-l-stroke-weight))] py-[calc(var(--input-base-input-size-l-padding-y)-var(--input-base-input-size-l-stroke-weight))] [&_svg]:size-(--input-base-input-size-l-icon-size)',
    },
  },
  defaultVariants: { size: 'm' },
});

// The <input>'s height = Icon Size, so the row never depends on the text's line box.
const inputHeight = {
  s: 'h-(--input-base-input-size-s-icon-size)',
  m: 'h-(--input-base-input-size-m-icon-size)',
  l: 'h-(--input-base-input-size-l-icon-size)',
} as const;

const itemsGap = {
  s: 'gap-(--input-base-input-size-s-items-gap)',
  m: 'gap-(--input-base-input-size-m-items-gap)',
  l: 'gap-(--input-base-input-size-l-items-gap)',
} as const;

// Shared with fields built on a Base Input frame (Date Input's trigger). Not public.
export { frameStyles as baseInputFrame, itemsGap as baseInputItemsGap };

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'size' | 'className'>,
    VariantProps<typeof frameStyles> {
  /** Primary = filled (`bg/default`), Secondary = outline only. */
  variant?: FieldVariant;
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

export function Input({
  label,
  helper,
  errorMessage,
  size: sizeProp,
  variant = 'primary',
  leadingIcon,
  trailingIcon,
  disabled,
  className,
  ...rest
}: InputProps) {
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
          isInvalid ? [fieldInvalid, fieldInvalidFill[variant]] : [fieldFill[variant], fieldHover],
        )}
      >
        {leadingIcon ? (
          <FieldIcon className={isInvalid ? 'text-[var(--status-danger-default)]' : undefined}>
            {leadingIcon}
          </FieldIcon>
        ) : null}
        <BaseInput
          className={cn(
            'min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed',
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

/** Decorative field icon in `text/muted`, sized by the frame's `[&_svg]` rule. */
export function FieldIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex shrink-0 text-[var(--text-muted)]', className)}
    >
      {children}
    </span>
  );
}
