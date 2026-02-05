/**
 * Hazard Attack Test: H-01 - Room 0 missing hintsUsed
 * Spec: Room 0 should have hintsUsed in initial state
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('H-01: Room 0 state structure', () => {
  test('Room 0 initial state has hintsUsed property', () => {
    const hookContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/hooks/useRoom.js'),
      'utf8'
    );

    // Check that Room 0 has hintsUsed
    expect(hookContent).toContain('0: { completed: false, attempts: 0, hintsUsed: 0 }');
  });

  test('Room 0 state structure matches other rooms', () => {
    const hookContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/hooks/useRoom.js'),
      'utf8'
    );

    // Room 0 and Room 1 should have same base structure
    const room0Match = hookContent.match(/0:\s*\{[^}]+\}/);
    const room1Match = hookContent.match(/1:\s*\{[^}]+\}/);

    expect(room0Match).toBeTruthy();
    expect(room1Match).toBeTruthy();

    // Both should have completed, attempts, hintsUsed
    expect(room0Match[0]).toContain('completed');
    expect(room0Match[0]).toContain('attempts');
    expect(room0Match[0]).toContain('hintsUsed');

    expect(room1Match[0]).toContain('completed');
    expect(room1Match[0]).toContain('attempts');
    expect(room1Match[0]).toContain('hintsUsed');
  });

  test('useHint function handles Room 0 correctly', () => {
    const hookContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/hooks/useRoom.js'),
      'utf8'
    );

    // useHint should work with hintsUsed property
    expect(hookContent).toContain('hintsUsed:');
    expect(hookContent).toContain('useHint');
  });
});
