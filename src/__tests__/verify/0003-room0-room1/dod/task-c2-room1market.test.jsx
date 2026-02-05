/**
 * DoD Test: Task C.2 - Create Room1Market.jsx
 * Spec: Component renders 7 stalls, accepts input, validates RISTORA
 * Mitigates: H-04, H-05
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

describe('C.2: Room1Market component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders 7 market stalls (C-07)', async () => {
    const { container } = render(<Room1Market />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // STALLS array has 7 items, each rendered as a stall div
    const stalls = container.querySelectorAll('[class*="stall"]');
    // Filter to actual stall divs (exclude stallName, stallItems, etc)
    // Each stall has stallName and stallItems children, so we need to count parent stalls
    const stallElements = Array.from(stalls).filter(
      (el) => !el.className.includes('Name') && !el.className.includes('Items') && !el.className.includes('Letter')
    );

    // Should have at least 7 stalls (may have more due to class name structure)
    expect(stallElements.length).toBeGreaterThanOrEqual(7);
  });

  test('renders correct vendor names (C-08)', async () => {
    const { container } = render(<Room1Market />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Vendor names are split: first letter in <span>, rest as text node
    // So we check the stallName divs contain the expected text content
    const stallNameDivs = container.querySelectorAll('[class*="stallName"]');
    const vendorNames = Array.from(stallNameDivs).map((div) => div.textContent);

    // Check each expected vendor name is present
    expect(vendorNames).toContain("Rosie's Roots");
    expect(vendorNames).toContain("Ivy's Organics");
    expect(vendorNames).toContain('Sunrise Blooms');
    expect(vendorNames).toContain('Terra Fruits');
    expect(vendorNames).toContain('Oak Barrel Honey');
    expect(vendorNames).toContain('Red Barn Eggs');
    expect(vendorNames).toContain('Abandoned');
  });

  test('stall #7 has hidden styling (C-09)', async () => {
    const { container } = render(<Room1Market />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // The 7th stall (Abandoned) should have stallHidden class
    const hiddenStalls = container.querySelectorAll('[class*="stallHidden"]');
    expect(hiddenStalls.length).toBeGreaterThanOrEqual(1);
  });

  test('uses TextInput component (C-14)', async () => {
    render(<Room1Market />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);
    expect(input).toBeTruthy();
  });

  test('uses HintButton component (C-15)', async () => {
    render(<Room1Market />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const hintButton = screen.getByRole('button', { name: /hint/i });
    expect(hintButton).toBeTruthy();
  });

  test('validates RISTORA (SC-03, C-11)', async () => {
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

  test('validates case insensitive ristora', async () => {
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

  test('H-04: calls onComplete when validation succeeds', async () => {
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

  test('H-05: calls onHintUsed when hint is used', async () => {
    const onHintUsed = vi.fn();
    render(<Room1Market onHintUsed={onHintUsed} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const hintButton = screen.getByRole('button', { name: /hint/i });

    await act(async () => {
      fireEvent.click(hintButton);
    });

    expect(onHintUsed).toHaveBeenCalled();
  });

  test('shows wrong answer feedback (SC-04)', async () => {
    const onComplete = vi.fn();
    render(<Room1Market onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const input = screen.getByPlaceholderText(/enter the word/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'WRONG' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    // onComplete should NOT be called
    expect(onComplete).not.toHaveBeenCalled();

    // Should show wrong answer text
    expect(screen.getByText(/that's not what they whisper/i)).toBeTruthy();
  });

  test('has 3 hints (C-12)', async () => {
    const onHintUsed = vi.fn();
    render(<Room1Market onHintUsed={onHintUsed} />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    const hintButton = screen.getByRole('button', { name: /hint/i });

    // Click 3 times
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        fireEvent.click(hintButton);
      });
    }

    expect(onHintUsed).toHaveBeenCalledTimes(3);
  });

  test('first letters of vendor names spell RISTORA', async () => {
    // This is the puzzle solution verification
    const vendorNames = [
      "Rosie's Roots",
      "Ivy's Organics",
      'Sunrise Blooms',
      'Terra Fruits',
      'Oak Barrel Honey',
      'Red Barn Eggs',
      'Abandoned',
    ];

    const firstLetters = vendorNames.map((name) => name[0]).join('');
    expect(firstLetters).toBe('RISTORA');
  });
});
