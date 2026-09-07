import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Layout-only button-group container matching Action Bar (Figma node 4112:93):
// a flexible slot of Button instances that expand equally (min-width 160px) in
// the chosen Direction. Colors come from the buttons inside — no color tokens.
const actionBarStyles = cva('flex gap-[var(--spacing-08)]', {
  variants: {
    direction: {
      horizontal: 'flex-row [&>*]:min-w-[var(--size-160)] [&>*]:flex-1',
      vertical: 'flex-col [&>*]:min-w-[var(--size-160)] [&>*]:w-full',
    },
  },
  defaultVariants: { direction: 'horizontal' },
});

export interface ActionBarProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof actionBarStyles> {}

export function ActionBar({ direction, className, children, ...rest }: ActionBarProps) {
  return (
    <div className={cn(actionBarStyles({ direction }), className)} {...rest}>
      {children}
    </div>
  );
}
