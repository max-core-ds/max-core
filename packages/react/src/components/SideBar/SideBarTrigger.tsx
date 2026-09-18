'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useRail } from '../../utils/rail-context.js';

// Collapse toggle for the SideBar. Drop it into the `topBar` slot — it reads the
// surrounding rail from context and flips it, so the consumer doesn't own the
// collapsed state. Renders whatever icon you pass as children.
export type SideBarTriggerProps = Omit<ComponentPropsWithoutRef<'button'>, 'onClick'>;

export function SideBarTrigger({ children, className, type, ...rest }: SideBarTriggerProps) {
  const { collapsed, toggle } = useRail();
  return (
    <button
      type={type ?? 'button'}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-md)]',
        'text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]',
        '[&_svg]:size-[var(--size-20)]',
        focusRing,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
