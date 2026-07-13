import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { statusOutline, statusSubtle, statusText, statusToneCompounds } from '../../utils/tone.js';

// Figma: 3 Variants (Default, Outline, Ghost) × 4 Tones × 3 Sizes = 36 variants.
//   Default → subtle tinted fill + tone border + tone text
//   Outline → transparent fill + tone border + tone text
//   Ghost   → text only
// The `default` (accent) tone is bespoke: the Default variant fills accent/subtle
// with white text/on-accent (the status tones keep their own tone-colored text).
const badgeStyles = cva(['inline-flex items-center justify-center font-bold whitespace-nowrap'], {
  variants: {
    // Radius + border weight match -- Atoms/Badge/Global/* (sm / thin).
    variant: {
      default: 'rounded-[var(--radius-sm)] border',
      outline: 'rounded-[var(--radius-sm)] border bg-transparent',
      ghost: 'rounded-[var(--radius-sm)] bg-transparent',
    },
    tone: {
      default: '',
      danger: '',
      success: '',
      warning: '',
    },

    // Padding X/Y match -- Atoms/Badge/{S,M,L}/*; height is padding-driven
    // (Figma Badge has no height token).
    size: {
      s: 'px-[var(--spacing-10)] py-[var(--spacing-06)] text-[10px]',
      m: 'px-[var(--spacing-12)] py-[var(--spacing-08)] text-xs',
      l: 'px-[var(--spacing-14)] py-[var(--spacing-10)] text-sm',
    },
  },
  compoundVariants: [
    // Default — subtle tinted fill.
    {
      variant: 'default',
      tone: 'default',
      class:
        'bg-[var(--accent-subtle)] border-[var(--accent-default)] text-[var(--text-on-accent)]',
    },
    ...statusToneCompounds('default', statusSubtle),
    // Outline — transparent fill, tone border + text.
    {
      variant: 'outline',
      tone: 'default',
      class: 'border-[var(--accent-default)] text-[var(--accent-default)]',
    },
    ...statusToneCompounds('outline', statusOutline),
    // Ghost — tone text only.
    { variant: 'ghost', tone: 'default', class: 'text-[var(--accent-default)]' },
    ...statusToneCompounds('ghost', statusText),
  ],
  defaultVariants: {
    variant: 'default',
    tone: 'default',
    size: 'm',
  },
});

export interface BadgeProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof badgeStyles> {
  children?: ReactNode;
}

export function Badge({ variant, tone, size, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ variant, tone, size }), className)} {...rest}>
      {children}
    </span>
  );
}
