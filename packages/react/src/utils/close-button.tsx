import { cn } from './cn.js';
import { focusRing } from './focus-ring.js';

// The ✕ in the Card and Bottom Sheet headers: the masters' "Close" frame, two 12px
// strokes (2px, text/muted) in a 24 box. Hover brightens to text/primary (the masters
// define no states); focus uses the shared ring.
export const closeButtonStyles = cn(
  'inline-flex size-[var(--size-24)] shrink-0 items-center justify-center rounded-[var(--radius-sm)]',
  'text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]',
  focusRing,
);

export function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className="size-[var(--size-24)]"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
