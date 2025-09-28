# 🏗️ Architecture Documentation

## System Overview

The Receipt Management System is built as a single-page application (SPA) using React 18 with TypeScript, following modern frontend architecture patterns. The application is designed to be stateless on the server side, with all data persistence handled client-side through localStorage.

## 📊 System Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as ReceiptSubmissionForm
    participant V as Zod Validator
    participant S as Zustand Store
    participant D as ReviewDashboard
    participant T as TanStack Table
    participant L as localStorage

    U->>F: Fill form & submit
    F->>V: Validate form data
    V-->>F: Validation result
    
    alt Validation Success
        F->>S: addReceipt(receiptData)
        S->>L: Persist to localStorage
        S-->>D: Trigger re-render
        D->>T: Update table data
        T-->>U: Show updated table
    else Validation Error
        F-->>U: Show error messages
    end

    Note over U,T: User can filter, sort, and manage receipts
    U->>D: Apply filters/search
    D->>T: Update table state
    T-->>U: Show filtered results

    U->>D: Approve/Reject receipt
    D->>S: updateReceipt(id, status)
    S->>L: Persist changes
    S-->>D: Trigger re-render
    D->>T: Update table data
    T-->>U: Show updated status
```

## 🧩 Component Architecture

### Component Hierarchy
```
App
├── Navigation
├── HomePage
├── ReceiptSubmissionForm
│   ├── Form Fields (Amount, Date, Vendor, etc.)
│   ├── File Upload Component
│   └── Validation Messages
└── ReviewDashboard
    ├── Search & Filter Controls
    ├── Bulk Actions Bar
    ├── TanStack Table
    │   ├── Table Header (Sortable)
    │   ├── Table Body (Rows)
    │   └── Pagination Controls
    └── ReceiptDetailsModal
        ├── Receipt Information Display
        ├── File Preview
        ├── Notes Section
        └── Action Buttons
```

### Component Responsibilities

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| **App** | Routing, Layout, Navigation | - | Route state |
| **ReceiptSubmissionForm** | Form handling, validation, submission | - | Form state, upload progress |
| **ReviewDashboard** | Data display, filtering, bulk actions | - | Filter state, selection state |
| **ReceiptDetailsModal** | Detailed view, notes, individual actions | `receipt`, `onClose` | Note input state |
| **Navigation** | Route navigation, active state | - | Location state |

## 🔄 State Management Flow

### Zustand Store Structure
```typescript
interface ReceiptStore {
  // State
  receipts: Receipt[]
  
  // Actions
  addReceipt: (receipt: Omit<Receipt, 'id' | 'submittedDate'>) => void
  updateReceipt: (id: number, updates: Partial<Receipt>) => void
  deleteReceipt: (id: number) => void
  bulkUpdateStatus: (ids: number[], status: Receipt['status']) => void
  addNote: (id: number, note: string) => void
}
```

### State Flow Events

#### Receipt Submission Flow
1. **User Input** → Form state (React Hook Form)
2. **Form Validation** → Zod schema validation
3. **Validation Success** → Zustand store action
4. **Store Update** → localStorage persistence
5. **UI Update** → Component re-render

#### Receipt Management Flow
1. **User Action** (approve/reject) → Component handler
2. **Store Action** → Zustand store update
3. **Persistence** → localStorage sync
4. **UI Update** → Table re-render

#### Filtering & Search Flow
1. **User Input** → Local component state
2. **Filter Logic** → Fuse.js search + custom filters
3. **Table Update** → TanStack Table state
4. **UI Update** → Filtered results display

## 🔍 Validation Architecture

### Zod Schema Reuse Pattern
```typescript
// Base schema definition
const receiptSchema = z.object({
  amount: z.number().min(0.01).max(999999.99),
  date: z.string().refine(date => new Date(date) <= new Date()),
  vendor: z.string().min(1).max(100),
  // ... other fields
})

// Type inference for form data
type ReceiptFormData = z.infer<typeof receiptSchema>

// Reuse in React Hook Form
const form = useForm<ReceiptFormData>({
  resolver: zodResolver(receiptSchema)
})
```

### Validation Layers
1. **Client-side Validation**: Zod schema + React Hook Form
2. **Type Safety**: TypeScript interfaces
3. **Runtime Validation**: Zod schema parsing
4. **UI Feedback**: Real-time error display

## 📊 Data Flow Architecture

### Data Sources
- **Mock Data**: Static array in `mockReceipts.ts`
- **User Input**: Form submissions
- **Local Storage**: Zustand persistence layer

### Data Transformations
```typescript
// Raw form data → Validated data
FormData → Zod.parse() → ReceiptFormData

// Form data → Store data
ReceiptFormData → addReceipt() → Receipt

// Store data → Display data
Receipt[] → TanStack Table → Rendered rows

// Search data → Filtered data
Receipt[] → Fuse.js search → Filtered Receipt[]
```

## 🎨 Styling Architecture

### Tailwind CSS Strategy
- **Utility-first**: No custom CSS components
- **Responsive design**: Mobile-first breakpoints
- **Component variants**: Conditional classes
- **Design tokens**: Consistent spacing, colors, typography

### Responsive Breakpoints
```css
/* Mobile first approach */
.container { /* Base styles */ }

@media (min-width: 640px) { /* sm */ }
@media (min-width: 1024px) { /* md */ }
@media (min-width: 1280px) { /* lg */ }
```

## 🧪 Testing Architecture

### Test Structure
```
src/test/
├── setup.ts              # Test environment setup
├── receiptSchema.test.ts  # Validation tests
└── components/           # Component tests (future)
    ├── ReceiptForm.test.tsx
    └── Dashboard.test.tsx
```

### Testing Strategy
- **Unit Tests**: Individual functions and utilities
- **Integration Tests**: Component interactions
- **E2E Tests**: User workflows (future)

## 🚀 Performance Considerations

### Optimization Strategies
- **Code Splitting**: Route-based lazy loading
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large datasets (future)
- **Debounced Search**: Prevent excessive filtering

### Bundle Analysis
- **Vite Bundle Analyzer**: Monitor bundle size
- **Tree Shaking**: Remove unused code
- **Dynamic Imports**: Load components on demand

## 🔒 Security Considerations

### Client-side Security
- **Input Sanitization**: Zod schema validation
- **XSS Prevention**: React's built-in escaping
- **File Validation**: Type and size checking
- **No Sensitive Data**: Mock data only

### Future Security Enhancements
- **CSRF Protection**: Backend integration
- **Authentication**: JWT tokens
- **Authorization**: Role-based access control
- **Data Encryption**: Sensitive data protection

## 📈 Scalability Considerations

### Current Limitations
- **Client-side Only**: No backend persistence
- **Memory Storage**: Limited by browser storage
- **Single User**: No multi-user support

### Future Scalability
- **Backend API**: RESTful or GraphQL
- **Database**: PostgreSQL or MongoDB
- **Caching**: Redis for performance
- **CDN**: Static asset delivery
- **Microservices**: Modular architecture

## 🔧 Development Workflow

### Build Process
1. **TypeScript Compilation**: Type checking
2. **Vite Bundling**: Module bundling
3. **Tailwind Processing**: CSS generation
4. **Asset Optimization**: Image and file optimization

### Development Tools
- **Vite Dev Server**: Hot module replacement
- **TypeScript**: Type checking and IntelliSense
- **ESLint**: Code linting (future)
- **Prettier**: Code formatting (future)

---

*This architecture documentation provides a comprehensive overview of the system design, data flow, and technical decisions made during development.*
