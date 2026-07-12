/**
 * Shared surface styling for text-field controls (Input, Textarea, Bottom Line,
 * Select trigger, Stepper, Search Bar). Radius, padding and sizing stay
 * per-component (they carry the Figma tokens); this covers only the common
 * fill / border / placeholder / focus / disabled / invalid treatment.
 *
 * Literal classes only — Tailwind must see them verbatim (see utils/tone.ts).
 */
export const fieldSurface =
  'bg-[var(--bg-surface)] text-[var(--text-primary)] ' +
  'border border-[var(--border-default)] ' +
  'placeholder:text-[var(--text-muted)] transition-colors ' +
  'focus:outline-none focus:border-[var(--border-focus)] ' +
  'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] ' +
  'data-[invalid]:border-[var(--status-danger-default)]';
