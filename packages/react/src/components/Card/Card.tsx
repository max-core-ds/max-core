import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { CloseIcon } from '../../utils/close-button.js';
import { cn } from '../../utils/cn.js';
import { ActionBar } from '../ActionBar/ActionBar.js';
import { IconOnlyButton } from '../IconOnlyButton/IconOnlyButton.js';

// Widget cards — the Figma "_Card" and "_Media Card" masters (page "widget card").
// Shared shell: bg/surface, Card/Base/Border Weight border/muted stroke (drawn over the
// content), clipped; Radius per card (Base / Media). Elevation None / Low / High = no
// shadow / effect/shadow/down/sm / effect/shadow/down/md. Titles are Heading/H6
// (text/primary), body copy Body/SM/300 (text/secondary), meta Caption/300 — all
// cap-trimmed. -- Organism/Card/Base|Media/* throughout.

const elevationStyles = cva(
  [
    'relative flex flex-col overflow-hidden bg-[var(--bg-surface)] text-[var(--text-primary)]',
    // Figma's INSIDE stroke sits on top of the content and takes no space: an overlay,
    // not a CSS border (which would shrink the 272 / 280 content box and cover nothing).
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-(length:--card-base-border-weight) after:border-[var(--border-muted)] after:content-['']",
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

const titleStyles = 'type-h6 text-[var(--text-primary)]';
const bodyText = 'type-body-sm-300 text-[var(--text-secondary)]';

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
 * _Card: header (title + close, Header Gap) → Body Content (Body Gap) → Action Bar,
 * Padding and Items Gap apart (-- Organism/Card/Base/*). The close is a Ghost S Icon
 * Only Button, as the master.
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
        'rounded-(--card-base-radius) gap-(--card-base-items-gap) p-(--card-base-padding)',
        className,
      )}
      {...rest}
    >
      {title != null || onClose ? (
        <div className="flex items-center justify-between gap-(--card-base-header-gap)">
          <div className={cn('min-w-0 flex-1', titleStyles)}>{title}</div>
          {onClose ? (
            <IconOnlyButton
              aria-label={closeLabel}
              onClick={onClose}
              variant="ghost"
              size="s"
              icon={<CloseIcon />}
            />
          ) : null}
        </div>
      ) : null}
      {children != null ? (
        <div className={cn('flex flex-col gap-(--card-base-body-gap)', bodyText)}>{children}</div>
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
 * _Media Card: Media Slot (Image Height) over a Content Slot (Padding, Content Gap;
 * -- Organism/Card/Media/*), at least Min Width wide.
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
    <div
      className={cn(
        elevationStyles({ elevation }),
        'min-w-(--card-media-min-width) rounded-(--card-media-radius)',
        className,
      )}
      {...rest}
    >
      <div className="relative flex h-(--card-media-image-height) shrink-0 items-center justify-center overflow-hidden bg-[var(--bg-subtle)] [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover">
        {media}
        {badge != null ? (
          <div className="absolute top-[var(--spacing-12)] left-[var(--spacing-12)]">{badge}</div>
        ) : null}
      </div>
      <div className="flex flex-col gap-(--card-media-content-gap) p-(--card-media-padding)">
        {title != null ? <div className={titleStyles}>{title}</div> : null}
        {meta != null ? (
          <div className="type-caption-300 text-[var(--text-accent)]">{meta}</div>
        ) : null}
        {description != null ? <div className={bodyText}>{description}</div> : null}
        {children}
        {action != null ? (
          <div className="flex justify-end gap-(--card-media-footer-gap)">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
