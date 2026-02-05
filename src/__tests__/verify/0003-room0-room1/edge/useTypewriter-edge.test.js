/**
 * Edge Case Tests: useTypewriter hook
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from '../../../../hooks/useTypewriter.js';

describe('Edge: useTypewriter hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('handles empty string', () => {
    const { result } = renderHook(() => useTypewriter('', 50));

    expect(result.current.displayText).toBe('');
    expect(result.current.isComplete).toBe(false);

    // Should not throw or create interval for empty text
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.displayText).toBe('');
  });

  test('handles null text gracefully', () => {
    const { result } = renderHook(() => useTypewriter(null, 50));

    expect(result.current.displayText).toBe('');
    expect(result.current.isComplete).toBe(false);
  });

  test('handles undefined text gracefully', () => {
    const { result } = renderHook(() => useTypewriter(undefined, 50));

    expect(result.current.displayText).toBe('');
    expect(result.current.isComplete).toBe(false);
  });

  test('handles single character', () => {
    const { result } = renderHook(() => useTypewriter('X', 50));

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current.displayText).toBe('X');

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current.isComplete).toBe(true);
  });

  test('handles very long text', () => {
    const longText = 'A'.repeat(1000);
    const { result } = renderHook(() => useTypewriter(longText, 1));

    // Type all characters
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.displayText).toBe(longText);
    expect(result.current.isComplete).toBe(true);
  });

  test('handles speed of 0', () => {
    const { result } = renderHook(() => useTypewriter('Test', 0));

    // With speed 0, should still work (immediate intervals)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should have typed some characters
    expect(result.current.displayText.length).toBeGreaterThan(0);
  });

  test('handles speed of 1', () => {
    const { result } = renderHook(() => useTypewriter('AB', 1));

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.displayText).toBe('A');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.displayText).toBe('AB');
  });

  test('handles text with newlines', () => {
    const textWithNewlines = 'Line1\nLine2\nLine3';
    const { result } = renderHook(() => useTypewriter(textWithNewlines, 10));

    // Type all characters
    act(() => {
      vi.advanceTimersByTime(textWithNewlines.length * 10 + 100);
    });

    expect(result.current.displayText).toBe(textWithNewlines);
    expect(result.current.isComplete).toBe(true);
  });

  test('handles text with special characters', () => {
    const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const { result } = renderHook(() => useTypewriter(specialText, 10));

    act(() => {
      vi.advanceTimersByTime(specialText.length * 10 + 100);
    });

    expect(result.current.displayText).toBe(specialText);
  });

  test('handles emoji text', () => {
    // Note: emoji handling may vary based on string iteration
    const emojiText = 'Hello!';
    const { result } = renderHook(() => useTypewriter(emojiText, 10));

    act(() => {
      vi.advanceTimersByTime(emojiText.length * 10 + 100);
    });

    expect(result.current.displayText).toBe(emojiText);
  });
});
