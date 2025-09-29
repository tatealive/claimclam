# Receipt Management System

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

A modern, responsive **Receipt Management System** built with React 18 and TypeScript. This application enables employees to submit expense receipts with comprehensive validation and provides reviewers with an advanced dashboard for managing and approving submissions. The system uses mock data only, making it perfect for demonstration and testing purposes without requiring backend infrastructure.

## ① Live Demo

**Demo URL:** `https://your-deployment-url.vercel.app`

*Note: Replace with actual deployment URL when available*

## ② Features Implemented

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

## ③ Tech Stack

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
| **TanStack Router DOM** | Client-side Routing | 7.9.3 |
| **Headless UI** | Accessible UI Components | 2.2.9 |
| **Heroicons** | Icon Library | 2.2.0 |
| **Fuse.js** | Fuzzy Search | 7.1.0 |
| **Vitest** | Test Runner | 3.2.4 |

## ④ Setup & Scripts

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
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

## ⑤ Design Decisions & Assumptions

### Validation Strategy
- **Zod + React Hook Form**: Type-safe validation with excellent developer experience
- **Real-time validation**: Immediate feedback on form errors
- **Client-side only**: No backend validation required for this demo

### File Upload Simulation
- **1-second delay**: Simulates real upload with progress bar (0-100%)
- **File kept in memory**: No actual file processing or storage
- **Supported formats**: JPG, PNG, PDF with 10MB size limit

### Pagination Strategy
- **Fixed 10 rows per page**: Simple UX, easily configurable
- **Client-side pagination**: All data loaded, filtered in memory
- **Responsive pagination**: Different layouts for mobile/desktop

### Responsive Design
- **Mobile-first**: Table collapses to card view below 640px breakpoint
- **Tailwind breakpoints**: sm (640px), md (1024px), lg (1280px)
- **Touch-friendly**: Larger touch targets on mobile devices

### State Management
- **Zustand + localStorage**: Simple state management with persistence
- **No backend**: All data stored locally, resets on browser clear
- **Optimistic updates**: UI updates immediately for better UX

### Data Strategy
- **Mock data only**: 15 sample receipts with varied statuses and categories
- **No API calls**: All operations are synchronous and local
- **Realistic data**: Includes proper date formatting and currency display

## ⑥ Folder Structure

```
receipt-ms/
├── src/
│   ├── components/
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
│   ├── App.tsx
│   ├── main.tsx
│   └── style.css
├── tests/
│   ├── unit/
│   │   └── receiptSchema.test.ts
│   └── integration/
│       ├── happy-paths.test.js
│       └── error-cases.test.js
├── public/
├── package.json
└── README.md
```

## ⑦ Testing Strategy

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

## ⑧ TODO

- [ ] Item 1
- [ ] Item 2

## ⑨ Future Improvements

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
