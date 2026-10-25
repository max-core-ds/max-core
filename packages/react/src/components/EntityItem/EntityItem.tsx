'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { useRailCollapsed } from '../../utils/rail-context.js';

// Avatar/Thumbnail + stacked title/subtitle + optional trailing content. Gap
// (leading ↔ text) and Label Gap (title ↔ subtitle) match -- Molecule/Entity Item/*.
// Figma Type: User = Avatar S + Body/MD/700 title; Workspace = circular Thumbnail S
// + Body/LG/700 title. The subtitle is Caption/300 text/secondary in both.
const titleSize = { user: 'text-base', workspace: 'text-lg' } as const;

export interface EntityItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Leading visual — an Avatar, Thumbnail, or icon. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Figma Type: `workspace` uses the larger Body/LG title (default `user`). */
  type?: keyof typeof titleSize;
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
  type = 'user',
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
          <span
            data-entity-title={type}
            className={cn(titleSize[type], 'font-bold text-[var(--text-primary)]')}
          >
            {title}
          </span>
          {subtitle ? (
            <span
              data-entity-subtitle=""
              className="text-xs font-light text-[var(--text-secondary)]"
            >
              {subtitle}
            </span>
          ) : null}
        </div>
      )}
      {!isCollapsed && trailing}
    </div>
  );
}
