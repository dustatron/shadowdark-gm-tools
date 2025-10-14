/**
 * SpellTableHeader Component
 *
 * Table header row displaying column labels for the spell table.
 * Uses responsive grid layout that matches SpellTableRow layout.
 */

/**
 * SpellTableHeader - Header row for spell table
 *
 * Features:
 * - Responsive grid layout matching table rows
 * - Hides Duration column on mobile (<640px)
 * - Semantic table header markup for accessibility
 * - TailwindCSS 4 styling with proper alignment
 *
 * Columns displayed:
 * - Name (always visible, left-aligned)
 * - Tier (always visible, center-aligned)
 * - Classes (always visible, center-aligned)
 * - Range (always visible, center-aligned)
 * - Duration (hidden on mobile, visible 640px+, center-aligned)
 *
 * Grid Layout:
 * - Mobile: grid-cols-[2fr_0.75fr_1.5fr_1fr] (4 columns)
 * - Desktop: sm:grid-cols-[2fr_0.75fr_1.5fr_1fr_1.25fr] (5 columns)
 *
 * @example
 * ```tsx
 * <SpellTableHeader />
 * ```
 */
export function SpellTableHeader() {
  return (
    <div
      className="grid grid-cols-[2fr_0.75fr_1.5fr_1fr] gap-4 border-b-2 border-gray-300 bg-gray-50 px-4 py-3 font-semibold text-gray-700 sm:grid-cols-[2fr_0.75fr_1.5fr_1fr_1.25fr] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      role="row"
    >
      {/* Name column - always visible, left-aligned */}
      <div role="columnheader" className="text-left">
        Name
      </div>

      {/* Tier column - always visible, center-aligned */}
      <div role="columnheader" className="text-center">
        Tier
      </div>

      {/* Classes column - always visible, center-aligned */}
      <div role="columnheader" className="text-center">
        Classes
      </div>

      {/* Range column - always visible, center-aligned */}
      <div role="columnheader" className="text-center">
        Range
      </div>

      {/* Duration column - hidden on mobile, visible on sm+ (640px) */}
      <div role="columnheader" className="hidden text-center sm:block">
        Duration
      </div>
    </div>
  )
}
