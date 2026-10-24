/**
 * Shared styling for text-field controls (Input, Textarea, Bottom Line, Select
 * trigger, Multiselect, Stepper, the Date/Time picker triggers). Radius, padding
 * and sizing stay per-component (they carry the Figma tokens); this covers the
 * common border / placeholder / hover / focus / invalid treatment and the field
 * chrome around the control (label, helper, error).
 *
 * Focus follows the hybrid model: the field's own border turns `border/focus` at
 * 2px (`focusBorder`, via focus-within so it works on a frame or the control).
 * Hover recolours the border to `border/hover`; the master's state-layer wash is
 * deliberately not shipped (decision 2026-10-24).
 *
 * Literal classes only — Tailwind must see them verbatim (see utils/tone.ts).
 */
import { focusBorder } from './focus-ring.js';

/** Border + text + placeholder + focus. Pair with a fill (`fieldFill`). */
export const fieldBorder = `text-[var(--text-primary)] border border-[var(--border-default)] placeholder:text-[var(--text-muted)] transition-colors outline-none ${focusBorder} disabled:cursor-not-allowed has-[:disabled]:cursor-not-allowed`;

/** Hover border — apply only while the field isn't invalid. Skipped while focused,
 * disabled or open (a trigger's `data-popup-open` keeps `border/accent`). */
export const fieldHover =
  'hover:not-focus-within:not-disabled:not-has-[:disabled]:not-data-[popup-open]:border-[var(--border-hover)]';

/** Error look (Validation=Error): `status/danger/border` stroke, danger placeholder. */
export const fieldInvalid =
  'border-[var(--status-danger-border)] placeholder:text-[var(--status-danger-default)] ' +
  '[&_input]:placeholder:text-[var(--status-danger-default)]';

/**
 * Field fill per Variant. Primary is filled (`bg/default`, `status/danger/subtle`
 * when invalid); Secondary is outline-only.
 */
export const fieldFill = {
  primary: 'bg-[var(--bg-default)]',
  secondary: 'bg-transparent',
} as const;
export const fieldInvalidFill = {
  primary: 'bg-[var(--status-danger-subtle)]',
  secondary: 'bg-transparent',
} as const;
export type FieldVariant = keyof typeof fieldFill;

/**
 * Legacy all-in-one surface (Primary fill + border + hover). Prefer composing
 * `fieldBorder` + `fieldFill` + `fieldHover` + `fieldInvalid`.
 */
export const fieldSurface = `${fieldFill.primary} ${fieldBorder}`;

/** Field.Root / wrapper column: label ↔ control ↔ helper, Items Gap (8px). Disabled
 * dims the whole field, label and helper included (master: opacity on the wrapper). */
export const fieldRoot =
  'group/field flex flex-col gap-[var(--spacing-08)] ' +
  'data-[disabled]:opacity-[var(--opacity-disabled)]';

/**
 * Title: Body/MD/700 `text/secondary`; `text/accent` while the control has focus
 * (the master's State=Active), `status/danger/default` when invalid.
 */
export function fieldLabel(invalid?: boolean): string {
  return invalid
    ? 'text-base font-bold text-[var(--status-danger-default)]'
    : 'text-base font-bold text-[var(--text-secondary)] transition-colors ' +
        'group-focus-within/field:text-[var(--text-accent)]';
}

/** Helper / error text: Caption/300. */
export const fieldHelper = 'text-xs font-light text-[var(--text-muted)]';
export const fieldError = 'text-xs font-light text-[var(--status-danger-default)]';
