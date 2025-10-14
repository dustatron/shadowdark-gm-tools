# Spell Search View

## Overview

**Project Goal**: Create a searchable, sortable table view for browsing and filtering Shadowdark RPG spells with key information at a glance.

**Target Users**: Game Masters and players running Shadowdark RPG sessions who need quick access to spell information during character preparation, leveling, or active play.

**Key Value Proposition**: Fast, efficient spell lookup with essential spell details (tier, class, range, duration) visible without clicking through to details, enabling users to quickly find and reference spells during gameplay and character creation.

## Project Scope

### In Scope

- Search/filter spells by name
- Display spells in a table format with key details
- Responsive table layout for desktop and mobile
- Import spell data into Convex database
- Type-safe spell data models
- Basic sorting by name

### Out of Scope

- Detailed spell view page (separate feature)
- Advanced filtering (by tier, class, range, duration)
- Spell favorites/bookmarks
- Export functionality
- Spell comparison tools
- Custom spell creation/editing

## Milestones

### Milestone 1: Data Layer Setup

**Goal**: Import spell data into Convex and establish type-safe data access patterns

**Tasks**:

- **Define Spell Schema in Convex**
  - Description: Create Convex table schema for spells with all required fields
  - Backend Requirements (Convex):
    - Add `spells` table to `convex/schema.ts`
    - Define validators for all fields (name, slug, description, classes, duration, range, tier)
    - Create indexes: `by_name` (for search/sort), `by_tier` (for future filtering), `by_slug` (for future detail pages)
    - Include all fields from source JSON:
      - `name` (string): Spell name (e.g., "Acid Arrow", "Magic Missile")
      - `slug` (string): URL-friendly identifier (e.g., "acid_arrow", "magic_missile")
      - `description` (string): Spell effect description
      - `classes` (array of strings): Classes that can cast (e.g., ["wizard"], ["priest"], ["priest", "wizard"])
      - `duration` (string): How long spell lasts (e.g., "Focus", "Instant", "5 rounds")
      - `range` (string): Casting range (e.g., "Self", "Close", "Near", "Far", "Unlimited")
      - `tier` (string): Spell tier/level (e.g., "1", "2", "3", "4", "5")
  - Acceptance Criteria:
    - [ ] Schema defined with proper validators
    - [ ] Indexes created for efficient querying
    - [ ] TypeScript types auto-generated from schema

- **Create Data Seeding Script**
  - Description: One-time script to import spells.json data into Convex database
  - Backend Requirements (Convex):
    - Create `convex/seedSpells.ts` with a mutation
    - Read from `/coreData/spells.json`
    - Parse and validate each spell entry
    - Insert all 99 spells into database
    - Handle potential duplicates (check by slug)
  - Acceptance Criteria:
    - [ ] Script successfully imports all 99 spells
    - [ ] No duplicate entries created
    - [ ] Data validation passes for all entries
    - [ ] Script can be run safely multiple times (idempotent)

- **Create Spell Query Functions**
  - Description: Convex queries for fetching and searching spells
  - Backend Requirements (Convex):
    - `listSpells` query: Return all spells (with optional limit/pagination)
    - `searchSpells` query: Filter by name (case-insensitive partial match)
    - Use indexes for efficient querying
    - Return sorted results (alphabetical by name)
  - Acceptance Criteria:
    - [ ] `listSpells` returns all spells efficiently
    - [ ] `searchSpells` filters correctly with case-insensitive matching
    - [ ] Queries use proper indexes (no full table scans)
    - [ ] Results sorted alphabetically

### Milestone 2: TypeScript Types & Utilities

**Goal**: Create type-safe interfaces and utility functions for working with spell data

**Tasks**:

- **Define Frontend Types**
  - Description: Create TypeScript types/interfaces for spell data used in UI
  - Frontend Requirements:
    - Create `src/types/spell.ts`
    - Export `Spell` type from Convex Doc type
    - Export utility types for table row display data
    - Create type for spell class filter options
  - Acceptance Criteria:
    - [ ] Types match Convex schema exactly
    - [ ] Types are reusable across components
    - [ ] No `any` types used

