'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

// Padding/radius/arrow radius match -- Atoms/Tooltip/*.
const popupStyles =
  'rounded-[var(--radius-md)] border border-[var(--border-muted)] bg-[var(--bg-surface)] ' +
  'p-[var(--spacing-16)] text-sm text-[var(--text-primary)] shadow-[var(--effect-shadow-down-md)] ' +
  'outline-none';

const arrowStyles = 'size-2 rotate-45 rounded-[var(--radius-xs)] bg-[var(--bg-surface)]';

export interface TooltipProps {
  /** The tooltip content. */
  content: ReactNode;
  /** The element the tooltip is attached to. */
  children: ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  rootProps?: ComponentPropsWithoutRef<typeof BaseTooltip.Root>;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  sideOffset = 8,
  rootProps,
}: TooltipProps) {
  return (
    <BaseTooltip.Root {...rootProps}>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
          <BaseTooltip.Popup className={popupStyles}>
            <BaseTooltip.Arrow className={arrowStyles} />
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
