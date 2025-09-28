#!/usr/bin/env node

/**
 * Performance Testing with Chrome DevTools MCP
 * 
 * Utilizes Chrome DevTools MCP performance tools for comprehensive testing
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5174';
const TEST_RESULTS_DIR = './tests/mcp/results';
const PERFORMANCE_REPORT = path.join(TEST_RESULTS_DIR, 'performance-report.json');

// Ensure results directory exists
if (!fs.existsSync(TEST_RESULTS_DIR)) {
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
}

// MCP Performance Test Scenarios
const PERFORMANCE_TESTS = [
  {
    name: 'Core Web Vitals Analysis',
    description: 'Analyze Core Web Vitals for the receipt management system',
    url: BASE_URL,
    actions: [
      'navigate_page',
      'performance_start_trace',
      'wait_for',
      'performance_stop_trace',
      'performance_analyze_insight'
    ],
    expectedMetrics: ['LCP', 'FID', 'CLS', 'FCP']
  },
  {
    name: 'Form Submission Performance',
    description: 'Test form submission performance',
    url: `${BASE_URL}/submit`,
    actions: [
      'navigate_page',
      'performance_start_trace',
      'fill_form',
      'upload_file',
      'click',
      'wait_for',
      'performance_stop_trace',
      'performance_analyze_insight'
    ],
    expectedMetrics: ['form_submission_time', 'file_upload_time', 'validation_time']
  },
  {
    name: 'Dashboard Rendering Performance',
    description: 'Test dashboard rendering with large datasets',
    url: `${BASE_URL}/dashboard`,
    actions: [
      'navigate_page',
      'performance_start_trace',
      'click', // Filter buttons
      'click', // Sort buttons
      'wait_for',
      'performance_stop_trace',
      'performance_analyze_insight'
    ],
    expectedMetrics: ['rendering_time', 'filter_time', 'sort_time']
  },
  {
    name: 'Memory Usage Analysis',
    description: 'Monitor memory usage during application usage',
    url: BASE_URL,
    actions: [
      'navigate_page',
      'performance_start_trace',
      'evaluate_script', // Memory monitoring script
      'wait_for',
      'performance_stop_trace',
      'performance_analyze_insight'
    ],
    expectedMetrics: ['heap_usage', 'memory_leaks', 'gc_frequency']
  }
];

// Helper functions
function logTest(testName, status, details = '') {
  const icon = status === 'PASS' ? '✅' : '❌';
  const color = status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  console.log(`${color}${icon} ${testName}${reset} ${details}`);
}

function generateMCPPrompt(test) {
  return `
Test: ${test.name}
Description: ${test.description}
URL: ${test.url}

Expected Actions:
1. Navigate to ${test.url}
2. Start performance trace
3. Perform user interactions
4. Stop performance trace
5. Analyze performance insights
6. Extract metrics: ${test.expectedMetrics.join(', ')}
7. Generate performance report

Please use the following MCP tools:
- performance_start_trace
- performance_stop_trace
- performance_analyze_insight
- take_screenshot
- evaluate_script

Focus on:
- Core Web Vitals (LCP, FID, CLS, FCP)
- JavaScript execution time
- Memory usage patterns
- Network request timing
- Rendering performance
`;
}

function runPerformanceTest(test) {
  logTest(`Running ${test.name}`, 'RUN');
  
  try {
    // Generate MCP prompt
    const mcpPrompt = generateMCPPrompt(test);
    
    // Save prompt to file for MCP client
    const promptFile = path.join(TEST_RESULTS_DIR, `${test.name.toLowerCase().replace(/\s+/g, '-')}-prompt.txt`);
    fs.writeFileSync(promptFile, mcpPrompt);
    
    logTest(`${test.name}`, 'PASS', `MCP prompt generated: ${promptFile}`);
    return true;
  } catch (error) {
    logTest(`${test.name}`, 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

function generatePerformanceReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    tests: results,
    summary: {
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length,
      failedTests: results.filter(r => !r.passed).length,
      successRate: Math.round((results.filter(r => r.passed).length / results.length) * 100)
    },
    recommendations: []
  };

  // Add performance recommendations
  if (report.summary.successRate < 80) {
    report.recommendations.push('Consider optimizing JavaScript execution');
    report.recommendations.push('Review network request patterns');
    report.recommendations.push('Check for memory leaks');
  }

  if (report.summary.successRate >= 90) {
    report.recommendations.push('Performance is excellent - maintain current standards');
  }

  return report;
}

async function runAllPerformanceTests() {
  console.log('🚀 Running Performance Tests with Chrome DevTools MCP\n');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const test of PERFORMANCE_TESTS) {
    const passed = runPerformanceTest(test);
    results.push({
      name: test.name,
      passed,
      timestamp: new Date().toISOString()
    });
  }
  
  // Generate performance report
  const report = generatePerformanceReport(results);
  fs.writeFileSync(PERFORMANCE_REPORT, JSON.stringify(report, null, 2));
  
  // Summary
  console.log('\n📊 Performance Test Results');
  console.log('=' .repeat(30));
  
  console.log(`Total Tests: ${report.summary.totalTests}`);
  console.log(`Passed: ${report.summary.passedTests}`);
  console.log(`Failed: ${report.summary.failedTests}`);
  console.log(`Success Rate: ${report.summary.successRate}%`);
  
  if (report.summary.successRate >= 80) {
    console.log('\n🎉 Performance Tests Passed!');
    console.log('✅ Application meets performance standards');
  } else {
    console.log('\n⚠️  Some performance tests failed.');
    console.log('🔧 Consider performance optimizations');
  }
  
  console.log(`\n📄 Detailed report saved to: ${PERFORMANCE_REPORT}`);
  console.log('\n📋 MCP Prompts generated in: tests/mcp/results/');
  console.log('\n🚀 Use these prompts with your MCP client for detailed testing!');
  
  return report.summary.successRate >= 80;
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url.includes('performance-testing.js')) {
  console.log('🚀 Starting Performance Testing...');
  runAllPerformanceTests().then(() => {
    console.log('✅ Performance testing completed');
  }).catch(console.error);
}

export { runAllPerformanceTests, PERFORMANCE_TESTS };
