import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';

// Padding X/Y, Item Gap, Radius, Border Weight and Icon Size are -- Organism/Top
// Bar/Desktop|Mobile|Global/*. Every surface is frosted glass: bg/surface at the
// Global/Background opacity token (20%) + effect/blur/md — Desktop with Global/Radius,
// Mobile Standard square, the floating Mobile buttons as Mobile/Radius circles. One
// surface colour for all bars (Max, round 1: was bg/brand on Desktop + floating).
//
// Each surface carries Figma's 1px bottom stroke: a linear gradient border/accent →
// border/focus at 40%. Its transform puts the whole bottom edge at ~94–98% of the
// ramp, so it renders as border/focus. An inset shadow keeps it inside the box
// like Figma's INSIDE stroke (a CSS border would add 1px of height).
// Elevated adds effect/shadow/down/md.
const bottomStroke =
  '[--top-bar-stroke:inset_0_calc(var(--top-bar-global-border-weight)*-1)_0_color-mix(in_srgb,var(--border-focus)_40%,transparent)]';
const strokeShadow = 'shadow-[var(--top-bar-stroke)]';
const elevatedShadow = 'shadow-[var(--top-bar-stroke),var(--effect-shadow-down-md)]';
const glass =
  'backdrop-blur-effect-md bg-[color-mix(in_srgb,var(--bg-surface)_calc(var(--top-bar-global-background-opacity)*100%),transparent)]';
// Figma overrides the slot icons to text/primary (the Ghost button default is accent).
const iconSlot = '[&_svg]:size-(--top-bar-mobile-icon-size) [&_button]:text-[var(--text-primary)]';
// Heading/H4 (floating title) and Heading/H5 (standard title), cap-trimmed.
const headingStyle = 'text-[var(--text-primary)]';

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
          'flex w-full flex-col gap-(--top-bar-mobile-item-gap) px-(--top-bar-mobile-padding-x) py-(--top-bar-mobile-padding-y)',
          iconSlot,
          className,
        )}
        {...rest}
      >
        <div className="flex items-center justify-between">
          <FrostedCircle elevated={elevated}>{leading}</FrostedCircle>
          <FrostedCircle elevated={elevated}>{trailing}</FrostedCircle>
        </div>
        {center ? <div className={cn('type-h4', headingStyle)}>{center}</div> : null}
      </header>
    );
  }

  const isDesktop = variant === 'desktop';
  // The Leading / Trailing slots space their items by the bar's Item Gap.
  const slotGap = isDesktop
    ? 'gap-(--top-bar-desktop-item-gap)'
    : 'gap-(--top-bar-mobile-item-gap)';
  return (
    <header
      className={cn(
        'flex w-full items-center',
        isDesktop
          ? 'gap-(--top-bar-desktop-item-gap) px-(--top-bar-desktop-padding-x) py-(--top-bar-desktop-padding-y)'
          : 'gap-(--top-bar-mobile-item-gap) px-(--top-bar-mobile-padding-x) py-(--top-bar-mobile-padding-y)',
        bottomStroke,
        glass,
        elevated ? elevatedShadow : strokeShadow,
        isDesktop ? 'rounded-(--top-bar-global-radius)' : iconSlot,
        className,
      )}
      {...rest}
    >
      <div className={cn('flex items-center', slotGap)}>{leading}</div>
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center justify-center',
          !isDesktop && cn('type-h5 text-center', headingStyle),
        )}
      >
        {/* The standard title is a flex item here, so it needs its own trim. */}
        {isDesktop ? center : <span className={capTrim}>{center}</span>}
      </div>
      <div className={cn('flex items-center', slotGap)}>{trailing}</div>
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
        'inline-flex items-center justify-center rounded-(--top-bar-mobile-radius)',
        '[&>button]:rounded-(--top-bar-mobile-radius)',
        bottomStroke,
        glass,
        elevated ? elevatedShadow : strokeShadow,
      )}
    >
      {children}
    </span>
  );
}
