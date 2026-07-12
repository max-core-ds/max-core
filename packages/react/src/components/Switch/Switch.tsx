'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';

// Track width from Switch/Width (32/40); Knob Padding (2) insets the thumb;
// radius full. Track height and thumb size follow the Tailwind scale (Figma
// does not tokenize them). Thumb travel = width − 2·padding − thumb.
const trackStyles = cva(
  [
    'relative inline-flex shrink-0 items-center rounded-[var(--radius-full)] p-[var(--spacing-02)]',
    'bg-[var(--neutral-default)] transition-colors data-[checked]:bg-[var(--accent-default)]',
    focusRing,
    'data-[disabled]:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'h-5 w-[var(--size-32)]',
        m: 'h-6 w-[var(--size-40)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

const thumbStyles = cva(
  [
    'block rounded-[var(--radius-full)] bg-[var(--bg-surface)]',
    'shadow-[var(--effect-shadow-down-sm)] transition-transform',
  ],
  {
    variants: {
      size: {
        s: 'size-4 data-[checked]:translate-x-3',
        m: 'size-5 data-[checked]:translate-x-4',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseSwitch.Root>, 'className'>,
    VariantProps<typeof trackStyles> {
  className?: string;
}

export function Switch({ size = 'm', className, ...rest }: SwitchProps) {
  return (
    <BaseSwitch.Root className={cn(trackStyles({ size }), className)} {...rest}>
      <BaseSwitch.Thumb className={thumbStyles({ size })} />
    </BaseSwitch.Root>
  );
}
