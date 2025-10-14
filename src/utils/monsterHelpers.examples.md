# Monster Helper Functions - Usage Examples

This document demonstrates how to use the monster utility functions throughout the application.

## Import Functions

```typescript
import {
  formatAlignment,
  formatMovement,
  formatAbilityScore,
  formatArmorClass,
  formatHitPoints,
  formatLevel,
  truncateText,
  getAlignmentCode,
} from '~/utils/monsterHelpers'
```

## Function Examples

### formatAlignment()

Convert single-letter alignment codes to readable names.

```typescript
// Basic usage
formatAlignment('L') // "Lawful"
formatAlignment('C') // "Chaotic"
formatAlignment('N') // "Neutral"

// Edge cases
formatAlignment('') // "Unknown"
formatAlignment(null) // "Unknown"
formatAlignment(undefined) // "Unknown"
formatAlignment('X') // "Unknown" (invalid code)

// Case insensitive
formatAlignment('l') // "Lawful"
formatAlignment('  c  ') // "Chaotic" (handles whitespace)
```

**Use Cases:**

- Display alignment in monster table rows
- Filter labels and badges
- Monster detail pages

---

### formatMovement()

Clean and capitalize movement descriptions.

```typescript
// Basic usage
formatMovement('near (swim)') // "Near (swim)"
formatMovement('double near (fly)') // "Double near (fly)"
formatMovement('far') // "Far"

// Edge cases
formatMovement('') // "—"
formatMovement(null) // "—"
formatMovement(undefined) // "—"
formatMovement('  near  ') // "Near" (trims whitespace)
```

**Use Cases:**

- Display movement in table columns
- Combat reference cards
- Monster comparison views

---

### formatAbilityScore()

Display ability score modifiers with +/- signs.

```typescript
// Positive modifiers
formatAbilityScore(3) // "+3"
formatAbilityScore(1) // "+1"

// Negative modifiers
formatAbilityScore(-1) // "-1"
formatAbilityScore(-4) // "-4"

// Zero
formatAbilityScore(0) // "+0"

// Edge cases
formatAbilityScore(null) // "—"
formatAbilityScore(undefined) // "—"
formatAbilityScore(NaN) // "—"
formatAbilityScore(Infinity) // "—"
```

**Use Cases:**

- Display ability scores in stat blocks
- Quick reference tables
- Character vs. monster comparisons

---

### formatArmorClass()

Display AC with optional armor type description.

```typescript
// With armor type
formatArmorClass(16, 'plate mail + shield') // "16 (plate mail + shield)"
formatArmorClass(14, 'leather armor') // "14 (leather armor)"

// Without armor type
formatArmorClass(12, null) // "12"
formatArmorClass(10) // "10"

// Edge cases
formatArmorClass(null, null) // "—"
formatArmorClass(15, '') // "15" (empty string ignored)
formatArmorClass(13, '  ') // "13" (whitespace ignored)
```

**Use Cases:**

- Monster table AC column
- Detailed stat blocks
- Combat reference sheets

---

### formatHitPoints()

Display hit points as whole numbers.

```typescript
// Basic usage
formatHitPoints(39) // "39"
formatHitPoints(4) // "4"
formatHitPoints(100) // "100"

// Edge cases
formatHitPoints(null) // "—"
formatHitPoints(undefined) // "—"
formatHitPoints(-5) // "—" (negative not allowed)
formatHitPoints(3.7) // "3" (rounds down)
formatHitPoints(NaN) // "—"
```

**Use Cases:**

- HP column in monster tables
- Combat tracking displays
- Health bars or indicators

---

### formatLevel()

Display monster level as a whole number.

```typescript
// Basic usage
formatLevel(8) // "8"
formatLevel(1) // "1"
formatLevel(11) // "11"

// Edge cases
formatLevel(null) // "—"
formatLevel(undefined) // "—"
formatLevel(-2) // "—" (negative not allowed)
formatLevel(5.9) // "5" (rounds down)
```

**Use Cases:**

- Level column in tables
- Encounter difficulty calculations
- Monster filtering/sorting

---

### truncateText()

Truncate long descriptions with ellipsis.

```typescript
// Basic usage
const longDesc =
  'Enormous, antediluvian catfish covered in slime and tentacles. They hate all intelligent beings.'
truncateText(longDesc, 50) // "Enormous, antediluvian catfish covered in slime..."
truncateText(longDesc, 30) // "Enormous, antediluvian catf..."

// Short text (no truncation needed)
truncateText('Short description', 50) // "Short description"

// Default max length (100)
truncateText(longDesc) // Full text if under 100 chars

// Edge cases
truncateText(null) // ""
truncateText('') // ""
truncateText('  Test  ', 20) // "Test" (trims whitespace)
```

