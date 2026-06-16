'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

const buttonStyles = cva(
  [
    'relative isolate inline-flex items-center justify-center',
    'font-bold whitespace-nowrap',
    'rounded-[var(--radius-l)]',
    'transition',
    // Hover/press feedback mirrors Figma's Button wrapper: a mode-aware
    // state-layer overlay (Figma `overlay/state layer`) plus elevation — the
    // SAME mechanism for every tone, not per-tone background swaps. The overlay
    // is a ::before behind the content (-z) so it tints the fill, not the label.
    "before:pointer-events-none before:absolute before:inset-0 before:-z-[1] before:rounded-[inherit] before:bg-[var(--overlay-state-layer)] before:opacity-0 before:transition-opacity before:content-['']",
    'hover:before:opacity-[var(--opacity-hover)]',
    'active:before:opacity-[var(--opacity-pressed)]',
    // Elevation lifts on hover and settles on press (Figma effect/shadow/down/*).
    'hover:shadow-[var(--effect-shadow-down-lg)]',
    'active:shadow-[var(--effect-shadow-down-sm)] active:translate-y-[2px]',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-default)]',
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      // Only Secondary has a border (Figma: Secondary Border Width = thin).
      // Primary and Ghost are borderless (Primary Border Width = none / ghost
      // has no stroke) — a transparent border would leave a 1px gap between the
      // hover state-layer overlay (inset to the padding box) and the box-shadow.
      variant: {
        primary: 'text-[var(--text-on-accent)]',
        secondary: 'border bg-[var(--bg-surface)] text-[var(--text-primary)]',
        ghost: 'bg-transparent text-[var(--text-primary)]',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },
      // Padding, gap and icon size per size mirror the Figma button tokens
      // (-- Atoms/Buttons/Global/Size *) from the exported tokens.json components block.
      size: {
        s: 'h-[var(--size-32)] gap-[var(--spacing-08)] px-[var(--spacing-06)] text-xs [&_svg]:size-[var(--size-20)]',
        m: 'h-[var(--size-40)] gap-[var(--spacing-08)] px-[var(--spacing-10)] text-sm [&_svg]:size-[var(--size-20)]',
        l: 'h-[var(--size-48)] gap-[var(--spacing-08)] px-[var(--spacing-12)] text-base [&_svg]:size-[var(--size-24)]',
        xl: 'h-[var(--size-56)] gap-[var(--spacing-16)] px-[var(--spacing-14)] text-lg [&_svg]:size-[var(--size-28)]',
      },
    },
    // Tone sets only the resting fill/border/text. Hover & press are handled
    // uniformly by the shared state-layer overlay + elevation in the base, so
    // there are no per-tone hover background swaps here anymore.
    compoundVariants: [
      // Primary — tone-colored fill.
      { variant: 'primary', tone: 'default', class: 'bg-[var(--accent-default)]' },
      { variant: 'primary', tone: 'danger', class: 'bg-[var(--status-danger-default)]' },
      { variant: 'primary', tone: 'success', class: 'bg-[var(--status-success-default)]' },
      { variant: 'primary', tone: 'warning', class: 'bg-[var(--status-warning-default)]' },
      // Secondary — neutral surface fill, tone-colored border + text.
      // Default tone is the brand/accent treatment (indigo text + border).
      {
        variant: 'secondary',
        tone: 'default',
        class: 'border-[var(--border-accent)] text-[var(--accent-default)]',
      },
      {
        variant: 'secondary',
        tone: 'danger',
        class: 'border-[var(--status-danger-border)] text-[var(--status-danger-default)]',
      },
      {
        variant: 'secondary',
        tone: 'success',
        class: 'border-[var(--status-success-default)] text-[var(--status-success-default)]',
      },
      {
        variant: 'secondary',
        tone: 'warning',
        class: 'border-[var(--status-warning-default)] text-[var(--status-warning-default)]',
      },
      // Ghost — transparent fill, tone-colored text (default tone = brand/accent).
      { variant: 'ghost', tone: 'default', class: 'text-[var(--accent-default)]' },
      { variant: 'ghost', tone: 'danger', class: 'text-[var(--status-danger-default)]' },
      { variant: 'ghost', tone: 'success', class: 'text-[var(--status-success-default)]' },
      { variant: 'ghost', tone: 'warning', class: 'text-[var(--status-warning-default)]' },
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
