'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { useRailCollapsed } from '../../utils/rail-context.js';

// Avatar/Thumbnail + stacked title/subtitle + optional trailing content. Gap
// (leading ↔ text) and Label Gap (title ↔ subtitle) are -- Molecule/Entity Item/*.
// Figma Type: User = Avatar S + Body/MD/700 title; Workspace = circular Thumbnail S
// + Body/LG/700 title. The subtitle is Caption/300 text/secondary in both. Labels
// are cap-trimmed (flex items), so a title alone is 12 / 13 tall like the master.
const titleSize = { user: 'type-body-md-700', workspace: 'type-body-lg-700' } as const;

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
        'flex items-center gap-(--entity-item-gap)',
        isCollapsed && 'justify-center',
        className,
      )}
      {...rest}
    >
      {leading}
      {isCollapsed ? (
        // Avatar-only when collapsed: the title stays for screen readers (it names the
        // surrounding Entity Card / trigger).
        <span className="sr-only">{title}</span>
      ) : (
        <div className="flex flex-1 flex-col gap-(--entity-item-label-gap)">
          <span
            data-entity-title={type}
            className={cn(titleSize[type], 'text-[var(--text-primary)]')}
          >
            {title}
          </span>
          {subtitle ? (
            <span data-entity-subtitle="" className="type-caption-300 text-[var(--text-secondary)]">
              {subtitle}
            </span>
          ) : null}
        </div>
      )}
      {!isCollapsed && trailing}
    </div>
  );
}
