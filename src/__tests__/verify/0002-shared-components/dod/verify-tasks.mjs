/**
 * DoD Verification Tests for 0002-shared-components
 *
 * These tests verify the Definition of Done for each task in the spec.
 * Run with: node src/__tests__/verify/0002-shared-components/dod/verify-tasks.mjs
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

// ========== T1.1: Create components.module.css ==========
console.log('\nT1.1: Create components.module.css');

test('CSS Module file exists', () => {
  const content = readFile('src/styles/components.module.css');
  assert(content.length > 0, 'File is empty');
});

test('CSS has styles for all 5 components', () => {
  const css = readFile('src/styles/components.module.css');
  assert(css.includes('.textInput'), 'Missing .textInput styles');
  assert(css.includes('.hintButton'), 'Missing .hintButton styles');
  assert(css.includes('.area'), 'Missing .area (ClickableArea) styles');
  assert(css.includes('.runaway'), 'Missing .runaway (RunawayButton) styles');
  assert(css.includes('.transition'), 'Missing .transition styles');
});

test('CSS uses color variables (no hardcoded hex/rgb)', () => {
  const css = readFile('src/styles/components.module.css');
  // Find all color properties
  const colorProps = css.match(/(?:color|background-color|border-color|box-shadow):\s*[^;]+/g) || [];
  for (const prop of colorProps) {
    // Allow 'transparent', 'inherit', 'none', or var(--*)
    const value = prop.split(':')[1].trim();
    const isValid = value.includes('var(--') ||
                    value === 'transparent' ||
                    value === 'inherit' ||
                    value === 'none' ||
                    value === 'white';
    assert(isValid, `Hardcoded color found: ${prop}`);
  }
});

test('CSS uses transition variables (--transition-slow/fast)', () => {
  const css = readFile('src/styles/components.module.css');
  assert(css.includes('var(--transition-slow)'), 'Missing --transition-slow usage');
  assert(css.includes('var(--transition-fast)'), 'Missing --transition-fast usage');
});

test('CSS uses font variables (--font-*)', () => {
  const css = readFile('src/styles/components.module.css');
  assert(css.includes('var(--font-'), 'Missing font variable usage');
});

// ========== T2.1: Create TextInput.jsx ==========
console.log('\nT2.1: Create TextInput.jsx');

test('TextInput file exists', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.length > 0, 'File is empty');
});

test('TextInput accepts value prop', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('value'), 'Missing value prop');
  assert(content.includes('value={value}') || content.includes('value: value'), 'value prop not used in input');
});

test('TextInput accepts onChange prop', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('onChange'), 'Missing onChange prop');
});

test('TextInput accepts onValidate prop', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('onValidate'), 'Missing onValidate prop');
});

test('TextInput accepts placeholder prop', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('placeholder'), 'Missing placeholder prop');
});

test('TextInput validates on Enter key (not onChange)', () => {
  const content = readFile('src/components/TextInput.jsx');
  // Should have keydown handler with Enter check
  assert(content.includes("key === 'Enter'") || content.includes('key==="Enter"'), 'Missing Enter key check');
  // onValidate should be called in keydown, not in onChange handler
  assert(content.includes('handleKeyDown') || content.includes('onKeyDown'), 'Missing key handler');
});

test('TextInput shows error/success state via className', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('textInputError') || content.includes('error'), 'Missing error state class');
  assert(content.includes('textInputSuccess') || content.includes('success'), 'Missing success state class');
});

test('TextInput uses CSS Module', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes("from '../styles/components.module.css'") ||
         content.includes('from "../styles/components.module.css"'),
         'Missing CSS Module import');
  assert(content.includes('styles.'), 'Not using styles object');
});

// ========== T2.2: Create ClickableArea.jsx ==========
console.log('\nT2.2: Create ClickableArea.jsx');

test('ClickableArea file exists', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.length > 0, 'File is empty');
});

test('ClickableArea accepts position props (id, x, y, width, height)', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.includes('id'), 'Missing id prop');
  assert(content.includes('x,') || content.includes('x }'), 'Missing x prop');
  assert(content.includes('y,') || content.includes('y }'), 'Missing y prop');
  assert(content.includes('width'), 'Missing width prop');
  assert(content.includes('height'), 'Missing height prop');
});

test('ClickableArea accepts found, onFind, isDecoy props', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.includes('found'), 'Missing found prop');
  assert(content.includes('onFind'), 'Missing onFind prop');
  assert(content.includes('isDecoy'), 'Missing isDecoy prop');
});

test('ClickableArea uses percentage-based positioning', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  // Should use % in left/top/width/height
  assert(content.includes('`${x}%`') || content.includes("x + '%'"), 'x position not percentage-based');
  assert(content.includes('`${y}%`') || content.includes("y + '%'"), 'y position not percentage-based');
});

test('ClickableArea has position: absolute', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.includes("position: 'absolute'") || content.includes('position: "absolute"'),
         'Missing position: absolute (or check CSS module)');
});

test('ClickableArea shows found state visually', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.includes('areaFound') || content.includes('found'), 'Missing found state visual');
});

test('ClickableArea has JSDoc about position:relative parent', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.toLowerCase().includes('position') && content.toLowerCase().includes('relative'),
         'Missing JSDoc about position:relative parent requirement');
});

// ========== T3.1: Create HintButton.jsx ==========
console.log('\nT3.1: Create HintButton.jsx');

test('HintButton file exists', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.length > 0, 'File is empty');
});

test('HintButton accepts hints[] array prop', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('hints'), 'Missing hints prop');
});

test('HintButton accepts onHintUsed callback prop', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('onHintUsed'), 'Missing onHintUsed prop');
});

test('HintButton accepts roomId prop (H-03 mitigation)', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('roomId'), 'Missing roomId prop');
});

test('HintButton has internal state tracking hint level (0-3)', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('useState'), 'Missing useState for state management');
  assert(content.includes('hintLevel') || content.includes('level'), 'Missing hint level state');
});

test('HintButton calls onHintUsed(roomId, level)', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('onHintUsed') && content.includes('roomId'),
         'onHintUsed should be called with roomId');
});

test('HintButton disables after all hints revealed', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('disabled') && (content.includes('>= 3') || content.includes('=== 3')),
         'Missing disable logic after 3 hints');
});

// ========== T3.2: Create RunawayButton.jsx ==========
console.log('\nT3.2: Create RunawayButton.jsx');

test('RunawayButton file exists', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.length > 0, 'File is empty');
});

test('RunawayButton implements TAUNTS array', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('TAUNTS'), 'Missing TAUNTS array');
  assert(content.includes("'no'") || content.includes('"no"'), 'TAUNTS should include "no"');
});

test('RunawayButton has internal attempts and position state', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('attempts'), 'Missing attempts state');
  assert(content.includes('position'), 'Missing position state');
});

test('RunawayButton uses useRef for button measurement', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('useRef'), 'Missing useRef import/usage');
  assert(content.includes('getBoundingClientRect'), 'Missing getBoundingClientRect for measurement');
});

test('RunawayButton calculates escape position on mouseEnter', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('mouseEnter') || content.includes('onMouseEnter'),
         'Missing mouseEnter handler');
  assert(content.includes('setPosition'), 'Missing position update on mouse enter');
});

test('RunawayButton has null check (H-01 mitigation)', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('!btn') || content.includes('!parent') || content.includes('btn &&'),
         'Missing null check for H-01 mitigation');
});

test('RunawayButton caps speed at 0.1s minimum (H-10 mitigation)', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('Math.max') && content.includes('0.1'),
         'Missing speed cap at 0.1s for H-10 mitigation');
});

test('RunawayButton accepts onCatch callback', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('onCatch'), 'Missing onCatch prop');
});

// ========== T4.1: Create Transition.jsx ==========
console.log('\nT4.1: Create Transition.jsx');

test('Transition file exists', () => {
  const content = readFile('src/components/Transition.jsx');
  assert(content.length > 0, 'File is empty');
});

test('Transition accepts children prop', () => {
  const content = readFile('src/components/Transition.jsx');
  assert(content.includes('children'), 'Missing children prop');
});

test('Transition accepts isVisible prop', () => {
  const content = readFile('src/components/Transition.jsx');
  assert(content.includes('isVisible'), 'Missing isVisible prop');
});

test('Transition uses CSS for animation (opacity + transform only per H-08)', () => {
  const css = readFile('src/styles/components.module.css');
  // Check that .transition class uses only opacity and transform
  const transitionSection = css.match(/\.transition\s*\{[^}]+\}/)?.[0] || '';
  assert(transitionSection.includes('opacity'), 'Missing opacity in transition CSS');
  assert(transitionSection.includes('transform'), 'Missing transform in transition CSS');
  // Verify no layout-shifting properties
  assert(!transitionSection.includes('width:'), 'Transition should not animate width (H-08)');
  assert(!transitionSection.includes('height:'), 'Transition should not animate height (H-08)');
  assert(!transitionSection.includes('margin:'), 'Transition should not animate margin (H-08)');
});

// ========== T5.1: Create ComponentDemo.jsx ==========
console.log('\nT5.1: Create ComponentDemo.jsx');

test('ComponentDemo file exists', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.length > 0, 'File is empty');
});

test('ComponentDemo imports all 5 components', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes("from './TextInput'") || content.includes('from "./TextInput"'),
         'Missing TextInput import');
  assert(content.includes("from './HintButton'") || content.includes('from "./HintButton"'),
         'Missing HintButton import');
  assert(content.includes("from './ClickableArea'") || content.includes('from "./ClickableArea"'),
         'Missing ClickableArea import');
  assert(content.includes("from './RunawayButton'") || content.includes('from "./RunawayButton"'),
         'Missing RunawayButton import');
  assert(content.includes("from './Transition'") || content.includes('from "./Transition"'),
         'Missing Transition import');
});

test('ComponentDemo renders TextInput with props', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('<TextInput'), 'Missing TextInput render');
});

test('ComponentDemo renders HintButton with props', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('<HintButton'), 'Missing HintButton render');
});

test('ComponentDemo renders ClickableArea with props', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('<ClickableArea'), 'Missing ClickableArea render');
});

test('ComponentDemo renders RunawayButton with props', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('<RunawayButton'), 'Missing RunawayButton render');
});

test('ComponentDemo renders Transition with props', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('<Transition'), 'Missing Transition render');
});

test('ComponentDemo demonstrates theme switching', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('theme') && content.includes('setTheme'),
         'Missing theme switching capability');
});

// ========== T5.2: Add Demo Route to App.jsx ==========
console.log('\nT5.2: Add Demo Route to App.jsx');

test('App.jsx has demo route check', () => {
  const content = readFile('src/App.jsx');
  assert(content.includes('demo=components') || content.includes("demo === 'components'"),
         'Missing ?demo=components check');
});

test('App.jsx imports ComponentDemo', () => {
  const content = readFile('src/App.jsx');
  assert(content.includes('ComponentDemo'), 'Missing ComponentDemo import');
});

test('App.jsx renders ComponentDemo for demo mode', () => {
  const content = readFile('src/App.jsx');
  assert(content.includes('<ComponentDemo'), 'Missing ComponentDemo render');
});

// ========== Summary ==========
console.log('\n========================================');
console.log(`DoD Verification Complete`);
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
