'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { tooltipArrow, tooltipBubble } from '../../utils/tooltip-surface.js';

// Base UI positions the arrow along the edge; we add the perpendicular offset so
// it straddles the popup border and protrudes toward the trigger (size-2 → -4px).
const arrowSides =
  'data-[side=top]:bottom-[-4px] data-[side=bottom]:top-[-4px] ' +
  'data-[side=left]:right-[-4px] data-[side=right]:left-[-4px]';

export interface TooltipProps {
  /** The tooltip content. */
  content: ReactNode;
  /** The element the tooltip is attached to. */
  children: ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  /** Delay before the tooltip opens, in ms. */
  delay?: number;
  /** Delay before the tooltip closes, in ms. */
  closeDelay?: number;
  rootProps?: ComponentPropsWithoutRef<typeof BaseTooltip.Root>;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  sideOffset = 8,
  delay,
  closeDelay,
  rootProps,
}: TooltipProps) {
  const root = (
    <BaseTooltip.Root {...rootProps}>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
          <BaseTooltip.Popup className={tooltipBubble}>
            <BaseTooltip.Arrow className={cn(tooltipArrow, arrowSides)} />
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );

  // delay/closeDelay live on the Provider. Only wrap when set, so an app-level
  // Tooltip.Provider (delay grouping) still applies when they're omitted.
  if (delay == null && closeDelay == null) return root;
  return (
    <BaseTooltip.Provider delay={delay} closeDelay={closeDelay}>
      {root}
    </BaseTooltip.Provider>
  );
}
