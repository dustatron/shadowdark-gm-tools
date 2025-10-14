# Spell Details vs Monster Details - Pattern Comparison

## Side-by-Side Layout Comparison

### Monster Details Page
```
┌────────────────────────────────────────────────────┐
│ Home / Monsters / Goblin                          │
│ ← Back to Monsters                                 │
├────────────────────────────────────────────────────┤
│ ╔════════════════════════════════════════════════╗ │
│ ║ GOBLIN                    [Level 1]           ║ │
│ ║ Alignment: Chaotic                            ║ │
│ ╚════════════════════════════════════════════════╝ │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ Description                                  │  │
│ │ Green-skinned humanoids with...              │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ Combat Stats                                       │
│ ┌───────┬───────┬──────────┬───────┐             │
│ │ AC: 15│ HP: 5 │ Move: 30'│ Lvl: 1│             │
│ └───────┴───────┴──────────┴───────┘             │
│                                                    │
│ Attacks                                            │
│ ┌──────────────────────────────────────────────┐  │
│ │ Spear +2 (1d6+1) or shortbow +2 (1d6)       │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ Ability Scores                                     │
│ ┌────┬────┬────┬────┬────┬────┐                  │
│ │STR │DEX │CON │INT │WIS │CHA │                  │
│ │ +1 │ +2 │ +0 │ -1 │ +0 │ -1 │                  │
│ └────┴────┴────┴────┴────┴────┘                  │
│                                                    │
│ Special Traits                                     │
│ ┌──────────────────────────────────────────────┐  │
│ │ Pack Tactics                                 │  │
│ │ Advantage on attacks when ally is nearby.   │  │
│ └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

### Spell Details Page (Proposed)
```
┌────────────────────────────────────────────────────┐
│ Home / Spells / Fireball                          │
│ ← Back to Spells                                   │
├────────────────────────────────────────────────────┤
│ ╔════════════════════════════════════════════════╗ │
│ ║ FIREBALL      [Tier 3] [Wizard]              ║ │
│ ║ Far | Instant | DC: 13                       ║ │
│ ╚════════════════════════════════════════════════╝ │
│                                                    │
│ ┌──────────────────────────────────────────────┐  │
│ │ Description                                  │  │
│ │ A roaring blast of flame erupts from your    │  │
│ │ palm, streaking toward a point you choose    │  │
│ │ within range and exploding in a fiery burst. │  │
│ │ All creatures within 20 feet must make a DEX │  │
│ │ saving throw. On a failed save, a target     │  │
│ │ takes 6d6 fire damage, or half as much on a  │  │
│ │ successful save.                             │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
│ Casting Information                                │
│ ┌──────────────────────────────────────────────┐  │
│ │ Casting DC:       13                         │  │
│ │ Tier:             3                          │  │
│ │ Classes:          Wizard                     │  │
│ │ Range:            Far (120 ft)               │  │
│ │ Duration:         Instant                    │  │
│ │ Concentration:    No                         │  │
│ └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

## Component Architecture Comparison

### Monster Details Architecture
```
/routes/monsters/$slug.tsx
  └─> MonsterDetailsPage (route wrapper)
       ├─> Breadcrumb navigation
       ├─> Back button
       └─> <Suspense>
            └─> MonsterDetailsContent (data fetching)
                 ├─> Query: getMonsterBySlug
                 ├─> 404 handling
                 └─> MonsterDetails (presentation)
                      ├─> Header (name, level, alignment)
                      ├─> Description card
                      ├─> Combat stats grid
                      ├─> Attacks card
                      ├─> Ability scores grid
                      │    └─> AbilityScoreCard (x6)
                      └─> Special traits list
                           └─> Trait cards (mapped)

/components/monsters/MonsterDetails.tsx
  └─> MonsterDetails component
       └─> Uses: monsterHelpers.ts
            ├─> formatAlignment()
            ├─> formatArmorClass()
            ├─> formatHitPoints()
            ├─> formatLevel()
            ├─> formatMovement()
            └─> formatAbilityScore()
```

