import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import {
  type StatusTone,
  accentFill,
  statusFill,
  statusOutline,
  statusSubtle,
  statusText,
} from '../../utils/tone.js';

// Figma: 3 Variants (Primary, Outline, Ghost) × 4 Tones × 2 Sizes + Selected
// (Primary only). Tag is a filter chip: Primary/Off is a subtle tinted fill,
// Primary/Selected is the solid fill. Label uses Caption/300 (Light, 12px) at
// both sizes. Radius sm / border thin / icon 16 match -- Atoms/Tag/Global/*.
const STATUS_TONES: StatusTone[] = ['danger', 'success', 'warning'];

// Build {variant, tone, selected} compound rows for the Primary variant from a
// status-tone table (the `default` tone is bespoke and supplied separately).
function primaryStatusRows(selected: boolean, table: Record<StatusTone, string>) {
  return STATUS_TONES.map((tone) => ({
    variant: 'primary' as const,
    tone,
    selected,
    class: table[tone],
  }));
}

const tagStyles = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-[var(--radius-sm)]',
    'border transition-colors',
    'font-light whitespace-nowrap',
    '[&_svg]:size-[var(--size-16)]',
  ],
  {
    variants: {
      variant: {
        primary: '',
        outline: 'bg-transparent',
        ghost: 'border-transparent bg-transparent',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },
      // Padding X/Y, Gap and Min Height match -- Atoms/Tag/{S,M}/*. Both sizes
      // render the label at 12px (Caption/300); S Min Height is a raw 28px.
      size: {
        s: 'min-h-[28px] px-[var(--spacing-06)] py-[var(--spacing-06)] gap-[var(--spacing-04)] text-xs',
        m: 'min-h-[var(--size-32)] px-[var(--spacing-08)] py-[var(--spacing-08)] gap-[var(--spacing-06)] text-xs',
      },
      // Only meaningful for the Primary variant (Off → subtle, On → solid).
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Primary / Off — subtle tinted fill.
      {
        variant: 'primary',
        selected: false,
        tone: 'default',
        class:
          'bg-[var(--accent-subtle)] border-[var(--border-default)] text-[var(--accent-active)]',
      },
      ...primaryStatusRows(false, statusSubtle),
      // Primary / Selected — solid fill.
      { variant: 'primary', selected: true, tone: 'default', class: accentFill },
      ...primaryStatusRows(true, statusFill),
      // Outline — transparent, tone border + text; default is neutral (secondary).
      {
        variant: 'outline',
        tone: 'default',
        class: 'border-[var(--border-default)] text-[var(--text-secondary)]',
      },
      { variant: 'outline', tone: 'danger', class: statusOutline.danger },
      { variant: 'outline', tone: 'success', class: statusOutline.success },
      { variant: 'outline', tone: 'warning', class: statusOutline.warning },
      // Ghost — tone text only; default is accent.
      { variant: 'ghost', tone: 'default', class: 'text-[var(--accent-default)]' },
      { variant: 'ghost', tone: 'danger', class: statusText.danger },
      { variant: 'ghost', tone: 'success', class: statusText.success },
      { variant: 'ghost', tone: 'warning', class: statusText.warning },
    ],
    defaultVariants: {
      variant: 'primary',
      tone: 'default',
      size: 'm',
      selected: false,
    },
  },
);

export interface TagProps extends ComponentPropsWithoutRef<'span'>, VariantProps<typeof tagStyles> {
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
