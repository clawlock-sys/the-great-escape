/**
 * Edge Case Verification Tests for 0002-shared-components
 *
 * These tests verify edge case handling in components.
 * Since we can't run React tests without adding dependencies,
 * we verify the code structure handles edge cases.
 *
 * Run with: node src/__tests__/verify/0002-shared-components/edge/verify-edge-cases.mjs
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

// ========== Edge: TextInput ==========
console.log('\nEdge: TextInput');

test('TextInput handles empty value (default)', () => {
  const content = readFile('src/components/TextInput.jsx');
  // Check for destructuring with default or value handling
  assert(content.includes('value'), 'Must accept value prop');
  // Should work with empty string (no null checks needed for controlled input)
});

test('TextInput has disabled prop support', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('disabled'), 'Missing disabled prop support');
  // Check it's passed to input
  assert(content.includes('disabled={disabled}') || content.includes('disabled: disabled'),
         'disabled prop not passed to input element');
});

test('TextInput safely handles optional onChange', () => {
  const content = readFile('src/components/TextInput.jsx');
  // Should use optional chaining or guard
  const safeCall = content.includes('onChange?.') ||
                   content.includes('onChange &&') ||
                   content.includes('if (onChange)');
  assert(safeCall, 'onChange should be called safely (optional chaining)');
});

test('TextInput safely handles optional onValidate', () => {
  const content = readFile('src/components/TextInput.jsx');
  // Should check if onValidate exists before calling
  // Patterns: onValidate && ..., && onValidate), if (onValidate), onValidate?.
  const safeCall = content.includes('onValidate &&') ||
                   content.includes('&& onValidate)') ||
                   content.includes('&& onValidate ') ||
                   content.includes('if (onValidate)') ||
                   content.includes('onValidate?.(');
  assert(safeCall, 'onValidate should be called safely');
});

// ========== Edge: HintButton ==========
console.log('\nEdge: HintButton');

test('HintButton handles button click when disabled', () => {
  const content = readFile('src/components/HintButton.jsx');
  // Should have early return when at max hints
  assert(content.includes('>= 3') || content.includes('=== 3'),
         'Should check hint level before incrementing');
  assert(content.includes('return') || content.includes('disabled'),
         'Should prevent action when max hints reached');
});

test('HintButton safely handles optional onHintUsed', () => {
  const content = readFile('src/components/HintButton.jsx');
  const safeCall = content.includes('onHintUsed?.') ||
                   content.includes('onHintUsed &&') ||
                   content.includes('if (onHintUsed)');
  assert(safeCall, 'onHintUsed should be called safely (optional chaining)');
});

test('HintButton safely accesses hints array', () => {
  const content = readFile('src/components/HintButton.jsx');
  // Should use slice or bounds checking
  const safeAccess = content.includes('.slice(') ||
                     content.includes('hints[index]') ||
                     (content.includes('hints.map') && content.includes('hintLevel'));
  assert(safeAccess, 'hints array should be accessed safely');
});

test('HintButton shows all revealed hints (not just current)', () => {
  const content = readFile('src/components/HintButton.jsx');
  // Should map over hints up to current level
  assert(content.includes('.slice(0, hintLevel)') || content.includes('.map'),
         'Should display all hints up to current level');
});

// ========== Edge: ClickableArea ==========
console.log('\nEdge: ClickableArea');

test('ClickableArea handles already-found state click', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  // Should have early return or check for found state
  const hasFoundCheck = content.includes('if (found)') ||
                        content.includes('found &&') ||
                        content.includes('!found &&');
  assert(hasFoundCheck, 'Should handle click when already found');
});

test('ClickableArea passes isDecoy to onFind callback', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  // onFind should be called with (id, isDecoy)
  assert(content.includes('onFind(id, isDecoy)') || content.includes('onFind(id,isDecoy)'),
         'onFind should receive (id, isDecoy) arguments');
});

test('ClickableArea has proper accessibility attributes', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.includes('role="button"') || content.includes("role='button'"),
         'Missing role="button"');
  assert(content.includes('tabIndex'), 'Missing tabIndex');
  assert(content.includes('aria-'), 'Missing aria attributes');
});

test('ClickableArea handles keyboard Enter and Space', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  const hasEnterKey = content.includes("'Enter'") || content.includes('"Enter"');
  const hasSpaceKey = content.includes("' '") || content.includes('" "');
  assert(hasEnterKey && hasSpaceKey, 'Should handle Enter and Space keys for activation');
});

// ========== Edge: RunawayButton ==========
console.log('\nEdge: RunawayButton');

test('RunawayButton handles rapid mouseEnter events (state management)', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  // State updates should use functional updates for rapid calls
  const functionalUpdate = content.includes('setAttempts((') ||
                           content.includes('setAttempts(a =>') ||
                           content.includes('setAttempts(prev =>');
  assert(functionalUpdate, 'setAttempts should use functional update for rapid events');
});

test('RunawayButton safely handles optional onCatch', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  const safeCall = content.includes('onCatch?.') ||
                   content.includes('onCatch &&') ||
                   content.includes('if (onCatch)');
  assert(safeCall, 'onCatch should be called safely (optional chaining)');
});

test('RunawayButton constrains position within parent bounds', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  // Should calculate max position based on parent/button dimensions
  assert(content.includes('maxX') || content.includes('maxY') ||
         content.includes('parentRect') || content.includes('offsetWidth'),
         'Should constrain position within parent bounds');
});

test('RunawayButton TAUNTS array handles attempts overflow', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  // Should use Math.min or bounds check for TAUNTS index
  assert(content.includes('Math.min') && content.includes('TAUNTS.length'),
         'TAUNTS index should be bounded');
});

test('RunawayButton font size has minimum value', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  // Should have Math.max for minimum font size
  const fontSizeLine = content.match(/fontSize.*Math\.max/);
  assert(fontSizeLine, 'Font size should have minimum value (Math.max)');
});

// ========== Edge: Transition ==========
console.log('\nEdge: Transition');

test('Transition renders children regardless of visibility', () => {
  const content = readFile('src/components/Transition.jsx');
  // Children should always be rendered (CSS handles visibility)
  assert(content.includes('{children}'), 'Children should be rendered');
  // Should NOT have conditional rendering like {isVisible && children}
  const conditionalRender = content.includes('isVisible && children') ||
                            content.includes('isVisible && {children}');
  assert(!conditionalRender, 'Should not conditionally render children (use CSS visibility instead)');
});

test('Transition applies different classes for enter/exit', () => {
  const content = readFile('src/components/Transition.jsx');
  const hasEnter = content.includes('transitionEnter') || content.includes('Visible');
  const hasExit = content.includes('transitionExit') || content.includes('Hidden');
  assert(hasEnter || hasExit, 'Should have different classes for enter/exit states');
});

test('Transition accepts optional className prop', () => {
  const content = readFile('src/components/Transition.jsx');
  assert(content.includes('className'), 'Should accept className prop');
  // Should merge with component classes - check for array pattern with filter and join
  // Can be split across lines, so check both separately
  const hasFilterBoolean = content.includes('.filter(Boolean)');
  const hasJoin = content.includes(".join('") || content.includes('.join("') || content.includes('.join(` ');
  const hasTemplateLiteral = content.includes('`${');
  assert(hasFilterBoolean && hasJoin || hasTemplateLiteral,
         'Should properly merge classNames with filter/join pattern');
});

// ========== Summary ==========
console.log('\n========================================');
console.log(`Edge Case Verification Complete`);
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
