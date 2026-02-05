/**
 * DoD Test: Task D.1 - Update App.jsx with room routing
 * Spec: Rooms render based on currentRoom, transitions work
 * Mitigates: H-11
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock useAudio
vi.mock('../../../../hooks/useAudio', () => ({
  useAudio: () => ({
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
  }),
}));

describe('D.1: App.jsx room routing', () => {
  let appContent;

  beforeEach(() => {
    appContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/App.jsx'),
      'utf8'
    );
  });

  test('imports Room0Entry', () => {
    expect(appContent).toContain('Room0Entry');
    expect(appContent).toContain("from './rooms/Room0Entry'");
  });

  test('imports Room1Market', () => {
    expect(appContent).toContain('Room1Market');
    expect(appContent).toContain("from './rooms/Room1Market'");
  });

  test('has switch statement for routing', () => {
    expect(appContent).toContain('switch');
    expect(appContent).toContain('gameState.currentRoom');
  });

  test('has case 0 for Room0', () => {
    expect(appContent).toContain('case 0:');
    expect(appContent).toContain('<Room0Entry');
  });

  test('has case 1 for Room1', () => {
    expect(appContent).toContain('case 1:');
    expect(appContent).toContain('<Room1Market');
  });

  test('has default case for future rooms (H-11)', () => {
    expect(appContent).toContain('default:');
  });

  test('has handleRoomComplete function', () => {
    expect(appContent).toContain('handleRoomComplete');
    expect(appContent).toContain('completeRoom');
    expect(appContent).toContain('nextRoom');
  });

  test('passes onComplete callback to rooms', () => {
    expect(appContent).toContain('onComplete=');
    expect(appContent).toContain('handleRoomComplete');
  });

  test('has handleHintUsed function', () => {
    expect(appContent).toContain('handleHintUsed');
    expect(appContent).toContain('useHint');
  });

  test('passes onHintUsed callback to rooms', () => {
    expect(appContent).toContain('onHintUsed=');
  });
});
