'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Button min-width/icon size/padding/gap/radius match -- Molecule/Pagination/*.
const buttonStyles = cn(
  'inline-flex min-w-[var(--size-24)] items-center justify-center rounded-[var(--radius-sm)]',
  'border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-04)] text-sm',
  'text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]',
  '[&_svg]:size-[var(--size-24)] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  focusRing,
);

const activeStyles =
  'border-[var(--accent-default)] bg-[var(--accent-default)] text-[var(--text-on-accent)]';

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
            className="px-[var(--spacing-04)] text-[var(--text-muted)]"
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

/** Build a windowed page list with ellipses, always showing first & last. */
function paginationRange(page: number, count: number, siblings: number): (number | 'ellipsis')[] {
  const total = siblings * 2 + 5; // first, last, current, 2 ellipses, siblings each side
  if (count <= total) return range(1, count);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, count);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < count - 1;

  const result: (number | 'ellipsis')[] = [1];
  if (showLeftEllipsis) result.push('ellipsis');
  else if (left === 2) result.push(2);
  for (let p = Math.max(left, 2); p <= Math.min(right, count - 1); p += 1) {
    if (p === 1 || p === count) continue;
    result.push(p);
  }
  if (showRightEllipsis) result.push('ellipsis');
  else if (right === count - 1) result.push(count - 1);
  result.push(count);
  return result;
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
