'use client';

import { useCallback, useState } from 'react';

/**
 * Reconcile a controlled prop with an internal uncontrolled fallback — the DS
 * convention for state a component genuinely owns (SideBar collapse, picker
 * value, Switcher selection…). When `controlled` is `undefined` the component
 * manages its own state seeded from `defaultValue` (or `fallback`); when it's
 * defined the consumer owns the value and `onChange` is the only notification.
 *
 * State bound to external/derived truth (route-driven navigation) should stay
 * purely controlled and NOT use this hook — see packages/react/README.md.
 */
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T | undefined,
  onChange: ((value: T) => void) | undefined,
  fallback: T,
): readonly [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue ?? fallback);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : uncontrolled;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue] as const;
}
