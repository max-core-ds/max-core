'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ElementRef, type ReactNode, forwardRef } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { elevatePress, stateLayer } from '../../utils/state-layer.js';
import { statusBg, statusOutline, statusText, statusToneCompounds } from '../../utils/tone.js';

// Square sibling of Button: same variant/tone system and shared interaction
// primitives, sized by its own Figma tokens -- Atoms/Buttons/Icon Only/<size>/*
// (Height = width, Padding X/Y, Radius, Icon Size; they alias Global/Size <size>/*).
const iconOnlyButtonStyles = cva(
  [
    'relative isolate inline-flex shrink-0 items-center justify-center',
    'transition',
    stateLayer,
    // Deliberate deviation: Figma's Icon Only Hover/Pressed are state-layer only
    // (no shadow / press-down); we keep Button's elevation for family consistency.
    elevatePress,
    focusRing,
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
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
      size: {
        s: 'size-(--buttons-icon-only-s-height) px-(--buttons-icon-only-s-padding-x) py-(--buttons-icon-only-s-padding-y) rounded-(--buttons-icon-only-s-radius) [&_svg]:size-(--buttons-icon-only-s-icon-size)',
        m: 'size-(--buttons-icon-only-m-height) px-(--buttons-icon-only-m-padding-x) py-(--buttons-icon-only-m-padding-y) rounded-(--buttons-icon-only-m-radius) [&_svg]:size-(--buttons-icon-only-m-icon-size)',
        l: 'size-(--buttons-icon-only-l-height) px-(--buttons-icon-only-l-padding-x) py-(--buttons-icon-only-l-padding-y) rounded-(--buttons-icon-only-l-radius) [&_svg]:size-(--buttons-icon-only-l-icon-size)',
        xl: 'size-(--buttons-icon-only-xl-height) px-(--buttons-icon-only-xl-padding-x) py-(--buttons-icon-only-xl-padding-y) rounded-(--buttons-icon-only-xl-radius) [&_svg]:size-(--buttons-icon-only-xl-icon-size)',
      },
    },
    compoundVariants: [
      { variant: 'primary', tone: 'default', class: 'bg-[var(--accent-default)]' },
      ...statusToneCompounds('primary', statusBg),
      {
        variant: 'secondary',
        tone: 'default',
        class: 'border-[var(--border-accent)] text-[var(--text-accent)]',
      },
      ...statusToneCompounds('secondary', statusOutline),
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

export interface IconOnlyButtonProps
  extends Omit<BaseButtonProps, 'children'>,
    VariantProps<typeof iconOnlyButtonStyles> {
  /** The icon to render, centered. */
  icon: ReactNode;
  /** Accessible label — required, since there is no visible text. */
  'aria-label': string;
}

// forwardRef so it can anchor Base UI popups (icon buttons are common tooltip triggers).
export const IconOnlyButton = forwardRef<ElementRef<typeof BaseButton>, IconOnlyButtonProps>(
  function IconOnlyButton({ variant, tone, size, className, icon, ...rest }, ref) {
    return (
      <BaseButton
        ref={ref}
        className={cn(iconOnlyButtonStyles({ variant, tone, size }), className)}
        {...rest}
      >
        {icon}
      </BaseButton>
    );
  },
);
