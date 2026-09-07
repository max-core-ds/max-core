'use client';

import { Slider } from '@base-ui/react/slider';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { progressFill, progressTrack } from '../../utils/progress.js';
import { tooltipArrow, tooltipBubble } from '../../utils/tooltip-surface.js';
import { Knob } from '../Knob/Knob.js';

// Composed from the Progress Bar (track + fill), Knob (thumb) and Tooltip (value
// bubble) atoms, per the Figma Range page. A thumb is rendered per value, so a
// range (array value) shows two knobs. Tooltip Knob Gap (16) spaces each bubble
// above its thumb.
export interface RangeProps
  extends Omit<ComponentPropsWithoutRef<typeof Slider.Root>, 'className'> {
  className?: string;
  /** Show a value tooltip above each thumb. */
  showTooltip?: boolean;
  /** Show the min/max bound labels beneath the track. */
  showLabels?: boolean;
  /** Format the bound labels (e.g. `(v) => `$${v}``). */
  formatLabel?: (value: number) => ReactNode;
}

export function Range({
  className,
  showTooltip,
  showLabels,
  formatLabel = (v) => v,
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
      className={cn('flex w-full flex-col gap-[var(--spacing-08)]', className)}
      {...rest}
    >
      <Slider.Control className="flex w-full items-center py-[var(--spacing-08)]">
        <Slider.Track className={progressTrack('s')}>
          <Slider.Indicator className={progressFill} />
          {Array.from({ length: thumbCount }, (_, i) => (
            <Slider.Thumb
              // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are a fixed, ordered set
              key={i}
              index={i}
              className="relative flex rounded-[var(--radius-full)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            >
              <Knob />
              {showTooltip ? (
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-[var(--spacing-16)] -translate-x-1/2">
                  <div className={cn('relative', tooltipBubble)}>
                    <Slider.Value>{(_, v) => (Array.isArray(v) ? v[i] : v)}</Slider.Value>
                    <span
                      className={cn('absolute -bottom-1 left-1/2 -translate-x-1/2', tooltipArrow)}
                    />
                  </div>
                </div>
              ) : null}
            </Slider.Thumb>
          ))}
        </Slider.Track>
      </Slider.Control>
      {showLabels ? (
        <div className="flex justify-between text-xs font-light text-[var(--text-primary)]">
          <span>{formatLabel(min)}</span>
          <span>{formatLabel(max)}</span>
        </div>
      ) : null}
    </Slider.Root>
  );
}
