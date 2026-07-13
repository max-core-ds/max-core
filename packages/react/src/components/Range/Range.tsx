'use client';

import { Slider } from '@base-ui/react/slider';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import { Knob } from '../Knob/Knob.js';

// Slider built on the Knob handle. A thumb is rendered per value, so a range
// (array value) shows two knobs. The only Figma token is Tooltip Knob Gap (16)
// — the space between a thumb and its value tooltip.
export interface RangeProps
  extends Omit<ComponentPropsWithoutRef<typeof Slider.Root>, 'className'> {
  className?: string;
  /** Show a value tooltip above each thumb. */
  showTooltip?: boolean;
  /** Show the min/max bound labels beneath the track. */
  showLabels?: boolean;
}

export function Range({
  className,
  showTooltip,
  showLabels,
  value,
  defaultValue,
  min = 0,
  max = 100,
  ...rest
}: RangeProps) {
  const values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : undefined;
  const thumbCount = values?.length ?? 1;

  return (
    <Slider.Root
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn('w-full', className)}
      {...rest}
    >
      <Slider.Control className="flex w-full items-center py-[var(--spacing-08)]">
        <Slider.Track className="h-[6px] w-full rounded-[var(--radius-full)] bg-[var(--bg-subtle)]">
          <Slider.Indicator className="rounded-[var(--radius-full)] bg-[var(--accent-default)]" />
          {Array.from({ length: thumbCount }, (_, i) => (
            <Slider.Thumb
              // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are a fixed, ordered set
              key={i}
              index={i}
              className="relative flex rounded-[var(--radius-full)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            >
              <Knob />
              {showTooltip ? (
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-[var(--spacing-16)] -translate-x-1/2 rounded-[var(--radius-sm)] bg-[var(--text-primary)] px-[var(--spacing-08)] py-[var(--spacing-04)] text-xs text-[var(--bg-surface)]">
                  <Slider.Value>{(_, v) => (Array.isArray(v) ? v[i] : v)}</Slider.Value>
                </span>
              ) : null}
            </Slider.Thumb>
          ))}
        </Slider.Track>
      </Slider.Control>
      {showLabels ? (
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      ) : null}
    </Slider.Root>
  );
}
