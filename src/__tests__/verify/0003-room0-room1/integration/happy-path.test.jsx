/**
 * Integration Test: Happy Path - Room 0 to Room 1 flow
 * Verifies E2E flow from Room 0 completion to Room 1 display
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// We need to test the flow through the actual components
// This tests that:
// 1. Room 0 renders with typewriter
// 2. Correct answer advances to Room 1
// 3. Room 1 displays stalls

// Mock useAudio
vi.mock('../../../../hooks/useAudio', () => ({
  useAudio: () => ({
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
  }),
}));

// Mock usePersistedState to avoid localStorage
vi.mock('../../../../hooks/usePersistedState', () => ({
  usePersistedState: (key, initialValue) => {
    const [state, setState] = vi.importActual('react').useState(initialValue);
    return [state, setState];
  },
}));

describe('Integration: Happy Path', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('Room0 completion flow', async () => {
    // Import after mocks
    const { Room0Entry } = await import('../../../../rooms/Room0Entry.jsx');

    const onComplete = vi.fn();
    render(<Room0Entry onComplete={onComplete} />);

    // Wait for typewriter
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Find input and enter correct answer
    const input = screen.getByPlaceholderText(/enter date/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: '10052024' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // Verify completion callback
    expect(onComplete).toHaveBeenCalled();
  });

  test('Room1 completion flow', async () => {
    const { Room1Market } = await import('../../../../rooms/Room1Market.jsx');

    const onComplete = vi.fn();
    const { container } = render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Verify stalls are displayed by checking stallName divs
    const stallNameDivs = container.querySelectorAll('[class*="stallName"]');
    const vendorNames = Array.from(stallNameDivs).map((div) => div.textContent);

    expect(vendorNames).toContain("Rosie's Roots");
    expect(vendorNames).toContain("Ivy's Organics");

    // Enter correct answer
    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'RISTORA' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('validate function accepts both room solutions', async () => {
    const { validate } = await import('../../../../utils/solutions.js');

    // Room 0 date
    expect(validate(0, '10052024')).toBe(true);
    expect(validate(0, '10/05/2024')).toBe(true);

    // Room 1 word
    expect(validate(1, 'RISTORA')).toBe(true);
    expect(validate(1, 'ristora')).toBe(true);

    // Wrong answers
    expect(validate(0, 'wrong')).toBe(false);
    expect(validate(1, 'wrong')).toBe(false);
  });

  test('hint tracking works in Room0', async () => {
    const { Room0Entry } = await import('../../../../rooms/Room0Entry.jsx');

    const onHintUsed = vi.fn();
    render(<Room0Entry onHintUsed={onHintUsed} />);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Click hint 3 times
    const hintButton = screen.getByRole('button', { name: /hint/i });

    for (let i = 1; i <= 3; i++) {
      await act(async () => {
        fireEvent.click(hintButton);
      });
      expect(onHintUsed).toHaveBeenCalledTimes(i);
    }
  });

  test('hint tracking works in Room1', async () => {
    const { Room1Market } = await import('../../../../rooms/Room1Market.jsx');

    const onHintUsed = vi.fn();
    render(<Room1Market onHintUsed={onHintUsed} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const hintButton = screen.getByRole('button', { name: /hint/i });

    for (let i = 1; i <= 3; i++) {
      await act(async () => {
        fireEvent.click(hintButton);
      });
      expect(onHintUsed).toHaveBeenCalledTimes(i);
    }
  });
});
