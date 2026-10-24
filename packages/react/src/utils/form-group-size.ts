'use client';

import { createContext, useContext } from 'react';

export type FormGroupSize = 's' | 'm' | 'l';

// Figma's Form Group Size S/M/L also sizes what it holds: its Base Inputs and
// Action Bar Buttons use the same S/M/L. FormGroup provides its size here;
// fields and buttons fall back to it when they have no `size` of their own.
export const FormGroupSizeContext = createContext<FormGroupSize | undefined>(undefined);

/** The component's own `size`, else the enclosing FormGroup's, else undefined. */
export function useFormGroupSize<T extends string>(
  size: T | null | undefined,
): T | FormGroupSize | undefined {
  const groupSize = useContext(FormGroupSizeContext);
  return size ?? groupSize;
}
