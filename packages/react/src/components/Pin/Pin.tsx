import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Circular avatar marker / map pin. Size/radius/padding match -- Molecule/Pin/*;
// the thick stroke is the ring that lifts it off the map.
const pinStyles = cn(
  'inline-flex size-[var(--size-40)] items-center justify-center overflow-hidden',
  'rounded-[var(--radius-full)] p-[var(--spacing-04)]',
  'border-2 border-[var(--bg-surface)] bg-[var(--accent-default)] text-[var(--text-on-accent)]',
  'shadow-[var(--effect-shadow-down-md)]',
);

export interface PinProps extends ComponentPropsWithoutRef<'div'> {
  /** Avatar image, icon, or initials shown inside the pin. */
  children?: ReactNode;
}

export function Pin({ children, className, ...rest }: PinProps) {
  return (
    <div className={cn(pinStyles, className)} {...rest}>
      {children}
    </div>
  );
}
