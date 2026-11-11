import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { Avatar } from '../Avatar/Avatar.js';

// Overlapping avatars. -- Molecule/Avatar Group/Gap = -12 (a raw negative overlap).
// Each avatar gets an inside 1px `border/surface` stroke (Border Weight token) to
// separate it — an inset outline, so it draws over the image like Figma's INSIDE
// stroke and doesn't grow the circle. Later avatars sit on top (DOM order), as in
// the master. The +N counter is the Avatar Text type (accent/default + Caption/700),
// Counter Size square at the default XS size (larger groups size it like the avatars).
const overlapItem = cn(
  // Avatars Radius (full) — the outline follows it.
  'rounded-(--avatar-group-avatars-radius)',
  'outline-solid outline-(length:--avatar-group-border-weight) outline-(--border-surface)',
  'outline-offset-[calc(-1*var(--avatar-group-border-weight))]',
);

export interface AvatarGroupItem {
  src?: string;
  fallback?: ReactNode;
  alt?: string;
}

export interface AvatarGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  avatars: AvatarGroupItem[];
  /** Max avatars to show before collapsing into a +N counter (Figma: Show Counter). */
  max?: number;
  /** Avatar size (default `xs`, as the master). */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
}

export function AvatarGroup({ avatars, max, size = 'xs', className, ...rest }: AvatarGroupProps) {
  const shown = max != null ? avatars.slice(0, max) : avatars;
  const overflow = max != null ? avatars.length - shown.length : 0;

  return (
    <div className={cn('flex items-center', className)} {...rest}>
      {shown.map((avatar, i) => (
        <Avatar
          // biome-ignore lint/suspicious/noArrayIndexKey: avatars are a static, ordered list
          key={i}
          size={size}
          src={avatar.src}
          fallback={avatar.fallback}
          alt={avatar.alt}
          className={cn(overlapItem, i > 0 && 'ml-(--avatar-group-gap)')}
        />
      ))}
      {overflow > 0 ? (
        <Avatar
          size={size}
          className={cn(
            overlapItem,
            size === 'xs' && 'size-(--avatar-group-counter-size)',
            shown.length > 0 && 'ml-(--avatar-group-gap)',
          )}
          fallback={
            <>
              <span aria-hidden="true">+{overflow}</span>
              <span className="sr-only normal-case">{overflow} more</span>
            </>
          }
        />
      ) : null}
    </div>
  );
}
