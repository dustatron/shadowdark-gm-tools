# Spell Search UI Component Plan

## Overview

This plan outlines the React UI components for spell search functionality, following the established monster search pattern. The spell system displays spell data including name, tier, classes, range, duration, and description.

## Data Structure Analysis

Based on `/Users/dmccord/Projects/vibeCode/shadowdark-gm-tools/coreData/spells.json`:

```typescript
interface Spell {
  name: string
  slug: string
  description: string
  classes: string[] // ["wizard"], ["priest"], or ["wizard", "priest"]
  duration: string // e.g., "Focus", "1 day", "5 rounds"
  range: string // e.g., "Self", "Close", "Near", "Far"
  tier: string // "1", "2", "3", "4", or "5"
}
```

Plus Convex system fields:
- `_id: Id<'spells'>`
- `_creationTime: number`

## Component Architecture

Following the monster pattern, create four components in `/Users/dmccord/Projects/vibeCode/shadowdark-gm-tools/src/components/spells/`:

### 1. SpellSearchInput.tsx

**Purpose:** Controlled search input with clear functionality

**Props Interface:**
```typescript
interface SpellSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string // default: "Search spells..."
}
```

**Features:**
- Identical to MonsterSearchInput
- Search by spell name
- Clear button when value present
- Escape key to clear
- Focus management
- ARIA labels for accessibility

**Differences from Monster:**
- None - exact same pattern, just different placeholder text

---

### 2. SpellTableHeader.tsx

**Purpose:** Table header with column labels

**Props Interface:**
```typescript
// No props needed - static header
```

**Column Layout:**

**Mobile (< 640px):**
- Name (2fr)
- Tier (0.75fr)
- Classes (1.5fr)
- Range (1fr)

**Tablet/Desktop (>= 640px):**
- Name (2fr)
- Tier (0.75fr)
- Classes (1.5fr)
- Range (1fr)
- Duration (1.25fr)

**Grid Template:**
```typescript
// Mobile: grid-cols-[2fr_0.75fr_1.5fr_1fr]
// Desktop: sm:grid-cols-[2fr_0.75fr_1.5fr_1fr_1.25fr]
```

**Differences from Monster:**
- Different columns (no AC/HP/Alignment/Movement)
- Tier is always visible (monsters hide some columns on mobile)
- Classes array needs special formatting
- Only Duration is hidden on mobile

**Rationale:**
- Tier is critical for spell level filtering (kept visible on mobile)
- Classes determines who can cast (kept visible on mobile)
- Range is important for tactical planning (kept visible on mobile)
- Duration is less critical for quick reference (hidden on mobile to save space)

---

### 3. SpellTableRow.tsx

**Purpose:** Individual spell row displaying stats

**Props Interface:**
```typescript
interface SpellTableRowProps {
  spell: Spell // Type from ~/types/spell.ts
}
```

**Column Display:**

| Column | Mobile | Desktop | Alignment | Format |
|--------|--------|---------|-----------|--------|
| Name | ✅ | ✅ | Left | `spell.name` |
| Tier | ✅ | ✅ | Center | `formatTier(spell.tier)` |
| Classes | ✅ | ✅ | Center | `formatClasses(spell.classes)` |
| Range | ✅ | ✅ | Center | `formatRange(spell.range)` |
| Duration | ❌ | ✅ | Center | `formatDuration(spell.duration)` |

**Grid Template:**
```typescript
// Same as header
// Mobile: grid-cols-[2fr_0.75fr_1.5fr_1fr]
// Desktop: sm:grid-cols-[2fr_0.75fr_1.5fr_1fr_1.25fr]
```

**Styling:**
- Hover effect: `hover:bg-gray-50 dark:hover:bg-gray-800`
- Border: `border-b border-gray-200 dark:border-gray-700`
- Padding: `px-4 py-3`
- Role: `role="row"`

**Differences from Monster:**
- Different stat formatting functions needed
- Classes array requires special rendering (badges/pills)
- Tier needs visual hierarchy (maybe color-coded)
- No complex stats like AC/HP calculations

---

### 4. SpellTable.tsx

**Purpose:** Container component orchestrating search and display

**Props Interface:**
```typescript
interface SpellTableProps {
  spells: Spell[]
  searchTerm: string
  onSearchChange: (value: string) => void
}
```

