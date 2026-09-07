import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Avatar/Thumbnail + stacked title/subtitle + optional trailing content. Gap
// (leading ↔ text) and Label Gap (title ↔ subtitle) match -- Molecule/Entity Item/*.
export interface EntityItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Leading visual — an Avatar, Thumbnail, or icon. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Trailing content — an action, chevron, or badge. */
  trailing?: ReactNode;
}

export function EntityItem({
  leading,
  title,
  subtitle,
  trailing,
  className,
  ...rest
}: EntityItemProps) {
  return (
    <div className={cn('flex items-center gap-[var(--spacing-08)]', className)} {...rest}>
      {leading}
      <div className="flex flex-1 flex-col gap-[var(--spacing-08)]">
        <span className="text-base font-bold text-[var(--text-primary)]">{title}</span>
        {subtitle ? <span className="text-sm text-[var(--text-secondary)]">{subtitle}</span> : null}
      </div>
      {trailing}
    </div>
  );
}
