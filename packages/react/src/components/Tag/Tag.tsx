import { type VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
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
// Primary/Selected is the solid fill. Label Caption/300 at both sizes, in a
// cap-trimmed span. Every dimension is the Tag's own token -- Atoms/Tag/<size>/*
// (Padding X/Y, Gap, Radius, Border Weight, Icon Size, Min Height). Figma's
// stroke is INSIDE the frame, so the border width comes out of the padding:
// the chip is exactly Min Height (28 / 32) with or without an icon.
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
// ::before of overlay/hover at `- opacity -/hover` and overlay/pressed at
// `- opacity -/pressed` (round-1 Figma rebind), the shared focus ring, and
// opacity-only Disabled.
const interactiveStyles = cn(
  'relative isolate cursor-pointer',
  "before:pointer-events-none before:absolute before:inset-0 before:-z-[1] before:rounded-[inherit] before:opacity-0 before:transition-opacity before:content-['']",
  'hover:before:bg-[var(--overlay-hover)] hover:before:opacity-[var(--opacity-hover)]',
  'active:before:bg-[var(--overlay-pressed)] active:before:opacity-[var(--opacity-pressed)]',
  focusRing,
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
);

const tagStyles = cva(
  [
    'inline-flex items-center justify-center',
    'border-solid transition-colors',
    'type-caption-300 whitespace-nowrap',
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
      size: {
        s: 'min-h-(--tag-s-min-height) gap-(--tag-s-gap) rounded-(--tag-s-radius) border-(length:--tag-s-border-weight) [&_svg]:size-(--tag-s-icon-size) px-[calc(var(--tag-s-padding-x)-var(--tag-s-border-weight))] py-[calc(var(--tag-s-padding-y)-var(--tag-s-border-weight))]',
        m: 'min-h-(--tag-m-min-height) gap-(--tag-m-gap) rounded-(--tag-m-radius) border-(length:--tag-m-border-weight) [&_svg]:size-(--tag-m-icon-size) px-[calc(var(--tag-m-padding-x)-var(--tag-m-border-weight))] py-[calc(var(--tag-m-padding-y)-var(--tag-m-border-weight))]',
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
        class: 'bg-[var(--accent-subtle)] border-[var(--border-default)] text-[var(--text-accent)]',
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
      // Ghost — tone text only; default is text/accent.
      { variant: 'ghost', tone: 'default', class: 'text-[var(--text-accent)]' },
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
        {children != null && children !== false ? (
          <span className={capTrim}>{children}</span>
        ) : null}
        {rightIcon}
      </button>
    );
  }
  return (
    <span className={cn(classes, className)} {...rest}>
      {leftIcon}
      {children != null && children !== false ? <span className={capTrim}>{children}</span> : null}
      {rightIcon}
    </span>
  );
}
