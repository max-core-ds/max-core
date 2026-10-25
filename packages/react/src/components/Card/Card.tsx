import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { ActionBar } from '../ActionBar/ActionBar.js';

// Widget cards — the Figma "_Card" and "_Media Card" masters (page "widget card").
// Shared shell: bg/surface, 1px border/muted stroke (drawn over the content), radius md, clipped. Elevation
// None / Low / High = no shadow / effect/shadow/down/sm / effect/shadow/down/md.
// Titles are Heading/H6 (text/primary), body copy Body/SM/300 (text/secondary).

const elevationStyles = cva(
  [
    'relative flex flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-surface)] text-[var(--text-primary)]',
    // Figma's INSIDE stroke sits on top of the content and takes no space: an overlay,
    // not a CSS border (which would shrink the 272 / 280 content box and cover nothing).
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-[length:var(--border-weight-thin)] after:border-[var(--border-muted)] after:content-['']",
  ],
  {
    variants: {
      elevation: {
        none: '',
        low: 'shadow-[var(--effect-shadow-down-sm)]',
        high: 'shadow-[var(--effect-shadow-down-md)]',
      },
    },
    defaultVariants: { elevation: 'none' },
  },
);

const titleStyles =
  'text-xl leading-[1.3] font-bold tracking-[-0.005em] text-[var(--text-primary)]';
const bodyText = 'text-sm leading-[1.3] font-light text-[var(--text-secondary)]';

export type CardElevation = NonNullable<VariantProps<typeof elevationStyles>['elevation']>;

export interface CardProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>,
    VariantProps<typeof elevationStyles> {
  /** Header title (Heading/H6). The header renders when there's a title or `onClose`. */
  title?: ReactNode;
  /** Shows the header's close ✕ and fires on click. */
  onClose?: () => void;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Footer buttons, laid out by an Action Bar (equal columns). */
  actions?: ReactNode;
  /** Body Content slot. Plain text gets Body/SM/300 text/secondary. */
  children?: ReactNode;
}

/**
 * _Card: header (title + close) → Body Content → Action Bar, Padding 24 and
 * Items Gap 24 (-- Organism/Card/Base/*). Body items sit 16 apart (Body Gap).
 */
export function Card({
  elevation,
  title,
  onClose,
  closeLabel = 'Close',
  actions,
  children,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        elevationStyles({ elevation }),
        'gap-[var(--spacing-24)] p-[var(--spacing-24)]',
        className,
      )}
      {...rest}
    >
      {title != null || onClose ? (
        <div className="flex items-center justify-between gap-[var(--spacing-12)]">
          <div className={cn('min-w-0 flex-1', titleStyles)}>{title}</div>
          {onClose ? (
            <button
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              className={cn(
                'inline-flex size-[var(--size-24)] shrink-0 items-center justify-center rounded-[var(--radius-sm)]',
                'text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]',
                focusRing,
              )}
            >
              {/* The master's Close Icon: two 12px strokes (2px) in a 24 frame. */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
                className="size-[var(--size-24)]"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          ) : null}
        </div>
      ) : null}
      {children != null ? (
        <div className={cn('flex flex-col gap-[var(--spacing-16)]', bodyText)}>{children}</div>
      ) : null}
      {actions != null ? (
        // The master's buttons share the 272 content width (132 each), under the
        // Action Bar's 160 minimum.
        <ActionBar className="auto-cols-[minmax(0,1fr)]">{actions}</ActionBar>
      ) : null}
    </div>
  );
}

export interface MediaCardProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>,
    VariantProps<typeof elevationStyles> {
  /** Media Slot: an image / video that fills the 240px area (bg/subtle behind it). */
  media?: ReactNode;
  /** Badge over the media's top-left corner (the master's Show Badge, a Badge S). */
  badge?: ReactNode;
  title?: ReactNode;
  /** Meta line under the title, e.g. a date (the master's Show Date; Caption/300 text/accent). */
  meta?: ReactNode;
  /** Description (Body/SM/300 text/secondary). */
  description?: ReactNode;
  /** Trailing action, right-aligned (a Link Button in the master). */
  action?: ReactNode;
  /** Extra Content Slot content, after the description. */
  children?: ReactNode;
}

/**
 * _Media Card: Media Slot (240 tall, Image Height) over a Content Slot (Padding 16,
 * Content Gap 12; -- Organism/Card/Media/*), at least 280 wide (Min Width).
 */
export function MediaCard({
  elevation,
  media,
  badge,
  title,
  meta,
  description,
  action,
  children,
  className,
  ...rest
}: MediaCardProps) {
  return (
    <div className={cn(elevationStyles({ elevation }), 'min-w-[280px]', className)} {...rest}>
      <div className="relative flex h-[240px] shrink-0 items-center justify-center overflow-hidden bg-[var(--bg-subtle)] [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover">
        {media}
        {badge != null ? (
          <div className="absolute top-[var(--spacing-12)] left-[var(--spacing-12)]">{badge}</div>
        ) : null}
      </div>
      <div className="flex flex-col gap-[var(--spacing-12)] p-[var(--spacing-16)]">
        {title != null ? <div className={titleStyles}>{title}</div> : null}
        {meta != null ? (
          <div className="text-xs leading-[1.3] font-light tracking-[0.005em] text-[var(--text-accent)]">
            {meta}
          </div>
        ) : null}
        {description != null ? <div className={bodyText}>{description}</div> : null}
        {children}
        {action != null ? (
          <div className="flex justify-end gap-[var(--spacing-08)]">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
