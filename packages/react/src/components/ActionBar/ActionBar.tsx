import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Layout-only button-group container matching Action Bar (Figma node 4112:93):
// a flexible slot of Button instances that expand equally (min-width 160px) in
// the chosen Direction. Colors come from the buttons inside — no color tokens.
// Horizontal is a grid of equal columns: `flex: 1` left a bordered (secondary)
// button 2px wider than a borderless one. Override the minimum with
// `auto-cols-[minmax(0,1fr)]` where the buttons must share a narrow width.
const actionBarStyles = cva('gap-[var(--spacing-08)]', {
  variants: {
    direction: {
      horizontal: 'grid grid-flow-col auto-cols-[minmax(var(--size-160),1fr)]',
      vertical: 'flex flex-col [&>*]:min-w-[var(--size-160)] [&>*]:w-full',
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
