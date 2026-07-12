import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Share-sheet item: an icon tile ("item") or an avatar, plus a caption. Has no
// dedicated Figma tokens — it composes generic sizes and status-subtle tones.
const tileStyles = cva(
  [
    'flex size-[var(--size-48)] items-center justify-center rounded-[var(--radius-full)]',
    '[&_svg]:size-[var(--size-24)]',
  ],
  {
    variants: {
      tone: {
        default: 'bg-[var(--bg-subtle)] text-[var(--text-primary)]',
        success: 'bg-[var(--status-success-subtle)] text-[var(--status-success-default)]',
        warning: 'bg-[var(--status-warning-subtle)] text-[var(--status-warning-default)]',
        danger: 'bg-[var(--status-danger-subtle)] text-[var(--status-danger-default)]',
      },
    },
    defaultVariants: { tone: 'default' },
  },
);

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
      className={cn('flex flex-col items-center gap-[var(--spacing-08)] text-center', className)}
      {...rest}
    >
      {avatar ?? <span className={tileStyles({ tone })}>{icon}</span>}
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
    </button>
  );
}
