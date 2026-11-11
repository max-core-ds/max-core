'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { truncateTrimmed } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Stacked List — a vertical list of content rows composed from the DS atoms
// (Avatar, AvatarGroup, Thumbnail, Badge, icons). One flexible `StackedListRow`
// covers the common row types via a `variant` axis. Each variant binds its own
// row-type tokens (-- Organism/Stacked List/{Default,Social,Media Row,Product}/*:
// Padding X/Y, Gap, Inner Gap, Border Weight, Item Size / Radius, Icon Size —
// they alias Global today) and swaps the leading slot:
//   default → the bare Icon Size icon (24, text/secondary), as the master
//   social  → Item Size (32) avatar / avatar group
//   media/product → Item Size (56), Item Radius (thumbnail, cropped)
//
// The master is rows only: each a bg/surface row with a border/default stroke at
// Border Weight none (Max: kept so a theme can switch borders on), stacked edge
// to edge. `bordered` (card frame) and `divided` (row
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
      default:
        'size-(--stacked-list-default-icon-size) text-[var(--text-secondary)] [&_svg]:size-(--stacked-list-default-icon-size)',
      social: 'size-(--stacked-list-social-item-size)',
      media:
        'size-(--stacked-list-media-row-item-size) overflow-hidden rounded-(--stacked-list-media-row-item-radius)',
      product:
        'size-(--stacked-list-product-item-size) overflow-hidden rounded-(--stacked-list-product-item-radius)',
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

// Row frame per type. Figma strokes sit inside, so the padding gives the stroke back.
const rowStyles = cva(
  'flex w-full items-center border-solid border-[var(--border-default)] bg-[var(--bg-surface)] text-left',
  {
    variants: {
      variant: {
        default:
          'gap-(--stacked-list-default-gap) border-(length:--stacked-list-default-border-weight) px-[calc(var(--stacked-list-default-padding-x)-var(--stacked-list-default-border-weight))] py-[calc(var(--stacked-list-default-padding-y)-var(--stacked-list-default-border-weight))]',
        social:
          'gap-(--stacked-list-social-gap) border-(length:--stacked-list-social-border-weight) px-[calc(var(--stacked-list-social-padding-x)-var(--stacked-list-social-border-weight))] py-[calc(var(--stacked-list-social-padding-y)-var(--stacked-list-social-border-weight))]',
        media:
          'gap-(--stacked-list-media-row-gap) border-(length:--stacked-list-media-row-border-weight) px-[calc(var(--stacked-list-media-row-padding-x)-var(--stacked-list-media-row-border-weight))] py-[calc(var(--stacked-list-media-row-padding-y)-var(--stacked-list-media-row-border-weight))] [&>[data-trailing]_svg]:size-(--stacked-list-media-row-icon-size)',
        product:
          'gap-(--stacked-list-product-gap) border-(length:--stacked-list-product-border-weight) px-[calc(var(--stacked-list-product-padding-x)-var(--stacked-list-product-border-weight))] py-[calc(var(--stacked-list-product-padding-y)-var(--stacked-list-product-border-weight))]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

// Text column: Inner Gap between title, subtitle and price.
const textGap = {
  default: 'gap-(--stacked-list-default-inner-gap)',
  social: 'gap-(--stacked-list-social-inner-gap)',
  media: 'gap-(--stacked-list-media-row-inner-gap)',
  product: 'gap-(--stacked-list-product-inner-gap)',
} as const;

// Title Body/MD/700 (text/primary), subtitle Caption/300 (text/secondary), price
// Heading/H6 (text/accent) — all cap-trimmed, so rows measure the master's 56 / 80.
const titleStyles = cn(truncateTrimmed, 'type-body-md-700 text-[var(--text-primary)]');
const subtitleStyles =
  'flex min-w-0 items-center gap-[var(--spacing-04)] text-[var(--text-secondary)] [&_svg]:size-[var(--size-12)] [&_svg]:shrink-0';
const priceStyles = 'type-h6 text-[var(--text-accent)]';

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
      <span className={cn('flex min-w-0 flex-1 flex-col', textGap[variant])}>
        <span className={titleStyles}>{title}</span>
        {subtitle != null ? (
          <span className={subtitleStyles}>
            <span className={cn(truncateTrimmed, 'type-caption-300')}>{subtitle}</span>
            {subtitleIcon}
          </span>
        ) : null}
        {price != null ? <span className={priceStyles}>{price}</span> : null}
      </span>
      {trailing != null ? (
        <span data-trailing="" className="flex shrink-0">
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          rowStyles({ variant }),
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
    <div className={cn(rowStyles({ variant }), className)} {...rest}>
      {content}
    </div>
  );
}
