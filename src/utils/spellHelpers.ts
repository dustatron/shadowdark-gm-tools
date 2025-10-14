/**
 * Spell Helper Utilities
 *
 * Pure utility functions for formatting and displaying spell data.
 * These functions handle presentation logic for spell properties like
 * tier, classes, range, and duration.
 */

/**
 * Format spell tier for display
 *
 * Converts tier string to ordinal format (1st, 2nd, 3rd, 4th, 5th)
 *
 * @param tier - Tier string ("1" to "5")
 * @returns Formatted tier with ordinal suffix
 *
 * @example
 * formatTier("1") // "1st"
 * formatTier("2") // "2nd"
 * formatTier("3") // "3rd"
 * formatTier("4") // "4th"
 */
export function formatTier(tier: string | null | undefined): string {
  if (!tier) return '—'

  const tierNum = parseInt(tier, 10)
  if (isNaN(tierNum)) return tier

  const suffixes = ['th', 'st', 'nd', 'rd']
  const suffix = tierNum >= 1 && tierNum <= 3 ? suffixes[tierNum] : suffixes[0]

  return `${tierNum}${suffix}`
}

/**
 * Format classes array for display
 *
 * Converts array of class names to a readable string with proper capitalization
 *
 * @param classes - Array of class names (["wizard", "priest"])
 * @returns Formatted class string with capitalized names
 *
 * @example
 * formatClasses(["wizard"]) // "Wizard"
 * formatClasses(["priest"]) // "Priest"
 * formatClasses(["wizard", "priest"]) // "Wizard, Priest"
 */
export function formatClasses(
  classes: string[] | null | undefined,
): string {
  if (!classes || classes.length === 0) return '—'

  return classes
    .map((cls) => cls.charAt(0).toUpperCase() + cls.slice(1).toLowerCase())
    .join(', ')
}

/**
 * Get Tailwind color classes for class badges
 *
 * Returns color classes based on the class name for visual differentiation
 * - Wizard: Blue theme
 * - Priest: Purple theme
 * - Default: Gray theme
 *
 * @param className - Class name ("wizard" or "priest")
 * @returns Tailwind CSS class string for badge styling
 *
 * @example
 * getClassBadgeColor("wizard") // "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
 * getClassBadgeColor("priest") // "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
 */
export function getClassBadgeColor(className: string): string {
  const classMap: Record<string, string> = {
    wizard:
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800',
    priest:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800',
  }

  return (
    classMap[className.toLowerCase()] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
  )
}

/**
 * Format range for display
 *
 * Capitalizes range string for consistent presentation
 *
 * @param range - Range string (e.g., "far", "self", "near")
 * @returns Capitalized range or em dash if missing
 *
 * @example
 * formatRange("far") // "Far"
 * formatRange("self") // "Self"
 * formatRange(null) // "—"
 */
export function formatRange(range: string | null | undefined): string {
  if (!range) return '—'
  return range.charAt(0).toUpperCase() + range.slice(1).toLowerCase()
}

/**
 * Format duration for display
 *
 * Returns duration string as-is or em dash if missing.
 * Durations are already well-formatted in the source data.
 *
 * @param duration - Duration string (e.g., "Focus", "1 day", "5 rounds")
 * @returns Duration string or em dash if missing
 *
 * @example
 * formatDuration("Focus") // "Focus"
 * formatDuration("5 rounds") // "5 rounds"
 * formatDuration(null) // "—"
 */
export function formatDuration(duration: string | null | undefined): string {
  if (!duration) return '—'
  return duration
}

/**
 * Get tier color classes for visual hierarchy
 *
 * Returns color classes based on spell tier for visual differentiation.
 * Higher tiers use more intense colors to indicate power level.
 *
 * @param tier - Tier number (1-5)
 * @returns Tailwind CSS class string for tier styling
 *
 * @example
 * getTierColorClasses(1) // Green - common spells
 * getTierColorClasses(3) // Blue - moderate spells
 * getTierColorClasses(5) // Purple - powerful spells
 */
export function getTierColorClasses(tier: number): string {
  const tierColorMap: Record<number, string> = {
    1: 'text-green-700 dark:text-green-400',
    2: 'text-blue-600 dark:text-blue-400',
    3: 'text-indigo-600 dark:text-indigo-400',
    4: 'text-purple-600 dark:text-purple-400',
    5: 'text-pink-600 dark:text-pink-400',
  }

  return (
    tierColorMap[tier] || 'text-gray-700 dark:text-gray-400'
  )
}
