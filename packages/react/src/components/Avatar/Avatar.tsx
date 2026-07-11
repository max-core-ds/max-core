'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { cva, type VariantProps } from 'class-variance-authority';
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
      // Sizes match -- Atoms/Avatar/Size */Size (24/32/40/48/64).
      size: {
        xs: 'size-[var(--size-24)] text-[10px]',
        s: 'size-[var(--size-32)] text-xs',
        m: 'size-[var(--size-40)] text-sm',
        l: 'size-[var(--size-48)] text-base',
        xl: 'size-[var(--size-64)] text-xl',
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
      <BaseAvatar.Fallback>{fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
