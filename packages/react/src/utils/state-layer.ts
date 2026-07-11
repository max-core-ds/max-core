/**
 * Interaction-state primitives for pressable components (the Button family).
 *
 * The consuming element MUST set `relative isolate` on its root: the overlay is
 * a `::before` painted behind the content (`-z-[1]`) so it tints the fill, not
 * the label, and the isolation keeps the stacking context contained.
 */

/**
 * Mode-aware state-layer overlay (Figma `overlay/state layer`): a `::before`
 * that fades 0 → hover → pressed. One uniform mechanism for every tone — no
 * per-tone hover background swaps.
 */
export const stateLayer =
  'before:pointer-events-none before:absolute before:inset-0 before:-z-[1] ' +
  'before:rounded-[inherit] before:bg-[var(--overlay-state-layer)] before:opacity-0 ' +
  "before:transition-opacity before:content-[''] " +
  'hover:before:opacity-[var(--opacity-hover)] active:before:opacity-[var(--opacity-pressed)]';

/**
 * Elevation feedback (Figma `effect/shadow/down/*`): lifts on hover, settles and
 * nudges 2px down on press.
 */
export const elevatePress =
  'hover:shadow-[var(--effect-shadow-down-lg)] ' +
  'active:shadow-[var(--effect-shadow-down-sm)] active:translate-y-[2px]';
