# Test Organization

This directory contains all test files organized by type and purpose.

## ① Directory Structure

```
tests/
├── unit/                    # Unit tests
│   ├── setup.ts            # Test environment setup
│   └── receiptSchema.test.ts # Form validation tests
├── integration/             # Integration tests
│   └── (future tests)      # API integration, component integration
├── mcp/                     # Chrome DevTools MCP tests
│   ├── MCP_TEST_REPORT.md   # MCP test results
│   ├── QUICK_MCP_SETUP.md   # Quick MCP setup guide
│   └── TESTING_WITH_CHROME_DEVTOOLS_MCP.md # Comprehensive MCP guide
└── run-all-tests.js         # Comprehensive test runner
```

## ② Running Tests

### Individual Test Suites
```bash
# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# All tests (unit + integration + MCP)
npm run test:all

# MCP tests
npm run mcp:test
```

### Test Types

#### Unit Tests (`tests/unit/`)
- **Purpose**: Test individual functions and components in isolation
- **Tools**: Vitest + React Testing Library
- **Coverage**: Form validation, utility functions, component logic
- **Run**: `npm run test:unit`

#### Integration Tests (`tests/integration/`)
- **Purpose**: Test component interactions and API integration
- **Tools**: Custom test runner + HTTP requests
- **Coverage**: End-to-end workflows, component integration
- **Run**: `npm run test:integration`

#### MCP Tests (`tests/mcp/`)
- **Purpose**: Real browser testing with Chrome DevTools MCP
- **Tools**: Chrome DevTools MCP server
- **Coverage**: User interactions, performance, responsive design
- **Run**: `npm run mcp:test`

## ③ Test Coverage

### Current Coverage
- **Form Validation**: Zod schema testing
- **Application Endpoints**: HTTP response testing
- **MCP Integration**: Chrome DevTools connectivity
- **Development Server**: Port and response testing

### Planned Coverage
- **Component Integration**: React component interactions
- **User Workflows**: Complete user journey testing
- **Performance Testing**: Core Web Vitals analysis
- **Accessibility Testing**: Screen reader and keyboard navigation

## ④ Test Configuration

### Vitest Configuration
- **Config File**: `vitest.config.ts`
- **Setup File**: `tests/unit/setup.ts`
- **Environment**: jsdom
- **Globals**: Enabled

### MCP Configuration
- **Config File**: `mcp-config.json`
- **Server**: chrome-devtools-mcp@latest
- **Log File**: `/tmp/mcp-test.log`
- **Port**: 5174 (development server)

## ⑤ Adding New Tests

### Unit Tests
1. Create test file in `tests/unit/`
2. Follow naming convention: `*.test.ts`
3. Import from `src/` directory
4. Run with `npm run test:unit`

### Integration Tests
1. Add test logic to `run-all-tests.js`
2. Or create separate test file in `tests/integration/`
3. Run with `npm run test:integration`

### MCP Tests
1. Add test scenarios to MCP documentation
2. Use Chrome DevTools MCP prompts
3. Run with `npm run mcp:test`

## ⑥ Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Naming**: Use descriptive test names
3. **Arrange-Act-Assert**: Follow AAA pattern
4. **Mock External Dependencies**: Use mocks for external services
5. **Test Edge Cases**: Include error conditions and boundary values
6. **Documentation**: Keep test documentation up to date

## ⑦ Troubleshooting

### Common Issues
- **Port Conflicts**: Check if port 5174 is available
- **MCP Server**: Ensure Chrome is installed and accessible
- **Test Failures**: Check console output for detailed error messages
- **Dependencies**: Run `npm install` if tests fail to start

### Debug Commands
```bash
# Check development server
curl http://localhost:5174

# Check MCP server
ps aux | grep chrome-devtools-mcp

# Run tests with verbose output
npm run test:unit -- --reporter=verbose
```

---

*This test organization ensures comprehensive coverage and easy maintenance of the Receipt Management System.*
