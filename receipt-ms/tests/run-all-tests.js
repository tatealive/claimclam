#!/usr/bin/env node

/**
 * Comprehensive Test Runner for ClaimClam Receipt Management System
 * 
 * Runs all test suites: unit tests, integration tests, and MCP tests
 */

import { execSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { runHappyPathTests } from './integration/happy-paths.test.js';
import { runErrorCaseTests } from './integration/error-cases.test.js';

// --- Logger Setup ---
const logsDir = path.join(process.cwd(), 'tests', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFilePath = path.join(logsDir, `test-run-${timestamp}.log`);
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const originalConsoleLog = console.log;
console.log = (...args) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)).join(' ');
  const cleanMessage = message.replace(/\x1b\[[0-9;]*m/g, ''); // Remove color codes
  logStream.write(`${new Date().toISOString()} - ${cleanMessage}\n`);
  originalConsoleLog.apply(console, args);
};

console.log('🧪 ClaimClam Receipt Management System - Comprehensive Test Suite\n');

// Test configuration
const DEV_SERVER_URL = 'http://localhost:5173';
const UNIT_TESTS = 'npm run test:run';
const MCP_TESTS = 'npm run mcp:test';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, successMessage, failureMessage) {
  try {
    const output = execSync(command, { stdio: 'pipe' }).toString();
    console.log(output); // Log command output
    log(`✅ ${successMessage}`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${failureMessage}`, 'red');
    console.log(error.stdout?.toString() || error.message); // Log error output
    return false;
  }
}

function checkDevServer() {
  return new Promise((resolve) => {
    const req = http.get(DEV_SERVER_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log(`Dev server check error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('Dev server check timed out.');
      resolve(false);
    });
  });
}

async function runUnitTests() {
  log('\n📋 Running Unit Tests...', 'blue');
  try {
    const output = execSync(UNIT_TESTS, { encoding: 'utf8', stdio: 'pipe' });
    log('✅ Unit Tests Passed', 'green');
    console.log(output);
    return true;
  } catch (error) {
    log('❌ Unit Tests Failed', 'red');
    console.log(error.stdout || error.message);
    return false;
  }
}

async function runMCPTests() {
  log('\n🔧 Running MCP Integration Tests...', 'blue');
  try {
    const output = execSync(MCP_TESTS, { encoding: 'utf8', stdio: 'pipe' });
    log('✅ MCP Tests Passed', 'green');
    console.log(output);
    return true;
  } catch (error) {
    log('❌ MCP Tests Failed', 'red');
    console.log(error.stdout || error.message);
    return false;
  }
}

async function runIntegrationTests() {
  log('\n🌐 Running Integration Tests...', 'blue');
  
  // Test development server
  const serverRunning = await checkDevServer();
  if (!serverRunning) {
    log('❌ Development server not running on port 5173', 'red');
    log('   Please start the server with: npm run dev', 'yellow');
    return false;
  }
  
  log('✅ Development server is running', 'green');
  
  // Run happy path tests
  log('\n📋 Running Happy Path Tests...', 'blue');
  const happyPathResults = await runHappyPathTests();
  
  // Run error case tests
  log('\n⚠️  Running Error Case Tests...', 'blue');
  const errorCaseResults = await runErrorCaseTests();
  
  return happyPathResults && errorCaseResults;
}

async function runAllTests() {
  log('🚀 Starting Comprehensive Test Suite', 'bold');
  log('=' .repeat(50), 'blue');
  
  const results = {
    unit: false,
    integration: false,
    mcp: false
  };
  
  // Run unit tests
  results.unit = await runUnitTests();
  
  // Run integration tests
  const integrationTestsPassed = await runIntegrationTests();
  if (!integrationTestsPassed) results.integration = false;

  // Run MCP tests
  results.mcp = await runMCPTests();
  
  // Summary
  log('\n📊 Test Results Summary', 'bold');
  log('=' .repeat(30), 'blue');
  log(`Unit Tests: ${results.unit ? '✅ PASSED' : '❌ FAILED'}`, results.unit ? 'green' : 'red');
  log(`Integration Tests: ${results.integration ? '✅ PASSED' : '❌ FAILED'}`, results.integration ? 'green' : 'red');
  log(`MCP Tests: ${results.mcp ? '✅ PASSED' : '❌ FAILED'}`, results.mcp ? 'green' : 'red');
  
  const allPassed = results.unit && results.integration && results.mcp;
  
  if (allPassed) {
    log('\n🎉 All Tests Passed! Application is ready for production.', 'green');
    log('🚀 Ready for technical interview demonstration!', 'bold');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed. Please review the output above.', 'yellow');
    process.exit(1);
  }
};

// Graceful exit
process.on('exit', (code) => {
  console.log(`\nExiting with code ${code}. Closing log stream.`);
  logStream.end();
});

process.on('SIGINT', () => {
  console.log('Caught interrupt signal. Exiting.');
  process.exit();
});

runAllTests();