### Spell Details Architecture (Proposed)
```
/routes/spells/$slug.tsx
  └─> SpellDetailsPage (route wrapper)
       ├─> Breadcrumb navigation
       ├─> Back button
       └─> <Suspense>
            └─> SpellDetailsContent (data fetching)
                 ├─> Query: getSpellBySlug
                 ├─> 404 handling
                 └─> SpellDetails (presentation)
                      ├─> Header (name, tier, classes)
                      ├─> Quick stats bar (range, duration, DC)
                      ├─> Description card
                      └─> Casting information card

/components/spells/SpellDetails.tsx
  └─> SpellDetails component
       └─> Uses: spellHelpers.ts
            ├─> formatTier()
            ├─> formatRange()
            ├─> formatDuration()
            ├─> calculateCastingDC()
            ├─> getTierColor()
            ├─> getClassColor()
            └─> isFocusSpell()
```

## Data Structure Comparison

### Monster Data (from database)
```typescript
{
  _id: Id<'monsters'>,
  _creationTime: number,
  name: "Goblin",
  slug: "goblin",
  description: "Green-skinned humanoids...",

  // Combat stats (numerical)
  armor_class: 15,
  armor_type: "leather armor",
  hit_points: 5,
  attacks: "Spear +2 (1d6+1) or...",
  movement: "30 ft.",
  level: 1,

  // Ability scores (6 numerical values)
  strength: 12,      // +1
  dexterity: 14,     // +2
  constitution: 10,  // +0
  intelligence: 8,   // -1
  wisdom: 10,        // +0
  charisma: 8,       // -1

  // Metadata
  alignment: "Chaotic",

  // Nested array of objects
  traits: [
    {
      name: "Pack Tactics",
      description: "Advantage on attacks..."
    }
  ]
}
```

**Complexity:** High
- 12+ individual fields
- 6 ability scores requiring modifier calculations
- Nested traits array
- Mix of numbers and strings

### Spell Data (from database)
```typescript
{
  _id: Id<'spells'>,
  _creationTime: number,
  name: "Fireball",
  slug: "fireball",
  description: "A roaring blast of flame...",

  // Casting properties (categorical)
  classes: ["wizard"],
  duration: "Instant",
  range: "Far",
  tier: "3",
}
```

**Complexity:** Low
- 7 fields total (fewer than monsters)
- No numerical calculations needed
- No nested data structures
- All string-based properties
- Description contains most information

## Helper Functions Comparison

### Monster Helpers (existing)
```typescript
// /src/utils/monsterHelpers.ts

export function formatAlignment(alignment: string): string {
  // Capitalizes alignment
  return alignment.charAt(0).toUpperCase() + alignment.slice(1)
}

export function formatArmorClass(ac: number, armorType: string | null): string {
  // Returns "15 (leather armor)" or "15"
  return armorType ? `${ac} (${armorType})` : `${ac}`
}

export function formatHitPoints(hp: number): string {
  // Returns "5 HP"
  return `${hp}`
}

export function formatLevel(level: number): string {
  // Returns "1"
  return `${level}`
}

export function formatMovement(movement: string): string {
  // Returns movement as-is
  return movement
}

export function formatAbilityScore(score: number): string {
  // Converts score to modifier: 12 → "+1", 8 → "-1", 10 → "+0"
  const modifier = Math.floor((score - 10) / 2)
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}
```

**Characteristics:**
- Mix of numerical and string formatting
- Calculations required (ability modifiers)
- Conditional logic for display

### Spell Helpers (proposed)
```typescript
// /src/utils/spellHelpers.ts

export function formatTier(tier: string): string {
  // Returns "Tier 3"
  return `Tier ${tier}`
}

export function formatRange(range: string): string {
  // Adds distance info: "Far" → "Far (120 ft)"
  const rangeMap: Record<string, string> = {
    'Self': 'Self',
    'Touch': 'Touch',
    'Near': 'Near (30 ft)',
    'Far': 'Far (120 ft)',
  }
  return rangeMap[range] || range
}

export function formatDuration(duration: string): string {
  // Returns duration as-is for now
  return duration
}

export function calculateCastingDC(tier: number): number {
  // Formula: 10 + tier
  return 10 + tier
}

export function getTierColor(tier: string): string {
  // Returns Tailwind classes for badge colors
  const colors: Record<string, string> = {
    '1': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    '2': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    '3': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    '4': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    '5': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return colors[tier] || colors['1']
}

export function getClassColor(className: string): string {
  // Returns Tailwind classes for class badge colors
  const colors: Record<string, string> = {
    wizard: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    priest: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  }
  return colors[className] || colors['wizard']
}

export function isFocusSpell(duration: string): boolean {
  // Check if spell requires concentration
  return duration.toLowerCase() === 'focus'
}
```

