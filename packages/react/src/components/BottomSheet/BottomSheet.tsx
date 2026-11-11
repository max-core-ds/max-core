'use client';

import { Drawer } from '@base-ui/react/drawer';
import type { ReactElement, ReactNode } from 'react';
import { CloseIcon } from '../../utils/close-button.js';
import { cn } from '../../utils/cn.js';
import { IconOnlyButton } from '../IconOnlyButton/IconOnlyButton.js';

// Bottom Sheet — the Figma "Bottom Sheet Builder" master (page "Bottom sheet"), on
// Base UI's Drawer (modal, focus trap, Esc / outside press, swipe down to dismiss).
// Shell: bg/surface, top corners Radius 2xl, effect/shadow/up/md; parts stacked
// Content Gap 16 apart, Footer Padding Bottom 32 (or the device's safe area).
// Handle: a 40 × 4 bg/subtle grabber with Handle Padding 8 above / below.
// Header: Heading/H6 title + ✕, Padding X 16. Body has no padding: its rows
// (Stacked List, inputs in a 16px frame…) bring their own, as in the master.
// Footer: Padding X 16, items Content Gap 16 apart, equal widths (the master's
// buttons FILL). Tokens: -- Organism/Bottom Sheet/*.

const popupStyles = cn(
  'relative flex max-h-[calc(100dvh-var(--spacing-48))] w-full max-w-lg flex-col gap-[var(--spacing-16)]',
  'rounded-t-[var(--radius-2xl)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none',
  'pb-[max(var(--spacing-32),env(safe-area-inset-bottom))] shadow-[var(--effect-shadow-up-md)]',
  // Slide in / out from below and follow the finger while swiping (Base UI sets
  // --drawer-swipe-movement-y and data-swiping).
  '[transform:translateY(var(--drawer-swipe-movement-y,0px))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
  'data-[starting-style]:[transform:translateY(100%)] data-[ending-style]:[transform:translateY(100%)]',
  'data-[swiping]:duration-0 motion-reduce:transition-none',
);

export interface BottomSheetProps {
  /** Element that opens the sheet. */
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Header title (Heading/H6). The header renders when there's a title. */
  title?: ReactNode;
  /** Show the header's ✕. Default true; the sheet still closes on Esc, outside press and swipe. */
  showClose?: boolean;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Show the grabber (Show Handle). Default true. */
  handle?: boolean;
  /** Body Content slot. No padding: rows and frames inside bring their own. */
  children?: ReactNode;
  /**
   * Footer Content slot: items share the width in equal columns, 16 apart. For an
   * uneven row (input + icon buttons), pass one element that lays it out.
   */
  footer?: ReactNode;
  className?: string;
}

export function BottomSheet({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title,
  showClose = true,
  closeLabel = 'Close',
  handle = true,
  children,
  footer,
  className,
}: BottomSheetProps) {
  return (
    <Drawer.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
    >
      {trigger ? <Drawer.Trigger render={trigger} /> : null}
      <Drawer.Portal>
        <Drawer.Backdrop
          className={cn(
            'fixed inset-0 z-40 bg-[var(--overlay-scrim)] transition-opacity duration-[450ms]',
            'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none',
          )}
        />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
          <Drawer.Popup
            className={cn(
              popupStyles,
              // Without the handle the master starts flush at the top edge; keep Padding Y.
              !handle && 'pt-[var(--spacing-16)]',
              className,
            )}
          >
            {handle ? (
              <div
                aria-hidden="true"
                className="flex shrink-0 justify-center py-[var(--spacing-08)]"
              >
                <div className="h-[var(--size-4)] w-[var(--size-40)] rounded-[var(--radius-full)] bg-[var(--bg-subtle)]" />
              </div>
            ) : null}
            {title != null ? (
              <div className="flex shrink-0 items-center justify-between gap-[var(--spacing-12)] px-[var(--spacing-16)]">
                <Drawer.Title className="min-w-0 flex-1 text-xl leading-[1.3] font-bold tracking-[-0.005em] text-[var(--text-primary)]">
                  {title}
                </Drawer.Title>
                {showClose ? (
                  // Ghost S Icon Only Button, as the master (round 1).
                  <Drawer.Close
                    render={
                      <IconOnlyButton
                        aria-label={closeLabel}
                        variant="ghost"
                        size="s"
                        icon={<CloseIcon />}
                      />
                    }
                  />
                ) : null}
              </div>
            ) : null}
            {children != null ? (
              <Drawer.Content className="flex min-h-0 flex-1 flex-col gap-[var(--spacing-16)] overflow-y-auto">
                {children}
              </Drawer.Content>
            ) : null}
            {footer != null ? (
              <div className="grid shrink-0 grid-flow-col auto-cols-[minmax(0,1fr)] items-center gap-[var(--spacing-16)] px-[var(--spacing-16)]">
                {footer}
              </div>
            ) : null}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
