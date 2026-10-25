import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Padding/item gap/radius/icon size match -- Organism/Top Bar/*. Every surface is
// frosted glass at the Background opacity token (20%) + effect/blur/md (24px):
// Desktop on bg/brand with radius xl, Mobile Standard on bg/surface with square
// corners, the floating Mobile buttons on bg/brand circles (radius full).
//
// Each surface carries Figma's 1px bottom stroke: a linear gradient border/accent →
// border/focus at 40%. Its transform puts the whole bottom edge at ~94–98% of the
// ramp, so it renders as border/focus. An inset shadow keeps it inside the box
// like Figma's INSIDE stroke (a CSS border would add 1px of height).
// Elevated adds effect/shadow/down/md.
const bottomStroke =
  '[--top-bar-stroke:inset_0_calc(var(--border-weight-thin)*-1)_0_color-mix(in_srgb,var(--border-focus)_40%,transparent)]';
const strokeShadow = 'shadow-[var(--top-bar-stroke)]';
const elevatedShadow = 'shadow-[var(--top-bar-stroke),var(--effect-shadow-down-md)]';
const glass = 'backdrop-blur-xl';
// Figma overrides the slot icons to text/primary (the Ghost button default is accent).
const iconSlot = '[&_svg]:size-[var(--size-24)] [&_button]:text-[var(--text-primary)]';
// Heading/H4 (floating title) and Heading/H5 (standard title): 120%, -0.5%.
const headingStyle = 'font-bold leading-[1.2] tracking-[-0.005em] text-[var(--text-primary)]';

export interface TopBarProps extends ComponentPropsWithoutRef<'header'> {
  variant?: 'desktop' | 'mobile';
  /** Mobile only: compact bar (`standard`) or floating buttons + title (`mobile`). */
  type?: 'standard' | 'mobile';
  /** Adds the down/md drop shadow (Elevated=On). */
  elevated?: boolean;
  /** Desktop: brand + entry content. Mobile: the left icon button. */
  leading?: ReactNode;
  /** Desktop: primary nav. Mobile: the page title (styled H5 standard, H4 floating). */
  center?: ReactNode;
  /** Desktop: actions + identity. Mobile: the right icon button (Show right = omit it). */
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
  // Mobile floating layout: frosted circular buttons on top, title row below.
  if (variant === 'mobile' && type === 'mobile') {
    return (
      <header
        className={cn(
          'flex w-full flex-col gap-[var(--spacing-24)] px-[var(--spacing-24)] py-[var(--spacing-12)]',
          iconSlot,
          className,
        )}
        {...rest}
      >
        <div className="flex items-center justify-between">
          <FrostedCircle elevated={elevated}>{leading}</FrostedCircle>
          <FrostedCircle elevated={elevated}>{trailing}</FrostedCircle>
        </div>
        {center ? <div className={cn('text-3xl', headingStyle)}>{center}</div> : null}
      </header>
    );
  }

  const isDesktop = variant === 'desktop';
  return (
    <header
      className={cn(
        'flex w-full items-center gap-[var(--spacing-24)]',
        'px-[var(--spacing-24)] py-[var(--spacing-12)]',
        bottomStroke,
        glass,
        elevated ? elevatedShadow : strokeShadow,
        isDesktop
          ? 'rounded-[var(--radius-xl)] bg-[var(--bg-brand)]/20'
          : cn('bg-[var(--bg-surface)]/20', iconSlot),
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-[var(--spacing-24)]">{leading}</div>
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center justify-center',
          !isDesktop && cn('text-2xl text-center', headingStyle),
        )}
      >
        {center}
      </div>
      <div className="flex items-center gap-[var(--spacing-24)]">{trailing}</div>
    </header>
  );
}

// Circular frosted-glass wrapper for the floating mobile buttons. The master binds the
// nested Icon Only Button's radius to Mobile/Radius too, so its state layer and focus
// ring stay circular.
function FrostedCircle({ elevated, children }: { elevated?: boolean; children?: ReactNode }) {
  if (!children) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-full)] bg-[var(--bg-brand)]/20',
        '[&>button]:rounded-[var(--radius-full)]',
        bottomStroke,
        glass,
        elevated ? elevatedShadow : strokeShadow,
      )}
    >
      {children}
    </span>
  );
}
