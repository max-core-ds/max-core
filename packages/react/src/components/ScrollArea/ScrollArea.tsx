'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils/cn.js';
import { ScrollBar } from '../ScrollBar/ScrollBar.js';

// Scroll container that hides the native scrollbar and renders the ScrollBar
// atom as an *external* rail beside the content, driven from the viewport's
// scroll metrics. The rail can sit outside the content box (unlike a native
// scrollbar, which is locked inside the element).
//
// The consumer gives ScrollArea a bounded size on the scroll axis (e.g. `h-64`
// for vertical, `w-96` for horizontal); the viewport fills it and scrolls.
// Click or drag the rail to scroll.

/** Shortest the thumb is allowed to get, so it stays grabbable. Matches the atom's 24px. */
const MIN_THUMB = 24;
/** The rail's padding (-- Atoms/Scroll Bar/Padding, 4px) at each end of the lane. */
const RAIL_PADDING = 4;

/** Thumb length for a lane of `track` px showing `client` of `scrollSize`. */
const thumbLength = (track: number, client: number, scrollSize: number) =>
  Math.max(MIN_THUMB, (client / scrollSize) * track);

export interface ScrollAreaProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  children: ReactNode;
  /** Scroll axis. Defaults to vertical. */
  orientation?: 'vertical' | 'horizontal';
  /** Gap in px between the content and the external rail. Defaults to 8. */
  railGap?: number;
}

export function ScrollArea({
  children,
  className,
  orientation = 'vertical',
  railGap = 8,
  style,
  ...rest
}: ScrollAreaProps) {
  const horizontal = orientation === 'horizontal';
  const viewportRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ size: 0, offset: 0, visible: false });

  // Read scroll metrics for the active axis.
  const axis = useCallback(
    (el: HTMLDivElement) =>
      horizontal
        ? { pos: el.scrollLeft, size: el.scrollWidth, client: el.clientWidth }
        : { pos: el.scrollTop, size: el.scrollHeight, client: el.clientHeight },
    [horizontal],
  );

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { pos, size: scrollSize, client } = axis(el);
    if (scrollSize <= client) {
      setThumb((t) => (t.visible ? { ...t, visible: false } : t));
      return;
    }
    // The rail spans the viewport; the thumb travels the lane inside its padding.
    const track = client - 2 * RAIL_PADDING;
    const size = thumbLength(track, client, scrollSize);
    const maxOffset = Math.max(0, track - size);
    const offset = maxOffset * (pos / (scrollSize - client));
    setThumb({ size, offset, visible: true });
  }, [axis]);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    measure();
    // Re-measure when the viewport or its content resizes.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [measure]);

  // Click / drag the rail to scroll: translate a pointer delta along the axis
  // into a scroll delta over the matching range.
  const onRailPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = viewportRef.current;
      if (!el) return;
      event.preventDefault();
      const rail = event.currentTarget;
      rail.setPointerCapture(event.pointerId);
      const start = horizontal ? event.clientX : event.clientY;
      const { pos: startPos, size: scrollSize, client } = axis(el);
      const track = client - 2 * RAIL_PADDING;
      const usable = track - thumbLength(track, client, scrollSize);

      const onMove = (e: PointerEvent) => {
        if (usable <= 0) return;
        const delta = (horizontal ? e.clientX : e.clientY) - start;
        const scrollDelta = (delta / usable) * (scrollSize - client);
        if (horizontal) el.scrollLeft = startPos + scrollDelta;
        else el.scrollTop = startPos + scrollDelta;
      };
      const onUp = (e: PointerEvent) => {
        rail.releasePointerCapture(e.pointerId);
        rail.removeEventListener('pointermove', onMove);
        rail.removeEventListener('pointerup', onUp);
        rail.removeEventListener('pointercancel', onUp);
      };
      rail.addEventListener('pointermove', onMove);
      rail.addEventListener('pointerup', onUp);
      rail.addEventListener('pointercancel', onUp);
    },
    [axis, horizontal],
  );

  return (
    <div
      className={cn('flex', horizontal && 'flex-col', className)}
      style={{ gap: railGap, ...style }}
      {...rest}
    >
      <div
        ref={viewportRef}
        onScroll={measure}
        className={cn(
          'min-h-0 min-w-0 flex-1 scrollbar-none',
          horizontal ? 'overflow-x-auto' : 'overflow-y-auto',
        )}
      >
        {children}
      </div>
      {thumb.visible ? (
        <ScrollBar
          className="cursor-pointer touch-none"
          orientation={orientation}
          thumbSize={thumb.size}
          thumbOffset={thumb.offset}
          onPointerDown={onRailPointerDown}
        />
      ) : null}
    </div>
  );
}
