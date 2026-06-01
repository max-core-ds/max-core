import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

const badgeStyles = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-[var(--radius-full)]',
    'border font-bold whitespace-nowrap',
  ],
  {
    variants: {
      tone: {
        default: 'bg-[var(--accent-default)] border-transparent text-[var(--text-on-accent)]',
        danger: 'bg-[var(--status-danger-default)] border-transparent text-[var(--text-on-accent)]',
        success: 'bg-[var(--status-success-default)] border-transparent text-[var(--text-on-accent)]',
        warning: 'bg-[var(--status-warning-default)] border-transparent text-[var(--text-on-accent)]',
        neutral: 'bg-[var(--bg-subtle)] border-[var(--border-default)] text-[var(--text-primary)]',
      },
      size: {
        s: 'h-[var(--size-16)] px-[var(--spacing-04)] text-[10px]',
        m: 'h-[var(--size-20)] px-[var(--spacing-08)] text-xs',
        l: 'h-[var(--size-24)] px-[var(--spacing-08)] text-sm',
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
