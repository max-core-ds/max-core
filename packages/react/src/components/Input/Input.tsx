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
} from '../../utils/field.js';
import { useFormGroupSize } from '../../utils/form-group-size.js';

// Input frame (.Base-Input-Options → Input): owns the border, fill and focus
// border; the <input> inside is bare. Figma strokes are INSIDE the frame, so the
// padding gives back the 1px border (outer size = token padding + line height). Radius, Padding X and Inner Gap match
// -- Molecule/Input/Base Input/Size */* (md / 12 / 8 at every size).
const frameStyles = cva(
  [
    'flex w-full items-center gap-[var(--spacing-08)] rounded-[var(--radius-md)] px-[calc(var(--spacing-12)-var(--border-weight-thin))]',
    fieldBorder,
  ],
  {
    variants: {
      // Padding Y, Min Width (raw px in Figma) and Icon Size per Size. Height is
      // padding-driven: 40 / 44 / 56 with the text line height.
      size: {
        s: 'min-w-[160px] py-[calc(var(--spacing-12)-var(--border-weight-thin))] [&_svg]:size-[var(--size-16)]',
        m: 'min-w-[180px] py-[calc(var(--spacing-12)-var(--border-weight-thin))] [&_svg]:size-[var(--size-20)]',
        l: 'min-w-[200px] py-[calc(var(--spacing-16)-var(--border-weight-thin))] [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Value + placeholder text: 12 / 14 / 16 regular. The master's Caption/700 /
// Body/MD/700 placeholder is a deliberate deviation (decision 2026-10-24).
const textSize = { s: 'text-xs', m: 'text-sm', l: 'text-base' } as const;

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
    <Field.Root className={cn(fieldRoot, className)} invalid={isInvalid} disabled={disabled}>
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
            textSize[sizeKey],
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
