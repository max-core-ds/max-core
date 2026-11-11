import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { avatarStatusDotSize, avatarStatusDotStroke } from '../Avatar/Avatar.js';
import { StatusDot, type StatusDotStatus } from '../StatusDot/index.js';

// Sizes and per-shape radii are -- Atoms/Thumbnail/Global/*. Not clipped: the
// status dot sits on the bounding-box corner, outside a circle (the image
// rounds itself). Border Weight is `none` — kept so a theme can switch it on.
const thumbnailStyles = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center',
    'border-solid border-(length:--thumbnail-global-border-weight) border-(--border-default)',
    'bg-(--bg-subtle) text-(--text-muted)',
  ],
  {
    variants: {
      shape: {
        rounded: 'rounded-(--thumbnail-global-radius-rounded)',
        square: 'rounded-(--thumbnail-global-radius-square)',
        circle: 'rounded-(--thumbnail-global-radius-circle)',
      },
      size: {
        xs: 'size-(--thumbnail-global-size-xs)',
        s: 'size-(--thumbnail-global-size-s)',
        m: 'size-(--thumbnail-global-size-m)',
        l: 'size-(--thumbnail-global-size-l)',
        xl: 'size-(--thumbnail-global-size-xl)',
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
  /** Status dot in the bottom-right corner (Figma: Show Status). Omit to hide it. */
  status?: StatusDotStatus;
  /** Accessible label for the status dot, e.g. "In stock". */
  statusLabel?: string;
}

export function Thumbnail({
  shape,
  size,
  src,
  alt,
  fallback,
  status,
  statusLabel,
  className,
  ...rest
}: ThumbnailProps) {
  return (
    <span className={cn(thumbnailStyles({ shape, size }), className)} {...rest}>
      {src ? (
        <img src={src} alt={alt ?? ''} className="size-full rounded-[inherit] object-cover" />
      ) : (
        fallback
      )}
      {status ? (
        // The master binds the Avatar's per-size Status Dot tokens (flagged to Max).
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
    </span>
  );
}
