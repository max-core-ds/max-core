/**
 * Focus-ring primitives shared across interactive components.
 *
 * - `ring` — an always-on ring (e.g. Tag's `selected` state).
 * - `focusRing` — an outset `focus-visible` ring for pressable elements
 *   (buttons, chips). Keyboard-focus only.
 * - `focusRingInset` — the ring for input *frames*, per the Figma rule
 *   (CLAUDE.md: "ring in INPUT FRAME, not wrapper"). Rendered as an absolute
 *   `::before` stretched -3px on every side so it hugs the field and survives
 *   the title/helper being toggled off. The element it sits on must be
 *   `relative` and carry the field's border-radius (for `rounded-[inherit]`).
 *   Because an `<input>` cannot host a `::before`, apply this to a wrapper
 *   frame around the input, triggered by `focus-within`.
 */

/** Ring geometry + color, no state prefix. */
export const ring =
  'ring-2 ring-[var(--border-focus)] ring-offset-2 ring-offset-[var(--bg-default)]';

/** Outset keyboard-focus ring for pressable elements. */
export const focusRing =
  'focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-default)]';

/** Inset -3px hugging ring for an input frame (apply to a `relative` wrapper). */
export const focusRingInset =
  "before:content-[''] before:pointer-events-none before:absolute before:-inset-[3px] " +
  'before:rounded-[inherit] before:border-2 before:border-[var(--border-focus)] ' +
  'before:opacity-0 before:transition-opacity focus-within:before:opacity-100';
