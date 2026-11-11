import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Share-sheet item: an icon tile ("item") or an avatar, plus a caption. Composes
// the Stacked List Item Grid sizing (48px tile / 28px icon / full radius); each
// tone is a subtle fill + matching default-tone icon and label. Default = accent.
const tileStyles = cva(
  [
    'flex size-[var(--size-48)] items-center justify-center rounded-[var(--radius-full)]',
    '[&_svg]:size-[var(--size-28)]',
  ],
  {
    variants: {
      tone: {
        // Icon text/accent (round-1 sweep of accent/* icons → text/accent).
        default: 'bg-[var(--accent-subtle)] text-[var(--text-accent)]',
        success: 'bg-[var(--status-success-subtle)] text-[var(--status-success-default)]',
        warning: 'bg-[var(--status-warning-subtle)] text-[var(--status-warning-default)]',
        danger: 'bg-[var(--status-danger-subtle)] text-[var(--status-danger-default)]',
      },
    },
    defaultVariants: { tone: 'default' },
  },
);

// Caption is Caption/700; its color follows the tone (default = secondary).
const labelStyles = cva('type-caption-700', {
  variants: {
    tone: {
      default: 'text-[var(--text-secondary)]',
      success: 'text-[var(--status-success-default)]',
      warning: 'text-[var(--status-warning-default)]',
      danger: 'text-[var(--status-danger-default)]',
    },
  },
  defaultVariants: { tone: 'default' },
});

export interface ShareItemProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'type'>,
    VariantProps<typeof tileStyles> {
  label: ReactNode;
  /** Icon for the "item" type. */
  icon?: ReactNode;
  /** Avatar for the "avatar" type (replaces the icon tile). */
  avatar?: ReactNode;
}

export function ShareItem({ tone, label, icon, avatar, className, ...rest }: ShareItemProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex flex-col items-center gap-[var(--spacing-08)] rounded-[var(--radius-sm)] text-center',
        focusRing,
        className,
      )}
      {...rest}
    >
      {avatar ?? <span className={tileStyles({ tone })}>{icon}</span>}
      <span className={labelStyles({ tone })}>{label}</span>
    </button>
  );
}