**Use Cases:**

- Preview descriptions in table rows
- Card layouts with limited space
- Mobile responsive views

---

### getAlignmentCode()

Convert full alignment name back to single-letter code.

```typescript
// Basic usage
getAlignmentCode('Lawful') // "L"
getAlignmentCode('Chaotic') // "C"
getAlignmentCode('Neutral') // "N"

// Case insensitive
getAlignmentCode('lawful') // "L"
getAlignmentCode('CHAOTIC') // "C"

// Edge cases
getAlignmentCode('Invalid') // null
getAlignmentCode('') // null
getAlignmentCode(null) // null
```

**Use Cases:**

- Search filters (convert display values to query values)
- Form inputs
- Data transformation/normalization

---

## Complete Component Example

Here's how to use multiple helper functions in a monster table row component:

```typescript
import type { Monster } from "~/types/monster";
import {
  formatAlignment,
  formatMovement,
  formatAbilityScore,
  formatArmorClass,
  formatHitPoints,
  formatLevel,
} from "~/utils/monsterHelpers";

interface MonsterTableRowProps {
  monster: Monster;
}

export function MonsterTableRow({ monster }: MonsterTableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 font-medium">{monster.name}</td>
      <td className="px-4 py-2 text-center">{formatLevel(monster.level)}</td>
      <td className="px-4 py-2 text-center">
        {formatArmorClass(monster.armor_class, monster.armor_type)}
      </td>
      <td className="px-4 py-2 text-center">
        {formatHitPoints(monster.hit_points)}
      </td>
      <td className="px-4 py-2 hidden sm:table-cell">
        {formatAlignment(monster.alignment)}
      </td>
      <td className="px-4 py-2 hidden md:table-cell">
        {formatMovement(monster.movement)}
      </td>
      <td className="px-4 py-2 hidden lg:table-cell">
        <div className="flex gap-2 text-xs">
          <span>STR {formatAbilityScore(monster.strength)}</span>
          <span>DEX {formatAbilityScore(monster.dexterity)}</span>
          <span>CON {formatAbilityScore(monster.constitution)}</span>
        </div>
      </td>
    </tr>
  );
}
```

## Testing Examples

Example test cases for the utility functions:

```typescript
import { describe, it, expect } from 'vitest'
import {
  formatAlignment,
  formatMovement,
  formatAbilityScore,
} from './monsterHelpers'

describe('formatAlignment', () => {
  it('formats valid alignments', () => {
    expect(formatAlignment('L')).toBe('Lawful')
    expect(formatAlignment('C')).toBe('Chaotic')
    expect(formatAlignment('N')).toBe('Neutral')
  })

  it('handles invalid inputs', () => {
    expect(formatAlignment(null)).toBe('Unknown')
    expect(formatAlignment('')).toBe('Unknown')
    expect(formatAlignment('X')).toBe('Unknown')
  })
})

describe('formatAbilityScore', () => {
  it('formats positive scores', () => {
    expect(formatAbilityScore(3)).toBe('+3')
  })

  it('formats negative scores', () => {
    expect(formatAbilityScore(-2)).toBe('-2')
  })

  it('formats zero', () => {
    expect(formatAbilityScore(0)).toBe('+0')
  })

  it('handles null/undefined', () => {
    expect(formatAbilityScore(null)).toBe('—')
    expect(formatAbilityScore(undefined)).toBe('—')
  })
})
```

## Performance Notes

All utility functions are:

- **Pure functions** - no side effects, same input always produces same output
- **Lightweight** - simple string/number transformations
- **Safe to use in React** - can be called in render without performance concerns
- **Memoization-friendly** - consistent results make them cache-efficient

For large lists (200+ monsters), these functions perform well without additional optimization.
If needed, you can memoize at the component level using `React.memo()` or `useMemo()`.

## Type Safety

All functions have strict TypeScript types that catch errors at compile time:

```typescript
// TypeScript will catch these errors:
formatAbilityScore('3') // ❌ Error: Argument of type 'string' is not assignable
formatLevel(true) // ❌ Error: Argument of type 'boolean' is not assignable

// These work fine:
formatAbilityScore(3) // ✅
formatLevel(8) // ✅
```
