import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Sizes and per-shape radii match -- Atoms/Thumbnail/Global/*.
const thumbnailStyles = cva(
  [
    'inline-flex shrink-0 items-center justify-center overflow-hidden',
    'bg-[var(--bg-subtle)] text-[var(--text-muted)]',
  ],
  {
    variants: {
      shape: {
        rounded: 'rounded-[var(--radius-md)]',
        square: 'rounded-[var(--radius-none)]',
        circle: 'rounded-[var(--radius-full)]',
      },
      size: {
        xs: 'size-[var(--size-24)]',
        s: 'size-[var(--size-32)]',
        m: 'size-[var(--size-40)]',
        l: 'size-[var(--size-48)]',
        xl: 'size-[var(--size-64)]',
      },
    },
    defaultVariants: { shape: 'rounded', size: 'm' },
  },
);

export interface ThumbnailProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>,
    VariantProps<typeof thumbnailStyles> {
  src?: string;
  alt?: string;
  /** Shown when there is no `src` (e.g. an icon). */
  fallback?: ReactNode;
}

export function Thumbnail({ shape, size, src, alt, fallback, className, ...rest }: ThumbnailProps) {
  return (
    <span className={cn(thumbnailStyles({ shape, size }), className)} {...rest}>
      {src ? <img src={src} alt={alt ?? ''} className="size-full object-cover" /> : fallback}
    </span>
  );
}
