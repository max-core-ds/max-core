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

export interface DialogProps {
  /** Element that opens the dialog. */
  trigger?: ReactElement;
  title?: ReactNode;
  description?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** Footer actions (e.g. Cancel / Confirm buttons). */
  actions?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  actions,
  open,
  onOpenChange,
  className,
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <BaseDialog.Trigger render={trigger} /> : null}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-40 bg-black/50" />
        <BaseDialog.Popup className={cn(popupStyles, className)}>
          {title || description ? (
            <div className="flex flex-col gap-[var(--spacing-08)]">
              {title ? (
                <BaseDialog.Title className="text-lg font-bold text-[var(--text-primary)]">
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
            <div className="flex justify-end gap-[var(--spacing-08)]">{actions}</div>
          ) : null}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
