/**
 * Edge Case Tests: Room 0 input handling
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Room0Entry } from '../../../../rooms/Room0Entry.jsx';

// Mock useAudio
vi.mock('../../../../hooks/useAudio', () => ({
  useAudio: () => ({
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
  }),
}));

describe('Edge: Room0 input handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('handles empty input submission', async () => {
    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  test('handles whitespace-only input', async () => {
    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  test('handles very long input', async () => {
    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);
    const longInput = 'x'.repeat(1000);

    await act(async () => {
      fireEvent.change(input, { target: { value: longInput } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // Should not crash, just reject
    expect(onComplete).not.toHaveBeenCalled();
  });

  test('handles special characters', async () => {
    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '!@#$%^&*()' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  test('accepts date with leading/trailing whitespace', async () => {
    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '  10052024  ' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });
});
