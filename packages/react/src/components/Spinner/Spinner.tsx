import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Sizes match -- Atoms/Spinner/Size */Size (16/20/24/48). A full Track ring plus
// a quarter Indicator arc that spins, per the Figma Style columns:
//   brand (Brand)      accent/subtle track    · accent/default arc
//   neutral (Neutral)  neutral/subtle track   · neutral/active arc
//   inverse (Inverse)  text/on-accent track   · accent/active arc (for accent bgs)
//
// Ring thickness follows the master's *rendered* geometry (decision, Phase 4.5):
// its Track/Indicator ellipses are filled donut arcs with innerRadius 0.63 (S–L)
// and 0.75 (XL), so the ring is 37% / 25% of the radius, the same for track and
// arc. The bound Track/Indicator Stroke tokens sit on strokes with no paint in
// Figma and never render, so they aren't used here (flagged to the designer).
// Drawn in a 100-unit viewBox (radius 50): stroke = ring thickness, centred on
// r = 50 − stroke/2.
const RING = {
  default: { stroke: 18.5, r: 40.75 },
  xl: { stroke: 12.5, r: 43.75 },
} as const;

const spinnerStyles = cva('relative inline-grid shrink-0 place-items-center', {
  variants: {
    size: {
      s: 'size-[var(--size-16)]',
      m: 'size-[var(--size-20)]',
      l: 'size-[var(--size-24)]',
      xl: 'size-[var(--size-48)]',
    },
  },
  defaultVariants: { size: 'm' },
});

// Fully-written literals (Tailwind must see them verbatim).
const toneStroke = {
  brand: { track: 'stroke-[var(--accent-subtle)]', indicator: 'stroke-[var(--accent-default)]' },
  neutral: {
    track: 'stroke-[var(--neutral-subtle)]',
    indicator: 'stroke-[var(--neutral-active)]',
  },
  inverse: { track: 'stroke-[var(--text-on-accent)]', indicator: 'stroke-[var(--accent-active)]' },
} as const;

type SpinnerTone = keyof typeof toneStroke;

interface SpinnerBaseProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Figma Style: Brand / Neutral / Inverse (use `inverse` on accent backgrounds). */
  tone?: SpinnerTone;
  /** Accessible label; defaults to "Loading". Set to "" if a sibling already labels it. */
  label?: string;
}

export type SpinnerProps = SpinnerBaseProps &
  (
    | {
        size: 'xl';
        /** Percentage (0–100) shown in the centre (Figma "Show %", XL only). */
        value?: number;
      }
    | {
        size?: Exclude<VariantProps<typeof spinnerStyles>['size'], 'xl' | null>;
        value?: never;
      }
  );

export function Spinner({
  size,
  tone = 'brand',
  value,
  className,
  label = 'Loading',
  ...rest
}: SpinnerProps) {
  const ring = size === 'xl' ? RING.xl : RING.default;
  const stroke = toneStroke[tone];
  const percent = value == null ? undefined : Math.round(Math.min(100, Math.max(0, value)));
  return (
    <span
      // With a percentage it reports determinate progress; otherwise it's a status.
      role={percent == null ? 'status' : 'progressbar'}
      aria-label={label || undefined}
      aria-valuenow={percent}
      aria-valuemin={percent == null ? undefined : 0}
      aria-valuemax={percent == null ? undefined : 100}
      className={cn(spinnerStyles({ size }), className)}
      {...rest}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="col-start-1 row-start-1 size-full animate-spin"
      >
        <circle
          cx="50"
          cy="50"
          r={ring.r}
          fill="none"
          strokeWidth={ring.stroke}
          className={stroke.track}
        />
        {/* Quarter arc, starting at 12 o'clock. */}
        <circle
          cx="50"
          cy="50"
          r={ring.r}
          fill="none"
          strokeWidth={ring.stroke}
          pathLength={100}
          strokeDasharray="25 100"
          transform="rotate(-90 50 50)"
          className={stroke.indicator}
        />
      </svg>
      {percent != null ? (
        <span className="col-start-1 row-start-1 text-sm font-bold text-[var(--text-primary)] tabular-nums">
          {percent}%
        </span>
      ) : null}
    </span>
  );
}
