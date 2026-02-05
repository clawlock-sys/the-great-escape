/**
 * Hazard Attack Test: H-11 - App.jsx routing missing
 * Spec: Switch statement should cover all cases with default fallback
 */
import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('H-11: App.jsx routing coverage', () => {
  let appContent;

  beforeAll(() => {
    appContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/App.jsx'),
      'utf8'
    );
  });

  test('has switch statement', () => {
    expect(appContent).toContain('switch');
  });

  test('switch uses gameState.currentRoom', () => {
    expect(appContent).toContain('gameState.currentRoom');
  });

  test('has case 0 for Room 0', () => {
    expect(appContent).toContain('case 0:');
  });

  test('has case 1 for Room 1', () => {
    expect(appContent).toContain('case 1:');
  });

  test('has default case for undefined rooms', () => {
    expect(appContent).toContain('default:');
  });

  test('default case renders placeholder content', () => {
    // After default, should render some placeholder
    const defaultIndex = appContent.indexOf('default:');
    const afterDefault = appContent.slice(defaultIndex, defaultIndex + 500);

    expect(afterDefault).toContain('Coming soon');
  });

  test('Room0Entry is rendered in case 0', () => {
    const case0Index = appContent.indexOf('case 0:');
    const case1Index = appContent.indexOf('case 1:');
    const case0Block = appContent.slice(case0Index, case1Index);

    expect(case0Block).toContain('Room0Entry');
  });

  test('Room1Market is rendered in case 1', () => {
    const case1Index = appContent.indexOf('case 1:');
    const defaultIndex = appContent.indexOf('default:');
    const case1Block = appContent.slice(case1Index, defaultIndex);

    expect(case1Block).toContain('Room1Market');
  });
});
