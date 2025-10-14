/**
 * Monster types for Shadowdark GM Tools
 *
 * These types provide type-safe interfaces for working with monster data
 * throughout the application. The Monster type is derived from the Convex
 * database schema to ensure consistency between backend and frontend.
 */

import type { Doc } from '../../convex/_generated/dataModel'

/**
 * Monster type derived from Convex database
 *
 * Represents a complete monster entity with all stats and abilities.
 * Includes system fields (_id, _creationTime) from Convex.
 */
export type Monster = Doc<'monsters'>

/**
 * Monster trait interface
 *
 * Represents special abilities, features, or characteristics of a monster.
 * Traits include named abilities with detailed descriptions of their effects.
 *
 * @example
 * {
 *   name: "Curse",
 *   description: "DC 15 CON or target gains a magical curse"
 * }
 */
export interface MonsterTrait {
  name: string
  description: string
}

/**
 * Monster table row data
 *
 * Subset of monster data optimized for display in the monster table.
 * Includes only the fields shown in the table view for performance.
 */
export interface MonsterTableRow {
  _id: Monster['_id']
  name: string
  level: number
  armor_class: number
  hit_points: number
  alignment: string
  movement: string
}

/**
 * Alignment type
 *
 * Valid alignment values for monsters in Shadowdark RPG.
 * - L: Lawful (follows order and rules)
 * - C: Chaotic (embraces chaos and disorder)
 * - N: Neutral (balanced or unconcerned)
 */
export type Alignment = 'L' | 'C' | 'N'

/**
 * Type guard to check if a string is a valid alignment
 *
 * @param value - String to check
 * @returns True if value is a valid Alignment
 */
export function isAlignment(value: string): value is Alignment {
  return value === 'L' || value === 'C' || value === 'N'
}

/**
 * Monster search filters
 *
 * Defines available filter options for searching monsters.
 * Currently supports name search; future filters can be added here.
 */
export interface MonsterSearchFilters {
  searchTerm?: string
}
