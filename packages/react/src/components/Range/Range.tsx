'use client';

import { Slider } from '@base-ui/react/slider';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRingWithin } from '../../utils/focus-ring.js';
import { progressFill, progressTrack } from '../../utils/progress.js';
import {
  TOOLTIP_ARROW_PATH,
  TOOLTIP_ARROW_VIEWBOX,
  tooltipArrow,
  tooltipBubble,
} from '../../utils/tooltip-surface.js';
import { Knob } from '../Knob/Knob.js';

// Composed from the Progress Bar (track + fill), Knob (thumb) and Tooltip (value
// bubble) atoms, per the Figma Range page. A thumb is rendered per value, so a
// range (array value) shows two knobs. Tooltip Knob Gap (16) spaces each bubble
// above its thumb. The control is knob-tall (track centred, 10px knob overhang each
// side); the bound labels sit Progress Bar Item Gaps (8) below the *track*, as in
// the master, so they pull up by that overhang. Disabled dims the whole slider
// once (the knob keeps its default handle, no second opacity).
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
  disabled,
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
      disabled={disabled}
      className={cn(
        // select-none: dragging must not select the tooltip / label text.
        'flex w-full select-none flex-col data-[disabled]:opacity-[var(--opacity-disabled)]',
        className,
      )}
      {...rest}
    >
      <Slider.Control className="flex h-[var(--size-24)] w-full items-center data-[disabled]:pointer-events-none">
        <Slider.Track className={progressTrack('s')}>
          {/* No width transition: the fill must track the thumb while dragging. */}
          <Slider.Indicator className={cn(progressFill, 'transition-none')} />
          {Array.from({ length: thumbCount }, (_, i) => (
            <Slider.Thumb
              // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are a fixed, ordered set
              key={i}
              index={i}
              className={cn('relative flex rounded-[var(--radius-full)]', focusRingWithin)}
            >
              <Knob state={disabled ? 'default' : undefined} />
              {showTooltip ? (
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-[var(--spacing-16)] -translate-x-1/2">
                  <div className={cn('relative', tooltipBubble)}>
                    <Slider.Value>{(_, v) => (Array.isArray(v) ? v[i] : v)}</Slider.Value>
                    <svg
                      viewBox={TOOLTIP_ARROW_VIEWBOX}
                      aria-hidden="true"
                      className={cn(
                        'absolute top-full left-1/2 -mt-px -translate-x-1/2',
                        tooltipArrow,
                      )}
                    >
                      <path d={TOOLTIP_ARROW_PATH} />
                    </svg>
                  </div>
                </div>
              ) : null}
            </Slider.Thumb>
          ))}
        </Slider.Track>
      </Slider.Control>
      {showLabels ? (
        <div className="mt-[calc(var(--spacing-08)-(var(--size-24)-var(--size-4))/2)] flex justify-between text-xs font-light text-[var(--text-primary)]">
          <span>{formatLabel(min)}</span>
          <span>{formatLabel(max)}</span>
        </div>
      ) : null}
    </Slider.Root>
  );
}
