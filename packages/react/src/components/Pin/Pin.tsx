import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Map marker: a 40px circle over a round-capped tail. Size/radius/padding/stroke
// match -- Molecule/Pin/*. Figma Type:
// - Icon: accent/default circle, Padding 4, a 32px text/on-accent icon.
// - Avatar: an Avatar M with an inside 2px border/accent stroke (Avatar Stroke
//   Weight) — an inset outline, so it draws over the image.
// The tail is a 2px accent/default stroke (Stroke Weight), 20px long. No shadow.
const circleStyles = {
  icon: cn(
    'inline-flex size-[var(--size-40)] shrink-0 items-center justify-center',
    'rounded-[var(--radius-full)] p-[var(--spacing-04)]',
    'bg-[var(--accent-default)] text-[var(--text-on-accent)] [&_svg]:size-[var(--size-32)]',
  ),
  avatar: cn(
    'inline-flex size-[var(--size-40)] shrink-0 rounded-[var(--radius-full)]',
    // On the Avatar itself: it is position:relative, so it would paint over an
    // outline on this wrapper.
    '[&>*]:outline-solid [&>*]:outline-[length:var(--border-weight-thick)] [&>*]:outline-[var(--border-accent)]',
    '[&>*]:outline-offset-[calc(-1*var(--border-weight-thick))]',
  ),
} as const;

export interface PinProps extends ComponentPropsWithoutRef<'div'> {
  /** Figma Type: `icon` (default) fills the circle; `avatar` rings an Avatar M. */
  type?: keyof typeof circleStyles;
  /** The icon (Type Icon) or an `<Avatar size="m">` (Type Avatar). */
  children?: ReactNode;
}

export function Pin({ type = 'icon', children, className, ...rest }: PinProps) {
  return (
    <div className={cn('inline-flex flex-col items-center', className)} {...rest}>
      <div className={circleStyles[type]}>{children}</div>
      {/* Pin Tail — round-capped stroke below the circle. */}
      <span
        aria-hidden="true"
        className="h-[var(--size-20)] w-[var(--border-weight-thick)] rounded-b-[var(--radius-full)] bg-[var(--accent-default)]"
      />
    </div>
  );
}
