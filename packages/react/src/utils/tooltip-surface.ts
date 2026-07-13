/**
 * Shared tooltip bubble visual, reused by the Tooltip atom and the Range
 * slider's value bubble (Figma composes Range from the Tooltip atom).
 *
 * The tooltip is an INVERTED surface — a light `neutral/default` bubble with
 * dark `text/on-accent-muted` text — so it stands out from the page. Padding,
 * radius and arrow radius match -- Atoms/Tooltip/* (16 / md / xs).
 */
// `relative` so an absolutely-positioned arrow anchors to the bubble.
export const tooltipBubble =
  'relative rounded-[var(--radius-md)] bg-[var(--neutral-default)] p-[var(--spacing-16)] ' +
  'text-sm text-[var(--text-on-accent-muted)] shadow-[var(--effect-shadow-down-md)] outline-none';

// The arrow's visual only. Base UI sets its along-edge coordinate (top OR left);
// the consumer adds the perpendicular offset (see the Tooltip component's
// data-side classes, or the Range bubble's manual placement).
export const tooltipArrow =
  'size-2 rotate-45 rounded-[var(--radius-xs)] bg-[var(--neutral-default)]';