- **Create Utility Functions**
  - Description: Helper functions for formatting spell data for display
  - Frontend Requirements:
    - Create `src/utils/spellHelpers.ts`
    - `formatClasses(classes: string[])`: Convert array to readable string (e.g., "Wizard", "Priest, Wizard")
    - `formatTier(tier: string)`: Display tier with ordinal (e.g., "1st", "2nd", "3rd", "4th", "5th")
    - `formatRange(range: string)`: Clean display of range
    - `formatDuration(duration: string)`: Clean display of duration
    - `getClassBadgeColor(className: string)`: Return Tailwind color class for class badges
  - Acceptance Criteria:
    - [ ] All formatters handle edge cases
    - [ ] Functions are pure (no side effects)
    - [ ] Unit testable structure

### Milestone 3: UI Components

**Goal**: Build reusable, responsive components for displaying spell data

**Tasks**:

- **Create SpellSearchInput Component**
  - Description: Debounced search input field with clear button
  - User Flow:
    - User types in search field
    - Results filter after 300ms debounce
    - User can clear search with X button
  - Frontend Requirements:
    - Create `src/components/spells/SpellSearchInput.tsx`
    - Controlled input with debouncing (300ms delay)
    - Clear button appears when input has value
    - Accessible label and placeholder (e.g., "Search spells...")
    - TailwindCSS styling consistent with MonsterSearchInput
  - Acceptance Criteria:
    - [ ] Input debounces search after 300ms
    - [ ] Clear button removes all text and refocuses input
    - [ ] Accessible (proper labels, keyboard navigation)
    - [ ] Responsive design works on mobile

- **Create SpellTableHeader Component**
  - Description: Table header row with column labels
  - Frontend Requirements:
    - Create `src/components/spells/SpellTableHeader.tsx`
    - Display columns: Name, Tier, Classes, Range, Duration
    - Responsive: hide Duration on mobile (< 640px), hide Range on tablet (< 1024px)
    - TailwindCSS grid layout matching table rows
    - Follow MonsterTableHeader pattern
  - Acceptance Criteria:
    - [ ] Header columns align with table rows
    - [ ] Responsive breakpoints match row breakpoints
    - [ ] Accessible table semantics

- **Create SpellTableRow Component**
  - Description: Single table row displaying spell information
  - Frontend Requirements:
    - Create `src/components/spells/SpellTableRow.tsx`
    - Accept `spell` prop (Spell type)
    - Display: name, tier, classes (as badges), range, duration
    - Hover state for interactivity
    - Responsive grid layout (hide columns on mobile/tablet)
    - Use utility functions for formatting
    - Class badges with color coding (wizard = blue, priest = gold, both = purple)
  - Acceptance Criteria:
    - [ ] All spell details display correctly
    - [ ] Formatting functions applied properly
    - [ ] Hover state provides visual feedback
    - [ ] Mobile view shows essential info only (Name, Tier, Classes)
    - [ ] Tablet view adds Range
    - [ ] Desktop shows all columns
    - [ ] Accessible (proper semantic HTML)

- **Create SpellTable Component**
  - Description: Container component that orchestrates search and display
  - Frontend Requirements:
    - Create `src/components/spells/SpellTable.tsx`
    - Compose SpellSearchInput, SpellTableHeader, SpellTableRow
    - Handle empty states (no results, no spells)
    - Loading states during data fetch
    - Error boundary for graceful failures
    - Display spell count (e.g., "Showing 12 of 99 spells")
  - Acceptance Criteria:
    - [ ] Shows loading spinner while fetching
    - [ ] Displays "No spells found" when search returns empty
    - [ ] Renders all spell rows efficiently
    - [ ] Handles errors gracefully
    - [ ] Shows result count

### Milestone 4: Route Integration

**Goal**: Create spell route and integrate spell table with proper data fetching

**Tasks**:

- **Create Spells Route**
  - Description: New route for spell search functionality
  - User Flow:
    - User navigates to /spells
    - Page loads with all spells displayed
    - User types in search to filter results
    - Results update in real-time
  - Frontend Requirements:
    - Create `src/routes/spells/index.tsx`
    - Use `useSuspenseQuery` with `convexQuery` for data fetching
    - Integrate SpellTable component
    - Add page title and description
    - Handle loading states with Suspense boundary
    - Follow pattern from `src/routes/monsters/index.tsx`
  - Backend Requirements (Convex):
    - Query uses `api.spells.searchSpells` or `api.spells.listSpells`
    - Efficient data fetching with proper indexing
  - State Management:
    - Search term in local component state
    - Debounced search triggers new query
    - TanStack Query handles caching and updates
  - Acceptance Criteria:
    - [ ] Route loads without errors
    - [ ] All spells display on initial load
    - [ ] Search filters work correctly
    - [ ] Loading states handled by Suspense
    - [ ] Page is responsive on all screen sizes

