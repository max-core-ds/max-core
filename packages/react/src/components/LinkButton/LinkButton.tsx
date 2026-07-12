'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { statusText } from '../../utils/tone.js';

// A button that reads as a text link. No state-layer/elevation — just color +
// underline on hover. Gap/padding/icon size/focus radius match
// -- Atoms/Buttons/Link Button/*. Focus radius is `sm` (the element is `rounded-sm`
// so the outset focus ring follows it).
const linkButtonStyles = cva(
  [
    'relative inline-flex items-center',
    'gap-[var(--spacing-08)] p-[var(--spacing-04)]',
    '[&_svg]:size-[var(--size-20)]',
    'rounded-[var(--radius-sm)]',
    'font-bold whitespace-nowrap',
    'transition-colors hover:underline',
    focusRing,
    'disabled:pointer-events-none disabled:no-underline disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    // Default is the brand accent; the status tones reuse the shared table.
    variants: {
      tone: {
        default: 'text-[var(--accent-default)] hover:text-[var(--accent-hover)]',
        danger: statusText.danger,
        success: statusText.success,
        warning: statusText.warning,
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
