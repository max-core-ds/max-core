'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// A button that reads as a text link. No state-layer/elevation — just color +
// underline on hover. Gap / Padding / Icon Size / Focus Radius are its own Figma
// tokens -- Atoms/Buttons/Link Button/* (the element takes the Focus Radius so the
// outset focus ring follows it). Label: Body/MD/300.
// Figma: States Default / Hover / Pressed × 4 Tones + Disabled (opacity only,
// keeps the tone colour). The status tones walk default → hover → active; the
// Default tone stays `text/accent` in every state (round-1 Figma change).
const linkButtonStyles = cva(
  [
    'relative inline-flex items-center',
    'gap-(--buttons-link-button-gap) p-(--buttons-link-button-padding)',
    '[&_svg]:size-(--buttons-link-button-icon-size)',
    'rounded-(--buttons-link-button-focus-radius)',
    'type-body-md-300 whitespace-nowrap',
    'transition-colors hover:underline',
    focusRing,
    'disabled:pointer-events-none disabled:no-underline disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      tone: {
        default: 'text-[var(--text-accent)]',
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
      {children != null && children !== false ? <span className={capTrim}>{children}</span> : null}
      {rightIcon}
    </BaseButton>
  );
}