- **Add Navigation Link**
  - Description: Ensure spells route is accessible from navigation
  - Frontend Requirements:
    - Add "Spells" link to main navigation menu
    - Add to `src/routes/__root.tsx` navigation
    - Ensure consistent placement with "Monsters" link
  - Acceptance Criteria:
    - [ ] Route accessible from main navigation
    - [ ] Active state shows on spells page
    - [ ] Navigation order is logical

### Milestone 5: Polish & Optimization

**Goal**: Enhance performance, accessibility, and user experience

**Tasks**:

- **Performance Optimization**
  - Description: Ensure smooth performance with 99 spells
  - Frontend Requirements:
    - Optimize re-renders (React.memo on table rows if needed)
    - Monitor bundle size impact
    - Test search performance
  - Acceptance Criteria:
    - [ ] Smooth scrolling with full spell list
    - [ ] Search filtering feels instant
    - [ ] No unnecessary re-renders

- **Accessibility Audit**
  - Description: Ensure keyboard navigation and screen reader support
  - Frontend Requirements:
    - Test keyboard navigation (Tab, Enter, Escape)
    - Add ARIA labels where needed
    - Ensure color contrast meets WCAG AA
    - Test with screen reader
  - Acceptance Criteria:
    - [ ] Can navigate entire interface with keyboard
    - [ ] Screen reader announces search results count
    - [ ] Focus management works correctly
    - [ ] Color contrast passes WCAG AA
    - [ ] Class badge colors are distinguishable

- **Empty State Enhancement**
  - Description: Improve UX when no spells match search
  - Frontend Requirements:
    - Add helpful message for no results
    - Suggest clearing search or trying different terms
    - Show count of visible spells vs. total
  - Acceptance Criteria:
    - [ ] Empty state is clear and helpful
    - [ ] User knows how to recover from no results
    - [ ] Result counter shows "X of 99 spells"

## Technical Requirements

### Frontend Stack

- React 19 + TypeScript
- TanStack Start (file-based routing at `src/routes/spells/index.tsx`)
- TanStack Query with Convex integration (`useSuspenseQuery`, `convexQuery`)
- TailwindCSS 4 (responsive grid layout, color-coded badges)
- Component patterns mirroring monster search implementation

### Backend Stack

- Convex (real-time database)
- Schema-driven data model
- Type-safe queries with validators
- Pattern matching monsters.ts implementation

### Performance Targets

- Initial page load: < 2s
- Search filter response: < 100ms (perceived, with debouncing)
- Smooth 60fps scrolling

## Data Models

### Key Entities

**Spell**

- Purpose: Store comprehensive spell data for Shadowdark RPG
- Key Fields:
  - `name` (string): Display name (e.g., "Acid Arrow", "Cure Wounds", "Magic Missile")
  - `slug` (string): URL-friendly identifier (e.g., "acid_arrow", "cure_wounds", "magic_missile")
  - `description` (string): Spell effect description and mechanics
  - `classes` (array of strings): Classes that can cast this spell
    - Possible values: "wizard", "priest"
    - Can have multiple classes (e.g., ["priest", "wizard"] for shared spells)
  - `duration` (string): How long the spell lasts
    - Examples: "Instant", "Focus", "5 rounds", "10 rounds", "1 day", "1 hour real time"
  - `range` (string): Casting range
    - Examples: "Self", "Close", "Near", "Far", "Unlimited"
  - `tier` (string): Spell power level (stored as string in JSON)
    - Values: "1", "2", "3", "4", "5"
    - Display as "1st", "2nd", "3rd", "4th", "5th"
- Relationships: None (standalone entity for now)
- Indexes Needed:
  - `by_name`: For efficient alphabetical sorting and name-based searching
  - `by_tier`: For future tier-based filtering
  - `by_slug`: For future detail page lookups

## User Experience

### Key User Flows

1. **Browse All Spells**
   - Entry point: User navigates to /spells route
   - Steps:
     1. Page loads with all spells in alphabetical order
     2. User scrolls through table to browse
     3. User sees key spell details at a glance
   - Success state: All 99 spells visible, sorted alphabetically
   - Error states: Loading error shows retry button

