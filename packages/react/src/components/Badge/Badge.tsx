import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
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
// border + text/accent label. Label is Caption/300 at every size, in a
// cap-trimmed span, so a badge is Padding Y + 9 + Padding Y (21 / 25 / 29) as
// the master; Figma's stroke sits OUTSIDE that frame, and so does a CSS border
// (outside the padding box), so the rendered box matches too. Sizes differ only
// in padding. Non-interactive (Figma doc: "non-interactive").
const badgeStyles = cva(
  ['inline-flex items-center justify-center type-caption-300 whitespace-nowrap'],
  {
    variants: {
      variant: {
        default: 'border-solid',
        outline: 'border-solid bg-transparent',
        ghost: 'border-0 bg-transparent',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },

      // Padding X/Y, Radius and Border Weight are -- Atoms/Badge/<size>/*;
      // height is padding-driven (Figma Badge has no height token).
      size: {
        s: 'px-(--badge-s-padding-x) py-(--badge-s-padding-y) rounded-(--badge-s-radius)',
        m: 'px-(--badge-m-padding-x) py-(--badge-m-padding-y) rounded-(--badge-m-radius)',
        l: 'px-(--badge-l-padding-x) py-(--badge-l-padding-y) rounded-(--badge-l-radius)',
      },
    },
    compoundVariants: [
      // Border Weight per size on the stroked variants (Ghost has no stroke).
      {
        variant: ['default', 'outline'],
        size: 's',
        class: 'border-(length:--badge-s-border-weight)',
      },
      {
        variant: ['default', 'outline'],
        size: 'm',
        class: 'border-(length:--badge-m-border-weight)',
      },
      {
        variant: ['default', 'outline'],
        size: 'l',
        class: 'border-(length:--badge-l-border-weight)',
      },
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
        class: 'border-[var(--border-accent)] text-[var(--text-accent)]',
      },
      ...statusToneCompounds('outline', statusBorderOutline),
      // Ghost — tone text only.
      { variant: 'ghost', tone: 'default', class: 'text-[var(--text-accent)]' },
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
      <span className={capTrim}>{children}</span>
    </span>
  );
}
