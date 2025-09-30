# 🧪 MCP Test Scenarios - Real Browser Testing

## 🎯 User Happy Path Scenarios

### 1. Complete Receipt Submission Flow
```
MCP Prompt: "Test the complete receipt submission workflow at http://localhost:5173"

Expected Actions:
1. Navigate to http://localhost:5173/submit
2. Fill out the form with valid data:
   - Amount: $25.50
   - Date: Today's date
   - Vendor: "Test Vendor"
   - Category: "Meals"
   - Description: "Test receipt for MCP testing"
   - Employee Name: "John Doe"
   - Department: "Engineering"
3. Upload a test file (create a small JPG file)
4. Submit the form
5. Verify success message appears
6. Verify redirect to dashboard
7. Verify receipt appears in dashboard list
8. Take screenshot of final state
```

### 2. Dashboard Review and Management
```
MCP Prompt: "Test the dashboard functionality at http://localhost:5173/dashboard"

Expected Actions:
1. Navigate to http://localhost:5173/dashboard
2. Verify all receipts are displayed
3. Test search functionality:
   - Search for "Test Vendor"
   - Search for "John Doe"
   - Search for "Meals"
4. Test filtering:
   - Filter by status (Pending, Approved, Rejected)
   - Filter by category (Meals, Travel, Office Supplies, Other)
   - Filter by date range
5. Test sorting:
   - Sort by amount (ascending/descending)
   - Sort by date (ascending/descending)
   - Sort by employee name
6. Test bulk actions:
   - Select multiple receipts
   - Verify floating bulk actions bar appears
   - Approve selected receipts
   - Reject selected receipts
7. Test individual actions:
   - Click "View" on a receipt
   - Verify modal opens with smooth animation
   - Verify two-column layout in modal
   - Test file preview functionality
   - Add a note to the receipt
   - Delete a note with confirmation dialog
   - Close modal
8. Test responsive design:
   - Resize browser to mobile viewport (< 640px)
   - Verify table transforms to card layout
   - Test mobile pagination controls
   - Verify touch-friendly interactions
9. Take screenshot of dashboard
```

### 3. Responsive Design Testing
```
MCP Prompt: "Test responsive design at http://localhost:5173 on different viewport sizes"

Expected Actions:
1. Test desktop view (1920x1080):
   - Navigate to dashboard
   - Verify table layout with all columns
   - Test floating bulk actions bar
   - Test pagination with page indicators
   - Test Heroicon column headers
2. Test tablet view (768x1024):
   - Resize browser to tablet dimensions
   - Verify layout adapts
   - Test form usability
   - Test compressed table layout
3. Test mobile view (375x667):
   - Resize browser to mobile dimensions
   - Verify table becomes card layout
   - Test mobile pagination controls
   - Test form usability on mobile
   - Test navigation menu
   - Verify condensed card information display
4. Take screenshots of each viewport
5. Verify touch interactions work
```

## ⚠️ Error Case Scenarios

### 1. Form Validation Testing
```
MCP Prompt: "Test form validation by submitting invalid data at http://localhost:5173/submit"

Expected Actions:
1. Navigate to submit form
2. Test empty form submission:
   - Click submit without filling anything
   - Verify all required field errors appear
3. Test invalid amount:
   - Enter negative amount (-10)
   - Enter zero amount (0)
   - Enter very large amount (999999999)
   - Verify appropriate error messages
4. Test invalid date:
   - Select future date
   - Verify error message appears
5. Test invalid file:
   - Try to upload .txt file
   - Try to upload file > 10MB
   - Verify error messages
6. Test text length limits:
   - Enter very long vendor name (>100 chars)
   - Enter very long description (>500 chars)
   - Verify character count and limits
7. Take screenshot of error states
```

### 2. Network Error Simulation
```
MCP Prompt: "Test application behavior under network stress at http://localhost:5173"

Expected Actions:
1. Open Chrome DevTools Network tab
2. Set throttling to "Slow 3G"
3. Navigate to application
4. Test form submission with slow network
5. Test dashboard loading with slow network
6. Verify loading states appear
7. Test with "Offline" mode:
   - Go offline
   - Try to submit form
   - Verify error handling
   - Go back online
   - Verify recovery
8. Take screenshots of loading states
```

