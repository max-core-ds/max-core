'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Padding, Text Gap and Radius match -- Molecule/Dialogs/*.
const popupStyles = cn(
  'fixed left-1/2 top-1/2 z-50 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col',
  'gap-[var(--spacing-20)] rounded-[var(--radius-l)] bg-[var(--bg-surface)] p-[var(--spacing-20)]',
  'text-[var(--text-primary)] shadow-[var(--effect-shadow-down-xl)] outline-none',
);

export type DialogTone = 'danger' | 'success' | 'warning';

// Per-tone icon color (also the danger title color). Success/warning titles
// stay text/primary — only the destructive tone tints its title.
const toneIconColor: Record<DialogTone, string> = {
  danger: 'text-[var(--status-danger-default)]',
  success: 'text-[var(--status-success-default)]',
  warning: 'text-[var(--status-warning-default)]',
};

// Sensible per-tone default icons (overridable via the `icon` prop).
const defaultToneIcon: Record<DialogTone, ReactNode> = {
  danger: <TrashIcon />,
  success: <CheckIcon />,
  warning: <PinIcon />,
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
  /** Footer actions (e.g. Cancel / Confirm buttons). */
  actions?: ReactNode;
  /** Button layout: side-by-side (default) or full-width stacked. */
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
                'flex justify-center [&_svg]:size-[var(--size-40)]',
                tone && toneIconColor[tone],
              )}
            >
              {iconNode}
            </span>
          ) : null}
          {title || description ? (
            <div className={cn('flex flex-col gap-[var(--spacing-08)]', centered && 'text-center')}>
              {title ? (
                <BaseDialog.Title
                  className={cn(
                    'font-bold',
                    centered ? 'text-3xl' : 'text-lg',
                    tone === 'danger'
                      ? 'text-[var(--status-danger-default)]'
                      : 'text-[var(--text-primary)]',
                  )}
                >
                  {title}
                </BaseDialog.Title>
              ) : null}
              {description ? (
                <BaseDialog.Description className="text-sm text-[var(--text-secondary)]">
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
          ) : null}
          {children}
          {actions ? (
            <div
              className={cn(
                'flex gap-[var(--spacing-08)]',
                actionsLayout === 'vertical'
                  ? 'flex-col [&>*]:w-full'
                  : centered
                    ? 'justify-center'
                    : 'justify-end',
              )}
            >
              {actions}
            </div>
          ) : null}
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
      <path d="M3 6h18M8 6V4h8v2m1 0-1 14H8L7 6" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" strokeLinejoin="round" />
      <path d="M12 7v4m-2-2h4" strokeLinecap="round" />
    </svg>
  );
}
