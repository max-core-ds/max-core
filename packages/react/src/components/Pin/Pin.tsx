import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Map marker: a 40px circle over a round-capped tail. Size/radius/padding/stroke
// are -- Molecule/Pin/*. Figma Type:
// - Icon: accent/default circle, Padding 4, a 32px text/on-accent icon.
// - Avatar: an Avatar M with an inside 2px border/accent stroke (Avatar Stroke
//   Weight) — an inset outline, so it draws over the image.
// The tail is a 2px text/accent stroke (Stroke Weight), 20px long. No shadow.
const circleStyles = {
  icon: cn(
    'inline-flex size-(--pin-size) shrink-0 items-center justify-center',
    'rounded-(--pin-radius) p-(--pin-padding)',
    'bg-(--accent-default) text-(--text-on-accent) [&_svg]:size-(--size-32)',
  ),
  avatar: cn(
    'inline-flex size-(--pin-size) shrink-0 rounded-(--pin-radius)',
    // On the Avatar itself: it is position:relative, so it would paint over an
    // outline on this wrapper.
    '[&>*]:outline-solid [&>*]:outline-(length:--pin-avatar-stroke-weight) [&>*]:outline-(--border-accent)',
    '[&>*]:outline-offset-[calc(-1*var(--pin-avatar-stroke-weight))]',
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
        className="h-(--size-20) w-(--pin-stroke-weight) rounded-b-full bg-(--text-accent)"
      />
    </div>
  );
}
