'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { StatusDot, type StatusDotStatus } from '../StatusDot/index.js';

const avatarStyles = cva(
  [
    // No overflow-hidden: the status dot sits on the bounding-box corner, outside
    // the circle (the master doesn't clip). Image and fallback round themselves.
    'relative inline-flex shrink-0 items-center justify-center',
    'rounded-[var(--radius-full)]',
    'bg-[var(--bg-subtle)] text-[var(--text-primary)]',
    'font-bold uppercase select-none',
  ],
  {
    variants: {
      // Sizes match -- Atoms/Avatar/Size */Size (24/32/40/48/64). Initials font
      // per the Text variants: XS Caption/700 (12), S+M Body/MD/700 (16),
      // L Heading/H6 (20), XL Heading/H5 (24).
      size: {
        xs: 'size-[var(--size-24)] text-xs',
        s: 'size-[var(--size-32)] text-base',
        m: 'size-[var(--size-40)] text-base',
        l: 'size-[var(--size-48)] text-xl',
        xl: 'size-[var(--size-64)] text-2xl',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  },
);

// -- Atoms/Avatar/Size */Status Dot Size (8/8/16/16/20). The dot is pinned to the
// bottom-right corner (constraints MAX/MAX in the master).
const statusDotSize = {
  xs: 'size-[var(--size-8)]',
  s: 'size-[var(--size-8)]',
  m: 'size-[var(--size-16)]',
  l: 'size-[var(--size-16)]',
  xl: 'size-[var(--size-20)]',
} as const;

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseAvatar.Root>, 'children'>,
    VariantProps<typeof avatarStyles> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  /** Presence dot in the bottom-right corner (Figma: ShowStatus). Omit to hide it. */
  status?: StatusDotStatus;
  /** Accessible label for the status dot, e.g. "Online". */
  statusLabel?: string;
}

export function Avatar({
  size,
  src,
  alt,
  fallback,
  status,
  statusLabel,
  className,
  ...rest
}: AvatarProps) {
  return (
    <BaseAvatar.Root className={cn(avatarStyles({ size }), className)} {...rest}>
      {src ? (
        <BaseAvatar.Image
          src={src}
          alt={alt ?? ''}
          className="size-full rounded-[inherit] object-cover"
        />
      ) : null}
      <BaseAvatar.Fallback className="flex size-full items-center justify-center rounded-[inherit] bg-[var(--accent-default)] text-[var(--text-on-accent)]">
        {fallback}
      </BaseAvatar.Fallback>
      {status ? (
        <StatusDot
          status={status}
          label={statusLabel}
          className={cn('absolute right-0 bottom-0', statusDotSize[size ?? 'm'])}
        />
      ) : null}
    </BaseAvatar.Root>
  );
}
