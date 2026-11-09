'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ElementRef, type ReactNode, forwardRef } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useFormGroupSize } from '../../utils/form-group-size.js';
import { elevatePress, stateLayer } from '../../utils/state-layer.js';
import { statusBg, statusOutline, statusText, statusToneCompounds } from '../../utils/tone.js';

const buttonStyles = cva(
  [
    'relative isolate inline-flex items-center justify-center',
    'whitespace-nowrap',
    'min-w-(--buttons-global-standard-min-width)',
    'transition',
    // Hover/press feedback: a mode-aware state-layer overlay plus elevation —
    // the SAME mechanism for every tone, not per-tone background swaps. The
    // overlay is a ::before behind the content, so `relative isolate` above is
    // required. See utils/state-layer.ts and utils/focus-ring.ts.
    stateLayer,
    elevatePress,
    focusRing,
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      // Border widths are the Figma tokens: Primary Border Width (none today,
      // stroke `border/default`) and Secondary Border Width (thin). Ghost has no
      // stroke and, like Secondary, no fill.
      variant: {
        primary:
          'border-solid border-(length:--buttons-global-primary-border-width) border-[var(--border-default)] text-[var(--text-on-accent)]',
        secondary:
          'border-solid border-(length:--buttons-global-secondary-border-width) bg-transparent text-[var(--text-primary)]',
        ghost: 'bg-transparent text-[var(--text-primary)]',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },
      // Every dimension is the button's own Figma token
      // (-- Atoms/Buttons/Standard Button/<size>/*, which alias Global/Size <size>/*).
      // Label type: S/M Caption/700, L Body/SM/700, XL Body/MD/700.
      size: {
        s: 'h-(--buttons-standard-button-s-height) gap-(--buttons-standard-button-s-gap) px-(--buttons-standard-button-s-padding-x) py-(--buttons-standard-button-s-padding-y) rounded-(--buttons-standard-button-s-radius) [&_svg]:size-(--buttons-standard-button-s-icon-size) type-caption-700',
        m: 'h-(--buttons-standard-button-m-height) gap-(--buttons-standard-button-m-gap) px-(--buttons-standard-button-m-padding-x) py-(--buttons-standard-button-m-padding-y) rounded-(--buttons-standard-button-m-radius) [&_svg]:size-(--buttons-standard-button-m-icon-size) type-caption-700',
        l: 'h-(--buttons-standard-button-l-height) gap-(--buttons-standard-button-l-gap) px-(--buttons-standard-button-l-padding-x) py-(--buttons-standard-button-l-padding-y) rounded-(--buttons-standard-button-l-radius) [&_svg]:size-(--buttons-standard-button-l-icon-size) type-body-sm-700',
        xl: 'h-(--buttons-standard-button-xl-height) gap-(--buttons-standard-button-xl-gap) px-(--buttons-standard-button-xl-padding-x) py-(--buttons-standard-button-xl-padding-y) rounded-(--buttons-standard-button-xl-radius) [&_svg]:size-(--buttons-standard-button-xl-icon-size) type-body-md-700',
      },
    },
    // Tone sets only the resting fill/border/text. Hover & press are handled
    // uniformly by the shared state-layer overlay + elevation in the base. The
    // three status tones come from statusToneCompounds; `default` (brand accent)
    // stays bespoke per variant.
    compoundVariants: [
      // Primary — tone-colored fill.
      { variant: 'primary', tone: 'default', class: 'bg-[var(--accent-default)]' },
      ...statusToneCompounds('primary', statusBg),
      // Secondary — no fill, tone-colored border + text (Figma: border/accent + text/accent).
      {
        variant: 'secondary',
        tone: 'default',
        class: 'border-[var(--border-accent)] text-[var(--text-accent)]',
      },
      ...statusToneCompounds('secondary', statusOutline),
      // Ghost — transparent fill, tone-colored text (Figma: text/accent).
      { variant: 'ghost', tone: 'default', class: 'text-[var(--text-accent)]' },
      ...statusToneCompounds('ghost', statusText),
    ],
    defaultVariants: {
      variant: 'primary',
      tone: 'default',
      size: 'm',
    },
  },
);

type BaseButtonProps = ComponentPropsWithoutRef<typeof BaseButton>;

export interface ButtonProps
  extends Omit<BaseButtonProps, 'children'>,
    VariantProps<typeof buttonStyles> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

// forwardRef so the button can anchor Base UI popups (Tooltip/Dropdown/Dialog
// triggers pass a ref to position against).
export const Button = forwardRef<ElementRef<typeof BaseButton>, ButtonProps>(function Button(
  { variant, tone, size: sizeProp, className, leftIcon, rightIcon, children, ...rest },
  ref,
) {
  const size = useFormGroupSize(sizeProp);
  return (
    <BaseButton
      ref={ref}
      className={cn(buttonStyles({ variant, tone, size }), className)}
      {...rest}
    >
      {leftIcon}
      {children != null && children !== false ? <span className={capTrim}>{children}</span> : null}
      {rightIcon}
    </BaseButton>
  );
});
