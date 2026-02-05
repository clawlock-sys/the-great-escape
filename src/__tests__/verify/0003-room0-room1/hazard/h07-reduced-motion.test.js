/**
 * Hazard Attack Test: H-07 - Flicker accessibility
 * Spec: prefers-reduced-motion media query should disable animations
 */
import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('H-07: Accessibility - prefers-reduced-motion', () => {
  test('Room0.module.css has prefers-reduced-motion media query', () => {
    const cssContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/styles/Room0.module.css'),
      'utf8'
    );

    expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
  });

  test('flicker animation is disabled for reduced motion', () => {
    const cssContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/styles/Room0.module.css'),
      'utf8'
    );

    // The media query should contain animation: none for flicker
    const mediaQueryMatch = cssContent.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\}/
    );

    expect(mediaQueryMatch).toBeTruthy();
    expect(mediaQueryMatch[0]).toContain('.flicker');
    expect(mediaQueryMatch[0]).toContain('animation: none');
  });

  test('redFlash animation is disabled for reduced motion', () => {
    const cssContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/styles/Room0.module.css'),
      'utf8'
    );

    const mediaQueryMatch = cssContent.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\}/
    );

    expect(mediaQueryMatch).toBeTruthy();
    expect(mediaQueryMatch[0]).toContain('.redFlash');
  });
});
