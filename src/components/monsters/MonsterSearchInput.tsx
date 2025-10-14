/**
 * MonsterSearchInput Component
 *
 * Controlled search input with clear functionality for filtering monsters.
 * Provides accessible search experience with proper ARIA labels and keyboard support.
 */

import { useState } from 'react'

interface MonsterSearchInputProps {
  /**
   * Current search value
   */
  value: string

  /**
   * Callback fired when search value changes
   */
  onChange: (value: string) => void

  /**
   * Optional placeholder text
   * @default "Search monsters..."
   */
  placeholder?: string
}

/**
 * MonsterSearchInput - Search input field with clear button
 *
 * Features:
 * - Controlled input with immediate updates
 * - Clear button (X) appears when input has value
 * - Accessible with proper ARIA labels
 * - Keyboard navigation support (Escape to clear)
 * - Focus management after clearing
 * - Responsive design with TailwindCSS 4
 *
 * @example
 * ```tsx
 * <MonsterSearchInput
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search by name..."
 * />
 * ```
 */
export function MonsterSearchInput({
  value,
  onChange,
  placeholder = 'Search monsters...',
}: MonsterSearchInputProps) {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)

  /**
   * Handle clear button click
   * Clears the search value and refocuses the input
   */
  const handleClear = () => {
    onChange('')
    inputRef?.focus()
  }

  /**
   * Handle keyboard shortcuts
   * - Escape: Clear search and keep focus
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      handleClear()
      e.preventDefault()
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Label for screen readers */}
      <label htmlFor="monster-search" className="sr-only">
        Search monsters by name
      </label>

      {/* Search input field */}
      <input
        ref={setInputRef}
        id="monster-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 placeholder-gray-500 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        aria-describedby="search-hint"
      />

      {/* Clear button - only visible when input has value */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* Hidden hint for screen readers */}
      <span id="search-hint" className="sr-only">
        Type to search monsters by name. Press Escape to clear.
      </span>
    </div>
  )
}
