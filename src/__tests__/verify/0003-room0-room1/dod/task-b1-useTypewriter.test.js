/**
 * DoD Test: Task B.1 - Create useTypewriter hook
 * Spec: Hook returns { displayText, isComplete }
 * Mitigates: H-06 (memory leak via clearInterval)
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTypewriter } from '../../../../hooks/useTypewriter.js';

describe('B.1: useTypewriter hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns displayText and isComplete properties', () => {
    const { result } = renderHook(() => useTypewriter('Hello', 50));

    expect(result.current).toHaveProperty('displayText');
    expect(result.current).toHaveProperty('isComplete');
  });

  test('starts with empty displayText and isComplete false', () => {
    const { result } = renderHook(() => useTypewriter('Hello', 50));

    expect(result.current.displayText).toBe('');
    expect(result.current.isComplete).toBe(false);
  });

  test('types text letter by letter', () => {
    const { result } = renderHook(() => useTypewriter('Hi', 50));

    // Initial state
    expect(result.current.displayText).toBe('');

    // After first interval
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe('H');

    // After second interval
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe('Hi');
  });

  test('isComplete becomes true when done typing', () => {
    const { result } = renderHook(() => useTypewriter('AB', 50));

    expect(result.current.isComplete).toBe(false);

    // Type first letter
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.isComplete).toBe(false);

    // Type second letter
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.isComplete).toBe(false);

    // Complete typing (next tick sets isComplete)
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.isComplete).toBe(true);
  });

  test('respects speed parameter', () => {
    const { result } = renderHook(() => useTypewriter('Test', 100));

    // After 50ms (half of speed), no letter should be typed
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe('');

    // After 100ms, first letter should appear
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe('T');
  });

  test('handles empty string', () => {
    const { result } = renderHook(() => useTypewriter('', 50));

    expect(result.current.displayText).toBe('');
    expect(result.current.isComplete).toBe(false);

    // Nothing should happen with empty text
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.displayText).toBe('');
  });

  test('H-06: cleans up interval on unmount (no memory leak)', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useTypewriter('Hello World', 50));

    // Advance a bit to ensure interval is running
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Unmount should call cleanup
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  test('resets when text prop changes', () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter(text, 50),
      { initialProps: { text: 'AB' } }
    );

    // Type first letter
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe('A');

    // Change text
    rerender({ text: 'XY' });

    // Should reset to empty
    expect(result.current.displayText).toBe('');
    expect(result.current.isComplete).toBe(false);

    // Should start typing new text
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe('X');
  });
});
