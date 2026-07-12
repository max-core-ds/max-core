import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/cn.js';

// The circular draggable handle reused by Range / Switch / Slider. Size/padding/
// radius match -- Atoms/Knob/*: a 24px surface circle with an accent inner dot
// inset by the 4px padding. Presentational only — the parent control owns the
// drag interaction.
const knobStyles =
  'inline-flex size-[var(--size-24)] items-center justify-center rounded-[var(--radius-full)] ' +
  'bg-[var(--bg-surface)] p-[var(--spacing-04)] shadow-[var(--effect-shadow-down-sm)]';

export interface KnobProps extends ComponentPropsWithoutRef<'span'> {}

export function Knob({ className, ...rest }: KnobProps) {
  return (
    <span className={cn(knobStyles, className)} {...rest}>
      <span className="size-full rounded-[var(--radius-full)] bg-[var(--accent-default)]" />
    </span>
  );
}
