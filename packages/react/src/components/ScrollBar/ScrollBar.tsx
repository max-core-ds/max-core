import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Minimal scroll-position indicator matching -- Atoms/Scroll Bar (Figma):
// a transparent track (4px padding all sides) holding a rounded thumb —
// 4px wide, 24px tall, accent/subtle fill, fully rounded. Standalone atom,
// no variants/states/focus. Decorative by default (aria-hidden); the real
// scroll region owns the semantics.
const trackClass = 'inline-flex shrink-0 p-[var(--spacing-04)]';
const thumbClass =
  'block w-[var(--spacing-04)] h-[var(--size-24)] rounded-[var(--radius-full)] bg-[var(--accent-subtle)]';

export type ScrollBarProps = ComponentPropsWithoutRef<'div'>;

export function ScrollBar({ className, ...rest }: ScrollBarProps) {
  return (
    <div aria-hidden className={cn(trackClass, className)} {...rest}>
      <span className={thumbClass} />
    </div>
  );
}
