'use client';

import { Separator } from '@base-ui/react/separator';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// 1px hairline (border-weight.thin) in the default border color.
const dividerStyles = cva(['shrink-0 border-0 bg-[var(--border-default)]'], {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px self-stretch',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export interface DividerProps
  extends Omit<ComponentPropsWithoutRef<typeof Separator>, 'orientation'>,
    VariantProps<typeof dividerStyles> {}

export function Divider({ orientation = 'horizontal', className, ...rest }: DividerProps) {
  return (
    <Separator
      orientation={orientation ?? 'horizontal'}
      className={cn(dividerStyles({ orientation }), className)}
      {...rest}
    />
  );
}
