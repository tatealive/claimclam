import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { HeroUIDemo } from './components/HeroUIDemo'
// TODO: Re-enable after fixing
// import { ReceiptSubmissionForm } from './components/ReceiptSubmissionForm'
// import { ReviewDashboard } from './components/ReviewDashboard'

// Root layout component  
function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
}

// Temporarily removed broken Navigation and HomePage components
// TODO: Rebuild with HeroUI components to fix icon rendering issues

// Create root route
const rootRoute = createRootRoute({
  component: RootComponent,
})

// Create index route - temporarily using HeroUI demo
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HeroUIDemo,
})

// Create submit route - temporarily using HeroUI demo
const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit',
  component: HeroUIDemo,
})

// Create dashboard route - temporarily using HeroUI demo
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: HeroUIDemo,
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
