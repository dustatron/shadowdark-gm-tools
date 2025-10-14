/**
 * Monster helper utilities for Shadowdark GM Tools
 *
 * Pure functions for formatting and displaying monster data.
 * All functions handle edge cases (null, undefined, empty strings)
 * and are safe to use in UI components.
 */

import type { Alignment } from '~/types/monster'

/**
 * Format alignment code to full name
 *
 * Converts single-letter alignment codes to readable names.
 * Handles invalid or missing values gracefully.
 *
 * @param alignment - Alignment code (L, C, or N)
 * @returns Full alignment name or "Unknown" if invalid
 *
 * @example
 * formatAlignment("L") // "Lawful"
 * formatAlignment("C") // "Chaotic"
 * formatAlignment("N") // "Neutral"
 * formatAlignment("") // "Unknown"
 * formatAlignment(null) // "Unknown"
 */
export function formatAlignment(alignment: string | null | undefined): string {
  if (!alignment || typeof alignment !== 'string') {
    return 'Unknown'
  }

  const normalized = alignment.trim().toUpperCase()

  switch (normalized) {
    case 'L':
      return 'Lawful'
    case 'C':
      return 'Chaotic'
    case 'N':
      return 'Neutral'
    default:
      return 'Unknown'
  }
}

/**
 * Format movement string for display
 *
 * Cleans and standardizes movement descriptions for consistent display.
 * Capitalizes first letter and removes extra whitespace.
 *
 * @param movement - Raw movement string from database
 * @returns Formatted movement string or "—" if missing
 *
 * @example
 * formatMovement("near (swim)") // "Near (swim)"
 * formatMovement("double near (fly)") // "Double near (fly)"
 * formatMovement("  far  ") // "Far"
 * formatMovement("") // "—"
 * formatMovement(null) // "—"
 */
export function formatMovement(movement: string | null | undefined): string {
  if (!movement || typeof movement !== 'string') {
    return '—'
  }

  const trimmed = movement.trim()

  if (trimmed === '') {
    return '—'
  }

  // Capitalize first letter and preserve the rest
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

/**
 * Calculate ability score modifier from score value
 *
 * Converts a raw ability score modifier to the standard D&D format.
 * In Shadowdark, ability scores are already modifiers (not 3-18 values).
 *
 * @param score - Ability score modifier
 * @returns Formatted modifier string (e.g., "+3", "-1", "+0")
 *
 * @example
 * calculateModifier(3) // "+3"
 * calculateModifier(-1) // "-1"
 * calculateModifier(0) // "+0"
 */
function calculateModifier(score: number): string {
  if (score > 0) {
    return `+${score}`
  } else if (score < 0) {
    return `${score}`
  } else {
    return '+0'
  }
}

/**
 * Format ability score with modifier
 *
 * Displays ability score in the standard format with sign.
 * Handles invalid values by returning a placeholder.
 *
 * @param score - Ability score modifier (e.g., STR, DEX, etc.)
 * @returns Formatted string with +/- prefix or "—" if invalid
 *
 * @example
 * formatAbilityScore(3) // "+3"
 * formatAbilityScore(-1) // "-1"
 * formatAbilityScore(0) // "+0"
 * formatAbilityScore(null) // "—"
 * formatAbilityScore(undefined) // "—"
 */
export function formatAbilityScore(score: number | null | undefined): string {
  if (score === null || score === undefined || typeof score !== 'number') {
    return '—'
  }

  if (!Number.isFinite(score)) {
    return '—'
  }

  return calculateModifier(score)
}

/**
 * Format armor class with armor type
 *
 * Displays AC value with optional armor type in parentheses.
 * Useful for showing both numerical AC and the source of protection.
 *
 * @param ac - Armor class value
 * @param armorType - Optional armor type description
 * @returns Formatted AC string
 *
 * @example
 * formatArmorClass(16, "plate mail + shield") // "16 (plate mail + shield)"
 * formatArmorClass(12, null) // "12"
 * formatArmorClass(null, null) // "—"
 */
export function formatArmorClass(
  ac: number | null | undefined,
  armorType?: string | null,
): string {
  if (ac === null || ac === undefined || typeof ac !== 'number') {
    return '—'
  }

  const baseAC = ac.toString()

  if (armorType && typeof armorType === 'string' && armorType.trim() !== '') {
    return `${baseAC} (${armorType.trim()})`
  }

  return baseAC
}

/**
 * Format hit points for display
 *
 * Ensures HP is displayed as a whole number or placeholder.
 * Handles edge cases where HP might be missing or invalid.
 *
 * @param hp - Hit points value
 * @returns Formatted HP string or "—" if invalid
 *
 * @example
 * formatHitPoints(39) // "39"
 * formatHitPoints(4) // "4"
 * formatHitPoints(null) // "—"
 */
export function formatHitPoints(hp: number | null | undefined): string {
  if (hp === null || hp === undefined || typeof hp !== 'number') {
    return '—'
  }

  if (!Number.isFinite(hp) || hp < 0) {
    return '—'
  }

  return Math.floor(hp).toString()
}

/**
 * Format monster level for display
 *
 * Displays monster level as a whole number.
 * Handles invalid values gracefully.
 *
 * @param level - Monster level value
 * @returns Formatted level string or "—" if invalid
 *
 * @example
 * formatLevel(8) // "8"
 * formatLevel(1) // "1"
 * formatLevel(null) // "—"
 */
export function formatLevel(level: number | null | undefined): string {
  if (level === null || level === undefined || typeof level !== 'number') {
    return '—'
  }

  if (!Number.isFinite(level) || level < 0) {
    return '—'
  }

  return Math.floor(level).toString()
}

/**
 * Truncate long text with ellipsis
 *
 * Utility for truncating descriptions or long strings for table display.
 * Ensures text doesn't exceed a maximum length.
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation (default: 100)
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * truncateText("A very long description...", 20) // "A very long descrip..."
 * truncateText("Short", 20) // "Short"
 * truncateText(null, 20) // ""
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number = 100,
): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const trimmed = text.trim()

  if (trimmed.length <= maxLength) {
    return trimmed
  }

  return trimmed.slice(0, maxLength - 3) + '...'
}

/**
 * Get alignment abbreviation from full name
 *
 * Reverse of formatAlignment - converts full name back to code.
 * Useful for filters or search functionality.
 *
 * @param alignmentName - Full alignment name
 * @returns Single-letter alignment code or null if invalid
 *
 * @example
 * getAlignmentCode("Lawful") // "L"
 * getAlignmentCode("Chaotic") // "C"
 * getAlignmentCode("Neutral") // "N"
 * getAlignmentCode("Invalid") // null
 */
export function getAlignmentCode(
  alignmentName: string | null | undefined,
): Alignment | null {
  if (!alignmentName || typeof alignmentName !== 'string') {
    return null
  }

  const normalized = alignmentName.trim().toLowerCase()

  switch (normalized) {
    case 'lawful':
      return 'L'
    case 'chaotic':
      return 'C'
    case 'neutral':
      return 'N'
    default:
      return null
  }
}
