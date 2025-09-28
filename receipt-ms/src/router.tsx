import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AppNavbar } from './components/AppNavbar'
import { ReceiptSubmissionForm } from './components/ReceiptSubmissionForm'
import { ReviewDashboard } from './components/ReviewDashboard'

function RootComponent() {
  return (
    <div className="min-h-screen-safe bg-gray-50">
      <AppNavbar />
      <main className="p-6">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  )
}

const rootRoute = createRootRoute({
  component: RootComponent,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ReviewDashboard,   // ✅ now the default entry page
})

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: ReceiptSubmissionForm,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: ReviewDashboard,   // still available at /dashboard
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  submitRoute,
  dashboardRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
