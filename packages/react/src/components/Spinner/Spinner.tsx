import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Sizes match -- Atoms/Spinner/Size */Size (16/20/24/48). Ring uses a 2px
// (border-weight.thick) indicator with a transparent segment; `border-current`
// so it inherits the surrounding text color (e.g. on-accent inside a button).
const spinnerStyles = cva(
  [
    'inline-block shrink-0 animate-spin rounded-full',
    'border-2 border-current border-t-transparent',
  ],
  {
    variants: {
      size: {
        s: 'size-[var(--size-16)]',
        m: 'size-[var(--size-20)]',
        l: 'size-[var(--size-24)]',
        xl: 'size-[var(--size-48)]',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  },
);

export interface SpinnerProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof spinnerStyles> {
  /** Accessible label; defaults to "Loading". Set to "" if a sibling already labels it. */
  label?: string;
}

export function Spinner({ size, className, label = 'Loading', ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label || undefined}
      className={cn(spinnerStyles({ size }), className)}
      {...rest}
    />
  );
}
