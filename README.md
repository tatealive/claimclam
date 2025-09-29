# ClaimClam: A Receipt Management System

![React 18](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-cyan)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-7.6-pink)
![Zod](https://img.shields.io/badge/Zod-4.1-purple)
![TanStack Table](https://img.shields.io/badge/TanStack%20Table-8.2-green)
![Zustand](https://img.shields.io/badge/Zustand-5.0-yellow)
![Vitest](https://img.shields.io/badge/Vitest-3.2-green)
![PWA](https://img.shields.io/badge/PWA-Ready-blue)

## Project Overview

A modern, responsive **Receipt Management System** named **ClaimClam**, built with React 18 and TypeScript. This application enables employees to submit expense receipts with comprehensive validation and provides reviewers with an advanced dashboard for managing and approving submissions. The system uses mock data only, making it perfect for demonstration and testing purposes without requiring backend infrastructure.

## ① Features Implemented

- **Receipt Submission Form**
  - Real-time validation with Zod schema
  - File upload simulation with progress bar
  - Mobile-first responsive design
  - Success feedback with auto-redirect

- **Review Dashboard**
  - Advanced filtering (status, category, date range)
  - Fuzzy search across employee, vendor, and description
  - Sortable columns with visual indicators
  - Pagination (10 items per page)
  - Bulk approve/reject actions
  - Responsive table that collapses to cards on mobile

- **Receipt Details Modal**
  - Complete receipt information display
  - File attachment preview
  - Notes system for reviewers
  - Inline approve/reject actions

- **Responsive Design**
  - Mobile-first approach
  - Table transforms to card view on screens < 640px
  - Touch-friendly interface elements

- **State Management**
  - Zustand store with localStorage persistence
  - Data survives page refresh
  - Optimistic updates for better UX

- **Testing**
  - Vitest test runner
  - React Testing Library integration
  - Comprehensive form validation tests

## ② Tech Stack

| Library | Purpose | Version |
|---------|---------|---------|
| **React** | UI Framework | 19 (via @types/react) |
| **Vite** | Build Tool & Dev Server | 7.1.7 |
| **TypeScript** | Type Safety | ~5.8.3 |
| **Tailwind CSS** | Utility-first Styling | 4.1.13 |
| **React Hook Form** | Form Management | 7.63.0 |
| **Zod** | Schema Validation | 4.1.11 |
| **TanStack Table** | Data Table Component | 8.21.3 |
| **Zustand** | State Management | 5.0.8 |
| **TanStack Router DOM** | Client-side Routing | 1.132.17 |
| **Headless UI** | Accessible UI Components | 2.2.9 |
| **Heroicons** | Icon Library | 2.2.0 |
| **Fuse.js** | Fuzzy Search | 7.1.0 |
| **Vitest** | Test Runner | 3.2.4 |

## ③ Setup & Scripts

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/tatealive/claimclam.git
cd claimclam

# Navigate to the receipt management system
cd receipt-ms

# Install dependencies
npm install

# Quick setup for Chrome DevTools MCP testing
./setup-mcp.sh

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts
- `./setup-mcp.sh` - Quick setup for Chrome DevTools MCP testing
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once (CI mode)
- `npm run test:integration` - Run all integration tests
- `npm run test:mcp` - Start development server for MCP testing
- `npm run mcp:install` - Install Chrome DevTools MCP server
- `npm run mcp:start` - Start the MCP server

## ④ Design Decisions & Assumptions

This section outlines the key architectural choices and assumptions made during the development of the application. These decisions are guided by the goal of creating a modern, performant, and maintainable demonstration application.

### Application-Wide Decisions

These decisions affect the overall architecture and behavior of the application.

- **Client-Side Only & Mock Data**: The application is designed to run entirely in the browser without a backend.
  - **Justification**: This simplifies the project setup, making it easy to run and test without requiring a database or server. All data is sourced from `src/data/mockReceipts.ts` and managed in the client's state.

- **State Management with Zustand & localStorage**: Zustand is used for centralized state management, with the `persist` middleware to save the entire state to the browser's `localStorage`.
  - **Justification**: Zustand provides a simple and scalable state management solution without the boilerplate of other libraries. Persisting to `localStorage` ensures that user-submitted receipts and changes are not lost on page refresh, creating a more seamless demo experience.

- **Responsive & Mobile-First Design**: The application is built with a mobile-first approach using Tailwind CSS.
  - **Justification**: This ensures a high-quality user experience on a wide range of devices, from small mobile screens to large desktops. Standard Tailwind breakpoints are used for consistency.

### Submission Form (`/submit`)

Decisions specific to the receipt submission page.

- **Type-Safe Forms with React Hook Form & Zod**: Forms are managed by React Hook Form, and validation is handled using Zod schemas defined in `src/schemas/receiptSchema.ts`.
  - **Justification**: This combination provides a powerful, type-safe, and declarative way to manage form state and validation. It leads to more maintainable code and a better developer experience.

- **Real-time Validation & User Feedback**: Form fields are validated in real-time (`onChange`), providing immediate feedback to the user.
  - **Justification**: This improves the user experience by helping users correct errors as they happen, rather than after submitting the form. On submission errors, the first invalid field is automatically focused.

- **Simulated File Upload**: The file upload process is simulated with a 2-second delay and a progress indicator.
  - **Justification**: This mimics the behavior of a real-world file upload, providing a more realistic demonstration. The file itself is stored in memory and not sent to a server.

- **UX Enhancements with Toasts & Success States**: The application uses toast notifications for non-intrusive feedback (e.g., "uploading", "success", "error"). A clear success overlay is shown after a successful submission.
  - **Justification**: These features provide clear and immediate feedback on the status of user actions, improving usability and user confidence.

- **Required File Attachment**: The receipt file attachment is a mandatory field for form submission.
  - **Justification**: This ensures that every receipt submission is accompanied by its corresponding proof. This is a deliberate design choice for the current version, though it could be made optional in future iterations depending on business requirements.

### Review Dashboard (`/dashboard`)

Decisions specific to the receipt review and management dashboard.

- **Data Table with TanStack Table**: The dashboard uses TanStack Table to manage and display the receipt data.
  - **Justification**: TanStack Table is a headless, lightweight, and powerful utility for building complex data grids. It provides essential features like sorting, filtering, and pagination out-of-the-box.

- **Advanced Filtering & Fuzzy Search**: The dashboard includes multi-faceted filtering (by status, category, date range) and a global fuzzy search powered by Fuse.js.
  - **Justification**: These features allow reviewers to quickly and efficiently find specific receipts. Fuzzy search provides a more forgiving and user-friendly search experience compared to exact matching.

- **Efficient Review Workflow**: The dashboard is designed for efficient reviewing with features like bulk actions (approve/reject multiple receipts), inline actions on each row, and a detailed modal view.
  - **Justification**: This minimizes the number of clicks and page navigations required for a reviewer to perform their tasks, improving productivity.

- **Client-Side Operations**: All data operations, including sorting, filtering, and pagination, are performed on the client side.
  - **Justification**: With a small mock dataset, client-side operations are instantaneous, providing a very responsive user experience. This approach would be re-evaluated for a production application with a large dataset.

- **Optimized Table Layout**: The table is designed to minimize horizontal scrolling by using compact column headers and text truncation.
  - **Justification**: Horizontal scrolling creates poor user experience on most devices. By truncating long text (like descriptions) with tooltips and using concise headers, the table fits better on standard screen sizes while maintaining functionality.

- **Icon-Based Column Headers**: All table columns use Heroicons instead of text-only headers for better visual hierarchy and space efficiency.
  - **Justification**: Icons provide immediate visual recognition, reduce header width, and create a more modern, professional appearance. The combination of icon + text ensures accessibility while saving horizontal space.

- **Two-Column Modal Layout**: The receipt details modal uses a responsive two-column grid layout for receipt information.
  - **Justification**: This reduces the modal height and creates a more compact, scannable layout. Information is logically grouped and easier to read than a single-column vertical list.

## ⑤ Folder Structure

```
receipt-ms/
├── src/
│   ├── components/
│   │   ├── AppNavbar.tsx
│   │   ├── ConfirmationDialog.tsx
│   │   ├── FilePreview.tsx
│   │   ├── ReceiptDetailsModal.tsx
│   │   ├── ReceiptSubmissionForm.tsx
│   │   └── ReviewDashboard.tsx
│   ├── data/
│   │   └── mockReceipts.ts
│   ├── schemas/
│   │   └── receiptSchema.ts
│   ├── store/
│   │   └── receiptStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── main.tsx
│   ├── router.tsx
│   └── style.css
├── tests/
│   ├── unit/
│   │   ├── components.test.tsx
│   │   ├── receiptForm.test.tsx
│   │   ├── receiptSchema.test.ts
│   │   └── setup.ts
│   ├── integration/
│   │   ├── error-cases.test.js
│   │   ├── form-submission.test.js
│   │   └── happy-paths.test.js
│   ├── mcp/
│   │   ├── automation-testing.js
│   │   ├── debugging-testing.js
│   │   ├── form-submission-automated.test.js
│   │   ├── performance-testing.js
│   │   └── run-advanced-mcp-tests.js
│   └── run-all-tests.js
├── docs/
│   ├── ARCHITECTURE.md
│   └── TESTING_WITH_CHROME_DEVTOOLS_MCP.md
├── public/
│   └── vite.svg
├── package.json
├── setup-mcp.sh
├── mcp-config.json
├── test-mcp-integration.js
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

## ⑥ Testing Strategy

### Test Coverage
- **Form Validation**: Comprehensive Zod schema testing
  - Valid data acceptance
  - Invalid data rejection with proper error messages
  - Edge cases (future dates, file size limits, etc.)

### Test Tools
- **Vitest**: Fast test runner with Vite integration
- **React Testing Library**: Component testing utilities
- **Jest DOM**: Additional matchers for DOM testing
- **Chrome DevTools MCP**: Real browser testing and debugging

**Note**: The test framework is currently basic and needs improvement. Future enhancements should include comprehensive component testing, integration tests, and automated end-to-end testing to ensure robust application reliability.

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Start MCP testing (requires MCP client setup)
npm run test:mcp
```

### Chrome DevTools MCP Testing

This project includes integration with [Chrome DevTools MCP](https://developer.chrome.com/blog/chrome-devtools-mcp) for advanced testing capabilities:

- **Real browser testing**: Verify code changes in actual Chrome browser
- **Performance auditing**: Automated performance traces and analysis
- **User behavior simulation**: Test complex user flows and interactions
- **Live debugging**: Inspect DOM, CSS, and console errors in real-time
- **Network analysis**: Debug CORS issues and network requests

See [./docs/TESTING_WITH_CHROME_DEVTOOLS_MCP.md](docs/TESTING_WITH_CHROME_DEVTOOLS_MCP.md) for detailed testing instructions.

## ⑦ Future Improvements

### Backend Integration
- **REST API**: Replace mock data with real backend
- **Database**: PostgreSQL/MongoDB for persistent storage
- **Authentication**: JWT-based user authentication
- **File Storage**: AWS S3 or similar for receipt attachments

### Enhanced Features
- **PDF Export**: Generate PDF reports for approved receipts
- **Email Notifications**: Notify users of status changes
- **Role-based Access**: Different permissions for employees vs. reviewers
- **Audit Trail**: Track all changes and approvals
- **Advanced Analytics**: Spending reports and insights

### Performance Optimizations
- **Virtual Scrolling**: Handle large datasets efficiently
- **Lazy Loading**: Load receipts on demand
- **Caching**: Implement smart caching strategies
- **PWA Features**: Offline support and push notifications

### UI/UX Enhancements
- **Dark Mode**: Theme switching capability
- **Drag & Drop**: File upload with drag and drop
- **Bulk Upload**: Multiple file upload at once
- **Advanced Filters**: More sophisticated filtering options
