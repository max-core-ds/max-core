'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { fieldBorder, fieldFill, fieldHover } from '../../utils/field.js';
import { focusRing } from '../../utils/focus-ring.js';

// Searchbar (2106:546): a pill field, every dimension from -- Molecule/Search
// Bar/*. Fill bg/default, stroke border/default (INSIDE, so the padding gives the
// Border Weight back), Radius full, Min Width 180. Per size: Gap, Padding X/Y and
// Icon Size; the row is Icon Size tall → 32 / 40 / 48. Placeholder Caption/300,
// Body/SM/300, Body/MD/300 (Max, round 1). Icons text/secondary. Field states
// follow the Inputs model: hover border/hover, focus = focusBorder (border/focus 2px).
const rootStyles = cva(
  [
    'inline-flex w-full items-center',
    'min-w-(--search-bar-global-min-width) rounded-(--search-bar-global-radius) border-(length:--search-bar-global-border-weight)',
    fieldBorder,
    fieldFill.primary,
    fieldHover,
    'has-[:disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'gap-(--search-bar-size-s-gap) px-[calc(var(--search-bar-size-s-padding-x)-var(--search-bar-global-border-weight))] py-[calc(var(--search-bar-size-s-padding-y)-var(--search-bar-global-border-weight))] type-caption-300 [&_svg]:size-(--search-bar-size-s-icon-size)',
        m: 'gap-(--search-bar-size-m-gap) px-[calc(var(--search-bar-size-m-padding-x)-var(--search-bar-global-border-weight))] py-[calc(var(--search-bar-size-m-padding-y)-var(--search-bar-global-border-weight))] type-body-sm-300 [&_svg]:size-(--search-bar-size-m-icon-size)',
        l: 'gap-(--search-bar-size-l-gap) px-[calc(var(--search-bar-size-l-padding-x)-var(--search-bar-global-border-weight))] py-[calc(var(--search-bar-size-l-padding-y)-var(--search-bar-global-border-weight))] type-body-md-300 [&_svg]:size-(--search-bar-size-l-icon-size)',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// The <input> is Icon Size tall, so the row never depends on the text's line box.
const inputHeight = {
  s: 'h-(--search-bar-size-s-icon-size)',
  m: 'h-(--search-bar-size-m-icon-size)',
  l: 'h-(--search-bar-size-l-icon-size)',
} as const;

export interface SearchBarProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'size' | 'className'>,
    VariantProps<typeof rootStyles> {
  /** Called when the clear (✕) button is pressed. Shown when `value` is non-empty. */
  onClear?: () => void;
  /**
   * Trailing action button (Button=On mode) — pass a size-S Standard Button at every
   * size, e.g. `action={<Button size="s">Search</Button>}`; it gets the bar's full radius and
   * 16px side padding.
   * Replaces the clear (✕) button.
   */
  action?: ReactNode;
  /** Leading icon (Figma: Left icon swap). Defaults to the magnifier; `null` hides it. */
  leadingIcon?: ReactNode;
  /** Applied to the pill (the whole field). */
  className?: string;
}

export function SearchBar({
  size,
  className,
  value,
  onClear,
  action,
  leadingIcon = <SearchIcon />,
  placeholder = 'Search',
  ...rest
}: SearchBarProps) {
  return (
    <div className={cn(rootStyles({ size }), className)}>
      {leadingIcon ? (
        <span aria-hidden="true" className="inline-flex shrink-0 text-[var(--text-secondary)]">
          {leadingIcon}
        </span>
      ) : null}
      <BaseInput
        className={cn(
          'min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed',
          inputHeight[size ?? 'm'],
        )}
        placeholder={placeholder}
        value={value}
        {...rest}
      />
      {action ? (
        // The master overrides the Button's radius with the bar's own (Global/Radius,
        // full) and hand-sizes it so the label sits 16px from each side; React pads
        // instead of fixing the width (decision 2026-10-24). `!` beats the Button's
        // own classes regardless of stylesheet order.
        <span className="inline-flex shrink-0 [&>*]:rounded-(--search-bar-global-radius)! [&>*]:px-[var(--spacing-16)]!">
          {action}
        </span>
      ) : onClear && value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className={cn(
            'inline-flex shrink-0 rounded-[var(--radius-full)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            focusRing,
          )}
        >
          <XIcon />
        </button>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