**Features:**
- Search input integration
- Results count display ("Found X spells" vs "Showing X spells")
- Empty state handling
- Table structure with ARIA roles
- Responsive layout
- Clear search button in empty state

**Component Composition:**
```tsx
<div className="w-full space-y-4">
  {/* Search + Count */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <SpellSearchInput ... />
    <div role="status" aria-live="polite">
      {/* Count display */}
    </div>
  </div>

  {/* Table or Empty State */}
  {spellCount > 0 ? (
    <div role="table" aria-label="Spell list table">
      <SpellTableHeader />
      <div role="rowgroup">
        {spells.map(spell => <SpellTableRow key={spell._id} spell={spell} />)}
      </div>
    </div>
  ) : (
    <EmptyState />
  )}
</div>
```

**Empty State:**
- Search icon
- "No spells found" heading
- Contextual message (search term vs no data)
- Clear search button (if searching)

**Differences from Monster:**
- Same pattern, different entity name
- Same ARIA structure
- Same empty state logic

---

## Supporting Utilities

Create `/Users/dmccord/Projects/vibeCode/shadowdark-gm-tools/src/utils/spellHelpers.ts`:

### Helper Functions Needed:

```typescript
/**
 * Format spell tier for display
 * @param tier - Tier string ("1" to "5")
 * @returns Formatted tier (e.g., "Tier 1", "Tier 5")
 */
export function formatTier(tier: string | null | undefined): string

/**
 * Format classes array for display
 * @param classes - Array of class names (["wizard", "priest"])
 * @returns Formatted class string or badges
 */
export function formatClasses(classes: string[] | null | undefined): string | JSX.Element

/**
 * Format range for display
 * @param range - Range string (e.g., "Far", "Self")
 * @returns Capitalized range or "—"
 */
export function formatRange(range: string | null | undefined): string

/**
 * Format duration for display
 * @param duration - Duration string (e.g., "Focus", "1 day")
 * @returns Formatted duration or "—"
 */
export function formatDuration(duration: string | null | undefined): string

/**
 * Get tier badge color classes
 * @param tier - Tier number (1-5)
 * @returns Tailwind classes for tier badge (higher tiers = more intense color)
 */
export function getTierColorClasses(tier: number): string
```

**Differences from Monster Helpers:**
- Simpler formatting (no ability score modifiers)
- Classes array formatting is unique to spells
- Tier color coding for visual hierarchy
- No calculations needed (all display values are strings)

---

## Type Definitions

Create `/Users/dmccord/Projects/vibeCode/shadowdark-gm-tools/src/types/spell.ts`:

```typescript
import type { Doc } from '../../convex/_generated/dataModel'

/**
 * Spell type derived from Convex database
 */
export type Spell = Doc<'spells'>

/**
 * Spell table row data
 * Subset optimized for table display
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
 * Type guard for spell tier
 */
export function isSpellTier(value: string): value is SpellTier

/**
 * Type guard for spell class
 */
export function isSpellClass(value: string): value is SpellClass

/**
 * Spell search filters
 */
export interface SpellSearchFilters {
  searchTerm?: string
  tier?: SpellTier
  classes?: SpellClass[]
}
```

---

## Responsive Breakpoints

Following TailwindCSS 4 defaults:

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Mobile | < 640px | Hide Duration column |
| Tablet/Desktop | >= 640px (sm:) | Show all columns |

**Grid Changes:**
- **Mobile:** 4 columns (Name, Tier, Classes, Range)
- **Desktop:** 5 columns (+ Duration)

**Rationale:**
- Spells have fewer critical stats than monsters
- Tier/Classes/Range are most important for quick reference
- Duration can be sacrificed on mobile
- Keep layout simple and readable on small screens

---

## Classes Array Display Strategy

### Option 1: Comma-separated string (Simple)
```tsx
{spell.classes.join(", ")} // "wizard, priest"
```

**Pros:** Simple, text-only, lightweight
**Cons:** Less visual hierarchy, harder to scan

### Option 2: Badge pills (Recommended)
```tsx
<div className="flex gap-1 justify-center flex-wrap">
  {spell.classes.map(cls => (
    <span key={cls} className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
      {cls}
    </span>
  ))}
</div>
```

**Pros:**
- Visual hierarchy
- Easy to scan
- Handles 1-2 classes well
- Wraps nicely on mobile

