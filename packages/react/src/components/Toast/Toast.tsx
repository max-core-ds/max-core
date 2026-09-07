'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Padding X/Y, Gap, Icon Size and Radius match -- Molecule/Toast Snackbar/*.
// No border (Border Weight none); the surface is the tone's subtle fill.
const toastStyles = cn(
  'pointer-events-auto flex items-start gap-[var(--spacing-16)]',
  'rounded-[var(--radius-l)] text-[var(--text-primary)]',
  'px-[var(--spacing-16)] py-[var(--spacing-12)]',
  'shadow-[var(--effect-shadow-down-md)]',
);

// Icon + title take the tone's default color; the surface is its subtle fill.
// Info/Loading (and anything unmapped) sit on the neutral bg/surface.
const toneColor: Record<string, string> = {
  success: 'text-[var(--status-success-default)]',
  danger: 'text-[var(--status-danger-default)]',
  warning: 'text-[var(--status-warning-default)]',
  info: 'text-[var(--text-primary)]',
};

const toneBg: Record<string, string> = {
  success: 'bg-[var(--status-success-subtle)]',
  danger: 'bg-[var(--status-danger-subtle)]',
  warning: 'bg-[var(--status-warning-subtle)]',
};

/**
 * Wrap the app once. Toasts are triggered with the `useToast()` manager:
 *   const toast = useToast();
 *   toast.add({ title: 'Saved', type: 'success' });
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <BaseToast.Provider>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="fixed right-0 bottom-0 z-[100] flex w-full max-w-sm flex-col gap-[var(--spacing-12)] p-[var(--spacing-16)]">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      className={cn(toastStyles, (toast.type && toneBg[toast.type]) || 'bg-[var(--bg-surface)]')}
    >
      {toast.type && toneColor[toast.type] ? (
        <span className={cn('shrink-0 [&_svg]:size-[var(--size-32)]', toneColor[toast.type])}>
          <ToneIcon type={toast.type} />
        </span>
      ) : null}
      <div className="flex flex-1 flex-col gap-[var(--spacing-04)]">
        <BaseToast.Title
          className={cn('text-2xl font-bold', toast.type ? toneColor[toast.type] : undefined)}
        />
        <BaseToast.Description className="text-sm text-[var(--text-secondary)]" />
      </div>
      <BaseToast.Close
        aria-label="Close"
        className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] [&_svg]:size-[var(--size-20)]"
      >
        <XIcon />
      </BaseToast.Close>
    </BaseToast.Root>
  ));
}

export function useToast() {
  return BaseToast.useToastManager();
}

function ToneIcon({ type }: { type: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      {type === 'success' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : type === 'danger' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
        </>
      ) : type === 'warning' ? (
        <>
          <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
          <path d="M12 10v4M12 17h.01" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
