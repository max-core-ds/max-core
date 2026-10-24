'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useId } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { type Validation, radioValidation } from '../../utils/validation.js';

export interface RadioGroupProps extends ComponentPropsWithoutRef<typeof BaseRadioGroup> {
  /** Group-level label rendered above the radios. */
  label?: ReactNode;
  /** Group-level helper text, shown when there is no error. */
  helperText?: ReactNode;
  /** Group-level error message; when set it renders below the radios in danger color. */
  errorMessage?: ReactNode;
}

// Item Gap (8) between radios.
export function RadioGroup({
  className,
  label,
  helperText,
  errorMessage,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: RadioGroupProps) {
  const labelId = useId();
  const hasText = Boolean(label || helperText || errorMessage);
  const group = (
    <BaseRadioGroup
      className={cn('flex flex-col gap-[var(--spacing-08)]', className)}
      aria-labelledby={label ? (ariaLabelledBy ?? labelId) : ariaLabelledBy}
      {...rest}
    />
  );
  if (!hasText) return group;
  return (
    <div className="flex flex-col gap-[var(--spacing-06)]">
      {label ? (
        <span id={labelId} className="text-sm font-bold text-[var(--text-primary)]">
          {label}
        </span>
      ) : null}
      {group}
      {errorMessage ? (
        <span className="text-sm text-[var(--status-danger-default)]">{errorMessage}</span>
      ) : helperText ? (
        <span className="text-sm text-[var(--text-muted)]">{helperText}</span>
      ) : null}
    </div>
  );
}

// Box size from Selection Control/Global/Size (16/24); the dot is the box inset
// by the per-size Dot Padding (2 / 4) and takes the box's `text-` color
// (bg-current). Color + border come from the Validation axis. Radius full.
const boxStyles = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-[var(--radius-full)] border',
    'transition-colors',
    focusRing,
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'size-[var(--size-16)] p-[var(--spacing-02)]',
        m: 'size-[var(--size-24)] p-[var(--spacing-04)]',
      },
      validation: radioValidation,
    },
    defaultVariants: { size: 'm', validation: 'default' },
  },
);

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'className'>,
    VariantProps<typeof boxStyles> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  validation?: Validation;
  className?: string;
}

export function Radio({
  size = 'm',
  validation = 'default',
  label,
  helperText,
  errorMessage,
  className,
  ...rest
}: RadioProps) {
  // An error message forces the error color and takes precedence over helperText.
  const effectiveValidation: Validation = errorMessage ? 'error' : validation;
  const hasText = Boolean(label || helperText || errorMessage);
  // Link the helper/error text to the control so it's announced with it.
  const descId = useId();
  const describedBy = errorMessage || helperText ? descId : undefined;
  const box = (
    <BaseRadio.Root
      className={cn(boxStyles({ size, validation: effectiveValidation }), !hasText && className)}
      aria-describedby={describedBy}
      {...rest}
    >
      <BaseRadio.Indicator className="size-full rounded-[var(--radius-full)] bg-current" />
    </BaseRadio.Root>
  );
  if (!hasText) return box;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI radio button (a labelable control)
    <label className="inline-flex cursor-pointer items-start gap-[var(--spacing-08)] p-[var(--spacing-04)]">
      {box}
      {/* Label Body/SM/300; helper/error Caption/300 (helper in text/secondary).
          The control is top-aligned with the label (Figma centres it — deliberate). */}
      <span className="flex flex-col gap-[var(--spacing-06)]">
        {label ? (
          <span className="text-sm font-light text-[var(--text-primary)]">{label}</span>
        ) : null}
        {errorMessage ? (
          <span id={descId} className="text-xs font-light text-[var(--status-danger-default)]">
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={descId} className="text-xs font-light text-[var(--text-secondary)]">
            {helperText}
          </span>
        ) : null}
      </span>
    </label>
  );
}
