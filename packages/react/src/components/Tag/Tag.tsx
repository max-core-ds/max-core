import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

const tagStyles = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-[var(--radius-full)]',
    'border transition-colors',
    'font-bold whitespace-nowrap',
    'gap-[var(--spacing-04)]',
  ],
  {
    variants: {
      variant: {
        filled: '',
        outline: 'bg-transparent',
        ghost: 'border-transparent bg-[var(--bg-subtle)]',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },
      size: {
        s: 'h-[var(--size-24)] px-[var(--spacing-08)] text-xs',
        m: 'h-[var(--size-32)] px-[var(--spacing-12)] text-sm',
      },
      selected: {
        true: 'ring-2 ring-[var(--border-focus)] ring-offset-2 ring-offset-[var(--bg-default)]',
        false: '',
      },
    },
    compoundVariants: [
      // Filled
      {
        variant: 'filled',
        tone: 'default',
        class: 'bg-[var(--accent-default)] border-transparent text-[var(--text-on-accent)]',
      },
      {
        variant: 'filled',
        tone: 'danger',
        class:
          'bg-[var(--status-danger-default)] border-transparent text-[var(--text-on-accent)]',
      },
      {
        variant: 'filled',
        tone: 'success',
        class:
          'bg-[var(--status-success-default)] border-transparent text-[var(--text-on-accent)]',
      },
      {
        variant: 'filled',
        tone: 'warning',
        class:
          'bg-[var(--status-warning-default)] border-transparent text-[var(--text-on-accent)]',
      },
      // Outline
      {
        variant: 'outline',
        tone: 'default',
        class: 'border-[var(--border-default)] text-[var(--text-primary)]',
      },
      {
        variant: 'outline',
        tone: 'danger',
        class: 'border-[var(--status-danger-default)] text-[var(--status-danger-default)]',
      },
      {
        variant: 'outline',
        tone: 'success',
        class: 'border-[var(--status-success-default)] text-[var(--status-success-default)]',
      },
      {
        variant: 'outline',
        tone: 'warning',
        class: 'border-[var(--status-warning-default)] text-[var(--status-warning-default)]',
      },
      // Ghost
      { variant: 'ghost', tone: 'default', class: 'text-[var(--text-primary)]' },
      { variant: 'ghost', tone: 'danger', class: 'text-[var(--status-danger-default)]' },
      { variant: 'ghost', tone: 'success', class: 'text-[var(--status-success-default)]' },
      { variant: 'ghost', tone: 'warning', class: 'text-[var(--status-warning-default)]' },
    ],
    defaultVariants: {
      variant: 'filled',
      tone: 'default',
      size: 'm',
      selected: false,
    },
  },
);

export interface TagProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof tagStyles> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function Tag({
  variant,
  tone,
  size,
  selected,
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}: TagProps) {
  return (
    <span className={cn(tagStyles({ variant, tone, size, selected }), className)} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </span>
  );
}
