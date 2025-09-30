#!/usr/bin/env node

/**
 * Advanced Chrome DevTools MCP Test Runner
 * 
 * Runs comprehensive tests utilizing all Chrome DevTools MCP key features:
 * - Performance insights
 * - Advanced browser debugging
 * - Reliable automation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import test modules
import { runAllPerformanceTests } from './performance-testing.js';
import { runAllAutomationTests } from './automation-testing.js';
import { runAllDebuggingTests } from './debugging-testing.js';

const BASE_URL = 'http://localhost:5173';
const TEST_RESULTS_DIR = './tests/mcp/results';
const COMPREHENSIVE_REPORT = path.join(TEST_RESULTS_DIR, 'comprehensive-mcp-report.json');

// Ensure results directory exists
if (!fs.existsSync(TEST_RESULTS_DIR)) {
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
}

// Helper functions
function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bold: '\x1b[1m',
    reset: '\x1b[0m'
  };
  
  const colorCode = colors[color] || colors.white;
  console.log(`${colorCode}${message}${colors.reset}`);
}

function checkDevServer() {
  return new Promise((resolve) => {
    import('http').then(({ default: http }) => {
      const req = http.get(BASE_URL, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => {
        resolve(false);
      });
      req.setTimeout(3000, () => {
        req.destroy();
        resolve(false);
      });
    }).catch(() => {
      resolve(false);
    });
  });
}

async function runAdvancedMCPTests() {
  log('🚀 Advanced Chrome DevTools MCP Testing Suite', 'bold');
  log('=' .repeat(60), 'blue');
  log('Utilizing all Chrome DevTools MCP key features:', 'cyan');
  log('• Performance insights with traces and analysis', 'white');
  log('• Advanced browser debugging with network/console analysis', 'white');
  log('• Reliable automation with Puppeteer', 'white');
  log('');

  // Check if development server is running
  log('🔍 Checking development server...', 'blue');
  const serverRunning = await checkDevServer();
  if (!serverRunning) {
    log('❌ Development server not running on port 5173', 'red');
    log('   Please start the server with: npm run dev', 'yellow');
    return false;
  }
  log('✅ Development server is running', 'green');
  log('');

  const results = {
    performance: false,
    automation: false,
    debugging: false,
    timestamp: new Date().toISOString()
  };

  // Run Performance Tests
  log('🏃‍♂️ Running Performance Tests...', 'blue');
  log('Focus: Core Web Vitals, rendering performance, memory usage', 'white');
  try {
    results.performance = await runAllPerformanceTests();
    log('');
  } catch (error) {
    log(`❌ Performance tests failed: ${error.message}`, 'red');
    results.performance = false;
  }

  // Run Automation Tests
  log('🤖 Running Automation Tests...', 'blue');
  log('Focus: User journey automation, form testing, responsive design', 'white');
  try {
    results.automation = await runAllAutomationTests();
    log('');
  } catch (error) {
    log(`❌ Automation tests failed: ${error.message}`, 'red');
    results.automation = false;
  }

  // Run Debugging Tests
  log('🔍 Running Debugging Tests...', 'blue');
  log('Focus: Network analysis, console monitoring, JavaScript profiling', 'white');
  try {
    results.debugging = await runAllDebuggingTests();
    log('');
  } catch (error) {
    log(`❌ Debugging tests failed: ${error.message}`, 'red');
    results.debugging = false;
  }

  // Generate comprehensive report
  const comprehensiveReport = {
    ...results,
    summary: {
      totalTestSuites: 3,
      passedTestSuites: Object.values(results).filter(Boolean).length - 1, // -1 for timestamp
      failedTestSuites: 3 - (Object.values(results).filter(Boolean).length - 1),
      successRate: Math.round(((Object.values(results).filter(Boolean).length - 1) / 3) * 100)
    },
    recommendations: []
  };

  // Add comprehensive recommendations
  if (comprehensiveReport.summary.successRate < 80) {
    comprehensiveReport.recommendations.push('Review performance optimization opportunities');
    comprehensiveReport.recommendations.push('Improve automation reliability');
    comprehensiveReport.recommendations.push('Enhance debugging capabilities');
  }

  if (comprehensiveReport.summary.successRate >= 90) {
    comprehensiveReport.recommendations.push('Excellent MCP testing coverage - maintain current standards');
  }

  // Save comprehensive report
  fs.writeFileSync(COMPREHENSIVE_REPORT, JSON.stringify(comprehensiveReport, null, 2));

  // Final summary
  log('📊 Advanced MCP Test Results Summary', 'bold');
  log('=' .repeat(40), 'blue');
  log(`Performance Tests: ${results.performance ? '✅ PASSED' : '❌ FAILED'}`, results.performance ? 'green' : 'red');
  log(`Automation Tests: ${results.automation ? '✅ PASSED' : '❌ FAILED'}`, results.automation ? 'green' : 'red');
  log(`Debugging Tests: ${results.debugging ? '✅ PASSED' : '❌ FAILED'}`, results.debugging ? 'green' : 'red');
  log('');
  log(`Overall Success Rate: ${comprehensiveReport.summary.successRate}%`, 'bold');
  log('');

  if (comprehensiveReport.summary.successRate >= 80) {
    log('🎉 Advanced MCP Testing Passed!', 'green');
    log('✅ All Chrome DevTools MCP features utilized effectively', 'green');
    log('🚀 Application ready for comprehensive testing demonstration', 'green');
  } else {
    log('⚠️  Some MCP test suites failed.', 'yellow');
    log('🔧 Consider reviewing test implementations', 'yellow');
  }

  log('');
  log('📄 Detailed reports saved to:', 'cyan');
  log(`   • Performance: ${path.join(TEST_RESULTS_DIR, 'performance-report.json')}`, 'white');
  log(`   • Automation: ${path.join(TEST_RESULTS_DIR, 'automation-report.json')}`, 'white');
  log(`   • Debugging: ${path.join(TEST_RESULTS_DIR, 'debugging-report.json')}`, 'white');
  log(`   • Comprehensive: ${COMPREHENSIVE_REPORT}`, 'white');
  log('');
  log('📋 MCP Prompts generated in: tests/mcp/results/', 'cyan');
  log('🚀 Use these prompts with your MCP client for detailed testing!', 'cyan');
  log('');
  log('🎯 Next Steps:', 'bold');
  log('1. Use the generated MCP prompts with your MCP client', 'white');
  log('2. Run the actual Chrome DevTools MCP tests', 'white');
  log('3. Analyze the detailed reports for insights', 'white');
  log('4. Implement any recommended improvements', 'white');

  return comprehensiveReport.summary.successRate >= 80;
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAdvancedMCPTests().catch(console.error);
}

export { runAdvancedMCPTests };
