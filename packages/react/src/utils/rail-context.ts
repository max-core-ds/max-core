'use client';

import { createContext, useContext } from 'react';

// Shared by collapsible rails (e.g. SideBar) so slotted items — ListItem,
// EntityItem — can render their icon-only (collapsed) form without each call
// site having to pass `collapsed` explicitly, and so a composed trigger (e.g.
// SideBarTrigger in the topBar slot) can flip the state. Lives in utils, not in
// SideBar, so the atoms depend on a neutral helper rather than on the organism.
export interface RailContextValue {
  collapsed: boolean;
  toggle: () => void;
}

export const RailContext = createContext<RailContextValue>({
  collapsed: false,
  toggle: () => {},
});

/**
 * Resolve the collapsed state for a rail item: an explicit prop always wins,
 * otherwise fall back to the surrounding rail (SideBar) via context.
 */
export function useRailCollapsed(explicit?: boolean): boolean {
  const ctx = useContext(RailContext);
  return explicit ?? ctx.collapsed;
}

/** Access the surrounding rail (collapsed state + toggle) — for triggers. */
export function useRail(): RailContextValue {
  return useContext(RailContext);
}
