# 🧪 Testing with Chrome DevTools MCP

This guide explains how to use the Chrome DevTools Model Context Protocol (MCP) server to test and debug the ClaimClam Receipt Management System in real-time.

## What is Chrome DevTools MCP?

The [Chrome DevTools MCP server](https://developer.chrome.com/blog/chrome-devtools-mcp) brings the power of Chrome DevTools to AI coding assistants, allowing them to:

- Debug web pages directly in Chrome
- Analyze performance traces
- Inspect network requests and console errors
- Simulate user behavior
- Debug live styling and layout issues
- Automate performance audits

## Setup

### 1. Install Chrome DevTools MCP

```bash
npm install -D chrome-devtools-mcp
```

### 2. Configure MCP Client

Add the following configuration to your MCP client (e.g., Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Testing Scenarios

### 1. Verify Code Changes in Real-Time

**Prompt to try:**
```
Verify in the browser that your change works as expected. Test the receipt submission form at http://localhost:5173/submit
```

**What it does:**
- Opens the application in Chrome
- Tests the form submission flow
- Verifies validation works correctly
- Confirms success feedback appears

### 2. Diagnose Network and Console Errors

**Prompt to try:**
```
A few images on localhost:5173 are not loading. What's happening?
```

**What it does:**
- Analyzes network requests
- Checks for CORS issues
- Inspects console logs
- Identifies missing resources

### 3. Simulate User Behavior

**Prompt to try:**
```
Why does submitting the form fail after entering an email address? Test the form at http://localhost:5173/submit
```

**What it does:**
- Navigates to the form
- Fills out form fields
- Clicks submit button
- Analyzes any errors or issues

### 4. Debug Live Styling and Layout Issues

**Prompt to try:**
```
The page on localhost:5173 looks strange and off. Check what's happening there.
```

**What it does:**
- Inspects the DOM structure
- Analyzes CSS styles
- Identifies layout issues
- Suggests fixes for styling problems

### 5. Automate Performance Audits

**Prompt to try:**
```
Localhost:5173 is loading slowly. Make it load faster.
```

**What it does:**
- Runs performance traces
- Analyzes Core Web Vitals
- Identifies performance bottlenecks
- Suggests optimizations

## Specific Test Cases for ClaimClam Receipt Management System

### Form Validation Testing

```
Test the receipt submission form at http://localhost:5173/submit:
1. Try submitting with empty fields
2. Enter an invalid amount (negative or zero)
3. Select a future date
4. Upload an unsupported file type
5. Verify all validation messages appear correctly
```

### Dashboard Functionality Testing

```
Test the review dashboard at http://localhost:5173/dashboard:
1. Verify all receipts are displayed
2. Test the search functionality
3. Try filtering by status and category
4. Test sorting by different columns
5. Verify pagination works
6. Test bulk actions (select multiple receipts)
```

### Responsive Design Testing

```
Check the responsive design of the application:
1. Test on mobile viewport (< 640px)
2. Verify table transforms to cards on mobile
3. Test form usability on mobile
4. Check navigation on different screen sizes
```

### Performance Testing

```
Run a performance audit on the receipt management system:
1. Check Core Web Vitals (LCP, FID, CLS)
2. Analyze bundle size
3. Test loading performance
4. Check for memory leaks
5. Verify efficient re-renders
```

## Available MCP Tools

The Chrome DevTools MCP server provides several tools:

- `performance_start_trace` - Start performance tracing
- `performance_stop_trace` - Stop and analyze performance trace
- `navigate_to_url` - Navigate to a specific URL
- `take_screenshot` - Capture page screenshots
- `get_console_logs` - Retrieve console logs
- `get_network_requests` - Analyze network activity
- `inspect_element` - Inspect DOM elements
- `execute_script` - Run JavaScript in the page context

## Integration with Development Workflow

### Pre-commit Testing

```bash
# Before committing changes, run:
npm run test:run
# Then use MCP to verify in browser:
# "Verify the latest changes work correctly at http://localhost:5173"
```

### Performance Monitoring

```bash
# Regular performance checks:
# "Run a performance audit on localhost:5173 and identify any issues"
```

### User Experience Testing

```bash
# Test user flows:
# "Simulate a complete user journey: submit a receipt, then review it in the dashboard"
```

## Troubleshooting

### Common Issues

1. **MCP Server Not Starting**
   - Ensure Node.js is installed
   - Check if port 5173 is available
   - Verify the MCP configuration

2. **Chrome Not Opening**
   - Check Chrome installation
   - Verify browser permissions
   - Try different Chrome profiles

3. **Performance Issues**
   - Check system resources
   - Close unnecessary browser tabs
   - Restart the development server

### Debug Commands

```bash
# Check MCP server status
npx chrome-devtools-mcp --help

# Verify Chrome installation
google-chrome --version

# Check development server
curl http://localhost:5173
```

## Best Practices

1. **Always test in real browser** - Don't rely only on unit tests
2. **Test user interactions** - Simulate real user behavior
3. **Monitor performance** - Regular performance audits
4. **Check accessibility** - Use DevTools accessibility features
5. **Test responsive design** - Verify mobile experience
6. **Debug console errors** - Monitor and fix console issues

## Resources

- [Chrome DevTools MCP Documentation](https://developer.chrome.com/blog/chrome-devtools-mcp)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [Performance Testing Guide](https://web.dev/performance-testing/)

---

*This testing approach ensures our ClaimClam Receipt Management System works perfectly in real browser environments and provides excellent user experience.*
