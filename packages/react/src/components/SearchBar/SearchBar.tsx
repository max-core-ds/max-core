'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Pill search field. Gap/radius/min-width and per-size padding/icon size match
// -- Molecule/Search Bar/*.
const rootStyles = cva(
  [
    'inline-flex w-full items-center gap-[var(--spacing-06)]',
    'min-w-[var(--size-180)] rounded-[var(--radius-full)]',
    'border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]',
    'transition-colors focus-within:border-[var(--border-focus)]',
  ],
  {
    variants: {
      size: {
        s: 'px-[var(--spacing-10)] py-[var(--spacing-08)] text-xs [&_svg]:size-[var(--size-16)]',
        m: 'px-[var(--spacing-12)] py-[var(--spacing-10)] text-sm [&_svg]:size-[var(--size-20)]',
        l: 'px-[var(--spacing-14)] py-[var(--spacing-12)] text-base [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface SearchBarProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseInput>, 'size'>,
    VariantProps<typeof rootStyles> {
  /** Called when the clear (✕) button is pressed. Shown when `value` is non-empty. */
  onClear?: () => void;
  wrapperClassName?: string;
}

export function SearchBar({
  size,
  className,
  wrapperClassName,
  value,
  onClear,
  placeholder = 'Search',
  ...rest
}: SearchBarProps) {
  return (
    <div className={cn(rootStyles({ size }), wrapperClassName)}>
      <SearchIcon className="shrink-0 text-[var(--text-muted)]" />
      <BaseInput
        className={cn(
          'w-full bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]',
          className,
        )}
        placeholder={placeholder}
        value={value}
        {...rest}
      />
      {onClear && value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <XIcon />
        </button>
      ) : null}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
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
