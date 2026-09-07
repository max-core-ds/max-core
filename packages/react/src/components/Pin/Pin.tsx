import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Circular avatar/icon map marker. Size/radius/padding match -- Molecule/Pin/*;
// the 2px border/accent ring + a short accent tail (Pin Tail vector) make it a
// map pin that lifts off the surface.
const circleStyles = cn(
  'inline-flex size-[var(--size-40)] items-center justify-center overflow-hidden',
  'rounded-[var(--radius-full)] p-[var(--spacing-04)]',
  'border-2 border-[var(--border-accent)] bg-[var(--accent-default)] text-[var(--text-on-accent)]',
  'shadow-[var(--effect-shadow-down-md)]',
);

export interface PinProps extends ComponentPropsWithoutRef<'div'> {
  /** Avatar image, icon, or initials shown inside the pin. */
  children?: ReactNode;
}

export function Pin({ children, className, ...rest }: PinProps) {
  return (
    <div className={cn('inline-flex flex-col items-center', className)} {...rest}>
      <div className={circleStyles}>{children}</div>
      {/* Pin Tail — 2px accent stem (~20px) below the circle. */}
      <span aria-hidden className="h-5 w-0.5 bg-[var(--border-accent)]" />
    </div>
  );
}
