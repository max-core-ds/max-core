'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useId } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { type Validation, checkboxValidation } from '../../utils/validation.js';

// Box size = Selection Control/Global/Size S|M; Radius + Border Weight = the
// Checkbox's own tokens. Color comes from the Validation axis
// (Default/Error/Warning/Success). A <label> wraps the button so clicking the
// text/helper toggles it.
const boxStyles = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-(--selection-control-checkbox-radius)',
    'border-solid border-(length:--selection-control-checkbox-border-weight)',
    'text-[var(--text-on-accent)] transition-colors',
    focusRing,
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'size-(--selection-control-global-size-s)',
        m: 'size-(--selection-control-global-size-m)',
      },
      validation: checkboxValidation,
    },
    defaultVariants: { size: 'm', validation: 'default' },
  },
);

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'className'>,
    VariantProps<typeof boxStyles> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  validation?: Validation;
  className?: string;
}

export function Checkbox({
  size = 'm',
  validation = 'default',
  label,
  helperText,
  errorMessage,
  className,
  ...rest
}: CheckboxProps) {
  // An error message forces the error color and takes precedence over helperText.
  const effectiveValidation: Validation = errorMessage ? 'error' : validation;
  const hasText = Boolean(label || helperText || errorMessage);
  // Link the helper/error text to the control so it's announced with it.
  const descId = useId();
  const describedBy = errorMessage || helperText ? descId : undefined;
  const box = (
    <BaseCheckbox.Root
      className={cn(boxStyles({ size, validation: effectiveValidation }), !hasText && className)}
      aria-describedby={describedBy}
      {...rest}
    >
      {/* Indicator mirrors the root state as data-* attrs; show a dash for
          indeterminate, a check otherwise. */}
      <BaseCheckbox.Indicator className="group/ind flex items-center justify-center text-current">
        <CheckIcon className="group-data-[indeterminate]/ind:hidden" />
        <DashIcon className="hidden group-data-[indeterminate]/ind:block" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
  if (!hasText) return box;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI checkbox button (a labelable control)
    <label
      className={cn(
        'inline-flex cursor-pointer items-start gap-(--selection-control-checkbox-checkbox-gap) p-(--selection-control-global-padding)',
        className,
      )}
    >
      {box}
      {/* Label Body/SM/300; helper/error Caption/300 (helper in text/secondary),
          cap-trimmed by the type-* utilities. The control is top-aligned with the label. */}
      <span className="flex flex-col gap-(--selection-control-checkbox-text-gap)">
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
 * Visual-only Checkbox (Size S, Default) for option rows whose row is the
 * interactive element (Multiselect list). Follows the row's `data-selected`;
 * the row must carry `group/option` (see `listItemOption`).
 */
export function CheckboxMark() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-(--selection-control-global-size-s) shrink-0 items-center justify-center',
        'rounded-(--selection-control-checkbox-radius) border-solid border-(length:--selection-control-checkbox-border-weight)',
        'border-[var(--border-default)] bg-[var(--bg-default)] text-[var(--text-on-accent)]',
        'group-data-[selected]/option:border-[var(--border-accent)] group-data-[selected]/option:bg-[var(--accent-default)]',
      )}
    >
      <CheckIcon className="hidden group-data-[selected]/option:block" />
    </span>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className={cn('size-3/4', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className={cn('size-3/4', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
