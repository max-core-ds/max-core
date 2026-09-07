'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

const avatarStyles = cva(
  [
    'relative inline-flex items-center justify-center overflow-hidden',
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

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseAvatar.Root>, 'children'>,
    VariantProps<typeof avatarStyles> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
}

export function Avatar({ size, src, alt, fallback, className, ...rest }: AvatarProps) {
  return (
    <BaseAvatar.Root className={cn(avatarStyles({ size }), className)} {...rest}>
      {src ? (
        <BaseAvatar.Image src={src} alt={alt ?? ''} className="size-full object-cover" />
      ) : null}
      <BaseAvatar.Fallback className="flex size-full items-center justify-center bg-[var(--accent-default)] text-[var(--text-on-accent)]">
        {fallback}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
