'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// The interactive row primitive reused by Item List / Dropdown / Stacked List.
// Padding/gap/icon size/radius match -- Atoms/List Item/*.
const listItemStyles = cn(
  'relative flex w-full items-center gap-[var(--spacing-08)] rounded-[var(--radius-l)]',
  'px-[var(--spacing-12)] py-[var(--spacing-12)] text-left text-[var(--text-primary)]',
  '[&_svg]:size-[var(--size-20)] transition-colors',
  'hover:bg-[var(--bg-subtle)]',
  focusRing,
  'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
);

export interface ListItemProps extends ComponentPropsWithoutRef<'button'> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function ListItem({ leftIcon, rightIcon, children, className, ...rest }: ListItemProps) {
  return (
    <button type="button" className={cn(listItemStyles, className)} {...rest}>
      {leftIcon}
      <span className="flex-1">{children}</span>
      {rightIcon}
    </button>
  );
}
