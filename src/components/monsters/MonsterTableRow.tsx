/**
 * MonsterTableRow Component
 *
 * Single table row displaying monster statistics.
 * Uses utility formatters for consistent data display.
 * Clickable row that navigates to monster detail page.
 */

import { Link } from '@tanstack/react-router'
import type { Monster } from '~/types/monster'
import {
  formatAlignment,
  formatArmorClass,
  formatHitPoints,
  formatLevel,
  formatMovement,
} from '~/utils/monsterHelpers'

interface MonsterTableRowProps {
  /**
   * Monster data to display
   */
  monster: Monster
}

/**
 * MonsterTableRow - Individual monster row in the table
 *
 * Features:
 * - Displays all key monster stats using utility formatters
 * - Hover state for visual feedback and interactivity
 * - Responsive grid layout (hides columns on mobile)
 * - Semantic table row markup
 * - Type-safe with Monster type from Convex
 *
 * Stats displayed:
 * - Name (always visible)
 * - Level (always visible, formatted)
 * - AC (always visible, formatted with armor type if available)
 * - HP (always visible, formatted)
 * - Alignment (hidden on mobile, formatted to full name)
 * - Movement (hidden on mobile, formatted)
 *
 * @example
 * ```tsx
 * <MonsterTableRow monster={monsterData} />
 * ```
 */
export function MonsterTableRow({ monster }: MonsterTableRowProps) {
  return (
    <Link
      to="/monsters/$slug"
      params={{ slug: monster.slug }}
      className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50 sm:grid-cols-[2fr_1fr_1fr_1fr_1.5fr_1.5fr] dark:border-gray-700 dark:hover:bg-gray-800"
      role="row"
    >
      {/* Name column - always visible */}
      <div
        role="cell"
        className="text-left font-medium text-gray-900 dark:text-gray-100"
      >
        {monster.name}
      </div>

      {/* Level column - always visible */}
      <div role="cell" className="text-center text-gray-700 dark:text-gray-300">
        {formatLevel(monster.level)}
      </div>

      {/* AC column - always visible */}
      <div role="cell" className="text-center text-gray-700 dark:text-gray-300">
        {formatArmorClass(monster.armor_class, monster.armor_type)}
      </div>

      {/* HP column - always visible */}
      <div role="cell" className="text-center text-gray-700 dark:text-gray-300">
        {formatHitPoints(monster.hit_points)}
      </div>

      {/* Alignment column - hidden on mobile, visible on sm+ (640px) */}
      <div
        role="cell"
        className="hidden text-center text-gray-700 sm:block dark:text-gray-300"
      >
        {formatAlignment(monster.alignment)}
      </div>

      {/* Movement column - hidden on mobile, visible on sm+ (640px) */}
      <div
        role="cell"
        className="hidden text-center text-gray-700 sm:block dark:text-gray-300"
      >
        {formatMovement(monster.movement)}
      </div>
    </Link>
  )
}
