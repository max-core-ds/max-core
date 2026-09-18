'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { useRailCollapsed } from '../../utils/rail-context.js';

// Avatar/Thumbnail + stacked title/subtitle + optional trailing content. Gap
// (leading ↔ text) and Label Gap (title ↔ subtitle) match -- Molecule/Entity Item/*.
export interface EntityItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Leading visual — an Avatar, Thumbnail, or icon. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Trailing content — an action, chevron, or badge. */
  trailing?: ReactNode;
  /**
   * Icon-only rail mode: shows only the leading visual, centered, and hides the
   * title/subtitle/trailing. Defaults to the surrounding rail (e.g. a collapsed
   * SideBar) when omitted.
   */
  collapsed?: boolean;
}

export function EntityItem({
  leading,
  title,
  subtitle,
  trailing,
  collapsed,
  className,
  ...rest
}: EntityItemProps) {
  const isCollapsed = useRailCollapsed(collapsed);
  return (
    <div
      className={cn(
        'flex items-center gap-[var(--spacing-08)]',
        isCollapsed && 'justify-center',
        className,
      )}
      {...rest}
    >
      {leading}
      {!isCollapsed && (
        <div className="flex flex-1 flex-col gap-[var(--spacing-08)]">
          <span className="text-base font-bold text-[var(--text-primary)]">{title}</span>
          {subtitle ? (
            <span className="text-sm text-[var(--text-secondary)]">{subtitle}</span>
          ) : null}
        </div>
      )}
      {!isCollapsed && trailing}
    </div>
  );
}
