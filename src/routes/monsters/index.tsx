import { Suspense, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { MonsterTable } from '~/components/monsters/MonsterTable'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'

export const Route = createFileRoute('/monsters/')({
  component: MonstersPage,
})

/**
 * MonstersPage Component
 *
 * Main page component that orchestrates monster search functionality.
 * Uses Suspense boundaries for loading states and integrates debounced
 * search with Convex real-time queries.
 */
function MonstersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Monsters
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Browse and search all monsters in the Shadowdark RPG system. View
          stats, abilities, and special traits.
        </p>
      </div>

      {/* Monster table with Suspense boundary for loading state */}
      <Suspense fallback={<MonsterTableLoading />}>
        <MonsterTableContent />
      </Suspense>
    </div>
  )
}

/**
 * MonsterTableContent Component
 *
 * Handles search state and data fetching for the monster table.
 * Separated from MonstersPage to allow Suspense to handle loading states.
 */
function MonsterTableContent() {
  // Search state - immediate updates for UI responsiveness
  const [searchTerm, setSearchTerm] = useState('')

  // Debounced search term - prevents excessive Convex queries while typing
  // 300ms delay matches the plan specification
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)

  // Fetch monsters with debounced search term
  // Uses Convex + TanStack Query hybrid pattern
  // Pass undefined when search is empty to let backend optimize the query
  const { data: monsters } = useSuspenseQuery(
    convexQuery(api.monsters.searchMonsters, {
      searchTerm: debouncedSearchTerm.trim() || undefined,
    }),
  )

  return (
    <MonsterTable
      monsters={monsters}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    />
  )
}

/**
 * MonsterTableLoading Component
 *
 * Loading skeleton shown while monster data is being fetched.
 * Provides visual feedback and prevents layout shift.
 */
function MonsterTableLoading() {
  return (
    <div
      className="w-full space-y-4"
      role="status"
      aria-label="Loading monsters"
    >
      {/* Search input skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Header skeleton */}
        <div className="flex gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Row skeletons */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-gray-100 px-6 py-4 last:border-b-0 dark:border-gray-800"
          >
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">Loading monster data...</span>
    </div>
  )
}
