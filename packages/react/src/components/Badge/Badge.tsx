import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import {
  statusBorderOutline,
  statusSubtle,
  statusText,
  statusToneCompounds,
} from '../../utils/tone.js';

// Figma: 3 Variants (Default, Outline, Ghost) × 4 Tones × 3 Sizes = 36 variants.
//   Default → subtle tinted fill + tone border + tone text
//   Outline → transparent fill + tone border + tone text
//   Ghost   → text only
// The `default` (accent) tone is bespoke: accent/subtle fill + accent/active
// border + text/accent label. Label is Caption/300 (12px Light) at every size;
// sizes differ only in padding. Non-interactive (Figma doc: "non-interactive").
const badgeStyles = cva(
  ['inline-flex items-center justify-center text-xs font-light whitespace-nowrap'],
  {
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
        s: 'px-[var(--spacing-10)] py-[var(--spacing-06)]',
        m: 'px-[var(--spacing-12)] py-[var(--spacing-08)]',
        l: 'px-[var(--spacing-14)] py-[var(--spacing-10)]',
      },
    },
    compoundVariants: [
      // Default — subtle tinted fill (accent parallel of statusSubtle).
      {
        variant: 'default',
        tone: 'default',
        class: 'bg-[var(--accent-subtle)] border-[var(--accent-active)] text-[var(--text-accent)]',
      },
      ...statusToneCompounds('default', statusSubtle),
      // Outline — transparent fill, tone border + text (status tones bind the
      // status/*/border token, not the solid tone).
      {
        variant: 'outline',
        tone: 'default',
        class: 'border-[var(--accent-default)] text-[var(--accent-default)]',
      },
      ...statusToneCompounds('outline', statusBorderOutline),
      // Ghost — tone text only.
      { variant: 'ghost', tone: 'default', class: 'text-[var(--accent-default)]' },
      ...statusToneCompounds('ghost', statusText),
    ],
    defaultVariants: {
      variant: 'default',
      tone: 'default',
      size: 'm',
    },
  },
);

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
