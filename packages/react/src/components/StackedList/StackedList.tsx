'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Stacked List — a vertical list of content rows composed from the DS atoms
// (Avatar, AvatarGroup, Thumbnail, Badge, icons). One flexible `StackedListRow`
// covers the common row types via a `variant` axis; padding/gap/inner-gap/icon
// size are shared (-- Organism/Stacked List/Global/*), and each variant only
// swaps the leading slot size/shape:
//   default/social → 32px leading (icon 24 in text/secondary / avatar / avatar group)
//   media/product  → 56px leading, Item Radius sm (thumbnail, cropped)
// Row-type tokens: -- Organism/Stacked List/{Default,Social,Media Row,Product}/*.
//
// The master is rows only: each a bg/surface row with Border Weight none (no
// stroke), stacked edge to edge. `bordered` (card frame) and `divided` (row
// dividers) are React extensions, off by default.

const containerStyles = cva('flex w-full flex-col', {
  variants: {
    bordered: {
      true: 'overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)]',
      false: '',
    },
    divided: {
      true: '[&>*+*]:border-t [&>*+*]:border-[var(--border-muted)]',
      false: '',
    },
  },
  defaultVariants: { bordered: false, divided: false },
});

export interface StackedListProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof containerStyles> {}

export function StackedList({ bordered, divided, className, children, ...rest }: StackedListProps) {
  return (
    <div className={cn(containerStyles({ bordered, divided }), className)} {...rest}>
      {children}
    </div>
  );
}

// Leading slot sizing per row variant. The caller supplies the visual (Avatar,
// Thumbnail, icon, AvatarGroup); the slot fixes the token-defined footprint.
const leadingStyles = cva('flex shrink-0 items-center justify-center', {
  variants: {
    variant: {
      default: 'size-[var(--size-32)] text-[var(--text-secondary)] [&_svg]:size-[var(--size-24)]',
      social: 'size-[var(--size-32)]',
      media: 'size-[var(--size-56)] overflow-hidden rounded-[var(--radius-sm)]',
      product: 'size-[var(--size-56)] overflow-hidden rounded-[var(--radius-sm)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type StackedListVariant = NonNullable<VariantProps<typeof leadingStyles>['variant']>;

export interface StackedListRowProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'onClick'> {
  /** Row layout — controls the leading slot footprint. */
  variant?: StackedListVariant;
  /** Leading visual: an Avatar, Thumbnail, AvatarGroup, or icon. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Icon after the subtitle (Social's 12px chevron, the master's Show sub icon). */
  subtitleIcon?: ReactNode;
  /** Product price under the subtitle (Heading/H6, text/accent). */
  price?: ReactNode;
  /** Trailing content — an action, price, badge, or chevron. */
  trailing?: ReactNode;
  /** When set, the row renders as a button and gains hover feedback. */
  onClick?: ComponentPropsWithoutRef<'button'>['onClick'];
}

const rowStyles = cn(
  'flex w-full items-center gap-[var(--spacing-16)] bg-[var(--bg-surface)] text-left',
  'px-[var(--spacing-16)] py-[var(--spacing-12)]',
);

// Title Body/MD/700 (text/primary), subtitle Caption/300 (text/secondary).
const titleStyles = 'truncate text-base leading-[1.4] font-bold text-[var(--text-primary)]';
const subtitleStyles =
  'flex min-w-0 items-center gap-[var(--spacing-04)] text-xs leading-[1.3] font-light tracking-[0.005em] text-[var(--text-secondary)] [&_svg]:size-[var(--size-12)] [&_svg]:shrink-0';
const priceStyles = 'text-xl leading-[1.3] font-bold tracking-[-0.005em] text-[var(--text-accent)]';

export function StackedListRow({
  variant = 'default',
  leading,
  title,
  subtitle,
  subtitleIcon,
  price,
  trailing,
  onClick,
  className,
  ...rest
}: StackedListRowProps) {
  const content = (
    <>
      {leading != null ? <span className={leadingStyles({ variant })}>{leading}</span> : null}
      <span className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-08)]">
        <span className={titleStyles}>{title}</span>
        {subtitle != null ? (
          <span className={subtitleStyles}>
            <span className="truncate">{subtitle}</span>
            {subtitleIcon}
          </span>
        ) : null}
        {price != null ? <span className={priceStyles}>{price}</span> : null}
      </span>
      {trailing != null ? <span className="shrink-0">{trailing}</span> : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          rowStyles,
          // Hover is a React extension (the master has no row states). Rows sit edge
          // to edge, so the focused one is lifted over its neighbours' backgrounds.
          'transition-colors hover:bg-[var(--bg-subtle)] focus-visible:relative focus-visible:z-10',
          focusRing,
          className,
        )}
        {...(rest as ComponentPropsWithoutRef<'button'>)}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cn(rowStyles, className)} {...rest}>
      {content}
    </div>
  );
}