**Cons:**
- More DOM elements
- Slightly more complex

**Recommendation:** Use Option 2 (badges) for better UX and visual consistency with modern table designs.

### Badge Color Scheme:
- **Wizard:** Blue (`bg-blue-100 text-blue-800`)
- **Priest:** Purple (`bg-purple-100 text-purple-800`)
- **Both:** Could show both badges

---

## Key Differences from Monster Components

| Aspect | Monster | Spell | Reason |
|--------|---------|-------|--------|
| **Columns** | 6 (Name, Level, AC, HP, Alignment, Movement) | 5 (Name, Tier, Classes, Range, Duration) | Different stat systems |
| **Mobile Columns** | 4 (hide Alignment, Movement) | 4 (hide Duration) | Different priority stats |
| **Complex Stats** | AC with armor type, HP, ability modifiers | Simple strings | Monsters have calculations |
| **Array Display** | No arrays | Classes array needs badges | Spells have multi-class support |
| **Color Coding** | None | Tier color hierarchy | Visual spell level indication |
| **Formatting** | Ability scores, modifiers, alignment codes | Capitalize strings, format tier | Simpler data types |

---

## Implementation Checklist

- [ ] Create `/src/types/spell.ts` with type definitions
- [ ] Create `/src/utils/spellHelpers.ts` with formatter functions
- [ ] Create `/src/components/spells/SpellSearchInput.tsx`
- [ ] Create `/src/components/spells/SpellTableHeader.tsx`
- [ ] Create `/src/components/spells/SpellTableRow.tsx`
- [ ] Create `/src/components/spells/SpellTable.tsx`
- [ ] Add spell schema to Convex schema.ts
- [ ] Create Convex query functions for spells
- [ ] Test responsive behavior at all breakpoints
- [ ] Test with 0, 1, and many spells
- [ ] Test search functionality
- [ ] Verify accessibility (keyboard nav, screen readers)
- [ ] Test dark mode styling

---

## Open Questions / Considerations

1. **Description Display:** Should descriptions be shown in an expanded row or modal on click?
   - Monster table doesn't show attacks/traits inline
   - Spell descriptions could be valuable
   - Consider expandable rows or detail view

2. **Filtering:** Beyond search, should we add tier/class filters?
   - Monster table is search-only currently
   - Spell filters would be useful (filter by tier, class)
   - Could add filter UI above table

3. **Tier Color Coding:** Should tier have background colors?
   - Tier 1: Green (common)
   - Tier 2-3: Blue (moderate)
   - Tier 4-5: Purple/Red (powerful)
   - Helps visual scanning

4. **Sorting:** Should table support column sorting?
   - Monster table doesn't have sorting
   - Alphabetical by name is good default
   - Could add sort by tier, class

5. **Slug Usage:** Do we need the slug field in the UI?
   - Could be used for URL routing (`/spells/acid-arrow`)
   - Not displayed in table
   - Useful for deep linking

---

## Accessibility Considerations

Following monster component patterns:

- **Semantic HTML:** Use `role="table"`, `role="row"`, `role="columnheader"`, `role="cell"`
- **ARIA Labels:** `aria-label` on table, `aria-live="polite"` on results count
- **Keyboard Navigation:** Focus management on clear, Escape to clear search
- **Screen Reader Support:** Hidden hints, descriptive labels, status announcements
- **Color Contrast:** Ensure tier badges meet WCAG AA standards
- **Focus Indicators:** Clear focus rings on interactive elements

---

## Performance Considerations

- **Array Rendering:** Classes array is max 2 items (wizard, priest) - no performance concerns
- **Formatting Functions:** Pure functions, memoize if needed
- **Search:** Client-side filtering for <1000 spells is fine
- **Future:** Consider virtualization if spell list grows significantly

---

## Summary

The spell search UI follows the established monster search pattern with these adaptations:

1. **Four components** matching the monster structure exactly
2. **Different columns** appropriate for spell data (tier, classes, range, duration)
3. **Badge-based display** for classes array (1-2 badges max)
4. **Simpler formatting** (no calculations, mostly string capitalization)
5. **Same responsive strategy** (hide less critical columns on mobile)
6. **Tier color coding** for visual hierarchy (optional enhancement)
7. **Identical accessibility** and empty state patterns

The plan maintains consistency with the existing codebase while adapting to spell-specific data structures and display requirements.
