#!/usr/bin/env node
/**
 * Master Verification Script for 0002-shared-components
 *
 * Runs all verification tests and build check.
 * Run with: node src/__tests__/verify/0002-shared-components/run-all-verification.mjs
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../../..');

const results = {
  regression: null,
  dod: null,
  hazard: null,
  edge: null,
  integration: null,
};

async function runCommand(name, cmd, args, cwd) {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running: ${name}`);
    console.log(`Command: ${cmd} ${args.join(' ')}`);
    console.log('='.repeat(60));

    const proc = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      resolve(code === 0);
    });

    proc.on('error', (err) => {
      console.error(`Error: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('========================================');
  console.log('DARWIN Verification: 0002-shared-components');
  console.log('========================================');

  // 1. Regression: Build check
  console.log('\n[1/5] Regression Check: npm run build');
  results.regression = await runCommand(
    'Build (Regression)',
    'npm',
    ['run', 'build'],
    ROOT
  );

  if (!results.regression) {
    console.log('\n!!! CRITICAL: Build failed - stopping verification !!!');
    process.exit(1);
  }

  // 2. DoD Tests
  console.log('\n[2/5] DoD Verification');
  results.dod = await runCommand(
    'DoD Tests',
    'node',
    ['src/__tests__/verify/0002-shared-components/dod/verify-tasks.mjs'],
    ROOT
  );

  // 3. Hazard Tests
  console.log('\n[3/5] Hazard Verification');
  results.hazard = await runCommand(
    'Hazard Tests',
    'node',
    ['src/__tests__/verify/0002-shared-components/hazard/verify-hazards.mjs'],
    ROOT
  );

  // 4. Edge Case Tests
  console.log('\n[4/5] Edge Case Verification');
  results.edge = await runCommand(
    'Edge Case Tests',
    'node',
    ['src/__tests__/verify/0002-shared-components/edge/verify-edge-cases.mjs'],
    ROOT
  );

  // 5. Integration Tests
  console.log('\n[5/5] Integration Verification');
  results.integration = await runCommand(
    'Integration Tests',
    'node',
    ['src/__tests__/verify/0002-shared-components/integration/verify-integration.mjs'],
    ROOT
  );

  // Summary
  console.log('\n');
  console.log('='.repeat(60));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(60));

  const categories = [
    { name: 'Regression (Build)', result: results.regression },
    { name: 'DoD Verification', result: results.dod },
    { name: 'Hazard Verification', result: results.hazard },
    { name: 'Edge Case Verification', result: results.edge },
    { name: 'Integration Verification', result: results.integration },
  ];

  let passCount = 0;
  let failCount = 0;

  for (const cat of categories) {
    const status = cat.result ? 'PASS' : 'FAIL';
    const symbol = cat.result ? '[OK]' : '[XX]';
    console.log(`  ${symbol} ${cat.name}: ${status}`);
    if (cat.result) passCount++;
    else failCount++;
  }

  console.log('='.repeat(60));

  // Determine verdict
  let verdict;
  if (!results.regression) {
    verdict = 'BLOCKED';
    console.log(`\nVerdict: ${verdict}`);
    console.log('Reason: Build failed - critical regression');
  } else if (failCount === 0) {
    verdict = 'VERIFIED';
    console.log(`\nVerdict: ${verdict}`);
    console.log('All tests passed. Implementation verified against specification.');
  } else if (failCount <= 3) {
    verdict = 'FIXABLE';
    console.log(`\nVerdict: ${verdict}`);
    console.log(`${failCount} test suite(s) failed with fixable issues.`);
  } else {
    verdict = 'BLOCKED';
    console.log(`\nVerdict: ${verdict}`);
    console.log(`${failCount} test suite(s) failed - too many issues.`);
  }

  console.log('='.repeat(60));

  process.exit(failCount === 0 ? 0 : 1);
}

main().catch(console.error);
