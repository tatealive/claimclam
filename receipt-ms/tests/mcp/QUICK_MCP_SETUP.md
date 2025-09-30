# 🚀 Quick Chrome DevTools MCP Setup

## Immediate Testing Setup

### 1. Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### 2. Configure Your MCP Client

Add this configuration to your MCP client (Claude Desktop, Cursor, etc.):

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

### 3. Test the Application

Use these prompts in your AI assistant:

#### Basic Functionality Test
```
Please check the LCP of http://localhost:5173 and verify the receipt management system is working correctly.
```

#### Form Testing
```
Test the receipt submission form at http://localhost:5173/submit:
1. Try submitting with invalid data
2. Verify validation messages appear
3. Test file upload functionality
4. Confirm success feedback works
```

#### Dashboard Testing
```
Test the review dashboard at http://localhost:5173/dashboard:
1. Verify all receipts are displayed
2. Test search and filtering
3. Check responsive design on mobile
4. Test bulk actions
```

#### Performance Audit
```
Run a performance audit on localhost:5173 and identify any performance issues that need optimization.
```

## What You Can Test

✅ **Form Validation** - Real-time validation with error messages  
✅ **File Upload** - Simulated upload with progress bar  
✅ **Dashboard Filtering** - Search, sort, and filter functionality  
✅ **Responsive Design** - Mobile-first responsive layout  
✅ **Performance** - Core Web Vitals and loading performance  
✅ **User Interactions** - Complete user journey testing  
✅ **Error Handling** - Console errors and network issues  
✅ **Accessibility** - Screen reader and keyboard navigation  

## Troubleshooting

If MCP doesn't work:
1. Ensure Chrome is installed
2. Check if port 5173 is available
3. Restart your MCP client
4. Verify the configuration is correct

## Next Steps

Once MCP is working, you can:
- Test complex user flows
- Debug performance issues
- Verify responsive design
- Test accessibility features
- Monitor console errors
- Analyze network requests

---

*This setup allows you to test the ClaimClam Receipt Management System in a real browser environment with full debugging capabilities.*
