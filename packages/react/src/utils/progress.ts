/**
 * Shared track + fill visuals for the Progress Bar atom and the Range slider —
 * Figma composes Range from the Progress Bar atom, so both must render an
 * identical bar. Track background = accent/subtle, fill = accent/default, radius
 * full; per-size height + radius are -- Atoms/Progress Bar/Size S|M|L/Height|Radius
 * (4/8/16, Global/Radius = full). Global/Border Weight is `none`, so no stroke.
 *
 * `overflow-hidden` is intentionally NOT included: the Progress Bar adds it to
 * clip its fill, but the slider must let its knobs overflow the thin track.
 */
import { cn } from './cn.js';

const trackSize = {
  s: 'h-(--progress-bar-size-s-height) rounded-(--progress-bar-size-s-radius)',
  m: 'h-(--progress-bar-size-m-height) rounded-(--progress-bar-size-m-radius)',
  l: 'h-(--progress-bar-size-l-height) rounded-(--progress-bar-size-l-radius)',
} as const;

export type ProgressSize = keyof typeof trackSize;

export function progressTrack(size: ProgressSize = 'm'): string {
  return cn('w-full bg-(--accent-subtle)', trackSize[size]);
}

// Fill radius = the track's (Figma: Value=100 fill binds Size */Radius).
export const progressFill = 'h-full rounded-[inherit] bg-(--accent-default) transition-all';
