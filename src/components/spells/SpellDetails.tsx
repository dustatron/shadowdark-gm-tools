/**
 * SpellDetails Component
 *
 * Displays the full details of a single spell including:
 * - Name, tier, and classes
 * - Full spell description
 * - Casting information (range, duration, DC)
 */

import type { Spell } from '~/types/spell'
import {
  formatTier,
  formatRange,
  formatDuration,
  getClassBadgeColor,
  getTierColorClasses,
} from '~/utils/spellHelpers'

interface SpellDetailsProps {
  spell: Spell
}

export function SpellDetails({ spell }: SpellDetailsProps) {
  const tierNumber = parseInt(spell.tier, 10)
  const castingDC = 10 + tierNumber

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3 dark:bg-white bg-black py-2 pl-4 flex-wrap">
          <h1 className="text-4xl font-bold dark:text-gray-900 text-gray-100">
            {spell.name}
          </h1>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getTierBadgeColor(tierNumber)}`}
          >
            Tier {formatTier(spell.tier)}
          </span>
          {spell.classes.map((className) => (
            <span
              key={className}
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getClassBadgeColor(className)}`}
            >
              {className.charAt(0).toUpperCase() + className.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Description - Primary Content */}
      <div>
        <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Description:
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xl whitespace-pre-wrap">
          {spell.description}
        </p>
      </div>

      {/* Casting Information */}
      <div>
        <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Casting Information:
        </h2>
        <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Casting DC */}
          <div className="border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Casting DC
            </div>
            <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {castingDC}
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              (10 + tier)
            </div>
          </div>

          {/* Tier */}
          <div className="border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tier
            </div>
            <div
              className={`mt-1 text-3xl font-bold ${getTierColorClasses(tierNumber)}`}
            >
              {formatTier(spell.tier)}
            </div>
          </div>

          {/* Range */}
          <div className="border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Range
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatRange(spell.range)}
            </div>
            {getRangeDistance(spell.range) && (
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                {getRangeDistance(spell.range)}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="border-2 border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Duration
            </div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(spell.duration)}
            </div>
            {spell.duration.toLowerCase() === 'focus' && (
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                (Concentration)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Classes That Can Cast */}
      <div>
        <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Available To:
        </h2>
        <div className="flex gap-2 flex-wrap">
          {spell.classes.map((className) => (
            <span
              key={className}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-base font-medium ${getClassBadgeColor(className)}`}
            >
              {className.charAt(0).toUpperCase() + className.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Get tier badge color classes
 * Similar to getTierColorClasses but for badge backgrounds
 */
function getTierBadgeColor(tier: number): string {
  const tierColorMap: Record<number, string> = {
    1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    2: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    3: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    4: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    5: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  }

  return (
    tierColorMap[tier] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  )
}

/**
 * Get range distance in feet for common ranges
 */
function getRangeDistance(range: string | null | undefined): string | null {
  if (!range) return null

  const rangeMap: Record<string, string> = {
    self: '',
    touch: '',
    near: '(30 ft)',
    far: '(120 ft)',
  }

  return rangeMap[range.toLowerCase()] || null
}
