/**
 * Hazard Attack Test: H-03 - Date format rejection
 * Spec: validate() should accept all common date formats for Room 0
 */
import { describe, test, expect } from 'vitest';
import { validate } from '../../../../utils/solutions.js';

describe('H-03: Date format acceptance', () => {
  test('accepts 10052024 (no separator)', () => {
    expect(validate(0, '10052024')).toBe(true);
  });

  test('accepts 10/05/2024 (slash separator)', () => {
    expect(validate(0, '10/05/2024')).toBe(true);
  });

  test('accepts 10.05.2024 (dot separator)', () => {
    expect(validate(0, '10.05.2024')).toBe(true);
  });

  test('accepts 10-05-2024 (dash separator)', () => {
    expect(validate(0, '10-05-2024')).toBe(true);
  });

  test('accepts 10 05 2024 (space separator)', () => {
    expect(validate(0, '10 05 2024')).toBe(true);
  });

  test('rejects WRONG answer', () => {
    expect(validate(0, 'WRONG')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(validate(0, '')).toBe(false);
  });

  test('rejects wrong date', () => {
    expect(validate(0, '12252024')).toBe(false);
  });

  test('handles case insensitivity for mixed content', () => {
    // The date doesn't have letters, but test the normalization
    expect(validate(0, '10/05/2024')).toBe(true);
  });

  test('accepts multiple spaces', () => {
    expect(validate(0, '10  05  2024')).toBe(true);
  });

  test('accepts mixed separators', () => {
    expect(validate(0, '10-05/2024')).toBe(true);
  });
});
