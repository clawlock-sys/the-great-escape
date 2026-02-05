import { describe, it, expect } from 'vitest';

// Nash photo data matching the component
const NASH_PHOTOS = [
  { id: 1, letter: 'I', isDecoy: false, requiresAllOthers: false },
  { id: 2, letter: 'L', isDecoy: false, requiresAllOthers: false },
  { id: 3, letter: 'A', isDecoy: false, requiresAllOthers: false },
  { id: 4, letter: 'N', isDecoy: false, requiresAllOthers: false },
  { id: 5, letter: 'D', isDecoy: false, requiresAllOthers: false },
  { id: 6, letter: 'O', isDecoy: false, requiresAllOthers: false },
  { id: 7, letter: null, isDecoy: true, requiresAllOthers: false }, // Decoy
  { id: 8, letter: '?', isDecoy: false, requiresAllOthers: true }, // Mirror
];

// Helper to count real photos found (matching component logic)
const countRealPhotosFound = (foundNashes) => {
  return [...foundNashes].filter((id) => {
    const photo = NASH_PHOTOS.find((p) => p.id === id);
    return photo && !photo.isDecoy && !photo.requiresAllOthers;
  }).length;
};

// Helper to check if mirror is unlocked
const isMirrorUnlocked = (foundNashes) => {
  return countRealPhotosFound(foundNashes) >= 6;
};

describe('Room 2 Mirror Unlock Logic', () => {
  it('should not unlock mirror when no photos found', () => {
    const foundNashes = new Set();
    expect(isMirrorUnlocked(foundNashes)).toBe(false);
  });

  it('should not unlock mirror with only 3 real photos', () => {
    const foundNashes = new Set([1, 2, 3]);
    expect(isMirrorUnlocked(foundNashes)).toBe(false);
  });

  it('should not unlock mirror with 5 real photos', () => {
    const foundNashes = new Set([1, 2, 3, 4, 5]);
    expect(isMirrorUnlocked(foundNashes)).toBe(false);
  });

  it('should not unlock mirror with 5 real photos + decoy', () => {
    // Decoy (id 7) should not count toward the 6
    const foundNashes = new Set([1, 2, 3, 4, 5, 7]);
    expect(countRealPhotosFound(foundNashes)).toBe(5);
    expect(isMirrorUnlocked(foundNashes)).toBe(false);
  });

  it('should unlock mirror when 6 real photos found', () => {
    const foundNashes = new Set([1, 2, 3, 4, 5, 6]);
    expect(countRealPhotosFound(foundNashes)).toBe(6);
    expect(isMirrorUnlocked(foundNashes)).toBe(true);
  });

  it('should unlock mirror when 6 real photos + decoy found', () => {
    const foundNashes = new Set([1, 2, 3, 4, 5, 6, 7]);
    expect(countRealPhotosFound(foundNashes)).toBe(6);
    expect(isMirrorUnlocked(foundNashes)).toBe(true);
  });

  it('should stay unlocked after finding all 8', () => {
    const foundNashes = new Set([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(isMirrorUnlocked(foundNashes)).toBe(true);
  });

  it('should correctly identify real photos vs decoy/mirror', () => {
    // Real letter-carrying photos: 1-6
    expect(NASH_PHOTOS.filter(p => !p.isDecoy && !p.requiresAllOthers).length).toBe(6);

    // Decoy: id 7
    expect(NASH_PHOTOS.find(p => p.id === 7).isDecoy).toBe(true);

    // Mirror: id 8
    expect(NASH_PHOTOS.find(p => p.id === 8).requiresAllOthers).toBe(true);
  });

  it('should collect correct letters spelling ILANDO', () => {
    const letterOrder = ['I', 'L', 'A', 'N', 'D', 'O'];
    const collectedLetters = NASH_PHOTOS
      .filter(p => p.letter && p.letter !== '?')
      .map(p => p.letter);

    expect(collectedLetters).toEqual(letterOrder);
  });
});
