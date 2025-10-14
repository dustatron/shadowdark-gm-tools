/**
 * Spells Route - Spell Search and Browse Page
 *
 * This page provides a searchable, sortable table of all spells in the
 * Shadowdark RPG system. Features include:
 * - Real-time search with debouncing (300ms)
 * - Responsive table layout
 * - Loading states with Suspense
 * - Empty state handling
 * - Accessible keyboard navigation
 * - Class badges for visual differentiation
 * - Tier color coding for power level indication
 */

import { Suspense, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../convex/_generated/api'
import { SpellTable } from '~/components/spells/SpellTable'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'

export const Route = createFileRoute('/spells/')({
  component: SpellsPage,
})

/**
 * SpellsPage Component
 *
 * Main page component that orchestrates spell search functionality.
 * Uses Suspense boundaries for loading states and integrates debounced
 * search with Convex real-time queries.
 */
function SpellsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Spells
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Browse and search all spells in the Shadowdark RPG system. View
          spell tiers, classes, range, duration, and effects.
        </p>
      </div>

      {/* Spell table with Suspense boundary for loading state */}
      <Suspense fallback={<SpellTableLoading />}>
        <SpellTableContent />
      </Suspense>
    </div>
  )
}

/**
 * SpellTableContent Component
 *
 * Handles search state and data fetching for the spell table.
 * Separated from SpellsPage to allow Suspense to handle loading states.
 */
function SpellTableContent() {
  // Search state - immediate updates for UI responsiveness
  const [searchTerm, setSearchTerm] = useState('')

  // Debounced search term - prevents excessive Convex queries while typing
  // 300ms delay matches the plan specification
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)

  // Fetch spells with debounced search term
  // Uses Convex + TanStack Query hybrid pattern
  // Pass undefined when search is empty to let backend optimize the query
  const { data: spells } = useSuspenseQuery(
    convexQuery(api.spells.searchSpells, {
      searchTerm: debouncedSearchTerm.trim() || undefined,
    }),
  )

  return (
    <SpellTable
      spells={spells}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    />
  )
}

/**
 * SpellTableLoading Component
 *
 * Loading skeleton shown while spell data is being fetched.
 * Provides visual feedback and prevents layout shift.
 */
function SpellTableLoading() {
  return (
    <div
      className="w-full space-y-4"
      role="status"
      aria-label="Loading spells"
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
          <div className="h-5 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-5 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Row skeletons */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-gray-100 px-6 py-4 last:border-b-0 dark:border-gray-800"
          >
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">Loading spell data...</span>
    </div>
  )
}
