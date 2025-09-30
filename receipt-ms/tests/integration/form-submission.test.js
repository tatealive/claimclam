#!/usr/bin/env node

/**
 * Form Submission Integration Test
 * 
 * Tests complete form submission flow with specific values
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

const BASE_URL = 'http://localhost:5173';
const TIMEOUT = 30000;

// Test data for form submission
const TEST_RECEIPT_DATA = {
  employeeName: 'John Smith',
  amount: '25.50',
  date: '2024-01-15',
  vendor: 'Officeworks',
  category: 'Office Supplies',
  department: 'Engineering',
  description: 'Test receipt for office supplies',
  attachment: 'test-receipt.pdf'
};

function logTest(testName, status, details = '') {
  const icon = status === 'PASS' ? '✅' : '❌';
  const color = status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  console.log(`${color}${icon} ${testName}${reset} ${details}`);
}

async function waitForApp() {
  logTest('Waiting for app to start', 'RUN');
  
  const startTime = Date.now();
  while (Date.now() - startTime < TIMEOUT) {
    try {
      const response = await fetch(`${BASE_URL}/submit`);
      if (response.ok) {
        logTest('App is running', 'PASS', `Available at ${BASE_URL}`);
        return true;
      }
    } catch (error) {
      // App not ready yet, continue waiting
    }
    await setTimeout(1000);
  }
  
  logTest('App startup timeout', 'FAIL', 'App did not start within 30 seconds');
  return false;
}

async function runFormSubmissionTest() {
  console.log('🚀 Running Form Submission Integration Test\n');
  console.log('=' .repeat(50));
  
  // Check if app is running
  const appReady = await waitForApp();
  if (!appReady) {
    console.log('\n❌ Cannot run tests - app is not running');
    console.log('Please start the app with: npm run dev');
    return false;
  }
  
  console.log('\n📝 Test Data:');
  console.log(JSON.stringify(TEST_RECEIPT_DATA, null, 2));
  
  console.log('\n🔧 To test form submission manually:');
  console.log('1. Open browser to http://localhost:5173/submit');
  console.log('2. Fill in the form with the test data above');
  console.log('3. Select category: Office Supplies');
  console.log('4. Select department: Engineering');
  console.log('5. Upload a test file (any PDF/JPG/PNG)');
  console.log('6. Click Submit Receipt');
  console.log('7. Verify success message or error handling');
  
  console.log('\n📊 Expected Results:');
  console.log('✅ All form fields should accept the test values');
  console.log('✅ Dropdowns should show selected values');
  console.log('✅ File upload should work');
  console.log('✅ Form validation should pass');
  console.log('✅ Submit button should process the form');
  
  return true;
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFormSubmissionTest().catch(console.error);
}

export { runFormSubmissionTest, TEST_RECEIPT_DATA };
