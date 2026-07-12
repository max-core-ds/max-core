'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Interactive card wrapping Entity Item content. Padding/gap/radius match
// -- Molecule/Entity Card/*; the interaction states (hover/pressed/active/focus)
// are expressed in CSS. Radius is none (square).
const cardStyles = cn(
  'flex w-full items-center gap-[var(--spacing-08)] text-left',
  'rounded-[var(--radius-none)] px-[var(--spacing-12)] py-[var(--spacing-12)]',
  'transition-colors hover:bg-[var(--bg-subtle)] active:bg-[var(--neutral-subtle)]',
  focusRing,
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
);

export interface EntityCardProps extends ComponentPropsWithoutRef<'button'> {
  /** Selected/active state (persistent highlight). */
  active?: boolean;
  children?: ReactNode;
}

export function EntityCard({ active, children, className, ...rest }: EntityCardProps) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      className={cn(cardStyles, active && 'bg-[var(--accent-surface)]', className)}
      {...rest}
    >
      {children}
    </button>
  );
}
