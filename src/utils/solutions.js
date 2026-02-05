// src/utils/solutions.js
const hash = (str) => {
  // Simple hash for obfuscation (not security)
  return btoa(str.toLowerCase().replace(/\s/g, ''));
};

export const SOLUTIONS = {
  0: hash('10052024'),     // Date: Oct 5, 2024
  1: hash('ristora'),      // Market vendor initials
  2: hash('ilando'),       // Nash letters
  3: hash('octoberfifth'), // Anagram answer
  4: 'i-love-you-im-sorry', // Selection, not typed
  5: hash('02142025'),     // Date: Feb 14, 2025
};

export const validate = (room, answer) => {
  const normalized = answer.toLowerCase().replace(/[\s\-\/\.]/g, '');
  return (
    hash(normalized) === SOLUTIONS[room] || SOLUTIONS[room] === normalized
  );
};
