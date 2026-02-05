/**
 * Edge Case Tests: Room 1 input handling
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Room1Market } from '../../../../rooms/Room1Market.jsx';

// Mock useAudio
vi.mock('../../../../hooks/useAudio', () => ({
  useAudio: () => ({
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
  }),
}));

describe('Edge: Room1 input handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('accepts RISTORA uppercase', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'RISTORA' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('accepts ristora lowercase', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'ristora' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('accepts RiStOrA mixed case', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'RiStOrA' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('handles empty input', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  test('handles whitespace-only input', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  test('accepts RISTORA with leading/trailing whitespace', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '  ristora  ' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('rejects partial answer RIST', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'RIST' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  test('rejects answer with extra characters', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'RISTORAX' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
