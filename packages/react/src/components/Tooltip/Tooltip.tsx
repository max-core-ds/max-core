'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { tooltipArrow, tooltipBubble } from '../../utils/tooltip-surface.js';

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
          <BaseTooltip.Popup className={tooltipBubble}>
            <BaseTooltip.Arrow className={tooltipArrow} />
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
