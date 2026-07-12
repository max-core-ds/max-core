import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// The circular draggable handle reused by Range / Switch / Slider. Size/padding/
// radius match -- Atoms/Knob/*; a surface container holds an inner handle whose
// fill is state-specific (Figma: State=Default/Hover/Pressed × Disabled):
//   Default → neutral/subtle · Hover → accent · Pressed → hollow border ring.
const containerStyles =
  'inline-flex size-[var(--size-24)] items-center justify-center rounded-[var(--radius-full)] ' +
  'bg-[var(--bg-surface)] p-[var(--spacing-04)] shadow-[var(--effect-shadow-down-sm)]';

const handleStyles = cva('size-full rounded-[var(--radius-full)]', {
  variants: {
    state: {
      default: 'bg-[var(--neutral-subtle)]',
      hover: 'bg-[var(--accent-default)]',
      pressed: 'border-2 border-[var(--border-default)] bg-transparent',
    },
  },
  defaultVariants: { state: 'default' },
});

export interface KnobProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof handleStyles> {
  disabled?: boolean;
}

export function Knob({ state, disabled, className, ...rest }: KnobProps) {
  return (
    <span
      data-disabled={disabled || undefined}
      className={cn(containerStyles, disabled && 'opacity-[var(--opacity-disabled)]', className)}
      {...rest}
    >
      <span className={handleStyles({ state })} />
    </span>
  );
}
