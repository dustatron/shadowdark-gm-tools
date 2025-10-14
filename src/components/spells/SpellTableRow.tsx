/**
 * SpellTableRow Component
 *
 * Single table row displaying spell information.
 * Uses utility formatters for consistent data display and badge components for classes.
 */

import type { Spell } from '~/types/spell'
import {
  formatTier,
  formatRange,
  formatDuration,
  getClassBadgeColor,
  getTierColorClasses,
} from '~/utils/spellHelpers'

interface SpellTableRowProps {
  /**
   * Spell data to display
   */
  spell: Spell
}

/**
 * SpellTableRow - Individual spell row in the table
 *
 * Features:
 * - Displays all key spell properties using utility formatters
 * - Class badges with color coding (wizard = blue, priest = purple)
 * - Tier with color hierarchy (1=green to 5=pink)
 * - Hover state for visual feedback and interactivity
 * - Responsive grid layout (hides Duration on mobile)
 * - Semantic table row markup
 * - Type-safe with Spell type from Convex
 *
 * Properties displayed:
 * - Name (always visible, left-aligned)
 * - Tier (always visible, center-aligned, color-coded)
 * - Classes (always visible, center-aligned, badge pills)
 * - Range (always visible, center-aligned)
 * - Duration (hidden on mobile, center-aligned)
 *
 * @example
 * ```tsx
 * <SpellTableRow spell={spellData} />
 * ```
 */
export function SpellTableRow({ spell }: SpellTableRowProps) {
  // Parse tier for color coding
  const tierNum = parseInt(spell.tier, 10)

  return (
    <div
      className="grid grid-cols-[2fr_0.75fr_1.5fr_1fr] gap-4 border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50 sm:grid-cols-[2fr_0.75fr_1.5fr_1fr_1.25fr] dark:border-gray-700 dark:hover:bg-gray-800"
      role="row"
    >
      {/* Name column - always visible */}
      <div
        role="cell"
        className="text-left font-medium text-gray-900 dark:text-gray-100"
      >
        {spell.name}
      </div>

      {/* Tier column - always visible, color-coded by tier level */}
      <div
        role="cell"
        className={`text-center font-semibold ${getTierColorClasses(tierNum)}`}
      >
        {formatTier(spell.tier)}
      </div>

      {/* Classes column - always visible, badge pills */}
      <div role="cell" className="flex items-center justify-center gap-1.5">
        {spell.classes && spell.classes.length > 0 ? (
          spell.classes.map((cls) => (
            <span
              key={cls}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getClassBadgeColor(cls)}`}
            >
              {cls.charAt(0).toUpperCase() + cls.slice(1)}
            </span>
          ))
        ) : (
          <span className="text-gray-400 dark:text-gray-500">—</span>
        )}
      </div>

      {/* Range column - always visible */}
      <div role="cell" className="text-center text-gray-700 dark:text-gray-300">
        {formatRange(spell.range)}
      </div>

      {/* Duration column - hidden on mobile, visible on sm+ (640px) */}
      <div
        role="cell"
        className="hidden text-center text-gray-700 sm:block dark:text-gray-300"
      >
        {formatDuration(spell.duration)}
      </div>
    </div>
  )
}
