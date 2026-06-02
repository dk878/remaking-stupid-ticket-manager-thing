import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, createRoute, createRootRoute, RouterProvider } from '@tanstack/react-router'
import './index.css'
import { Root } from './routes/__root'
import { HomePage } from './routes/index'
import { ShowcasePage } from './routes/showcase'
import { TicketDetailPage } from './routes/ticket-detail'

const rootRoute = createRootRoute({ component: Root })
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const showcaseRoute = createRoute({ getParentRoute: () => rootRoute, path: '/showcase', component: ShowcasePage })
const ticketDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tickets/$ticketId', component: TicketDetailPage })

const routeTree = rootRoute.addChildren([indexRoute, showcaseRoute, ticketDetailRoute])
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
