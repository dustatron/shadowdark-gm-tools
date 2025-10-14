/**
 * SpellTable Component
 *
 * Container component that orchestrates search input and spell display.
 * Handles empty states and composes all sub-components.
 */

import type { Spell } from '~/types/spell'
import { SpellSearchInput } from './SpellSearchInput'
import { SpellTableHeader } from './SpellTableHeader'
import { SpellTableRow } from './SpellTableRow'

interface SpellTableProps {
  /**
   * Array of spells to display
   */
  spells: Spell[]

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
 * SpellTable - Complete spell table with search
 *
 * Features:
 * - Integrates search input with table display
 * - Shows count of filtered results
 * - Handles empty states ("No spells found")
 * - Responsive layout for all screen sizes
 * - Semantic table structure with proper ARIA roles
 * - Accessible to keyboard and screen reader users
 *
 * Component Composition:
 * - SpellSearchInput: Search field with clear button
 * - SpellTableHeader: Column headers
 * - SpellTableRow[]: List of spell rows
 *
 * @example
 * ```tsx
 * <SpellTable
 *   spells={filteredSpells}
 *   searchTerm={searchTerm}
 *   onSearchChange={setSearchTerm}
 * />
 * ```
 */
export function SpellTable({
  spells,
  searchTerm,
  onSearchChange,
}: SpellTableProps) {
  const spellCount = spells.length
  const hasSearch = searchTerm.trim().length > 0

  return (
    <div className="w-full space-y-4">
      {/* Search input section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SpellSearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search spells by name..."
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
              Found <strong className="font-semibold">{spellCount}</strong>{' '}
              {spellCount === 1 ? 'spell' : 'spells'}
            </span>
          ) : (
            <span>
              Showing <strong className="font-semibold">{spellCount}</strong>{' '}
              {spellCount === 1 ? 'spell' : 'spells'}
            </span>
          )}
        </div>
      </div>

      {/* Table section */}
      {spellCount > 0 ? (
        <div
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          role="table"
          aria-label="Spell statistics table"
          aria-rowcount={spellCount + 1}
        >
          {/* Table header */}
          <SpellTableHeader />

          {/* Table rows */}
          <div role="rowgroup">
            {spells.map((spell) => (
              <SpellTableRow key={spell._id} spell={spell} />
            ))}
          </div>
        </div>
      ) : (
        // Empty state - no spells found
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
                No spells found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {hasSearch ? (
                  <>
                    No spells match "<strong>{searchTerm}</strong>". Try a
                    different search term or clear the search to see all spells.
                  </>
                ) : (
                  'No spells are available in the database.'
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
