/**
 * Shared tooltip bubble visual, reused by the Tooltip atom and the Range
 * slider's value bubble (Figma composes Range from the Tooltip atom).
 *
 * The tooltip is an INVERTED surface — a light `neutral/default` bubble with
 * dark `text/on-accent-muted` text — so it stands out from the page (~17:1
 * against bg/default, either mode). Padding, radius and arrow radius match
 * -- Atoms/Tooltip/* (16 / md / xs). No shadow: the master has no effect.
 *
 * Figma's text styles use leading trim (cap height), so the 16px padding runs
 * from the cap top / baseline: the master bubble is 16 + 9 + 16 = 41 tall.
 * `text-box: trim-both cap alphabetic` is the CSS equivalent (browsers without
 * it fall back to the full 15.6px line box, about 7px taller). Caption is 130%.
 */
// `relative` so an absolutely-positioned arrow anchors to the bubble.
export const tooltipBubble =
  'relative rounded-[var(--radius-md)] bg-[var(--neutral-default)] p-[var(--spacing-16)] ' +
  'text-xs leading-[1.3] font-light text-[var(--text-on-accent-muted)] outline-none ' +
  '[text-box:trim-both_cap_alphabetic]';

// The arrow: an SVG triangle pointing down (away from a bubble above its
// trigger), 16 wide at the bubble edge × 12 deep, matching the visible part of
// the master's Arrow polygon. Arrow Radius (xs) rounds its corners via a round-
// joined stroke 2× the radius wide, drawn around a triangle inset by the radius
// (so the outer size stays 16×12 at xs = 2px).
// Render `<svg viewBox={TOOLTIP_ARROW_VIEWBOX}><path d={TOOLTIP_ARROW_PATH} /></svg>`.
// Base UI sets the arrow's along-edge coordinate (top OR left); the consumer
// adds the perpendicular offset and rotation (see the Tooltip component's
// data-side classes, or the Range bubble's manual placement).
export const tooltipArrow =
  'block h-[var(--spacing-12)] w-[var(--size-16)] fill-[var(--neutral-default)] ' +
  'stroke-[var(--neutral-default)] [stroke-linejoin:round] [stroke-width:calc(var(--radius-xs)*2)]';
export const TOOLTIP_ARROW_VIEWBOX = '0 0 16 12';
export const TOOLTIP_ARROW_PATH = 'M2 0H14L8 10Z';
