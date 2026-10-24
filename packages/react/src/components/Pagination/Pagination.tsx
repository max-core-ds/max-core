'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Button min-width/icon size/padding/gap/radius match -- Molecule/Pagination/*.
// Figma wraps a fixed 24x24 content box (Min Width = Icon Size = 24) in 4px padding,
// so every button — number or icon — is a 32x32 square that grows only for multi-digit
// pages. Fix h + min-w to size-32 (= content 24 + padding 8) so numbers and arrows match.
// Hover = bg/subtle + text/accent (Phase 4.5 decision: Figma's overlay/hover +
// text/accent is 3.15 light / 3.96 dark); the current page skips it. Pressed =
// Figma's overlay/pressed + text/on-accent (1.91 in dark — the dark accent ramp).
const buttonStyles = cn(
  'inline-flex h-[var(--size-32)] min-w-[var(--size-32)] items-center justify-center rounded-[var(--radius-sm)]',
  // Figma strokes sit inside: give the 1px border back so icon buttons stay 32 wide.
  'border border-[var(--border-default)] bg-[var(--bg-default)] p-[calc(var(--spacing-04)-var(--border-weight-thin))] text-sm font-bold',
  'text-[var(--text-secondary)] transition-colors',
  // not-active: so the hover rule doesn't outrank the pressed one.
  'not-aria-[current=page]:not-active:hover:bg-[var(--bg-subtle)] not-aria-[current=page]:not-active:hover:text-[var(--text-accent)]',
  'active:bg-[var(--overlay-pressed)] active:text-[var(--text-on-accent)]',
  '[&_svg]:size-[var(--size-24)] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  focusRing,
);

// Active keeps border/default (like every Figma state) — only fill + text change.
const activeStyles = 'bg-[var(--accent-subtle)] text-[var(--text-accent)]';

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> {
  /** Current 1-based page. */
  page: number;
  /** Total number of pages. */
  count: number;
  onPageChange?: (page: number) => void;
  /** Pages to show around the current one (default 1). */
  siblings?: number;
}

export function Pagination({
  page,
  count,
  onPageChange,
  siblings = 1,
  className,
  ...rest
}: PaginationProps) {
  const pages = paginationRange(page, count, siblings);
  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center gap-[var(--spacing-04)]', className)}
      {...rest}
    >
      <button
        type="button"
        className={buttonStyles}
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        <ChevronLeft />
      </button>
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis positions are stable within a render
            key={`e${i}`}
            // A button-sized slot (React-only; the master has no ellipsis) keeps the bar's width.
            className="inline-flex min-w-[var(--size-32)] justify-center text-[var(--text-muted)]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn(buttonStyles, p === page && activeStyles)}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onPageChange?.(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={buttonStyles}
        aria-label="Next page"
        disabled={page >= count}
        onClick={() => onPageChange?.(page + 1)}
      >
        <ChevronRight />
      </button>
    </nav>
  );
}

/**
 * Build a windowed page list with ellipses, always showing first & last. The list
 * always has `siblings * 2 + 5` slots, so the bar keeps its width while paging.
 */
function paginationRange(page: number, count: number, siblings: number): (number | 'ellipsis')[] {
  const total = siblings * 2 + 5; // first, last, current, 2 ellipses, siblings each side
  if (count <= total) return range(1, count);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, count);
  const showLeftEllipsis = left > 3;
  const showRightEllipsis = right < count - 2;
  const edgeItems = siblings * 2 + 3; // the run beside a single ellipsis

  if (!showLeftEllipsis) return [...range(1, edgeItems), 'ellipsis', count];
  if (!showRightEllipsis) return [1, 'ellipsis', ...range(count - edgeItems + 1, count)];
  return [1, 'ellipsis', ...range(left, right), 'ellipsis', count];
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
