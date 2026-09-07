import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Sizes match -- Atoms/Spinner/Size */Size (16/20/24/48). A full faint track
// (Track Stroke) plus a brighter indicator arc (Indicator Stroke, the top
// border) per the three Figma tone columns; both render at the 2px indicator
// stroke. Tones: accent (default), neutral, on-accent (white, for accent bg).
const spinnerStyles = cva('inline-block shrink-0 animate-spin rounded-full border-2', {
  variants: {
    size: {
      s: 'size-[var(--size-16)]',
      m: 'size-[var(--size-20)]',
      l: 'size-[var(--size-24)]',
      xl: 'size-[var(--size-48)]',
    },
    tone: {
      accent: 'border-[var(--accent-subtle)] border-t-[var(--accent-default)]',
      neutral: 'border-[var(--neutral-subtle)] border-t-[var(--neutral-active)]',
      'on-accent': 'border-[var(--accent-active)] border-t-[var(--text-on-accent)]',
    },
  },
  defaultVariants: {
    size: 'm',
    tone: 'accent',
  },
});

export interface SpinnerProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof spinnerStyles> {
  /** Accessible label; defaults to "Loading". Set to "" if a sibling already labels it. */
  label?: string;
}

export function Spinner({ size, tone, className, label = 'Loading', ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label || undefined}
      className={cn(spinnerStyles({ size, tone }), className)}
      {...rest}
    />
  );
}
