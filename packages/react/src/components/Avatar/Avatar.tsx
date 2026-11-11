'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { StatusDot, type StatusDotStatus } from '../StatusDot/index.js';

const avatarStyles = cva(
  [
    // No overflow-hidden: the status dot sits on the bounding-box corner, outside
    // the circle (the master doesn't clip). Image and fallback round themselves.
    'relative inline-flex shrink-0 items-center justify-center',
    'rounded-(--avatar-global-radius)',
    // Global/Border Weight is `none` — kept so a theme can switch the stroke on.
    'border-solid border-(length:--avatar-global-border-weight) border-(--border-default)',
    'bg-(--bg-subtle) text-(--text-primary)',
    'uppercase select-none',
  ],
  {
    variants: {
      // Sizes are -- Atoms/Avatar/Size */Size (24/32/40/48/64). Initials text
      // style per the Text variants: XS Caption/700, S+M Body/MD/700,
      // L Heading/H6, XL Heading/H5.
      size: {
        xs: 'size-(--avatar-size-xs-size) type-caption-700',
        s: 'size-(--avatar-size-s-size) type-body-md-700',
        m: 'size-(--avatar-size-m-size) type-body-md-700',
        l: 'size-(--avatar-size-l-size) type-h6',
        xl: 'size-(--avatar-size-xl-size) type-h5',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  },
);

// -- Atoms/Avatar/Size */Status Dot Size (8/8/16/16/20), stroke = Global/Status
// Dot Border Weight. The dot is pinned to the bottom-right corner (constraints
// MAX/MAX in the master). Exported: Thumbnail's status dot binds the same tokens.
export const avatarStatusDotSize = {
  xs: 'size-(--avatar-size-xs-status-dot-size)',
  s: 'size-(--avatar-size-s-status-dot-size)',
  m: 'size-(--avatar-size-m-status-dot-size)',
  l: 'size-(--avatar-size-l-status-dot-size)',
  xl: 'size-(--avatar-size-xl-status-dot-size)',
} as const;
export const avatarStatusDotStroke = 'border-(length:--avatar-global-status-dot-border-weight)';

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseAvatar.Root>, 'children'>,
    VariantProps<typeof avatarStyles> {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  /** Presence dot in the bottom-right corner (Figma: Show Status). Omit to hide it. */
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
      <BaseAvatar.Fallback className="flex size-full items-center justify-center rounded-[inherit] bg-(--accent-default) text-(--text-on-accent)">
        <span className={capTrim}>{fallback}</span>
      </BaseAvatar.Fallback>
      {status ? (
        <StatusDot
          status={status}
          label={statusLabel}
          className={cn(
            'absolute right-0 bottom-0',
            avatarStatusDotSize[size ?? 'm'],
            avatarStatusDotStroke,
          )}
        />
      ) : null}
    </BaseAvatar.Root>
  );
}
