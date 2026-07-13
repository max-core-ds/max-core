/**
 * Validation → color mapping for the selection controls (Checkbox, Radio,
 * Switch). Figma gives each a 4-value Validation axis (Default, Error, Warning,
 * Success) that recolors the control: the resting border/tint and the
 * checked/indeterminate fill both take the validation color.
 *
 * Every class is a full literal (see utils/tone.ts for why interpolation would
 * break Tailwind's static extraction).
 */

export type Validation = 'default' | 'error' | 'warning' | 'success';

// Checkbox box: resting border + subtle tint; data-checked / data-indeterminate
// flip to the solid validation fill.
export const checkboxValidation: Record<Validation, string> = {
  default:
    'border-[var(--border-default)] bg-[var(--bg-default)] data-[checked]:border-[var(--accent-default)] data-[checked]:bg-[var(--accent-default)] data-[indeterminate]:border-[var(--accent-default)] data-[indeterminate]:bg-[var(--accent-default)]',
  error:
    'border-[var(--status-danger-border)] bg-[var(--status-danger-subtle)] data-[checked]:border-[var(--status-danger-border)] data-[checked]:bg-[var(--status-danger-default)] data-[indeterminate]:border-[var(--status-danger-border)] data-[indeterminate]:bg-[var(--status-danger-default)]',
  warning:
    'border-[var(--status-warning-border)] bg-[var(--status-warning-subtle)] data-[checked]:border-[var(--status-warning-border)] data-[checked]:bg-[var(--status-warning-default)] data-[indeterminate]:border-[var(--status-warning-border)] data-[indeterminate]:bg-[var(--status-warning-default)]',
  success:
    'border-[var(--status-success-border)] bg-[var(--status-success-subtle)] data-[checked]:border-[var(--status-success-border)] data-[checked]:bg-[var(--status-success-default)] data-[indeterminate]:border-[var(--status-success-border)] data-[indeterminate]:bg-[var(--status-success-default)]',
};

// Radio box: resting border + subtle tint; the dot (a bg-current child) takes
// the `text-` color set here, and data-checked promotes the border.
export const radioValidation: Record<Validation, string> = {
  default:
    'border-[var(--border-default)] bg-[var(--bg-default)] text-[var(--accent-default)] data-[checked]:border-[var(--accent-default)]',
  error:
    'border-[var(--status-danger-border)] bg-[var(--status-danger-subtle)] text-[var(--status-danger-default)] data-[checked]:border-[var(--status-danger-border)]',
  warning:
    'border-[var(--status-warning-border)] bg-[var(--status-warning-subtle)] text-[var(--status-warning-default)] data-[checked]:border-[var(--status-warning-border)]',
  success:
    'border-[var(--status-success-border)] bg-[var(--status-success-subtle)] text-[var(--status-success-default)] data-[checked]:border-[var(--status-success-border)]',
};

// Switch track: neutral when off; data-checked flips to the solid validation
// fill (the thumb stays white on all validations).
export const switchValidation: Record<Validation, string> = {
  default: 'bg-[var(--neutral-default)] data-[checked]:bg-[var(--accent-default)]',
  error: 'bg-[var(--neutral-default)] data-[checked]:bg-[var(--status-danger-default)]',
  warning: 'bg-[var(--neutral-default)] data-[checked]:bg-[var(--status-warning-default)]',
  success: 'bg-[var(--neutral-default)] data-[checked]:bg-[var(--status-success-default)]',
};
