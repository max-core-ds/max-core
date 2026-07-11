import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { ring } from '../../utils/focus-ring.js';
import { accentFill, statusFill, statusOutline, statusText, statusToneCompounds } from '../../utils/tone.js';

const tagStyles = cva(
  [
    'inline-flex items-center justify-center',
    // Radius, border weight and icon size match -- Atoms/Tag/Global/*.
    'rounded-[var(--radius-sm)]',
    'border transition-colors',
    'font-bold whitespace-nowrap',
    '[&_svg]:size-[var(--size-16)]',
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
      // Padding X/Y, Gap and Min Height match -- Atoms/Tag/{S,M}/*.
      // (S Min Height is a raw 28px in Figma; M Min Height = size.32.)
      size: {
        s: 'min-h-[28px] px-[var(--spacing-06)] py-[var(--spacing-06)] gap-[var(--spacing-04)] text-xs',
        m: 'min-h-[var(--size-32)] px-[var(--spacing-08)] py-[var(--spacing-08)] gap-[var(--spacing-06)] text-sm',
      },
      selected: {
        true: ring,
        false: '',
      },
    },
    // Status tones (danger/success/warning) come from statusToneCompounds; the
    // `default` tone is neutral here (unlike Button's accent default) and stays
    // bespoke per variant.
    compoundVariants: [
      // Filled — solid tone fill.
      { variant: 'filled', tone: 'default', class: accentFill },
      ...statusToneCompounds('filled', statusFill),
      // Outline — tone border + text; default is neutral.
      {
        variant: 'outline',
        tone: 'default',
        class: 'border-[var(--border-default)] text-[var(--text-primary)]',
      },
      ...statusToneCompounds('outline', statusOutline),
      // Ghost — tone text; default is neutral.
      { variant: 'ghost', tone: 'default', class: 'text-[var(--text-primary)]' },
      ...statusToneCompounds('ghost', statusText),
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
