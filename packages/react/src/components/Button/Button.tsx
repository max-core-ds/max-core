'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

const buttonStyles = cva(
  [
    'inline-flex items-center justify-center',
    'font-bold whitespace-nowrap',
    'rounded-[var(--radius-l)]',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-default)]',
    'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed',
    'active:translate-y-[2px]',
  ],
  {
    variants: {
      variant: {
        primary: 'border border-transparent text-[var(--text-on-accent)]',
        secondary: 'border bg-[var(--bg-surface)] text-[var(--text-primary)]',
        ghost: 'border border-transparent bg-transparent text-[var(--text-primary)]',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },
      size: {
        s: 'h-[var(--size-32)] gap-[var(--spacing-08)] px-[var(--spacing-12)] text-xs',
        m: 'h-[var(--size-40)] gap-[var(--spacing-08)] px-[var(--spacing-16)] text-sm',
        l: 'h-[var(--size-48)] gap-[var(--spacing-12)] px-[var(--spacing-20)] text-base',
        xl: 'h-[var(--size-56)] gap-[var(--spacing-12)] px-[var(--spacing-24)] text-lg',
      },
    },
    compoundVariants: [
      // Primary — background colored by tone
      {
        variant: 'primary',
        tone: 'default',
        class: 'bg-[var(--accent-default)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)]',
      },
      {
        variant: 'primary',
        tone: 'danger',
        class: 'bg-[var(--status-danger-default)] hover:bg-[var(--status-danger-hover)]',
      },
      {
        variant: 'primary',
        tone: 'success',
        class: 'bg-[var(--status-success-default)] hover:bg-[var(--status-success-hover)]',
      },
      {
        variant: 'primary',
        tone: 'warning',
        class: 'bg-[var(--status-warning-default)] hover:bg-[var(--status-warning-hover)]',
      },
      // Secondary — border + text colored by tone, neutral fill
      {
        variant: 'secondary',
        tone: 'default',
        class: 'border-[var(--border-default)] hover:bg-[var(--bg-subtle)]',
      },
      {
        variant: 'secondary',
        tone: 'danger',
        class:
          'border-[var(--status-danger-border)] text-[var(--status-danger-default)] hover:bg-[var(--status-danger-subtle)]',
      },
      {
        variant: 'secondary',
        tone: 'success',
        class:
          'border-[var(--status-success-default)] text-[var(--status-success-default)] hover:bg-[var(--status-success-subtle)]',
      },
      {
        variant: 'secondary',
        tone: 'warning',
        class:
          'border-[var(--status-warning-default)] text-[var(--status-warning-default)] hover:bg-[var(--status-warning-subtle)]',
      },
      // Ghost — text colored by tone, hover tinted bg
      {
        variant: 'ghost',
        tone: 'default',
        class: 'hover:bg-[var(--bg-subtle)]',
      },
      {
        variant: 'ghost',
        tone: 'danger',
        class: 'text-[var(--status-danger-default)] hover:bg-[var(--status-danger-subtle)]',
      },
      {
        variant: 'ghost',
        tone: 'success',
        class: 'text-[var(--status-success-default)] hover:bg-[var(--status-success-subtle)]',
      },
      {
        variant: 'ghost',
        tone: 'warning',
        class: 'text-[var(--status-warning-default)] hover:bg-[var(--status-warning-subtle)]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      tone: 'default',
      size: 'm',
    },
  },
);

type BaseButtonProps = ComponentPropsWithoutRef<typeof BaseButton>;

export interface ButtonProps
  extends Omit<BaseButtonProps, 'children'>,
    VariantProps<typeof buttonStyles> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant,
  tone,
  size,
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}: ButtonProps) {
  return (
    <BaseButton className={cn(buttonStyles({ variant, tone, size }), className)} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </BaseButton>
  );
}
