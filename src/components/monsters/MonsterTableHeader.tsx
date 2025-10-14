/**
 * MonsterTableHeader Component
 *
 * Table header row displaying column labels for the monster table.
 * Uses responsive grid layout that matches MonsterTableRow layout.
 */

/**
 * MonsterTableHeader - Header row for monster table
 *
 * Features:
 * - Responsive grid layout matching table rows
 * - Hides Alignment and Movement columns on mobile (<640px)
 * - Semantic table header markup for accessibility
 * - TailwindCSS 4 styling with proper alignment
 *
 * Columns displayed:
 * - Name (always visible)
 * - Level (always visible)
 * - AC (always visible)
 * - HP (always visible)
 * - Alignment (hidden on mobile, visible 640px+)
 * - Movement (hidden on mobile, visible 640px+)
 *
 * @example
 * ```tsx
 * <MonsterTableHeader />
 * ```
 */
export function MonsterTableHeader() {
  return (
    <div
      className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b-2 border-gray-300 bg-gray-50 px-4 py-3 font-semibold text-gray-700 sm:grid-cols-[2fr_1fr_1fr_1fr_1.5fr_1.5fr] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      role="row"
    >
      {/* Name column - always visible */}
      <div role="columnheader" className="text-left">
        Name
      </div>

      {/* Level column - always visible */}
      <div role="columnheader" className="text-center">
        Level
      </div>

      {/* AC column - always visible */}
      <div role="columnheader" className="text-center">
        AC
      </div>

      {/* HP column - always visible */}
      <div role="columnheader" className="text-center">
        HP
      </div>

      {/* Alignment column - hidden on mobile, visible on sm+ (640px) */}
      <div role="columnheader" className="hidden text-center sm:block">
        Alignment
      </div>

      {/* Movement column - hidden on mobile, visible on sm+ (640px) */}
      <div role="columnheader" className="hidden text-center sm:block">
        Movement
      </div>
    </div>
  )
}
