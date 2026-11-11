'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { ActionBar } from '../ActionBar/ActionBar.js';

// Padding, Radius and Text Gap are -- Molecule/Dialogs/*; flat bg/surface, no
// shadow or stroke (as the master). The master is a fixed 347 × 327 card with
// its parts spread apart (unbound); React hugs its content with a 20px gap so any
// copy fits.
const popupStyles = cn(
  'fixed left-1/2 top-1/2 z-50 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col',
  'gap-[var(--spacing-20)] rounded-(--dialogs-radius) bg-[var(--bg-surface)] p-(--dialogs-padding)',
  'text-[var(--text-primary)] outline-none',
);

export type DialogTone = 'danger' | 'success' | 'warning';

// Per-tone icon color (also the danger title color). Success/warning titles
// stay text/primary — only the destructive tone tints its title.
const toneIconColor: Record<DialogTone, string> = {
  danger: 'text-[var(--status-danger-default)]',
  success: 'text-[var(--status-success-default)]',
  warning: 'text-[var(--status-warning-default)]',
};

// The master's per-tone icons (Icon Danger / Success / Warning swaps; `icon` overrides).
const defaultToneIcon: Record<DialogTone, ReactNode> = {
  danger: <TrashIcon />,
  success: <CheckIcon />,
  warning: <MapPinPlusIcon />,
};

export interface DialogProps {
  /** Element that opens the dialog. */
  trigger?: ReactElement;
  title?: ReactNode;
  description?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /**
   * Confirmation tone — shows a tone-colored icon and centers the content.
   * Danger additionally tints the title. Omit for a plain left-aligned modal.
   */
  tone?: DialogTone;
  /** Override the default tone icon. */
  icon?: ReactNode;
  /** Show the icon. Defaults to true when a tone (or custom icon) is set. */
  showIcon?: boolean;
  /** Footer actions, laid out by an Action Bar (the master uses Button S: Ghost + Primary). */
  actions?: ReactNode;
  /** Figma Type — Action Bar direction: side-by-side (default) or full-width stacked. */
  actionsLayout?: 'horizontal' | 'vertical';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  tone,
  icon,
  showIcon,
  actions,
  actionsLayout = 'horizontal',
  open,
  onOpenChange,
  className,
}: DialogProps) {
  const centered = tone != null;
  const iconNode = icon ?? (tone ? defaultToneIcon[tone] : null);
  const displayIcon = showIcon !== false && iconNode;

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <BaseDialog.Trigger render={trigger} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-40 bg-black/50" />
        <BaseDialog.Popup className={cn(popupStyles, className)}>
          {displayIcon ? (
            <span
              className={cn(
                'flex justify-center [&_svg]:size-[var(--size-56)]',
                tone && toneIconColor[tone],
              )}
            >
              {iconNode}
            </span>
          ) : null}
          {title || description ? (
            // Text Gap between title (Heading/H4) and body (Body/SM/300), both cap-trimmed.
            <div
              className={cn('flex flex-col gap-(--dialogs-text-gap)', centered && 'text-center')}
            >
              {title ? (
                <BaseDialog.Title
                  className={cn(
                    'type-h4',
                    tone === 'danger'
                      ? 'text-[var(--status-danger-default)]'
                      : 'text-[var(--text-primary)]',
                  )}
                >
                  {title}
                </BaseDialog.Title>
              ) : null}
              {description ? (
                <BaseDialog.Description className="type-body-sm-300 text-[var(--text-secondary)]">
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
          ) : null}
          {children}
          {actions ? <ActionBar direction={actionsLayout}>{actions}</ActionBar> : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        strokeLinejoin="round"
      />
      <path d="M12 7v6M9 10h6" strokeLinecap="round" />
    </svg>
  );
}
