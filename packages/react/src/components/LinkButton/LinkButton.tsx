'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// A button that reads as a text link. No state-layer/elevation — just color +
// underline on hover. Gap/padding/icon size/focus radius match
// -- Atoms/Buttons/Link Button/*. Focus radius is `sm` (the element is `rounded-sm`
// so the outset focus ring follows it). Label uses Body/MD/300 (Light, 16px).
// Figma: 4 States (Default, Focused, Hover, Pressed) × 4 Tones + Disabled —
// each tone shifts through default → hover → active across the states.
const linkButtonStyles = cva(
  [
    'relative inline-flex items-center',
    'gap-[var(--spacing-08)] p-[var(--spacing-04)]',
    '[&_svg]:size-[var(--size-20)]',
    'rounded-[var(--radius-sm)]',
    'text-base font-light whitespace-nowrap',
    'transition-colors hover:underline',
    focusRing,
    'disabled:pointer-events-none disabled:no-underline disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    // Each tone walks default → hover → active (Pressed) exactly as the Figma
    // states do; `default` is the brand accent.
    variants: {
      tone: {
        default:
          'text-[var(--accent-default)] hover:text-[var(--accent-hover)] active:text-[var(--accent-active)]',
        danger:
          'text-[var(--status-danger-default)] hover:text-[var(--status-danger-hover)] active:text-[var(--status-danger-active)]',
        success:
          'text-[var(--status-success-default)] hover:text-[var(--status-success-hover)] active:text-[var(--status-success-active)]',
        warning:
          'text-[var(--status-warning-default)] hover:text-[var(--status-warning-hover)] active:text-[var(--status-warning-active)]',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

type BaseButtonProps = ComponentPropsWithoutRef<typeof BaseButton>;

export interface LinkButtonProps
  extends Omit<BaseButtonProps, 'children'>,
    VariantProps<typeof linkButtonStyles> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function LinkButton({
  tone,
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <BaseButton className={cn(linkButtonStyles({ tone }), className)} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </BaseButton>
  );
}
