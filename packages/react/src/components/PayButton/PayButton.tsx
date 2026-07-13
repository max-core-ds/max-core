'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { elevatePress, stateLayer } from '../../utils/state-layer.js';
import { Spinner } from '../Spinner/Spinner.js';

// Dimensions match -- Atoms/Buttons/Pay Button/Global/*. Figma: 8 Types × 2
// Colors × 2 Providers. Color (Light/Dark) and Provider (Apple/Google) are
// INDEPENDENT axes — the fill is a theme-aware token pair, not a per-provider
// hardcode, so each button keeps contrast against the page in either mode:
//   Dark  → bg/surface + text/primary   (dark-appearing in dark mode)
//   Light → neutral/default + on-accent (light-appearing in dark mode)
const payButtonStyles = cva(
  [
    'relative isolate inline-flex items-center justify-center',
    'min-w-[var(--size-160)] min-h-[var(--size-32)]',
    'gap-[var(--spacing-04)] px-[var(--spacing-08)] py-[var(--spacing-06)]',
    'rounded-[var(--radius-sm)] border border-[var(--border-default)]',
    'font-bold whitespace-nowrap',
    stateLayer,
    elevatePress,
    focusRing,
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      color: {
        dark: 'bg-[var(--bg-surface)] text-[var(--text-primary)]',
        light: 'bg-[var(--neutral-default)] text-[var(--text-on-accent)]',
      },
    },
    defaultVariants: {
      color: 'dark',
    },
  },
);

type BaseButtonProps = ComponentPropsWithoutRef<typeof BaseButton>;

export interface PayButtonProps
  extends Omit<BaseButtonProps, 'children' | 'color'>,
    VariantProps<typeof payButtonStyles> {
  /** Which wallet — selects the default accessible label; the visible logo is
   * passed as children (brand SVGs are provider-supplied assets). */
  provider?: 'apple' | 'google';
  /** Brand mark / label content (e.g. an Apple Pay logo). */
  children?: ReactNode;
  /** Show a spinner and disable the button. */
  loading?: boolean;
}

export function PayButton({
  color,
  provider = 'apple',
  className,
  children,
  loading,
  disabled,
  'aria-label': ariaLabel,
  ...rest
}: PayButtonProps) {
  return (
    <BaseButton
      className={cn(payButtonStyles({ color }), className)}
      disabled={disabled || loading}
      aria-label={ariaLabel ?? (provider === 'apple' ? 'Apple Pay' : 'Google Pay')}
      {...rest}
    >
      {loading ? <Spinner size="s" label="Processing payment" /> : children}
    </BaseButton>
  );
}