### 3. Browser Error Testing
```
MCP Prompt: "Test browser error handling at http://localhost:5173"

Expected Actions:
1. Open Chrome DevTools Console
2. Monitor for JavaScript errors
3. Test with JavaScript disabled:
   - Disable JavaScript in DevTools
   - Refresh page
   - Verify graceful degradation
4. Test with localStorage disabled:
   - Clear localStorage
   - Test form submission
   - Verify data persistence
5. Test with limited memory:
   - Open many tabs
   - Test application performance
6. Test with console errors:
   - Inject test errors in console
   - Verify error boundaries work
7. Take screenshots of error states
```

## 🔍 Edge Case Scenarios

### 1. Boundary Value Testing
```
MCP Prompt: "Test boundary values and edge cases at http://localhost:5173/submit"

Expected Actions:
1. Test minimum valid amount ($0.01)
2. Test maximum valid amount ($999,999.99)
3. Test exactly 100 character vendor name
4. Test exactly 500 character description
5. Test file exactly 10MB
6. Test special characters in all fields:
   - Unicode characters (测试, 🚀)
   - Special symbols (!@#$%^&*())
   - SQL injection attempts
   - XSS attempts
7. Test with very long file names
8. Test with empty strings vs null values
9. Take screenshots of edge cases
```

### 2. Concurrent User Testing
```
MCP Prompt: "Test concurrent user scenarios at http://localhost:5173"

Expected Actions:
1. Open multiple tabs/windows
2. Submit receipts simultaneously
3. Test dashboard updates across tabs
4. Test localStorage synchronization
5. Test state management consistency
6. Verify no data corruption
7. Test rapid form submissions
8. Test rapid filtering/sorting
9. Take screenshots of concurrent states
```

### 3. Performance Testing
```
MCP Prompt: "Run performance audit on http://localhost:5173"

Expected Actions:
1. Open Chrome DevTools Performance tab
2. Start performance recording
3. Navigate through application:
   - Load home page
   - Submit a receipt
   - View dashboard
   - Filter and search
4. Stop recording
5. Analyze performance metrics:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - First Input Delay (FID)
6. Identify performance bottlenecks
7. Test with large datasets (100+ receipts)
8. Take screenshots of performance data
```

## 🎯 Accessibility Testing

### 1. Screen Reader Testing
```
MCP Prompt: "Test accessibility with screen reader at http://localhost:5173"

Expected Actions:
1. Enable screen reader (if available)
2. Navigate through application using keyboard only
3. Test form accessibility:
   - Tab through all form fields
   - Verify field labels are announced
   - Test error message announcements
4. Test dashboard accessibility:
   - Navigate table with keyboard
   - Test sorting with keyboard
   - Test filtering with keyboard
5. Test modal accessibility:
   - Open receipt details modal
   - Navigate modal with keyboard
   - Close modal with keyboard
6. Verify ARIA labels and roles
7. Take screenshots of accessibility features
```

### 2. Keyboard Navigation Testing
```
MCP Prompt: "Test keyboard navigation at http://localhost:5173"

Expected Actions:
1. Navigate entire application using only keyboard
2. Test tab order and focus management
3. Test form submission with Enter key
4. Test modal opening/closing with keyboard
5. Test table navigation with arrow keys
6. Test dropdown interactions with keyboard
7. Test button activation with Space/Enter
8. Verify focus indicators are visible
9. Take screenshots of focus states
```

## 📊 Test Execution Plan

### Phase 1: Core Functionality (30 minutes)
- [ ] Complete receipt submission flow
- [ ] Dashboard review and management
- [ ] Basic form validation

### Phase 2: Error Handling (20 minutes)
- [ ] Form validation errors
- [ ] Network error simulation
- [ ] Browser error testing

### Phase 3: Edge Cases (20 minutes)
- [ ] Boundary value testing
- [ ] Concurrent user testing
- [ ] Performance testing

### Phase 4: Accessibility (15 minutes)
- [ ] Screen reader testing
- [ ] Keyboard navigation testing
- [ ] ARIA compliance testing

## 🎯 Success Criteria

### Must Pass (Critical)
- ✅ Complete user workflows work
- ✅ Form validation prevents invalid submissions
- ✅ Application handles network errors gracefully
- ✅ Responsive design works on mobile
- ✅ No JavaScript errors in console

### Should Pass (Important)
- ✅ Performance metrics are acceptable
- ✅ Accessibility features work
- ✅ Edge cases are handled gracefully
- ✅ Concurrent usage doesn't break app

### Nice to Have (Optional)
- ✅ Advanced error recovery
- ✅ Optimized performance
- ✅ Full accessibility compliance
- ✅ Advanced edge case handling

---

**These MCP test scenarios provide comprehensive coverage for your technical interview demonstration! 🚀**
