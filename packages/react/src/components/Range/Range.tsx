'use client';

import { Slider } from '@base-ui/react/slider';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// Slider with a knob thumb. The only Figma token is Tooltip Knob Gap (16) — the
// space between the thumb and its value tooltip.
export interface RangeProps
  extends Omit<ComponentPropsWithoutRef<typeof Slider.Root>, 'className'> {
  className?: string;
  /** Show a value tooltip above the thumb. */
  showTooltip?: boolean;
}

export function Range({ className, showTooltip, ...rest }: RangeProps) {
  return (
    <Slider.Root className={cn('w-full', className)} {...rest}>
      <Slider.Control className="flex w-full items-center py-[var(--spacing-08)]">
        <Slider.Track className="h-[6px] w-full rounded-[var(--radius-full)] bg-[var(--bg-subtle)]">
          <Slider.Indicator className="rounded-[var(--radius-full)] bg-[var(--accent-default)]" />
          <Slider.Thumb className="relative size-[var(--size-24)] rounded-[var(--radius-full)] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--effect-shadow-down-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]">
            {showTooltip ? (
              <span className="absolute bottom-full left-1/2 mb-[var(--spacing-16)] -translate-x-1/2 rounded-[var(--radius-sm)] bg-[var(--text-primary)] px-[var(--spacing-08)] py-[var(--spacing-04)] text-xs text-[var(--bg-surface)]">
                <Slider.Value />
              </span>
            ) : null}
          </Slider.Thumb>
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
