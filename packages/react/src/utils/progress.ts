/**
 * Shared track + fill visuals for the Progress Bar atom and the Range slider —
 * Figma composes Range from the Progress Bar atom, so both must render an
 * identical bar. Track background = accent/subtle, fill = accent/default, radius
 * full; per-size heights match the Progress Bar Size S/M/L Height tokens (4/8/16).
 *
 * `overflow-hidden` is intentionally NOT included: the Progress Bar adds it to
 * clip its fill, but the slider must let its knobs overflow the thin track.
 */
import { cn } from './cn.js';

const trackHeight = {
  s: 'h-[var(--size-4)]',
  m: 'h-[var(--size-8)]',
  l: 'h-[var(--size-16)]',
} as const;

export type ProgressSize = keyof typeof trackHeight;

export function progressTrack(size: ProgressSize = 'm'): string {
  return cn('w-full rounded-[var(--radius-full)] bg-[var(--accent-subtle)]', trackHeight[size]);
}

export const progressFill =
  'h-full rounded-[var(--radius-full)] bg-[var(--accent-default)] transition-all';
