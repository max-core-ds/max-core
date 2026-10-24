'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useId } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { type Validation, switchKnobValidation, switchValidation } from '../../utils/validation.js';

// Track width from Switch/Width (32/40); Knob Padding (2) insets the knob
// horizontally; Border Width thin; radius full. Track height (18/22) and knob
// size (14/18) are untokenized in Figma — Tailwind scale. Colors (track + knob)
// come from the Validation axis. Knob travel = width − 2·border − 2·padding − knob.
const trackStyles = cva(
  [
    'group/switch relative inline-flex shrink-0 items-center rounded-[var(--radius-full)] border px-[var(--spacing-02)]',
    'transition-colors',
    focusRing,
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'h-4.5 w-[var(--size-32)]',
        m: 'h-5.5 w-[var(--size-40)]',
      },
      validation: switchValidation,
    },
    defaultVariants: { size: 'm', validation: 'default' },
  },
);

// Knob: validation color when off, on-accent when on; Pressed (off) = frosted
// glass. Figma's effect/blur/xs isn't exported as a token — backdrop-blur-xs.
const thumbStyles = cva(
  [
    'block rounded-[var(--radius-full)] border transition',
    'group-active/switch:data-[unchecked]:backdrop-blur-xs',
  ],
  {
    variants: {
      size: {
        s: 'size-3.5 data-[checked]:translate-x-3',
        m: 'size-4.5 data-[checked]:translate-x-4',
      },
      validation: switchKnobValidation,
    },
    defaultVariants: { size: 'm', validation: 'default' },
  },
);

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseSwitch.Root>, 'className'>,
    VariantProps<typeof trackStyles> {
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  validation?: Validation;
  className?: string;
}

export function Switch({
  size = 'm',
  validation = 'default',
  label,
  helperText,
  errorMessage,
  className,
  ...rest
}: SwitchProps) {
  // An error message forces the error color and takes precedence over helperText.
  const effectiveValidation: Validation = errorMessage ? 'error' : validation;
  const hasText = Boolean(label || helperText || errorMessage);
  // Link the helper/error text to the control so it's announced with it.
  const descId = useId();
  const describedBy = errorMessage || helperText ? descId : undefined;
  const track = (
    <BaseSwitch.Root
      className={cn(trackStyles({ size, validation: effectiveValidation }), !hasText && className)}
      aria-describedby={describedBy}
      {...rest}
    >
      <BaseSwitch.Thumb className={thumbStyles({ size, validation: effectiveValidation })} />
    </BaseSwitch.Root>
  );
  if (!hasText) return track;
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: wraps the Base UI switch button (a labelable control)
    <label className="inline-flex cursor-pointer items-start gap-[var(--spacing-08)] p-[var(--spacing-04)]">
      {track}
      {/* Label Body/MD/300; helper/error Caption/300 (helper in text/secondary).
          The control is top-aligned with the label (Figma centres it — deliberate). */}
      <span className="flex flex-col gap-[var(--spacing-06)]">
        {label ? (
          <span className="text-base font-light text-[var(--text-primary)]">{label}</span>
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
