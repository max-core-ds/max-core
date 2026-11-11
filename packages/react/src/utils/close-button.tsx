// The ✕ (lucide `x`) in the Card and Bottom Sheet headers. Both masters render it
// in a Ghost S Icon Only Button (Max, round 1), which sizes the icon.
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
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
