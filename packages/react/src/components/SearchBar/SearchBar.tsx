'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { fieldBorder, fieldFill, fieldHover } from '../../utils/field.js';
import { focusRing } from '../../utils/focus-ring.js';

// Searchbar (2106:546): a pill field, -- Molecule/Search Bar/*. Fill bg/default,
// stroke border/default (INSIDE, so the padding gives the 1px back), Radius full,
// Min Width 180, Gap 6. Per size: Padding X/Y 10·8 / 12·10 / 14·12 and Icon Size
// 16/20/24 (the M/L tokens; Figma binds the S token on every size, decision
// 2026-10-24) → heights 32/40/48. Icons text/secondary. Field states follow the
// Inputs model: hover border/hover, focus = focusBorder (border/focus 2px).
const rootStyles = cva(
  [
    'inline-flex w-full items-center gap-[var(--spacing-06)]',
    'min-w-[var(--size-180)] rounded-[var(--radius-full)]',
    fieldBorder,
    fieldFill.primary,
    fieldHover,
    'has-[:disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      // Text 12 / 14 / 16 regular (deviation from the master's Caption/300, as Inputs).
      size: {
        s: 'px-[calc(var(--spacing-10)-var(--border-weight-thin))] py-[calc(var(--spacing-08)-var(--border-weight-thin))] text-xs [&_svg]:size-[var(--size-16)]',
        m: 'px-[calc(var(--spacing-12)-var(--border-weight-thin))] py-[calc(var(--spacing-10)-var(--border-weight-thin))] text-sm [&_svg]:size-[var(--size-20)]',
        l: 'px-[calc(var(--spacing-14)-var(--border-weight-thin))] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-base [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface SearchBarProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'size' | 'className'>,
    VariantProps<typeof rootStyles> {
  /** Called when the clear (✕) button is pressed. Shown when `value` is non-empty. */
  onClear?: () => void;
  /**
   * Trailing action button (Button=On mode) — pass a size-S Standard Button at every
   * size, e.g. `action={<Button size="s">Search</Button>}`. Replaces the clear (✕) button.
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
        className="min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
        placeholder={placeholder}
        value={value}
        {...rest}
      />
      {action ? (
        <span className="shrink-0">{action}</span>
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
