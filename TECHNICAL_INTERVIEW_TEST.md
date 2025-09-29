# Frontend Developer Technical Interview - Take-Home Challenge

## 📋 Project Overview

You are tasked with building a **Receipt Management System** - a web application that allows employees to submit expense receipts and enables reviewers to manage and approve these submissions. This challenge simulates real-world development scenarios you might encounter in our team.

### Business Context
Employees need a simple way to submit receipts for reimbursement, while finance teams need an efficient dashboard to review, filter, and process these submissions. The system should handle common receipt information like amounts, vendors, categories, and attachments.

### Time Allocation: Required 1 day before interview

## 🤖 AI Tools Welcome

**Feel free to use AI tools!** We encourage modern development practices and welcome AI assistance (GitHub Copilot, ChatGPT, Claude, etc.) to help with code generation, debugging, and documentation.

### What We're Looking For
- **Technical problem-solving** and architectural decisions
- **Code quality** and organization skills
- **User experience** thinking and design sensibility
- **Understanding of your code** - be prepared to explain your implementation choices
- **Modern development practices** including testing, documentation, and responsive design

Just ensure you understand and can explain any code you submit, whether AI-assisted or not.

---

## 🛠 Technical Requirements

### Tech Stack Choice
**You choose the stack!** Use whatever frontend technologies you're most comfortable with. We want to see your best work, not how quickly you can learn something new. Common choices include:
- React, Vue, Angular, or Svelte
- TypeScript or JavaScript
- Any CSS framework (Tailwind, Bootstrap, Material-UI, etc.)
- Any build tool (Vite, Webpack, Create React App, etc.)

### Core Requirements
- ✅ **Responsive design** - Works on desktop and mobile
- ✅ **Mock data** - No backend required, use static/mock data
- ✅ **Modern browser support** - Chrome/Firefox/Safari/Edge
- ✅ **Clean, readable code** with consistent formatting
- ✅ **Basic error handling** and user feedback

---

## 📝 Feature Specifications

### 1. Receipt Submission Form

Build a form where employees can submit new expense receipts with the following fields:

#### Required Fields
- **Amount** (number, required, min $0.01)
- **Date** (date picker, required, cannot be future date)
- **Vendor/Merchant** (text, required, max 100 characters)
- **Category** (dropdown: Meals, Travel, Office Supplies, Other)
- **Description** (textarea, optional, max 500 characters)
- **Employee Name** (text, required)
- **Department** (dropdown: Engineering, Sales, Marketing, Finance, HR)

#### File Upload
- **Receipt Image/PDF** (optional, show file name when selected)
- Support common formats: JPG, PNG, PDF
- Mock the upload - no actual file processing needed
- Show upload progress or success state

#### Form Behavior
- **Real-time validation** with helpful error messages
- **Clear success feedback** when submitted

### 2. Review Dashboard

Build a dashboard where reviewers can manage submitted receipts:

#### Receipt List/Table
Display receipts with these columns:
- **Date Submitted**
- **Employee Name**
- **Amount**
- **Vendor**
- **Category**
- **Status** (Pending, Approved, Rejected)
- **Actions** (View, Approve, Reject buttons)

#### Filtering & Search
- **Search bar** - search by employee name, vendor, or description
- **Filter by status** - All, Pending, Approved, Rejected
- **Filter by date range** - From/To date pickers
- **Filter by category** - Multi-select dropdown
- **Clear all filters** button

#### Table Features
- **Sortable columns** (amount, date, employee name)
- **Pagination** if more than 10 items
- **Row selection** with bulk actions
- **Responsive table** that works on mobile

#### Receipt Details Modal
When clicking "View" on a receipt:
- Show all receipt information
- Display uploaded file (mock with placeholder)
- Add notes/comments section
- Approve/Reject actions with confirmation

---

## 📊 Mock Data

Use this sample data to populate your application:

```javascript
const mockReceipts = [
  {
    id: 1,
    amount: 45.67,
    date: "2024-01-15",
    vendor: "Starbucks",
    category: "Meals",
    description: "Client meeting coffee",
    employeeName: "Sarah Johnson",
    department: "Sales",
    status: "Pending",
    submittedDate: "2024-01-16T10:30:00Z",
    attachmentName: "starbucks_receipt.jpg"
  },
  {
    id: 2,
    amount: 120.00,
    date: "2024-01-10",
    vendor: "Delta Airlines",
    category: "Travel",
    description: "Flight to client site",
    employeeName: "Mike Chen",
    department: "Engineering",
    status: "Approved",
    submittedDate: "2024-01-11T14:45:00Z",
    attachmentName: "boarding_pass.pdf"
  },
  {
    id: 3,
    amount: 89.99,
    date: "2024-01-12",
    vendor: "Office Depot",
    category: "Office Supplies",
    description: "Printer paper and pens",
    employeeName: "Lisa Rodriguez",
    department: "HR",
    status: "Rejected",
    submittedDate: "2024-01-13T09:15:00Z",
    attachmentName: "office_depot.jpg"
  }
  // Add 10-15 more entries for realistic testing
];
```

### Additional Mock Data Arrays:
```javascript
const departments = ["Engineering", "Sales", "Marketing", "Finance", "HR"];
const categories = ["Meals", "Travel", "Office Supplies", "Other"];
const statuses = ["Pending", "Approved", "Rejected"];
```

---

## 🎯 Evaluation Criteria

#### Functionality
#### Code Quality 
#### UI/UX Design
##### Documentation is not required, but come prepared. 
---

## 📤 Submission Guidelines

### Repository Requirements
1. **Create a public GitHub repository**
2. **Include all source code** with clear commit history
3. **Add a comprehensive README.md** with:
   - Project description and features
   - Technology stack used
   - Setup and installation instructions
   - How to run the application
   - Any assumptions or design decisions

### README Template
```markdown
# Receipt Management System

## Features
- [List key features implemented]

## Tech Stack
- [List technologies used]

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Open http://localhost:3000

```

### Code Quality Checklist
- [ ] Code is properly formatted (use Prettier/ESLint)
- [ ] No console.logs or debugging code left in
- [ ] Components are reasonably sized and focused
- [ ] Error boundaries or error handling implemented
- [ ] Responsive design tested on mobile
- [ ] Application builds and runs without errors

---

## ❓ FAQs

**Q: Can I use UI component libraries?**
A: Absolutely! Use whatever helps you build efficiently. We want to see how you work, not reinvent the wheel.

**Q: Do I need to implement authentication?**
A: No, you can assume users are already logged in. Focus on the core functionality.

**Q: What about the backend/API?**
A: Use mock data only. No backend implementation required.

**Q: Can I ask questions during the challenge?**
A: Document any assumptions you make in your README. This shows how you handle ambiguous requirements.

**Q: What if I don't finish everything?**
A: Submit what you have! We'd rather see a polished, working subset than a broken full implementation.

**Q: How much time should I spend?**
A: We leave this up to you - we understand your time is valuable

---

## 🚀 Getting Started

1. **Plan your approach** - Sketch out your component structure
2. **Set up your development environment** - Choose your stack and create the project
3. **Start with the form** - Get one feature working completely before moving on
4. **Build the dashboard** - Focus on core functionality first
5. **Polish and test** - Responsive design, error handling, documentation

**Remember**: We're evaluating how you approach problems, write clean code, and build user-friendly interfaces. Focus on doing a few things really well rather than trying to implement every possible feature.

Good luck! We're excited to see what you build. 🎉