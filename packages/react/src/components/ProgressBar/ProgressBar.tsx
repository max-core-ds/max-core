'use client';

import { Progress } from '@base-ui/react/progress';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Heights match -- Atoms/Progress Bar/Size */Height (4/8/16); radius full.
const trackStyles = cva(
  ['w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--bg-subtle)]'],
  {
    variants: {
      size: {
        s: 'h-[var(--size-4)]',
        m: 'h-[var(--size-8)]',
        l: 'h-[var(--size-16)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

export interface ProgressBarProps
  extends Omit<ComponentPropsWithoutRef<typeof Progress.Root>, 'className' | 'value'>,
    VariantProps<typeof trackStyles> {
  /** 0–100 (or null for indeterminate). */
  value?: number | null;
  className?: string;
  /** Optional label rendered above the track. */
  label?: ReactNode;
}

export function ProgressBar({ value = null, size, className, label, ...rest }: ProgressBarProps) {
  return (
    <Progress.Root
      value={value}
      className={cn('flex w-full flex-col gap-[var(--spacing-08)]', className)}
      {...rest}
    >
      {label ? (
        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <Progress.Label>{label}</Progress.Label>
          <Progress.Value />
        </div>
      ) : null}
      <Progress.Track className={trackStyles({ size })}>
        <Progress.Indicator className="h-full rounded-[var(--radius-full)] bg-[var(--accent-default)] transition-all" />
      </Progress.Track>
    </Progress.Root>
  );
}
