'use client';

import { createContext, useContext } from 'react';

// Page-level stacking on Max's zIndex tokens (Primitives → `--z-index-*`):
// dropdown 400 < popover 500 < tooltip 600 < drawer 800 < modal 900 < toast 1000.
//
// Base UI portals every popup to <body> and sets no z-index, so a Select opened
// inside a Bottom Sheet (drawer) or Dialog (modal) would sit under it at 400.
// Overlays therefore publish their layer; a floating element inside one stacks
// just above that layer (+1 dropdown, +2 popover, +3 tooltip — the scale's order),
// and on its own token everywhere else.

export type OverlayLayer = 'drawer' | 'modal';
export type FloatingLayer = 'dropdown' | 'popover' | 'tooltip';

const OverlayLayerContext = createContext<OverlayLayer | null>(null);

/** Wrap an overlay's content so floating children stack above it. */
export const OverlayLayerProvider = OverlayLayerContext.Provider;

const offset: Record<FloatingLayer, number> = { dropdown: 1, popover: 2, tooltip: 3 };

/** The z-index (a CSS value) for a floating element's positioner. */
export function useFloatingZIndex(layer: FloatingLayer): string {
  const overlay = useContext(OverlayLayerContext);
  return overlay ? `calc(var(--z-index-${overlay}) + ${offset[layer]})` : `var(--z-index-${layer})`;
}
