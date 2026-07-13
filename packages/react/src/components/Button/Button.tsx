'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ElementRef, type ReactNode, forwardRef } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { elevatePress, stateLayer } from '../../utils/state-layer.js';
import { statusBg, statusOutline, statusText, statusToneCompounds } from '../../utils/tone.js';

const buttonStyles = cva(
  [
    'relative isolate inline-flex items-center justify-center',
    'font-bold whitespace-nowrap',
    'rounded-[var(--radius-l)]',
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
      // Only Secondary has a border (Figma: Secondary Border Width = thin).
      // Primary and Ghost are borderless (Primary Border Width = none / ghost
      // has no stroke) — a transparent border would leave a 1px gap between the
      // hover state-layer overlay (inset to the padding box) and the box-shadow.
      variant: {
        primary: 'text-[var(--text-on-accent)]',
        secondary: 'border bg-[var(--bg-surface)] text-[var(--text-primary)]',
        ghost: 'bg-transparent text-[var(--text-primary)]',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },
      // Padding, gap and icon size per size mirror the Figma button tokens
      // (-- Atoms/Buttons/Global/Size *) from the exported tokens.json components block.
      size: {
        s: 'h-[var(--size-32)] gap-[var(--spacing-08)] px-[var(--spacing-06)] text-xs [&_svg]:size-[var(--size-20)]',
        m: 'h-[var(--size-40)] gap-[var(--spacing-08)] px-[var(--spacing-10)] text-sm [&_svg]:size-[var(--size-20)]',
        l: 'h-[var(--size-48)] gap-[var(--spacing-08)] px-[var(--spacing-12)] text-base [&_svg]:size-[var(--size-24)]',
        xl: 'h-[var(--size-56)] gap-[var(--spacing-16)] px-[var(--spacing-14)] text-lg [&_svg]:size-[var(--size-28)]',
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
      // Secondary — neutral surface fill, tone-colored border + text.
      {
        variant: 'secondary',
        tone: 'default',
        class: 'border-[var(--border-accent)] text-[var(--accent-default)]',
      },
      ...statusToneCompounds('secondary', statusOutline),
      // Ghost — transparent fill, tone-colored text.
      { variant: 'ghost', tone: 'default', class: 'text-[var(--accent-default)]' },
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
  { variant, tone, size, className, leftIcon, rightIcon, children, ...rest },
  ref,
) {
  return (
    <BaseButton
      ref={ref}
      className={cn(buttonStyles({ variant, tone, size }), className)}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </BaseButton>
  );
});
