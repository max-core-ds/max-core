'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import {
  TOOLTIP_ARROW_PATH,
  TOOLTIP_ARROW_VIEWBOX,
  tooltipArrow,
  tooltipBubble,
} from '../../utils/tooltip-surface.js';

// Base UI positions the arrow along the edge; we add the perpendicular offset and
// rotation so the downward triangle (16×12 box) points at the trigger from any
// side, overlapping the bubble by 1px so no seam shows. Left/right rotate the box
// about its centre: its visual 12px depth then sits 2px inside the 16px box, so
// the offset is 16 − 2 − 1 = 13px.
const arrowSides =
  'data-[side=top]:bottom-[-11px] ' +
  'data-[side=bottom]:top-[-11px] data-[side=bottom]:rotate-180 ' +
  'data-[side=left]:right-[-13px] data-[side=left]:-rotate-90 ' +
  'data-[side=right]:left-[-13px] data-[side=right]:rotate-90';

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
            <BaseTooltip.Arrow className={arrowSides}>
              <svg viewBox={TOOLTIP_ARROW_VIEWBOX} className={tooltipArrow} aria-hidden="true">
                <path d={TOOLTIP_ARROW_PATH} />
              </svg>
            </BaseTooltip.Arrow>
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
