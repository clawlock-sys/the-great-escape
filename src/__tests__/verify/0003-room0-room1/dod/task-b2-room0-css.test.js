/**
 * DoD Test: Task B.2 - Create Room0.module.css
 * Spec: CSS includes flicker, redFlash, biggieFrame, prefers-reduced-motion
 * Mitigates: H-07 (accessibility)
 */
import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('B.2: Room0.module.css', () => {
  let cssContent;

  beforeAll(() => {
    cssContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/styles/Room0.module.css'),
      'utf8'
    );
  });

  test('CSS includes flicker animation', () => {
    expect(cssContent).toContain('.flicker');
    expect(cssContent).toContain('@keyframes flicker');
  });

  test('CSS includes redFlash animation', () => {
    expect(cssContent).toContain('.redFlash');
    expect(cssContent).toContain('@keyframes redFlash');
  });

  test('CSS includes biggieFrame class', () => {
    expect(cssContent).toContain('.biggieFrame');
    // Should have position fixed for overlay
    expect(cssContent).toContain('position: fixed');
  });

  test('H-07: CSS includes prefers-reduced-motion media query', () => {
    expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
    // Should disable animations for accessibility
    expect(cssContent).toContain('animation: none');
  });

  test('uses creepy CSS variables (C-06)', () => {
    expect(cssContent).toContain('var(--creepy-bg)');
    expect(cssContent).toContain('var(--creepy-text)');
  });

  test('includes typewriterText class', () => {
    expect(cssContent).toContain('.typewriterText');
  });

  test('includes room0 base class', () => {
    expect(cssContent).toContain('.room0');
  });
});
