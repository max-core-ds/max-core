/**
 * Focus-ring primitives shared across interactive components.
 *
 * - `ring` — an always-on ring (e.g. Tag's `selected` state).
 * - `focusRing` — an outset `focus-visible` ring for pressable elements
 *   (buttons, chips). Keyboard-focus only.
 * - `focusRingWithin` — the same ring on a wrapper whose focusable element is
 *   a descendant (e.g. Base UI's Slider.Thumb focuses an inner `<input>`).
 * - `focusBorder` — focus for bordered *fields* (inputs, select, textarea…).
 *   No ring: the field's own 1px border turns `border/focus` and thickens to
 *   2px via an inset shadow, so layout doesn't shift. Apply to the element
 *   that owns the border, triggered by `focus-within`.
 * - `focusRingInset` — deprecated -3px `::before` ring around input frames;
 *   replaced by `focusBorder` (hybrid focus model: fields = own border,
 *   pressables = outset ring).
 */

/** Ring geometry + color, no state prefix. */
export const ring =
  'ring-2 ring-[var(--border-focus)] ring-offset-2 ring-offset-[var(--bg-default)]';

/** Outset keyboard-focus ring for pressable elements. */
export const focusRing =
  'focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-default)]';

/** Outset ring on a wrapper, shown while a descendant has keyboard focus. */
export const focusRingWithin =
  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--border-focus)] ' +
  'has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--bg-default)]';

/** Field focus: own border → `border/focus` at 2px (1px border + 1px inset shadow). */
export const focusBorder =
  'focus-within:border-[var(--border-focus)] ' +
  'focus-within:shadow-[inset_0_0_0_1px_var(--border-focus)]';

/**
 * Inset -3px hugging ring for an input frame (apply to a `relative` wrapper).
 * @deprecated Use `focusBorder` — fields show focus on their own border.
 */
export const focusRingInset =
  "before:content-[''] before:pointer-events-none before:absolute before:-inset-[3px] " +
  'before:rounded-[inherit] before:border-2 before:border-[var(--border-focus)] ' +
  'before:opacity-0 before:transition-opacity focus-within:before:opacity-100';
