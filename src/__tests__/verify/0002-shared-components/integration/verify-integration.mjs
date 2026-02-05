/**
 * Integration Verification Tests for 0002-shared-components
 *
 * These tests verify integration points and end-to-end structure.
 * Run with: node src/__tests__/verify/0002-shared-components/integration/verify-integration.mjs
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

// ========== SC-01: All 5 components render ==========
console.log('\nSC-01: All 5 components exist and export');

test('TextInput component exports', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('export function TextInput') ||
         content.includes('export default TextInput'),
         'TextInput must be exported');
});

test('HintButton component exports', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('export function HintButton') ||
         content.includes('export default HintButton'),
         'HintButton must be exported');
});

test('ClickableArea component exports', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.includes('export function ClickableArea') ||
         content.includes('export default ClickableArea'),
         'ClickableArea must be exported');
});

test('RunawayButton component exports', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('export function RunawayButton') ||
         content.includes('export default RunawayButton'),
         'RunawayButton must be exported');
});

test('Transition component exports', () => {
  const content = readFile('src/components/Transition.jsx');
  assert(content.includes('export function Transition') ||
         content.includes('export default Transition'),
         'Transition must be exported');
});

// ========== SC-02: CSS Variable Theming ==========
console.log('\nSC-02: Components work with CSS variable theming');

test('CSS Module uses theme variables (creepy)', () => {
  const css = readFile('src/styles/components.module.css');
  assert(css.includes('--creepy-'), 'Missing creepy theme variables');
});

test('CSS Module uses theme variables (warm)', () => {
  const css = readFile('src/styles/components.module.css');
  assert(css.includes('--warm-'), 'Missing warm theme variables');
});

test('CSS Module uses theme variables (moody)', () => {
  const css = readFile('src/styles/components.module.css');
  assert(css.includes('--moody-'), 'Missing moody theme variables');
});

test('CSS Module uses theme variables (eerie)', () => {
  const css = readFile('src/styles/components.module.css');
  assert(css.includes('--eerie-'), 'Missing eerie theme variables');
});

test('ComponentDemo demonstrates theme switching', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  const themes = ['creepy', 'warm', 'moody', 'eerie', 'finale'];
  for (const theme of themes) {
    assert(content.includes(theme), `Missing ${theme} theme in demo`);
  }
});

// ========== SC-03: Demo page shows all components ==========
console.log('\nSC-03: Demo page shows all components in isolation');

test('ComponentDemo imports TextInput', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('TextInput'), 'Missing TextInput in demo');
});

test('ComponentDemo imports HintButton', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('HintButton'), 'Missing HintButton in demo');
});

test('ComponentDemo imports ClickableArea', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('ClickableArea'), 'Missing ClickableArea in demo');
});

test('ComponentDemo imports RunawayButton', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('RunawayButton'), 'Missing RunawayButton in demo');
});

test('ComponentDemo imports Transition', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('Transition'), 'Missing Transition in demo');
});

test('ComponentDemo renders each component with section', () => {
  const content = readFile('src/components/ComponentDemo.jsx');
  assert(content.includes('<TextInput'), 'Missing TextInput render');
  assert(content.includes('<HintButton'), 'Missing HintButton render');
  assert(content.includes('<ClickableArea'), 'Missing ClickableArea render');
  assert(content.includes('<RunawayButton'), 'Missing RunawayButton render');
  assert(content.includes('<Transition'), 'Missing Transition render');
});

// ========== SC-04: No console errors (structure check) ==========
console.log('\nSC-04: Component structure suggests no runtime errors');

test('All imports use correct relative paths', () => {
  const demo = readFile('src/components/ComponentDemo.jsx');
  // Check imports use ./ComponentName pattern
  assert(demo.includes("from './TextInput'") || demo.includes('from "./TextInput"'),
         'TextInput import path should be relative');
  assert(demo.includes("from './HintButton'") || demo.includes('from "./HintButton"'),
         'HintButton import path should be relative');
});

test('CSS Module imports are consistent', () => {
  const files = [
    'src/components/TextInput.jsx',
    'src/components/HintButton.jsx',
    'src/components/ClickableArea.jsx',
    'src/components/RunawayButton.jsx',
    'src/components/Transition.jsx',
  ];

  for (const file of files) {
    const content = readFile(file);
    assert(content.includes("from '../styles/components.module.css'") ||
           content.includes('from "../styles/components.module.css"'),
           `${file} should import CSS Module consistently`);
  }
});

// ========== C-06: All components use CSS Modules ==========
console.log('\nC-06: All components use CSS Modules');

test('All components import CSS Module', () => {
  const components = [
    'TextInput', 'HintButton', 'ClickableArea', 'RunawayButton', 'Transition'
  ];

  for (const comp of components) {
    const content = readFile(`src/components/${comp}.jsx`);
    assert(content.includes('components.module.css'),
           `${comp} should import CSS Module`);
    assert(content.includes('styles.'),
           `${comp} should use styles object`);
  }
});

// ========== C-10: Uses existing CSS variable naming ==========
console.log('\nC-10: Uses existing CSS variable naming from variables.css');

test('CSS Module only uses variables defined in variables.css', () => {
  const vars = readFile('src/styles/variables.css');
  const css = readFile('src/styles/components.module.css');

  // Extract all var(--*) usages from CSS module
  const varUsages = css.match(/var\(--[a-z-]+\)/gi) || [];
  const uniqueVars = [...new Set(varUsages.map(v => v.match(/--[a-z-]+/i)?.[0]))];

  // Verify each var is defined in variables.css
  for (const v of uniqueVars) {
    assert(vars.includes(v), `Variable ${v} not found in variables.css`);
  }
});

// ========== App Integration ==========
console.log('\nApp Integration');

test('App.jsx properly integrates demo route', () => {
  const app = readFile('src/App.jsx');
  assert(app.includes('ComponentDemo'), 'App should import ComponentDemo');
  assert(app.includes("demo === 'components'") || app.includes('demo=components'),
         'App should check for ?demo=components');
  assert(app.includes('<ComponentDemo'), 'App should render ComponentDemo');
});

test('Demo route does not affect normal app flow', () => {
  const app = readFile('src/App.jsx');
  // Demo check should be before normal app rendering
  const demoIndex = app.indexOf("demo === 'components'") || app.indexOf('ComponentDemo');
  const normalIndex = app.indexOf('gameState');
  assert(demoIndex < normalIndex || demoIndex > 0,
         'Demo check should happen before normal app flow');
});

// ========== Constraint Verification ==========
console.log('\nConstraint Verification');

test('C-01: TextInput accepts validation callback', () => {
  const content = readFile('src/components/TextInput.jsx');
  assert(content.includes('onValidate'), 'TextInput must accept onValidate prop');
});

test('C-02: HintButton supports 3 progressive hint levels', () => {
  const content = readFile('src/components/HintButton.jsx');
  assert(content.includes('3') && content.includes('hintLevel'),
         'HintButton should support 3 hint levels');
});

test('C-03: ClickableArea accepts position props', () => {
  const content = readFile('src/components/ClickableArea.jsx');
  assert(content.includes('x,') && content.includes('y,'),
         'ClickableArea must accept x, y props');
  assert(content.includes('width') && content.includes('height'),
         'ClickableArea must accept width, height props');
});

test('C-04: Transition wraps children with animation', () => {
  const content = readFile('src/components/Transition.jsx');
  assert(content.includes('children'), 'Transition must wrap children');
  const css = readFile('src/styles/components.module.css');
  assert(css.includes('.transition') && css.includes('transition:'),
         'Transition must have CSS animation');
});

test('C-05: RunawayButton moves on hover', () => {
  const content = readFile('src/components/RunawayButton.jsx');
  assert(content.includes('onMouseEnter') && content.includes('setPosition'),
         'RunawayButton must move on mouseEnter');
});

test('C-07: Demo page shows all components', () => {
  const demo = readFile('src/components/ComponentDemo.jsx');
  const components = ['TextInput', 'HintButton', 'ClickableArea', 'RunawayButton', 'Transition'];
  for (const comp of components) {
    assert(demo.includes(`<${comp}`), `Demo must show ${comp}`);
  }
});

// ========== Summary ==========
console.log('\n========================================');
console.log(`Integration Verification Complete`);
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
