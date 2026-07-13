/**
 * Shared tooltip bubble visual, reused by the Tooltip atom and the Range
 * slider's value bubble (Figma composes Range from the Tooltip atom).
 *
 * The tooltip is an INVERTED surface — a light `neutral/default` bubble with
 * dark `text/on-accent-muted` text — so it stands out from the page. Padding,
 * radius and arrow radius match -- Atoms/Tooltip/* (16 / md / xs).
 */
export const tooltipBubble =
  'rounded-[var(--radius-md)] bg-[var(--neutral-default)] p-[var(--spacing-16)] ' +
  'text-sm text-[var(--text-on-accent-muted)] shadow-[var(--effect-shadow-down-md)] outline-none';

export const tooltipArrow =
  'size-2 rotate-45 rounded-[var(--radius-xs)] bg-[var(--neutral-default)]';
