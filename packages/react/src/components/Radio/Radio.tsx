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

// Radio Button Gap between radios; group label Body/SM/700, helper/error Caption/300.
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
      className={cn(
        'flex flex-col gap-(--selection-control-radio-button-radio-button-gap)',
        className,
      )}
      aria-labelledby={label ? (ariaLabelledBy ?? labelId) : ariaLabelledBy}
      {...rest}
    />
  );
  if (!hasText) return group;
  return (
    <div className="flex flex-col gap-(--selection-control-radio-button-text-gap)">
      {label ? (
        <span id={labelId} className="type-body-sm-700 text-[var(--text-primary)]">
          {label}
        </span>
      ) : null}
      {group}
      {errorMessage ? (
        <span className="type-caption-300 text-[var(--status-danger-default)]">{errorMessage}</span>
      ) : helperText ? (
        <span className="type-caption-300 text-[var(--text-secondary)]">{helperText}</span>
      ) : null}
    </div>
  );
}

// Box size = Selection Control/Global/Size S|M; the dot is the box inset by the
// per-size Dot Padding and takes the box's `text-` color (bg-current). Radius +
// Border Weight = the Radio Button's own tokens; colors from the Validation axis.
const boxStyles = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-(--selection-control-radio-button-radius)',
    'border-solid border-(length:--selection-control-radio-button-border-weight)',
    'transition-colors',
    focusRing,
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'size-(--selection-control-global-size-s) p-(--selection-control-radio-button-dot-padding-s)',
        m: 'size-(--selection-control-global-size-m) p-(--selection-control-radio-button-dot-padding-m)',
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
      <BaseRadio.Indicator className="size-full rounded-(--selection-control-radio-button-radius) bg-current" />
    </BaseRadio.Root>
  );
  if (!hasText) return box;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI radio button (a labelable control)
    <label className="inline-flex cursor-pointer items-start gap-(--selection-control-radio-button-radio-button-gap) p-(--selection-control-global-padding)">
      {box}
      {/* Label Body/SM/300; helper/error Caption/300 (helper in text/secondary),
          cap-trimmed by the type-* utilities. The control is top-aligned with the label. */}
      <span className="flex flex-col gap-(--selection-control-radio-button-text-gap)">
        {label ? (
          <span className="type-body-sm-300 text-[var(--text-primary)]">{label}</span>
        ) : null}
        {errorMessage ? (
          <span id={descId} className="type-caption-300 text-[var(--status-danger-default)]">
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={descId} className="type-caption-300 text-[var(--text-secondary)]">
            {helperText}
          </span>
        ) : null}
      </span>
    </label>
  );
}

/**
 * Visual-only Radio (Size S, Default) for option rows whose row is the
 * interactive element (Select list). The dot shows on the row's `data-selected`;
 * the row must carry `group/option` (see `listItemOption`).
 */
export function RadioMark() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-(--selection-control-global-size-s) shrink-0 items-center justify-center p-(--selection-control-radio-button-dot-padding-s)',
        'rounded-(--selection-control-radio-button-radius) border-solid border-(length:--selection-control-radio-button-border-weight)',
        'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--accent-default)]',
      )}
    >
      <span className="hidden size-full rounded-(--selection-control-radio-button-radius) bg-current group-data-[selected]/option:block" />
    </span>
  );
}
