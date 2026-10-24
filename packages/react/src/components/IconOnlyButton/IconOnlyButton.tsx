'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ElementRef, type ReactNode, forwardRef } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { elevatePress, stateLayer } from '../../utils/state-layer.js';
import { statusBg, statusOutline, statusText, statusToneCompounds } from '../../utils/tone.js';

// Square sibling of Button: same variant/tone system and shared interaction
// primitives, but sized as a square (size = Standard Button Min Height) with a
// centered icon and no horizontal padding. Sizes/icon sizes match
// -- Atoms/Buttons/Global/Size */{Min Height,Icon Size}.
const iconOnlyButtonStyles = cva(
  [
    'relative isolate inline-flex items-center justify-center',
    'rounded-[var(--radius-l)]',
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
        primary: 'text-[var(--text-on-accent)]',
        secondary: 'border bg-transparent text-[var(--text-primary)]',
        ghost: 'bg-transparent text-[var(--text-primary)]',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },
      size: {
        s: 'size-[var(--size-32)] [&_svg]:size-[var(--size-20)]',
        m: 'size-[var(--size-40)] [&_svg]:size-[var(--size-20)]',
        l: 'size-[var(--size-48)] [&_svg]:size-[var(--size-24)]',
        xl: 'size-[var(--size-56)] [&_svg]:size-[var(--size-28)]',
      },
    },
    compoundVariants: [
      { variant: 'primary', tone: 'default', class: 'bg-[var(--accent-default)]' },
      ...statusToneCompounds('primary', statusBg),
      {
        variant: 'secondary',
        tone: 'default',
        class: 'border-[var(--border-accent)] text-[var(--accent-default)]',
      },
      ...statusToneCompounds('secondary', statusOutline),
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
