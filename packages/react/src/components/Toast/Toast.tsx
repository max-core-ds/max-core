'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { IconOnlyButton } from '../IconOnlyButton/IconOnlyButton.js';
import { LinkButton } from '../LinkButton/LinkButton.js';
import { Spinner } from '../Spinner/Spinner.js';

// Padding X/Y, Gap, Radius, Border Weight and Icon Size are -- Molecule/Toast Snackbar/*.
// Border Weight is none today, so the per-tone stroke (as bound in the master)
// only shows if Max raises it. Icon, content and action are centred on the row
// (Figma counter-axis CENTER).
const toastStyles = cn(
  'pointer-events-auto flex items-center gap-(--toast-snackbar-gap)',
  'rounded-(--toast-snackbar-radius) border-solid border-(length:--toast-snackbar-border-weight) text-[var(--text-primary)]',
  'px-[calc(var(--toast-snackbar-padding-x)-var(--toast-snackbar-border-weight))] py-[calc(var(--toast-snackbar-padding-y)-var(--toast-snackbar-border-weight))]',
  'shadow-[var(--effect-shadow-down-md)]',
);

// Figma Tone: Success / Danger / Warning / Default / Loading. Any other toast
// `type` (or none, e.g. `info`) renders as Default.
type Tone = 'success' | 'danger' | 'warning' | 'default' | 'loading';

function toneOf(type: string | undefined): Tone {
  return type === 'success' || type === 'danger' || type === 'warning' || type === 'loading'
    ? type
    : 'default';
}

const toneBg: Record<Tone, string> = {
  success: 'bg-[var(--status-success-subtle)] border-[var(--border-default)]',
  danger: 'bg-[var(--status-danger-subtle)] border-[var(--status-danger-default)]',
  warning: 'bg-[var(--status-warning-subtle)] border-[var(--status-warning-border)]',
  default: 'bg-[var(--bg-surface)] border-[var(--border-default)]',
  loading: 'bg-[var(--bg-surface)] border-[var(--border-default)]',
};

// Status tones colour the icon, title and body with the tone's default; the
// neutral tones use text/primary for icon + title and text/secondary for body.
const toneText: Record<Tone, string> = {
  success: 'text-[var(--status-success-default)]',
  danger: 'text-[var(--status-danger-default)]',
  warning: 'text-[var(--status-warning-default)]',
  default: 'text-[var(--text-primary)]',
  loading: 'text-[var(--text-primary)]',
};

const toneBody: Record<Tone, string> = {
  ...toneText,
  default: 'text-[var(--text-secondary)]',
  loading: 'text-[var(--text-secondary)]',
};

// The action is a Link Button in the toast's tone; Loading's (Cancel) is Danger.
const actionTone = {
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  default: 'default',
  loading: 'danger',
} as const;

/**
 * Wrap the app once. Toasts are triggered with the `useToast()` manager:
 *   const toast = useToast();
 *   toast.add({ title: 'Saved', type: 'success', actionProps: { children: 'Undo', onClick } });
 * `type: 'loading'` shows the XL spinner; pass `data: { progress }` (0–100) for its %.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <BaseToast.Provider>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="fixed right-0 bottom-0 z-[100] flex w-full max-w-lg flex-col gap-[var(--spacing-12)] p-[var(--spacing-16)]">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => {
    const tone = toneOf(toast.type);
    const progress = (toast.data as { progress?: unknown } | undefined)?.progress;
    return (
      <BaseToast.Root key={toast.id} toast={toast} className={cn(toastStyles, toneBg[tone])}>
        {tone === 'loading' ? (
          <Spinner
            size="xl"
            label=""
            value={typeof progress === 'number' ? progress : undefined}
            className="shrink-0"
          />
        ) : (
          <span
            data-toast-icon
            className={cn('shrink-0 [&_svg]:size-(--toast-snackbar-icon-size)', toneText[tone])}
          >
            <ToneIcon tone={tone} />
          </span>
        )}
        {/* Title Heading/H5, body Body/SM/300, Content Gap apart (both cap-trimmed). */}
        <div className="flex min-w-0 flex-1 flex-col gap-(--toast-snackbar-content-gap)">
          <BaseToast.Title className={cn('type-h5', toneText[tone])} />
          <BaseToast.Description className={cn('type-body-sm-300', toneBody[tone])} />
        </div>
        <BaseToast.Action render={<LinkButton tone={actionTone[tone]} />} className="shrink-0" />
        {/* Dismiss = Icon Only Button, Ghost / Default / S, as in the master. */}
        <BaseToast.Close
          className="shrink-0"
          render={<IconOnlyButton aria-label="Close" variant="ghost" size="s" icon={<XIcon />} />}
        />
      </BaseToast.Root>
    );
  });
}

export function useToast() {
  return BaseToast.useToastManager();
}

// Lucide check / x / triangle-alert / info, as in the Figma master.
function ToneIcon({ tone }: { tone: Tone }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {tone === 'success' ? (
        <path d="M20 6 9 17l-5-5" />
      ) : tone === 'danger' ? (
        <path d="M18 6 6 18M6 6l12 12" />
      ) : tone === 'warning' ? (
        <>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4M12 17h.01" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
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