2. **Search for Specific Spell**
   - Entry point: User focuses on search input
   - Steps:
     1. User types spell name (e.g., "magic")
     2. Table filters after 300ms debounce
     3. Results update to show only matching spells
     4. Result count updates (e.g., "Showing 3 of 99 spells")
     5. User continues typing to refine or clears search
   - Success state: Filtered list shows relevant spells with count
   - Error states: "No spells found" message with suggestion to clear search

3. **View Spell Details**
   - Entry point: User finds spell in table
   - Steps:
     1. User locates spell row
     2. User reads details directly from table row
     3. User identifies spell tier, classes, range, and duration
   - Success state: All essential spell info visible without additional clicks
   - Error states: N/A (future: clicking row navigates to detail page)

4. **Identify Class-Specific Spells**
   - Entry point: User reviewing spell list
   - Steps:
     1. User scans Classes column
     2. Color-coded badges indicate wizard (blue), priest (gold), or both (purple)
     3. User quickly identifies spells for their class
   - Success state: Easy visual identification of spell availability
   - Error states: N/A

## File Structure

### New Files to Create

```
src/
├── components/
│   └── spells/
│       ├── SpellSearchInput.tsx           # Search input with debounce
│       ├── SpellTableHeader.tsx           # Table header row
│       ├── SpellTableRow.tsx              # Individual spell row
│       └── SpellTable.tsx                 # Container component
├── routes/
│   └── spells/
│       └── index.tsx                      # Spells route page
├── types/
│   └── spell.ts                           # TypeScript interfaces
└── utils/
    └── spellHelpers.ts                    # Formatting utilities

convex/
├── schema.ts                              # (UPDATE) Add spells table
├── spells.ts                              # Spell queries
└── seedSpells.ts                          # One-time data import script
```

### Files to Update

```
src/routes/__root.tsx                      # Add "Spells" navigation link
```

## Integration Points

- **Data Source**: `/coreData/spells.json` (one-time import to Convex)
- **Convex Database**: Schema, queries, and mutations for spell data
- **TanStack Query**: Client-side caching and real-time updates
- **TanStack Router**: File-based routing at `/spells`
- **Existing Navigation**: Add to main menu alongside Monsters

## Assumptions & Constraints

**Assumptions**:

- Spell data is static after initial import (no real-time editing needed)
- All 99 spells can render efficiently without pagination
- Search is limited to name field (no advanced filtering in MVP)
- Mobile users primarily need Name, Tier, and Classes visible
- Users have modern browsers with ES2022 support
- Classes are limited to "wizard" and "priest" only

**Constraints**:

- Must use Convex for data storage (not static JSON querying)
- Must follow TanStack Start routing conventions
- Must use existing TailwindCSS 4 setup
- Must maintain type safety throughout stack
- Must follow same architecture pattern as monster search
- Tier stored as string in JSON (e.g., "1", "2") must be converted for display

**Technical Decisions**:

- **Data Strategy**: Import to Convex vs. query static file
  - **Decision**: Import to Convex
  - **Rationale**: Consistent with monster search implementation, enables future features (favorites, custom spells), better query performance with indexes, type-safe schema validation

- **Pagination**: Implement now or later?
  - **Decision**: Skip pagination in MVP
  - **Rationale**: 99 spells is very manageable (less than half of monster count), no performance concerns expected

- **Search Strategy**: Client-side filter vs. server query
  - **Decision**: Server query with Convex
  - **Rationale**: Consistent with monster search pattern, leverages Convex indexes, scalable for future filters

- **Class Display**: Text vs. badges
  - **Decision**: Color-coded badges
  - **Rationale**: Visual differentiation aids quick scanning, aligns with modern UI patterns, improves UX

## Success Metrics

**Functional Success**:

- All 99 spells imported successfully
- Search filters results correctly (case-insensitive, partial match)
- Table displays all required columns
- Responsive layout works on mobile, tablet, and desktop
- Class badges display with correct colors

**Performance Success**:

- Page load time < 2 seconds
- Search response feels instant (< 100ms perceived)
- Smooth scrolling (60fps)
- No layout shift during loading

**User Experience Success**:

