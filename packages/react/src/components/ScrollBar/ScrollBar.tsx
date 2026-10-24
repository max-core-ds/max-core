import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Minimal scroll-position indicator matching -- Atoms/Scroll Bar (Figma):
// a transparent track (4px padding all sides) holding a rounded thumb —
// 4px wide, 24px tall, accent/subtle fill, fully rounded. Standalone atom,
// no variants/states/focus. Decorative by default (aria-hidden); the real
// scroll region owns the semantics.
//
// Standalone (default): the thumb is a fixed 24px pill — a static accent.
// Driven: pass `thumbSize`/`thumbOffset` (px) and the atom becomes a full-length
// rail with an absolutely-positioned thumb a parent can move from scroll metrics
// (see ScrollArea). Both keep the same 4px accent/subtle rounded look.
const trackClass = 'inline-flex shrink-0 p-[var(--spacing-04)]';
const thumbClass =
  'block w-[var(--spacing-04)] h-[var(--size-24)] rounded-[var(--radius-full)] bg-[var(--accent-subtle)]';

// Driven rail: the same 4px padding on every side as the standalone track (so
// the cross axis is 4 + 4 + 4 = 12px and the thumb stops 4px short of either
// end), around an inner lane the thumb is positioned in via inline style from
// the parent. Vertical grows full height; horizontal grows full width.
const railClass = 'relative shrink-0 p-[var(--spacing-04)]';
const laneClass = {
  vertical: 'relative block h-full w-[var(--spacing-04)]',
  horizontal: 'relative block w-full h-[var(--spacing-04)]',
} as const;
const railThumbBaseClass = 'absolute rounded-[var(--radius-full)] bg-[var(--accent-subtle)]';
const railThumbCrossClass = {
  vertical: 'inset-x-0 top-0',
  horizontal: 'inset-y-0 left-0',
} as const;

export interface ScrollBarProps extends ComponentPropsWithoutRef<'div'> {
  /** Thumb length in px along the scroll axis. Omit for the standalone 24px pill. */
  thumbSize?: number;
  /** Thumb offset in px from the start of the lane (inside the 4px padding). Only used with `thumbSize`. */
  thumbOffset?: number;
  /** Rail axis when driven. Defaults to vertical. */
  orientation?: 'vertical' | 'horizontal';
}

export function ScrollBar({
  className,
  thumbSize,
  thumbOffset = 0,
  orientation = 'vertical',
  style,
  ...rest
}: ScrollBarProps) {
  if (thumbSize != null) {
    const horizontal = orientation === 'horizontal';
    return (
      <div aria-hidden className={cn(railClass, className)} style={style} {...rest}>
        <span className={laneClass[orientation]}>
          <span
            className={cn(railThumbBaseClass, railThumbCrossClass[orientation])}
            style={
              horizontal
                ? { width: thumbSize, transform: `translateX(${thumbOffset}px)` }
                : { height: thumbSize, transform: `translateY(${thumbOffset}px)` }
            }
          />
        </span>
      </div>
    );
  }
  return (
    <div aria-hidden className={cn(trackClass, className)} style={style} {...rest}>
      <span className={thumbClass} />
    </div>
  );
}
