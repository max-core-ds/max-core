'use client';

import { Progress } from '@base-ui/react/progress';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';
import { type ProgressSize, progressFill, progressTrack } from '../../utils/progress.js';

export interface ProgressBarProps
  extends Omit<ComponentPropsWithoutRef<typeof Progress.Root>, 'className' | 'value'> {
  /** 0–100 (or null for indeterminate). */
  value?: number | null;
  size?: ProgressSize;
  className?: string;
  /** Show the min/max range labels below the track (Figma: "Show Range Labels"). */
  showRangeLabels?: boolean;
  min?: number;
  max?: number;
}

export function ProgressBar({
  value = null,
  size = 'm',
  className,
  showRangeLabels,
  min = 0,
  max = 100,
  ...rest
}: ProgressBarProps) {
  return (
    <Progress.Root
      value={value}
      max={max}
      // Item Gaps (8px) between the track and the range labels.
      className={cn('flex w-full flex-col gap-[var(--spacing-08)]', className)}
      {...rest}
    >
      <Progress.Track className={cn(progressTrack(size), 'overflow-hidden')}>
        <Progress.Indicator className={progressFill} />
      </Progress.Track>
      {showRangeLabels ? (
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>{min}%</span>
          <span>{max}%</span>
        </div>
      ) : null}
    </Progress.Root>
  );
}
