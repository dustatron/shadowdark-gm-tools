/**
 * Spell types for Shadowdark GM Tools
 *
 * These types provide type-safe interfaces for working with spell data
 * throughout the application. The Spell type is derived from the Convex
 * database schema to ensure consistency between backend and frontend.
 */

import type { Doc } from '../../convex/_generated/dataModel'

/**
 * Spell type derived from Convex database
 *
 * Represents a complete spell entity with all properties.
 * Includes system fields (_id, _creationTime) from Convex.
 */
export type Spell = Doc<'spells'>

/**
 * Spell table row data
 *
 * Subset of spell data optimized for display in the spell table.
 * Includes only the fields shown in the table view for performance.
 */
export interface SpellTableRow {
  _id: Spell['_id']
  name: string
  tier: string
  classes: string[]
  range: string
  duration: string
}

/**
 * Spell tier type (1-5)
 */
export type SpellTier = '1' | '2' | '3' | '4' | '5'

/**
 * Spell class type
 */
export type SpellClass = 'wizard' | 'priest'

/**
 * Type guard to check if a string is a valid spell tier
 *
 * @param value - String to check
 * @returns True if value is a valid SpellTier
 */
export function isSpellTier(value: string): value is SpellTier {
  return ['1', '2', '3', '4', '5'].includes(value)
}

/**
 * Type guard to check if a string is a valid spell class
 *
 * @param value - String to check
 * @returns True if value is a valid SpellClass
 */
export function isSpellClass(value: string): value is SpellClass {
  return value === 'wizard' || value === 'priest'
}

/**
 * Spell search filters
 *
 * Defines available filter options for searching spells.
 * Currently supports name search; future filters can be added here.
 */
export interface SpellSearchFilters {
  searchTerm?: string
  tier?: SpellTier
  classes?: SpellClass[]
}
