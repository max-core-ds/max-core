'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { elevatePress, stateLayer } from '../../utils/state-layer.js';
import { Spinner } from '../Spinner/Spinner.js';

// Dimensions match -- Atoms/Buttons/Pay Button/Global/*. Provider colors are
// brand-fixed (Apple Pay black, Google Pay white) rather than themeable tokens.
const payButtonStyles = cva(
  [
    'relative isolate inline-flex items-center justify-center',
    'min-w-[var(--size-160)] min-h-[var(--size-32)]',
    'gap-[var(--spacing-04)] px-[var(--spacing-08)] py-[var(--spacing-06)]',
    'rounded-[var(--radius-sm)] border',
    'font-bold whitespace-nowrap',
    stateLayer,
    elevatePress,
    focusRing,
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      provider: {
        apple: 'bg-black text-white border-transparent',
        google: 'bg-white text-black border-[var(--border-default)]',
      },
    },
    defaultVariants: {
      provider: 'apple',
    },
  },
);

type BaseButtonProps = ComponentPropsWithoutRef<typeof BaseButton>;

export interface PayButtonProps
  extends Omit<BaseButtonProps, 'children'>,
    VariantProps<typeof payButtonStyles> {
  /** Brand mark / label content (e.g. an Apple Pay logo). */
  children?: ReactNode;
  /** Show a spinner and disable the button. */
  loading?: boolean;
}

export function PayButton({
  provider,
  className,
  children,
  loading,
  disabled,
  ...rest
}: PayButtonProps) {
  return (
    <BaseButton
      className={cn(payButtonStyles({ provider }), className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size="s" label="Processing payment" /> : children}
    </BaseButton>
  );
}
