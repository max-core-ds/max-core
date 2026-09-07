import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { Avatar } from '../Avatar/Avatar.js';

// Overlapping avatars. Gap = -12 (raw negative overlap); each avatar gets a ring
// in the page background to separate it (Border Weight token).
export interface AvatarGroupItem {
  src?: string;
  fallback?: ReactNode;
  alt?: string;
}

export interface AvatarGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  avatars: AvatarGroupItem[];
  /** Max avatars to show before collapsing into a +N counter. */
  max?: number;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
}

export function AvatarGroup({ avatars, max, size = 'm', className, ...rest }: AvatarGroupProps) {
  const shown = max != null ? avatars.slice(0, max) : avatars;
  const overflow = max != null ? avatars.length - shown.length : 0;

  return (
    <div className={cn('flex items-center', className)} {...rest}>
      {shown.map((avatar, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: avatars are a static, ordered list
          key={i}
          className={cn(
            'rounded-[var(--radius-full)] ring-1 ring-[var(--border-surface)]',
            i > 0 && 'ml-[-12px]',
          )}
        >
          <Avatar size={size} src={avatar.src} fallback={avatar.fallback} alt={avatar.alt} />
        </div>
      ))}
      {overflow > 0 ? (
        <div className="ml-[-12px] rounded-[var(--radius-full)] ring-1 ring-[var(--border-surface)]">
          <Avatar size={size} fallback={`+${overflow}`} />
        </div>
      ) : null}
    </div>
  );
}
