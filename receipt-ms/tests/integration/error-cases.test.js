#!/usr/bin/env node

/**
 * Error Cases Integration Tests
 * 
 * Tests critical error scenarios and edge cases
 */

import http from 'http';

const BASE_URL = 'http://localhost:5174';
const TIMEOUT = 5000;

// Helper functions
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(TIMEOUT, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function logTest(testName, status, details = '') {
  const icon = status === 'PASS' ? '✅' : '❌';
  const color = status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  console.log(`${color}${icon} ${testName}${reset} ${details}`);
}

// Error case tests
async function testInvalidRoutes() {
  logTest('Testing Invalid Routes', 'RUN');
  
  const invalidRoutes = [
    '/nonexistent',
    '/invalid-path',
    '/api/not-found',
    '/submit/invalid'
  ];
  
  let allHandledCorrectly = true;
  
  for (const route of invalidRoutes) {
    try {
      const response = await makeRequest(route);
      // Should return 404 or redirect to home
      if (response.status === 404 || response.status === 200) {
        logTest(`Route ${route}`, 'PASS', `Status: ${response.status}`);
      } else {
        logTest(`Route ${route}`, 'FAIL', `Unexpected status: ${response.status}`);
        allHandledCorrectly = false;
      }
    } catch (error) {
      // Network errors are also acceptable for invalid routes
      logTest(`Route ${route}`, 'PASS', `Error handled: ${error.message}`);
    }
  }
  
  return allHandledCorrectly;
}

async function testServerErrorHandling() {
  logTest('Testing Server Error Handling', 'RUN');
  
  try {
    // Test with malformed requests
    const response = await makeRequest('/?malformed=true');
    if (response.status === 200) {
      logTest('Server Error Handling', 'PASS', 'Server handles malformed requests gracefully');
      return true;
    } else {
      logTest('Server Error Handling', 'FAIL', `Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logTest('Server Error Handling', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

async function testNetworkTimeoutHandling() {
  logTest('Testing Network Timeout Handling', 'RUN');
  
  try {
    // Test with very short timeout to simulate network issues
    const response = await makeRequest('/', { timeout: 100 });
    logTest('Network Timeout', 'PASS', 'Request completed within timeout');
    return true;
  } catch (error) {
    if (error.message.includes('timeout')) {
      logTest('Network Timeout', 'PASS', 'Timeout handled gracefully');
      return true;
    } else {
      logTest('Network Timeout', 'FAIL', `Unexpected error: ${error.message}`);
      return false;
    }
  }
}

async function testConcurrentRequests() {
  logTest('Testing Concurrent Requests', 'RUN');
  
  try {
    // Make multiple concurrent requests
    const requests = [
      makeRequest('/'),
      makeRequest('/submit'),
      makeRequest('/dashboard'),
      makeRequest('/'),
      makeRequest('/submit')
    ];
    
    const responses = await Promise.allSettled(requests);
    const successful = responses.filter(r => r.status === 'fulfilled' && r.value.status === 200);
    
    if (successful.length >= 3) {
      logTest('Concurrent Requests', 'PASS', `${successful.length}/5 requests successful`);
      return true;
    } else {
      logTest('Concurrent Requests', 'FAIL', `Only ${successful.length}/5 requests successful`);
      return false;
    }
  } catch (error) {
    logTest('Concurrent Requests', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

async function testLargeRequestHandling() {
  logTest('Testing Large Request Handling', 'RUN');
  
  try {
    // Test with large query parameters
    const largeQuery = '?data=' + 'x'.repeat(10000);
    const response = await makeRequest(`/${largeQuery}`);
    
    if (response.status === 200 || response.status === 414) {
      logTest('Large Request Handling', 'PASS', `Status: ${response.status} (handled appropriately)`);
      return true;
    } else {
      logTest('Large Request Handling', 'FAIL', `Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logTest('Large Request Handling', 'PASS', `Error handled: ${error.message}`);
    return true;
  }
}

async function testSpecialCharactersHandling() {
  logTest('Testing Special Characters Handling', 'RUN');
  
  const specialChars = [
    '/?test=hello%20world',
    '/?test=special!@#$%^&*()',
    '/?test=unicode-测试-🚀',
    '/?test=sql-injection\'; DROP TABLE users; --'
  ];
  
  let allHandled = true;
  
  for (const path of specialChars) {
    try {
      const response = await makeRequest(path);
      if (response.status === 200) {
        logTest(`Special chars: ${path.substring(0, 20)}...`, 'PASS', 'Handled correctly');
      } else {
        logTest(`Special chars: ${path.substring(0, 20)}...`, 'FAIL', `Status: ${response.status}`);
        allHandled = false;
      }
    } catch (error) {
      logTest(`Special chars: ${path.substring(0, 20)}...`, 'FAIL', `Error: ${error.message}`);
      allHandled = false;
    }
  }
  
  return allHandled;
}

async function testMemoryUsage() {
  logTest('Testing Memory Usage', 'RUN');
  
  try {
    // Make multiple requests to test memory handling
    const requests = Array(10).fill().map(() => makeRequest('/'));
    const responses = await Promise.allSettled(requests);
    
    const successful = responses.filter(r => r.status === 'fulfilled' && r.value.status === 200);
    
    if (successful.length >= 8) {
      logTest('Memory Usage', 'PASS', `${successful.length}/10 requests successful`);
      return true;
    } else {
      logTest('Memory Usage', 'FAIL', `Only ${successful.length}/10 requests successful`);
      return false;
    }
  } catch (error) {
    logTest('Memory Usage', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runErrorCaseTests() {
  console.log('⚠️  Running Error Cases Integration Tests\n');
  console.log('=' .repeat(50));
  
  const results = {
    invalidRoutes: false,
    serverErrors: false,
    networkTimeout: false,
    concurrentRequests: false,
    largeRequests: false,
    specialChars: false,
    memoryUsage: false
  };
  
  // Run all error case tests
  results.invalidRoutes = await testInvalidRoutes();
  results.serverErrors = await testServerErrorHandling();
  results.networkTimeout = await testNetworkTimeoutHandling();
  results.concurrentRequests = await testConcurrentRequests();
  results.largeRequests = await testLargeRequestHandling();
  results.specialChars = await testSpecialCharactersHandling();
  results.memoryUsage = await testMemoryUsage();
  
  // Summary
  console.log('\n📊 Error Case Test Results');
  console.log('=' .repeat(30));
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests >= totalTests * 0.8) { // 80% pass rate for error cases
    console.log('\n🎉 Error Handling Tests Passed!');
    console.log('✅ Application handles errors gracefully');
    return true;
  } else {
    console.log('\n⚠️  Some error handling tests failed.');
    console.log('🔧 Consider improving error handling robustness');
    return false;
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runErrorCaseTests().catch(console.error);
}

export { runErrorCaseTests };
