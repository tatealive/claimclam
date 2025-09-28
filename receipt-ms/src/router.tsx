import { createRouter, createRoute, createRootRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReceiptSubmissionForm } from './components/ReceiptSubmissionForm'
import { ReviewDashboard } from './components/ReviewDashboard'
import { 
  DocumentTextIcon, 
  TableCellsIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

// Root layout component
function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  )
}

// Navigation component
function Navigation() {
  const router = useRouter()
  const location = router.state.location
  
  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Submit Receipt', href: '/submit', icon: DocumentTextIcon },
    { name: 'Review Dashboard', href: '/dashboard', icon: TableCellsIcon },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Receipt Management System</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

// Home page component
function HomePage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Receipt Management System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Submit expense receipts and manage approvals efficiently
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Submit Receipt</h3>
                <p className="text-gray-600 mb-4">
                  Submit new expense receipts with all required information and file attachments.
                </p>
                <Link
                  to="/submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Submit Receipt
                </Link>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Review Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  Review, filter, and manage submitted receipts with advanced search capabilities.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  <TableCellsIcon className="w-4 h-4 mr-2" />
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Create root route
const rootRoute = createRootRoute({
  component: RootComponent,
})

// Create index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Create submit route
const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: ReceiptSubmissionForm,
})

// Create dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: ReviewDashboard,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  submitRoute,
  dashboardRoute,
])

// Create the router
export const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
