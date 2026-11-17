import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useControllableState } from './use-controllable-state.js';

describe('useControllableState', () => {
  it('uncontrolled: seeds from defaultValue, updates itself and notifies', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<string>(undefined, 'a', onChange, 'z'),
    );
    expect(result.current[0]).toBe('a');
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('uncontrolled without defaultValue starts at the fallback', () => {
    const { result } = renderHook(() =>
      useControllableState<string>(undefined, undefined, undefined, 'z'),
    );
    expect(result.current[0]).toBe('z');
  });

  it('controlled: shows the prop, only notifies, and follows the next prop', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState<string>(value, undefined, onChange, 'z'),
      { initialProps: { value: 'a' } },
    );
    act(() => result.current[1]('b'));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(result.current[0]).toBe('a');

    rerender({ value: 'c' });
    expect(result.current[0]).toBe('c');
  });

  // `false` / `0` / `null` are real controlled values — only `undefined` means uncontrolled.
  it.each([false, 0, null])('treats %s as a controlled value', (value) => {
    const { result } = renderHook(() =>
      useControllableState<unknown>(value, 'default', undefined, 'fallback'),
    );
    expect(result.current[0]).toBe(value);
    act(() => result.current[1]('other'));
    expect(result.current[0]).toBe(value);
  });
});
