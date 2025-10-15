import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexReactClient, ConvexProvider } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { routeTree } from './routeTree.gen'

// Create singleton Convex client to persist across hot reloads
let convexClient: ConvexReactClient | null = null

function getConvexClient(url: string): ConvexReactClient {
  if (!convexClient) {
    convexClient = new ConvexReactClient(url)
  }
  return convexClient
}

export function getRouter() {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!
  if (!CONVEX_URL) {
    console.error('missing envar CONVEX_URL')
  }
  const client = getConvexClient(CONVEX_URL)
  const convexQueryClient = new ConvexQueryClient(client)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        gcTime: 5000,
      },
    },
  })
  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: 'intent',
      context: { queryClient },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0, // Let React Query handle all caching
      defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
      defaultNotFoundComponent: () => <p>not found</p>,
      Wrap: ({ children }) => (
        <ConvexAuthProvider client={client}>
          {children}
        </ConvexAuthProvider>
      ),
    }),
    queryClient,
  )

  return router
}