**Characteristics:**
- Mostly string formatting
- Simple calculations (DC formula)
- Color mapping for visual consistency
- Boolean checks for spell properties

## Visual Design Comparison

### Monster Details - Badge System
```tsx
{/* Level badge */}
<span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
  Level {monster.level}
</span>
```

### Spell Details - Badge System (Proposed)
```tsx
{/* Tier badge */}
<span className={getTierColor(spell.tier)}>
  Tier {spell.tier}
</span>

{/* Class badges */}
{spell.classes.map(className => (
  <span key={className} className={getClassColor(className)}>
    {className.charAt(0).toUpperCase() + className.slice(1)}
  </span>
))}
```

## Loading State Comparison

### Monster Loading Skeleton
```tsx
{/* Header skeleton */}
<div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
<div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />

{/* Description skeleton */}
<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

{/* Stats grid skeleton - 6 cards */}
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {[...Array(6)].map((_, i) => (
    <div className="rounded-lg border p-4">
      <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
    </div>
  ))}
</div>
```

### Spell Loading Skeleton (Proposed)
```tsx
{/* Header skeleton */}
<div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
<div className="flex gap-2">
  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
</div>

{/* Quick stats skeleton */}
<div className="flex gap-4">
  <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
  <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
  <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
</div>

{/* Description skeleton */}
<div className="space-y-2">
  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
</div>

{/* Casting info skeleton - single card */}
<div className="rounded-lg border p-6">
  <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
  <div className="mt-4 space-y-2">
    {[...Array(6)].map((_, i) => (
      <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
    ))}
  </div>
</div>
```

## Navigation Flow Comparison

### Monster Navigation Flow
```
Home Page
  └─> Click "Monsters" in nav
       └─> Monsters Table Page (/monsters)
            ├─> Search/filter monsters
            └─> Click monster row
                 └─> Monster Details Page (/monsters/goblin)
                      ├─> View full stats
                      ├─> Click "Back to Monsters"
                      │    └─> Returns to Monsters Table
                      └─> Breadcrumb "Home / Monsters / Goblin"
                           └─> Click any breadcrumb link
```

### Spell Navigation Flow (Same Pattern)
```
Home Page
  └─> Click "Spells" in nav
       └─> Spells Table Page (/spells)
            ├─> Search/filter spells
            └─> Click spell row
                 └─> Spell Details Page (/spells/fireball)
                      ├─> View full details
                      ├─> Click "Back to Spells"
                      │    └─> Returns to Spells Table
                      └─> Breadcrumb "Home / Spells / Fireball"
                           └─> Click any breadcrumb link
```

## Key Takeaways

### What Makes Monsters Complex
1. 6 ability scores requiring modifier calculations
2. Multiple numerical stats (AC, HP, level)
3. Nested traits array with dynamic rendering
4. Mix of formatted numbers and strings
5. Complex grid layouts (6-column ability scores)

### What Makes Spells Simpler
1. Fewer total fields (7 vs 12+)
2. No calculations except casting DC (10 + tier)
3. No nested data structures
4. Primarily string-based display
5. Description-heavy, not stat-heavy
6. Simpler layout (2-column at most)

### Shared Patterns (Reuse These!)
1. Route structure (`$slug.tsx`)
2. Data fetching pattern (Convex + TanStack Query)
3. Suspense boundaries for loading
4. 404 handling for not found
5. Breadcrumb navigation
6. Back button
7. Badge system (tier/class like level badge)
8. Card-based layout
9. Dark mode support
10. Responsive design approach

### Unique Considerations for Spells
1. Description is the primary content (not stats)
2. Multi-class support (some spells castable by both classes)
3. Tier-based color coding
4. Casting DC calculation and display
5. Focus spell highlighting (concentration)
6. Text-heavy layout vs number-heavy layout
7. Future: Spell effect parsing from description

## Conclusion

Spells are **simpler to implement** than monsters because:
- Less data complexity
- Fewer calculations
- No nested structures
- String-based properties

But we can **reuse almost all the patterns**:
- Route architecture
- Data fetching approach
- Navigation structure
- Visual design system
- Loading states
- Error handling

The main difference is **content emphasis**:
- Monsters: Stats and numbers
- Spells: Description and text

This makes spell details pages easier to build while maintaining consistency with the established Monster Details patterns.
