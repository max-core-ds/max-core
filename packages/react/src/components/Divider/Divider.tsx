'use client';

import { Separator } from '@base-ui/react/separator';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Hairline in border/default, as thick as -- Atoms/Divider/Border Weight
// (→ border-weight.thin, 1px). Figma only draws the horizontal line; vertical is
// the same line rotated, for toolbars and inline groups (stretches in a flex row).
const dividerStyles = cva(['shrink-0 border-0 bg-[var(--border-default)]'], {
  variants: {
    orientation: {
      horizontal: 'h-[var(--border-weight-thin)] w-full',
      vertical: 'w-[var(--border-weight-thin)] self-stretch',
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
