import { type VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import {
  type StatusTone,
  statusBorderOutline,
  statusSubtle,
  statusText,
} from '../../utils/tone.js';

// Figma: 3 Variants (Primary, Outline, Ghost) × 4 Tones × 2 Sizes + Selected
// (Primary only). Tag is a filter chip: Primary/Off is a subtle tinted fill,
// Primary/Selected is the solid fill. Label uses Caption/300 (Light, 12px) at
// both sizes. Radius sm / border thin / icon 16 match -- Atoms/Tag/Global/*.
// Every border is a tone *border* token (status/*/border, border/accent when
// selected) — not the solid tone colour.
const STATUS_TONES: StatusTone[] = ['danger', 'success', 'warning'];

// Build {variant, tone, selected} compound rows for the Primary variant from a
// status-tone table (the `default` tone is bespoke and supplied separately).
function primaryStatusRows(selected: boolean, table: Record<StatusTone, string>) {
  return STATUS_TONES.map((tone) => ({
    variant: 'primary' as const,
    tone,
    selected,
    class: table[tone],
  }));
}

// Solid Selected fill: tone fill + tone border + on-accent label.
const selectedFill: Record<StatusTone, string> = {
  danger:
    'bg-[var(--status-danger-default)] border-[var(--status-danger-border)] text-[var(--text-on-accent)]',
  success:
    'bg-[var(--status-success-default)] border-[var(--status-success-border)] text-[var(--text-on-accent)]',
  warning:
    'bg-[var(--status-warning-default)] border-[var(--status-warning-border)] text-[var(--text-on-accent)]',
};

// Interactive (clickable) tags get the Figma wrapper states: a `_StateOverlay`
// ::before of overlay/hover @ 0.4 on Hover and overlay/pressed @ 0.6 on Pressed
// (the master binds the opacities to `opacity/disabled` and `opacity/dim`),
// the shared focus ring, and opacity-only Disabled.
const interactiveStyles = cn(
  'relative isolate cursor-pointer',
  "before:pointer-events-none before:absolute before:inset-0 before:-z-[1] before:rounded-[inherit] before:opacity-0 before:transition-opacity before:content-['']",
  'hover:before:bg-[var(--overlay-hover)] hover:before:opacity-[var(--opacity-disabled)]',
  'active:before:bg-[var(--overlay-pressed)] active:before:opacity-[var(--opacity-dim)]',
  focusRing,
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
);

const tagStyles = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-[var(--radius-sm)]',
    'border transition-colors',
    'font-light whitespace-nowrap',
    '[&_svg]:size-[var(--size-16)]',
  ],
  {
    variants: {
      variant: {
        primary: '',
        outline: '',
        ghost: 'border-transparent bg-transparent',
      },
      tone: {
        default: '',
        danger: '',
        success: '',
        warning: '',
      },
      // Padding X/Y, Gap and Min Height match -- Atoms/Tag/{S,M}/*. Both sizes
      // render the label at 12px (Caption/300); S Min Height is a raw 28px.
      size: {
        s: 'min-h-[28px] px-[var(--spacing-06)] py-[var(--spacing-06)] gap-[var(--spacing-04)] text-xs',
        m: 'min-h-[var(--size-32)] px-[var(--spacing-08)] py-[var(--spacing-08)] gap-[var(--spacing-06)] text-xs',
      },
      // Only meaningful for the Primary variant (Off → subtle, On → solid).
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Primary / Off — subtle tinted fill.
      {
        variant: 'primary',
        selected: false,
        tone: 'default',
        class:
          'bg-[var(--accent-subtle)] border-[var(--border-default)] text-[var(--accent-active)]',
      },
      ...primaryStatusRows(false, statusSubtle),
      // Primary / Selected — solid fill.
      {
        variant: 'primary',
        selected: true,
        tone: 'default',
        class:
          'bg-[var(--accent-default)] border-[var(--border-accent)] text-[var(--text-on-accent)]',
      },
      ...primaryStatusRows(true, selectedFill),
      // Outline — tone border + text; Default is neutral on a bg/subtle fill,
      // the status tones are transparent.
      {
        variant: 'outline',
        tone: 'default',
        class: 'bg-[var(--bg-subtle)] border-[var(--border-default)] text-[var(--text-secondary)]',
      },
      { variant: 'outline', tone: 'danger', class: statusBorderOutline.danger },
      { variant: 'outline', tone: 'success', class: statusBorderOutline.success },
      { variant: 'outline', tone: 'warning', class: statusBorderOutline.warning },
      // Ghost — tone text only; default is accent.
      { variant: 'ghost', tone: 'default', class: 'text-[var(--accent-default)]' },
      { variant: 'ghost', tone: 'danger', class: statusText.danger },
      { variant: 'ghost', tone: 'success', class: statusText.success },
      { variant: 'ghost', tone: 'warning', class: statusText.warning },
    ],
    defaultVariants: {
      variant: 'primary',
      tone: 'default',
      size: 'm',
      selected: false,
    },
  },
);

export interface TagProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onClick'>,
    VariantProps<typeof tagStyles> {
  leftIcon?: ReactNode;
  /**
   * Trailing icon (Figma default: an ×). Visual only — there is no `onRemove`.
   * On a display-only tag you may pass a real `<button aria-label="Remove …">`
   * here; on a clickable tag (`onClick` / `selected`) don't — it would nest a
   * button inside the tag's button (invalid HTML, and its click bubbles).
   */
  rightIcon?: ReactNode;
  children?: ReactNode;
  /** Makes the tag a clickable chip (rendered as a `<button>`). */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Only applies to a clickable tag. */
  disabled?: boolean;
}

export function Tag({
  variant,
  tone,
  size,
  selected,
  className,
  leftIcon,
  rightIcon,
  children,
  onClick,
  disabled,
  ...rest
}: TagProps) {
  const classes = tagStyles({ variant, tone, size, selected });
  // A tag with a click handler or an explicit `selected` is a filter chip: a
  // toggle button announcing its state. Otherwise it's a display-only label.
  if (onClick || selected !== undefined) {
    return (
      <button
        type="button"
        className={cn(classes, interactiveStyles, className)}
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected ?? undefined}
        {...rest}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
  return (
    <span className={cn(classes, className)} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </span>
  );
}
