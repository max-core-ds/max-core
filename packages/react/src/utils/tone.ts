/**
 * Tone → color mapping shared by components with a `tone` axis (Button, Tag,
 * Badge, …). The three status tones (danger/success/warning) share a uniform
 * structure and are provided here as literal class tables; the `default` tone
 * is component-specific (brand accent vs neutral) and stays bespoke at each
 * call site.
 *
 * IMPORTANT: every class below is written out in full. Tailwind extracts
 * arbitrary-value utilities by scanning source text for complete literals, so
 * these must NEVER be assembled by string interpolation (`bg-[var(${x})]`) —
 * that produces classes Tailwind can't see and won't generate. This file lives
 * under `packages/react/src/**`, which the apps `@source`-scan, so the literals
 * here are picked up wherever the tables are consumed.
 */

export type Tone = 'default' | 'danger' | 'success' | 'warning';
export type StatusTone = 'danger' | 'success' | 'warning';

/** Solid tone background only (no border/text override) — e.g. Button `primary`. */
export const statusBg: Record<StatusTone, string> = {
  danger: 'bg-[var(--status-danger-default)]',
  success: 'bg-[var(--status-success-default)]',
  warning: 'bg-[var(--status-warning-default)]',
};

/** Subtle tinted fill: tone subtle bg + tone border + tone text (Badge `default`). */
export const statusSubtle: Record<StatusTone, string> = {
  danger:
    'bg-[var(--status-danger-subtle)] border-[var(--status-danger-border)] text-[var(--status-danger-default)]',
  success:
    'bg-[var(--status-success-subtle)] border-[var(--status-success-border)] text-[var(--status-success-default)]',
  warning:
    'bg-[var(--status-warning-subtle)] border-[var(--status-warning-border)] text-[var(--status-warning-default)]',
};

/** Tone-colored border + text — outline/secondary treatment. */
export const statusOutline: Record<StatusTone, string> = {
  danger: 'border-[var(--status-danger-default)] text-[var(--status-danger-default)]',
  success: 'border-[var(--status-success-default)] text-[var(--status-success-default)]',
  warning: 'border-[var(--status-warning-default)] text-[var(--status-warning-default)]',
};

/** Tone-colored text only — ghost treatment. */
export const statusText: Record<StatusTone, string> = {
  danger: 'text-[var(--status-danger-default)]',
  success: 'text-[var(--status-success-default)]',
  warning: 'text-[var(--status-warning-default)]',
};

/**
 * Map a status-tone class table into CVA `compoundVariants` rows for one
 * `variant` value. The `default` tone is intentionally omitted — supply it per
 * component. This only *selects* pre-written literals; it never builds classes.
 */
export function statusToneCompounds<V extends string>(
  variant: V,
  table: Record<StatusTone, string>,
): Array<{ variant: V; tone: StatusTone; class: string }> {
  return (Object.keys(table) as StatusTone[]).map((tone) => ({
    variant,
    tone,
    class: table[tone],
  }));
}
