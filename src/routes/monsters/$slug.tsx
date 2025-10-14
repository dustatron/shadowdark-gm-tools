/**
 * Monster Details Route - Individual Monster Display Page
 *
 * This page displays the full details of a single monster including:
 * - Core combat stats (AC, HP, attacks, movement)
 * - All ability score modifiers
 * - Full description and lore
 * - Special traits and abilities
 * - Navigation back to monster search
 */

import { Suspense } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { MonsterDetails } from '~/components/monsters/MonsterDetails'

export const Route = createFileRoute('/monsters/$slug')({
  component: MonsterDetailsPage,
})

/**
 * MonsterDetailsPage Component
 *
 * Main page component that displays a single monster's full details.
 * Uses Suspense boundaries for loading states and handles 404 errors
 * when monster is not found.
 */
function MonsterDetailsPage() {
  const { slug } = Route.useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <li>
            <Link
              to="/"
              className="hover:text-gray-900 dark:hover:text-gray-200"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to="/monsters"
              className="hover:text-gray-900 dark:hover:text-gray-200"
            >
              Monsters
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 dark:text-gray-100" aria-current="page">
            {slug}
          </li>
        </ol>
      </nav>

      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/monsters"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Monsters
        </Link>
      </div>

      {/* Monster details with Suspense boundary for loading state */}
      <Suspense fallback={<MonsterDetailsLoading />}>
        <MonsterDetailsContent slug={slug} />
      </Suspense>
    </div>
  )
}

/**
 * MonsterDetailsContent Component
 *
 * Fetches and displays the monster data.
 * Separated from MonsterDetailsPage to allow Suspense to handle loading states.
 */
function MonsterDetailsContent({ slug }: { slug: string }) {
  // Fetch monster by slug using Convex + TanStack Query
  const { data: monster } = useSuspenseQuery(
    convexQuery(api.monsters.getMonsterBySlug, { slug }),
  )

  // Handle monster not found
  if (!monster) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Monster Not Found
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The monster "{slug}" could not be found in the database.
        </p>
        <Link
          to="/monsters"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Return to Monster Search
        </Link>
      </div>
    )
  }

  return <MonsterDetails monster={monster} />
}

/**
 * MonsterDetailsLoading Component
 *
 * Loading skeleton shown while monster data is being fetched.
 * Provides visual feedback and prevents layout shift.
 */
function MonsterDetailsLoading() {
  return (
    <div
      className="w-full space-y-6"
      role="status"
      aria-label="Loading monster details"
    >
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-3/4 max-w-md animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-1/4 max-w-xs animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Traits skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">Loading monster details...</span>
    </div>
  )
}