- Zero-click info viewing (no need to open modal for basic spell info)
- Intuitive search behavior (clear button, debounced updates)
- Accessible to keyboard and screen reader users
- Mobile-friendly with essential info prioritized
- Clear visual distinction between wizard, priest, and shared spells

## Open Questions

- [ ] Should we add sorting capability (by tier, name)? - Scoped out for MVP, alphabetical default
- [ ] Should clicking a row navigate to a detail page? - Out of scope, separate PRD needed
- [ ] What columns should be visible on mobile? - Decided: Name, Tier, Classes
- [ ] What columns should be visible on tablet? - Decided: Add Range to mobile columns
- [ ] Should we cache the search term in URL query params? - No for MVP (adds complexity)
- [ ] What colors for class badges? - Wizard: blue (bg-blue-100, text-blue-800), Priest: gold (bg-amber-100, text-amber-800), Both: purple (bg-purple-100, text-purple-800)

## Implementation Notes

### Data Import Strategy

The one-time seeding script should:

1. Be runnable via Convex dashboard or CLI (or via Node script like monsters)
2. Check for existing spells (by slug) to avoid duplicates
3. Log import progress and any validation errors
4. Be idempotent (safe to run multiple times)
5. Handle tier as string (stored as "1"-"5" in JSON)
6. Handle classes array (can be single class or multiple)

### Search Implementation

Use Convex query with index scanning, mirroring monster search:

```typescript
// Pattern from monsters.ts
export const searchSpells = query({
  args: { searchTerm: v.optional(v.string()) },
  returns: v.array(v.object({ /* spell schema */ })),
  handler: async (ctx, args) => {
    if (!args.searchTerm || args.searchTerm.trim() === '') {
      return await ctx.db.query('spells').withIndex('by_name').collect()
    }

    const searchTermLower = args.searchTerm.toLowerCase()
    const allSpells = await ctx.db
      .query('spells')
      .withIndex('by_name')
      .collect()

    return allSpells.filter((spell) =>
      spell.name.toLowerCase().includes(searchTermLower)
    )
  },
})
```

### Component Composition

```
SpellsPage (route)
└── SpellTable (container)
    ├── SpellSearchInput (controlled input)
    ├── SpellTableHeader (header row)
    └── SpellTableRow[] (list of rows)
```

### Responsive Breakpoints

- **Mobile (< 640px)**: Show Name, Tier, Classes only
- **Tablet (640px - 1024px)**: Add Range
- **Desktop (> 1024px)**: Show all columns including Duration

### Class Badge Styling

```typescript
// Utility function in spellHelpers.ts
export function getClassBadgeColor(className: string): string {
  const classMap: Record<string, string> = {
    wizard: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    priest: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  }
  return classMap[className.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

// For spells with multiple classes, use a special "shared" color
export function getSharedClassColor(): string {
  return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
}
```

### Tier Formatting

```typescript
// Convert "1" to "1st", "2" to "2nd", etc.
export function formatTier(tier: string): string {
  const tierNum = parseInt(tier, 10)
  const suffixes = ['th', 'st', 'nd', 'rd']
  const suffix = tierNum <= 3 ? suffixes[tierNum] : suffixes[0]
  return `${tierNum}${suffix}`
}
```

## Next Steps After Completion

This feature sets the foundation for:

1. **Spell Detail Page**: Click row to see full description, mechanics, notes
2. **Advanced Filtering**: Filter by tier range, class, range, duration
3. **Favorites System**: Bookmark frequently used spells for character builds
4. **Custom Spells**: Allow users to create/edit homebrew spells
5. **Character Sheet Integration**: Add spells to character spell lists
6. **Spellbook Builder**: Create curated spell lists for different character levels

## Alignment with Monster Search

This spec intentionally mirrors the monster search implementation to maintain consistency:

- **Schema pattern**: Same structure (name, slug, description, indexes)
- **Query pattern**: Same search logic (case-insensitive, partial match, index-based)
- **Component structure**: Parallel component hierarchy (SearchInput, Table, TableHeader, TableRow)
- **Route pattern**: Same data fetching approach (useSuspenseQuery + convexQuery)
- **Type pattern**: Same type organization (types/, utils/ folders)
- **Seeding pattern**: Same import strategy (seedX.ts + optional Node script)

This ensures:
- Easier maintenance (patterns are familiar)
- Consistent user experience (same search behavior)
- Faster development (reuse architectural decisions)
- Better code organization (parallel structures)
