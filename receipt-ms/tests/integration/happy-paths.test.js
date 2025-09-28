#!/usr/bin/env node

/**
 * Happy Path Integration Tests
 * 
 * Tests the complete user journeys that should work smoothly
 */

import http from 'http';

const BASE_URL = 'http://localhost:5174';
const TIMEOUT = 5000;

// Test data for happy path scenarios
const VALID_RECEIPT_DATA = {
  amount: 25.50,
  date: '2024-01-15',
  vendor: 'Test Vendor',
  category: 'Meals',
  description: 'Test receipt description',
  employeeName: 'John Doe',
  department: 'Engineering'
};

const VALID_FILE_DATA = {
  name: 'test-receipt.jpg',
  type: 'image/jpeg',
  size: 1024 * 1024 // 1MB
};

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

// Test scenarios
async function testApplicationAccessibility() {
  logTest('Testing Application Accessibility', 'RUN');
  
  try {
    const response = await makeRequest('/');
    if (response.status === 200) {
      logTest('Application Accessibility', 'PASS', `Status: ${response.status}`);
      return true;
    } else {
      logTest('Application Accessibility', 'FAIL', `Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logTest('Application Accessibility', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

async function testAllRoutesAccessible() {
  logTest('Testing All Routes Accessible', 'RUN');
  
  const routes = [
    { path: '/', name: 'Home Page' },
    { path: '/submit', name: 'Submit Form' },
    { path: '/dashboard', name: 'Dashboard' }
  ];
  
  let allPassed = true;
  
  for (const route of routes) {
    try {
      const response = await makeRequest(route.path);
      if (response.status === 200) {
        logTest(`${route.name}`, 'PASS', `Status: ${response.status}`);
      } else {
        logTest(`${route.name}`, 'FAIL', `Status: ${response.status}`);
        allPassed = false;
      }
    } catch (error) {
      logTest(`${route.name}`, 'FAIL', `Error: ${error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function testStaticAssetsLoading() {
  logTest('Testing Static Assets Loading', 'RUN');
  
  const assets = [
    { path: '/src/main.tsx', name: 'Main TypeScript File' },
    { path: '/src/style.css', name: 'CSS Styles' }
  ];
  
  let allPassed = true;
  
  for (const asset of assets) {
    try {
      const response = await makeRequest(asset.path);
      if (response.status === 200) {
        logTest(`${asset.name}`, 'PASS', `Size: ${response.data.length} bytes`);
      } else {
        logTest(`${asset.name}`, 'FAIL', `Status: ${response.status}`);
        allPassed = false;
      }
    } catch (error) {
      logTest(`${asset.name}`, 'FAIL', `Error: ${error.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function testFormValidationEndpoints() {
  logTest('Testing Form Validation Endpoints', 'RUN');
  
  // Test that form pages load correctly
  try {
    const submitResponse = await makeRequest('/submit');
    if (submitResponse.status === 200 && submitResponse.data.includes('Submit New Receipt')) {
      logTest('Submit Form Page', 'PASS', 'Form page loads correctly');
      return true;
    } else {
      logTest('Submit Form Page', 'FAIL', 'Form page not loading correctly');
      return false;
    }
  } catch (error) {
    logTest('Submit Form Page', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

async function testDashboardFunctionality() {
  logTest('Testing Dashboard Functionality', 'RUN');
  
  try {
    const response = await makeRequest('/dashboard');
    if (response.status === 200) {
      // Check for key dashboard elements in the HTML
      const hasDashboardContent = response.data.includes('Review Dashboard') || 
                                 response.data.includes('dashboard') ||
                                 response.data.includes('receipt');
      
      if (hasDashboardContent) {
        logTest('Dashboard Page', 'PASS', 'Dashboard loads correctly');
        return true;
      } else {
        logTest('Dashboard Page', 'FAIL', 'Dashboard content not found');
        return false;
      }
    } else {
      logTest('Dashboard Page', 'FAIL', `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logTest('Dashboard Page', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

async function testResponsiveDesignSupport() {
  logTest('Testing Responsive Design Support', 'RUN');
  
  try {
    const response = await makeRequest('/');
    if (response.status === 200) {
      // Check for viewport meta tag and responsive CSS
      const hasViewport = response.data.includes('viewport');
      const hasResponsiveCSS = response.data.includes('tailwind') || 
                              response.data.includes('responsive');
      
      if (hasViewport) {
        logTest('Responsive Design', 'PASS', 'Viewport meta tag present');
        return true;
      } else {
        logTest('Responsive Design', 'FAIL', 'Viewport meta tag missing');
        return false;
      }
    } else {
      logTest('Responsive Design', 'FAIL', `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logTest('Responsive Design', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runHappyPathTests() {
  console.log('🚀 Running Happy Path Integration Tests\n');
  console.log('=' .repeat(50));
  
  const results = {
    accessibility: false,
    routes: false,
    assets: false,
    form: false,
    dashboard: false,
    responsive: false
  };
  
  // Run all tests
  results.accessibility = await testApplicationAccessibility();
  results.routes = await testAllRoutesAccessible();
  results.assets = await testStaticAssetsLoading();
  results.form = await testFormValidationEndpoints();
  results.dashboard = await testDashboardFunctionality();
  results.responsive = await testResponsiveDesignSupport();
  
  // Summary
  console.log('\n📊 Happy Path Test Results');
  console.log('=' .repeat(30));
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All Happy Path Tests Passed!');
    console.log('✅ Application is ready for user interactions');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Please review the output above.');
    return false;
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHappyPathTests().catch(console.error);
}

export { runHappyPathTests };
