/**
 * Hazard Attack Test: H-06 - Typewriter memory leak
 * Spec: clearInterval must be called in cleanup function
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from '../../../../hooks/useTypewriter.js';

describe('H-06: Typewriter memory leak prevention', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('clearInterval is called on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useTypewriter('Test text', 50));

    // Let some typing happen
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Unmount should trigger cleanup
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  test('clearInterval is called when text prop changes', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { rerender } = renderHook(({ text }) => useTypewriter(text, 50), {
      initialProps: { text: 'First' },
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Change text prop
    rerender({ text: 'Second' });

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  test('interval stops when typing completes', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { result } = renderHook(() => useTypewriter('AB', 50));

    // Complete typing
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isComplete).toBe(true);
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  test('no interval leak with rapid mount/unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const setIntervalSpy = vi.spyOn(global, 'setInterval');

    // Rapid mount/unmount cycles
    for (let i = 0; i < 5; i++) {
      const { unmount } = renderHook(() => useTypewriter(`Text ${i}`, 50));
      act(() => {
        vi.advanceTimersByTime(50);
      });
      unmount();
    }

    // Each mount creates one interval, each unmount should clear it
    expect(clearIntervalSpy.mock.calls.length).toBeGreaterThanOrEqual(
      setIntervalSpy.mock.calls.length - 1
    );

    clearIntervalSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });
});
