/**
 * MonsterTable Component
 *
 * Container component that orchestrates search input and monster display.
 * Handles empty states and composes all sub-components.
 */

import type { Monster } from '~/types/monster'
import { MonsterSearchInput } from './MonsterSearchInput'
import { MonsterTableHeader } from './MonsterTableHeader'
import { MonsterTableRow } from './MonsterTableRow'

interface MonsterTableProps {
  /**
   * Array of monsters to display
   */
  monsters: Monster[]

  /**
   * Current search term
   */
  searchTerm: string

  /**
   * Callback fired when search term changes
   */
  onSearchChange: (value: string) => void
}

/**
 * MonsterTable - Complete monster table with search
 *
 * Features:
 * - Integrates search input with table display
 * - Shows count of filtered results
 * - Handles empty states ("No monsters found")
 * - Responsive layout for all screen sizes
 * - Semantic table structure with proper ARIA roles
 * - Accessible to keyboard and screen reader users
 *
 * Component Composition:
 * - MonsterSearchInput: Search field with clear button
 * - MonsterTableHeader: Column headers
 * - MonsterTableRow[]: List of monster rows
 *
 * @example
 * ```tsx
 * <MonsterTable
 *   monsters={filteredMonsters}
 *   searchTerm={searchTerm}
 *   onSearchChange={setSearchTerm}
 * />
 * ```
 */
export function MonsterTable({
  monsters,
  searchTerm,
  onSearchChange,
}: MonsterTableProps) {
  const monsterCount = monsters.length
  const hasSearch = searchTerm.trim().length > 0

  return (
    <div className="w-full space-y-4">
      {/* Search input section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <MonsterSearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search monsters by name..."
        />

        {/* Results count - accessible announcement */}
        <div
          className="text-sm text-gray-600 dark:text-gray-400"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {hasSearch ? (
            <span>
              Found <strong className="font-semibold">{monsterCount}</strong>{' '}
              {monsterCount === 1 ? 'monster' : 'monsters'}
            </span>
          ) : (
            <span>
              Showing <strong className="font-semibold">{monsterCount}</strong>{' '}
              {monsterCount === 1 ? 'monster' : 'monsters'}
            </span>
          )}
        </div>
      </div>

      {/* Table section */}
      {monsterCount > 0 ? (
        <div
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          role="table"
          aria-label="Monster statistics table"
          aria-rowcount={monsterCount + 1}
        >
          {/* Table header */}
          <MonsterTableHeader />

          {/* Table rows */}
          <div role="rowgroup">
            {monsters.map((monster) => (
              <MonsterTableRow key={monster._id} monster={monster} />
            ))}
          </div>
        </div>
      ) : (
        // Empty state - no monsters found
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-md space-y-3">
            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                No monsters found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {hasSearch ? (
                  <>
                    No monsters match "<strong>{searchTerm}</strong>". Try a
                    different search term or clear the search to see all
                    monsters.
                  </>
                ) : (
                  'No monsters are available in the database.'
                )}
              </p>
            </div>

            {/* Clear search button - only show if searching */}
            {hasSearch && (
              <button
                onClick={() => onSearchChange('')}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
