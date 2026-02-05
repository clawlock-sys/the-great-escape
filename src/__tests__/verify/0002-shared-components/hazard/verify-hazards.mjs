/**
 * Hazard Verification Tests for 0002-shared-components
 *
 * These tests verify that hazard mitigations are in place.
 * Run with: node src/__tests__/verify/0002-shared-components/hazard/verify-hazards.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../../../..');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`  FAIL: ${name}`);
    console.log(`        ${e.message}`);
    failed++;
    failures.push({ name, error: e.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readFile(path) {
  const fullPath = join(ROOT, path);
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${path}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

// ========== H-01: RunawayButton parent null ==========
console.log('\nH-01: RunawayButton handles null parent');

test('RunawayButton has null check before getBoundingClientRect', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  // Check for null guard pattern
  const hasNullCheck = content.includes('!btn') ||
                       content.includes('!parent') ||
                       content.includes('btn && parent') ||
                       content.includes('if (!btn || !parent)');
  assert(hasNullCheck, 'Missing null check for btn/parent before measurement');
});

test('RunawayButton null check is before getBoundingClientRect call', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  // Find handleMouseEnter function
  const mouseEnterMatch = content.match(/handleMouseEnter[^}]+getBoundingClientRect/s);
  if (mouseEnterMatch) {
    const beforeRect = mouseEnterMatch[0];
    const hasGuard = beforeRect.includes('return') && (beforeRect.includes('!btn') || beforeRect.includes('!parent'));
    assert(hasGuard, 'Null check should return early before getBoundingClientRect');
  }
});

// ========== H-02: ClickableArea wrong positioning ==========
console.log('\nH-02: ClickableArea positioning documented');

test('ClickableArea has JSDoc about position:relative parent requirement', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  const hasDoc = content.toLowerCase().includes('position') &&
                 content.toLowerCase().includes('relative') &&
                 (content.includes('MUST') || content.includes('must') || content.includes('IMPORTANT'));
  assert(hasDoc, 'Missing documentation about position:relative parent requirement');
});

test('ClickableArea uses position: absolute', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  const css = readFile('src/styles/components.module.css');
  // Check either inline or CSS
  const hasAbsolute = content.includes("position: 'absolute'") ||
                      content.includes('position: "absolute"') ||
                      css.includes('.area') && css.match(/\.area\s*\{[^}]*position:\s*absolute/);
  assert(hasAbsolute, 'ClickableArea must use position: absolute');
});

// ========== H-03: HintButton not tracking game state ==========
console.log('\nH-03: HintButton tracks game state via roomId');

test('HintButton accepts roomId prop', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('roomId'), 'Missing roomId prop');
});

test('HintButton passes roomId to onHintUsed callback', () => {
  const content = readFile('src/components/HintButton.jsx');
  // Should call onHintUsed with roomId as first argument
  const callPattern = content.includes('onHintUsed(roomId') ||
                      content.includes('onHintUsed?.(roomId');
  assert(callPattern, 'onHintUsed should be called with roomId');
});

// ========== H-04: TextInput validation timing ==========
console.log('\nH-04: TextInput validates on Enter only (not onChange)');

test('TextInput does NOT call onValidate in onChange handler', () => {
  const content = readFile('src/components/TextInput.jsx');
  // Find handleChange function and verify it doesn't call onValidate
  const handleChangeMatch = content.match(/handleChange[^}]*\}/s)?.[0] || '';
  const callsValidate = handleChangeMatch.includes('onValidate');
  assert(!callsValidate, 'handleChange should NOT call onValidate');
});

test('TextInput calls onValidate only on Enter key', () => {
  const content = readFile('src/components/TextInput.jsx');
  // Find key handler that checks for Enter
  const hasEnterCheck = content.includes("key === 'Enter'") || content.includes('key==="Enter"');
  assert(hasEnterCheck, 'Missing Enter key check');
  // And onValidate is called in key handler
  const keyHandlerMatch = content.match(/handleKeyDown[^}]+onValidate/s) ||
                         content.match(/onKeyDown[^}]+onValidate/s);
  assert(keyHandlerMatch, 'onValidate should be called in key handler');
});

// ========== H-05: Hardcoded colors ==========
console.log('\nH-05: No hardcoded colors in CSS');

test('CSS Module uses CSS variables for all colors', () => {
  const css = readFile('src/styles/components.module.css');
  // Filter out colors that are in comments (scan line by line)
  const lines = css.split('\n');
  const activeHex = [];
  const activeRgb = [];

  for (const line of lines) {
    if (line.trim().startsWith('/*') || line.trim().startsWith('*')) continue;
    const hexMatch = line.match(/#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g);
    if (hexMatch) activeHex.push(...hexMatch);
    const rgbMatch = line.match(/rgb\([^)]+\)/gi);
    if (rgbMatch) activeRgb.push(...rgbMatch);
  }

  assert(activeHex.length === 0, `Found hardcoded hex colors: ${activeHex.join(', ')}`);
  assert(activeRgb.length === 0, `Found hardcoded rgb colors: ${activeRgb.join(', ')}`);
});

// ========== H-06: No keyboard support ==========
console.log('\nH-06: Keyboard support for interactive elements');

test('TextInput has onKeyDown handler', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('onKeyDown'), 'Missing onKeyDown handler');
});

test('ClickableArea has keyboard support', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  // Should have role="button" and tabIndex
  assert(content.includes('role="button"') || content.includes("role='button'"),
         'Missing role="button" for accessibility');
  assert(content.includes('tabIndex'), 'Missing tabIndex for keyboard focus');
  // Should have key handler for Enter/Space
  assert(content.includes('onKeyDown'), 'Missing onKeyDown for keyboard activation');
});

// ========== H-08: Transition layout shift ==========
console.log('\nH-08: Transition uses only opacity/transform (no layout shift)');

test('Transition CSS only animates opacity and transform', () => {
  const css = readFile('src/styles/components.module.css');
  // Find .transition class
  const transitionMatch = css.match(/\.transition\s*\{[^}]+\}/)?.[0] || '';

  // Should have opacity and transform
  assert(transitionMatch.includes('opacity'), 'Missing opacity in transition');
  assert(transitionMatch.includes('transform'), 'Missing transform in transition');

  // Should NOT have layout-shifting properties in transition
  const layoutProps = ['width', 'height', 'margin', 'padding', 'top', 'left', 'right', 'bottom'];
  for (const prop of layoutProps) {
    // Check the property isn't being animated (it's ok if it's static)
    const animatedProp = transitionMatch.match(new RegExp(`transition:.*${prop}`, 'i'));
    assert(!animatedProp, `Transition should not animate ${prop} (causes layout shift)`);
  }
});

// ========== H-09: HintButton hints type ==========
console.log('\nH-09: HintButton hints array documented');

test('HintButton has JSDoc documenting hints as string array', () => {
  const content = readFile('src/components/HintButton.jsx');
  const hasDoc = content.includes('@param') && content.includes('hints') &&
                 (content.includes('string[]') || content.includes('Array'));
  assert(hasDoc, 'Missing JSDoc for hints prop type');
});

test('HintButton handles hints safely with slice', () => {
  const content = readFile('src/components/HintButton.jsx');
  // Should use slice or similar to safely access hints
  assert(content.includes('.slice(') || content.includes('[hintLevel') || content.includes('hints['),
         'Should safely access hints array');
});

// ========== H-10: RunawayButton too fast ==========
console.log('\nH-10: RunawayButton speed is capped');

test('RunawayButton caps speed with Math.max', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('Math.max'), 'Missing Math.max for speed cap');
});

test('RunawayButton minimum speed is 0.1s', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  // Should have Math.max(0.1, ...) pattern
  const speedLine = content.match(/speed\s*=\s*Math\.max\s*\(\s*0\.1/);
  assert(speedLine, 'Speed should be capped at minimum 0.1s');
});

// ========== Summary ==========
console.log('\n========================================');
console.log(`Hazard Verification Complete`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log('========================================');

if (failed > 0) {
  console.log('\nFailures:');
  failures.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.name}`);
    console.log(`     ${f.error}`);
  });
  process.exit(1);
}

process.exit(0);
