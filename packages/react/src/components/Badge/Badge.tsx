import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { accentFill, statusFill } from '../../utils/tone.js';

const badgeStyles = cva(
  [
    'inline-flex items-center justify-center',
    // Radius + border weight match -- Atoms/Badge/Global/*.
    'rounded-[var(--radius-sm)]',
    'border font-bold whitespace-nowrap',
  ],
  {
    variants: {
      // Solid fills; `neutral` is bespoke (subtle bg, neutral border/text).
      tone: {
        default: accentFill,
        danger: statusFill.danger,
        success: statusFill.success,
        warning: statusFill.warning,
        neutral: 'bg-[var(--bg-subtle)] border-[var(--border-default)] text-[var(--text-primary)]',
      },

      // Padding X/Y match -- Atoms/Badge/{S,M,L}/*; height is padding-driven
      // (Figma Badge has no height token).
      size: {
        s: 'px-[var(--spacing-10)] py-[var(--spacing-06)] text-[10px]',
        m: 'px-[var(--spacing-12)] py-[var(--spacing-08)] text-xs',
        l: 'px-[var(--spacing-14)] py-[var(--spacing-10)] text-sm',
      },
    },
    defaultVariants: {
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

export function Badge({ tone, size, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ tone, size }), className)} {...rest}>
      {children}
    </span>
  );
}
