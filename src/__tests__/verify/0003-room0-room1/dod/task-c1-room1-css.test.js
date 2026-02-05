/**
 * DoD Test: Task C.1 - Create Room1.module.css
 * Spec: CSS includes stalls grid, stallHidden class, saturate filter
 * Mitigates: H-12
 */
import { describe, test, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('C.1: Room1.module.css', () => {
  let cssContent;

  beforeAll(() => {
    cssContent = fs.readFileSync(
      path.resolve(process.cwd(), 'src/styles/Room1.module.css'),
      'utf8'
    );
  });

  test('CSS includes stalls grid layout', () => {
    expect(cssContent).toContain('.marketScene');
    expect(cssContent).toContain('display: grid');
    expect(cssContent).toContain('grid-template-columns');
  });

  test('CSS includes stall class', () => {
    expect(cssContent).toContain('.stall');
  });

  test('CSS includes stallHidden class (C-09)', () => {
    expect(cssContent).toContain('.stallHidden');
    // Should have reduced opacity
    expect(cssContent).toMatch(/\.stallHidden[\s\S]*opacity/);
  });

  test('H-12: CSS includes saturate filter for oversaturated effect (C-13)', () => {
    expect(cssContent).toContain('saturate');
    expect(cssContent).toMatch(/filter:.*saturate\(1\.3\)/);
  });

  test('includes room1 base class', () => {
    expect(cssContent).toContain('.room1');
  });

  test('includes stallName class', () => {
    expect(cssContent).toContain('.stallName');
  });

  test('includes stallFirstLetter class for cipher hint', () => {
    expect(cssContent).toContain('.stallFirstLetter');
  });

  test('includes inputContainer class', () => {
    expect(cssContent).toContain('.inputContainer');
  });

  test('includes wrongAnswer class', () => {
    expect(cssContent).toContain('.wrongAnswer');
  });
});
