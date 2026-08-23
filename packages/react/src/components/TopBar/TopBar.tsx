import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Padding/item gap/radius match -- Organism/Top Bar/*. Desktop uses radius xl;
// Mobile is a radius-full pill. Elevated adds effect/shadow/down/md. The mobile
// "floating" type uses frosted-glass circular button wrappers (bg/surface @ 20%
// + background blur) with the title on a row below.
const elevatedShadow = 'shadow-[var(--effect-shadow-down-md)]';
const frostedGlass = 'bg-[var(--bg-surface)]/20 backdrop-blur-xl';

export interface TopBarProps extends ComponentPropsWithoutRef<'header'> {
  variant?: 'desktop' | 'mobile';
  /** Mobile only: compact bar (`standard`) or floating buttons + title (`mobile`). */
  type?: 'standard' | 'mobile';
  /** Adds the down/md drop shadow (Elevated=On). */
  elevated?: boolean;
  leading?: ReactNode;
  center?: ReactNode;
  trailing?: ReactNode;
}

export function TopBar({
  variant = 'desktop',
  type = 'standard',
  elevated = false,
  leading,
  center,
  trailing,
  className,
  ...rest
}: TopBarProps) {
  // Mobile floating layout: circular frosted buttons on top, title row below.
  if (variant === 'mobile' && type === 'mobile') {
    return (
      <header
        className={cn(
          'flex w-full flex-col gap-[var(--spacing-16)] px-[var(--spacing-24)] py-[var(--spacing-12)]',
          '[&_svg]:size-[var(--size-24)]',
          className,
        )}
        {...rest}
      >
        <div className="flex items-center justify-between">
          <FrostedCircle elevated={elevated}>{leading}</FrostedCircle>
          <FrostedCircle elevated={elevated}>{trailing}</FrostedCircle>
        </div>
        {center ? (
          <div className="text-3xl font-bold text-[var(--text-primary)]">{center}</div>
        ) : null}
      </header>
    );
  }

  // Desktop 3-zone bar + Mobile compact (standard) bar — both single row.
  const isDesktop = variant === 'desktop';
  return (
    <header
      className={cn(
        'flex w-full items-center gap-[var(--spacing-24)]',
        'px-[var(--spacing-24)] py-[var(--spacing-12)]',
        isDesktop
          ? 'rounded-[var(--radius-xl)] border-b border-[var(--border-default)] bg-[var(--bg-surface)]'
          : cn(
              'rounded-[var(--radius-full)] border border-[var(--border-default)]',
              frostedGlass,
              '[&_svg]:size-[var(--size-24)]',
            ),
        elevated && elevatedShadow,
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-[var(--spacing-24)]">{leading}</div>
      <div className="flex flex-1 items-center justify-center">{center}</div>
      <div className="flex items-center gap-[var(--spacing-24)]">{trailing}</div>
    </header>
  );
}

// Circular frosted-glass wrapper for the floating mobile buttons.
function FrostedCircle({ elevated, children }: { elevated?: boolean; children?: ReactNode }) {
  if (!children) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-full)]',
        frostedGlass,
        elevated && elevatedShadow,
      )}
    >
      {children}
    </span>
  );
}
