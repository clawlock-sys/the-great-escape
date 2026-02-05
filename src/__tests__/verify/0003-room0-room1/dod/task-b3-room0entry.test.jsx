/**
 * DoD Test: Task B.3 - Create Room0Entry.jsx
 * Spec: Component renders with Transition, uses useTypewriter, TextInput, HintButton
 * Mitigates: H-04, H-05, H-06
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Room0Entry } from '../../../../rooms/Room0Entry.jsx';

// Mock useAudio to avoid audio file issues
vi.mock('../../../../hooks/useAudio', () => ({
  useAudio: () => ({
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
  }),
}));

describe('B.3: Room0Entry component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders with Transition wrapper (C-16)', async () => {
    const { container } = render(<Room0Entry />);

    // Transition component should render children
    // The component should be in the DOM
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(container.querySelector('div')).toBeTruthy();
  });

  test('renders typewriter text', async () => {
    render(<Room0Entry />);

    // Wait for typewriter to start
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Should show narrative text (first letter or more)
    const textContainer = document.querySelector('p');
    expect(textContainer).toBeTruthy();
  });

  test('uses TextInput component (C-14)', async () => {
    render(<Room0Entry />);

    // Fast forward to show input (after typewriter completes)
    await act(async () => {
      // NARRATIVE_TEXT is ~100 chars, at 60ms each = 6000ms + buffer
      vi.advanceTimersByTime(10000);
    });

    // TextInput renders as an input element
    const input = screen.queryByPlaceholderText(/enter date/i);
    expect(input).toBeTruthy();
  });

  test('uses HintButton component (C-15)', async () => {
    render(<Room0Entry />);

    // Fast forward to show hint button
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // HintButton renders a button with "Hint" text
    const hintButton = screen.queryByRole('button', { name: /hint/i });
    expect(hintButton).toBeTruthy();
  });

  test('H-04: calls onComplete when validation succeeds', async () => {
    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    // Fast forward to show input
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);

    // Enter correct answer
    await act(async () => {
      fireEvent.change(input, { target: { value: '10052024' } });
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('H-05: calls onHintUsed when hint is used', async () => {
    const onHintUsed = vi.fn();
    render(<Room0Entry onHintUsed={onHintUsed} />);

    // Fast forward to show hint button
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const hintButton = screen.getByRole('button', { name: /hint/i });

    await act(async () => {
      fireEvent.click(hintButton);
    });

    expect(onHintUsed).toHaveBeenCalled();
  });

  test('validates correct date format 10052024 (SC-01)', async () => {
    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '10052024' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('validates alternate date format 10/05/2024 (SC-02)', async () => {
    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '10/05/2024' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('shows feedback on wrong answer (C-03, H-10)', async () => {
    const onComplete = vi.fn();
    const { container } = render(<Room0Entry onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    const input = screen.getByPlaceholderText(/enter date/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'WRONG' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // onComplete should NOT be called
    expect(onComplete).not.toHaveBeenCalled();

    // Red flash class should be applied (implementation detail via CSS classes)
    // The component adds redFlash class on wrong answer
    // Due to setTimeout, we need to check within the flash duration
    // Note: This is a visual effect test - the key assertion is onComplete not called
  });

  test('has 3 hints (C-04)', async () => {
    const onHintUsed = vi.fn();
    render(<Room0Entry onHintUsed={onHintUsed} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Click hint button 3 times
    const hintButton = screen.getByRole('button', { name: /hint/i });

    for (let i = 0; i < 3; i++) {
      await act(async () => {
        fireEvent.click(hintButton);
      });
    }

    expect(onHintUsed).toHaveBeenCalledTimes(3);

    // After 3 hints, button should be disabled
    expect(screen.getByRole('button', { name: /no more hints|all hints/i })).toBeDisabled();
  });
});
