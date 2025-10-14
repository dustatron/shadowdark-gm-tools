# Monster Search View

## Overview

**Project Goal**: Create a searchable, sortable table view for browsing and filtering 243 Shadowdark RPG monsters with key stats at a glance.

**Target Users**: Game Masters running Shadowdark RPG sessions who need quick access to monster statistics during game preparation or active play.

**Key Value Proposition**: Fast, efficient monster lookup with essential combat stats visible without clicking through to details, enabling GMs to quickly find and reference creatures during gameplay.

## Project Scope

### In Scope

- Search/filter monsters by name
- Display monsters in a table format with key combat stats
- Responsive table layout for desktop and mobile
- Import monster data into Convex database
- Type-safe monster data models
- Basic sorting by name

### Out of Scope

- Detailed monster view page (separate feature)
- Advanced filtering (by level, alignment, traits, etc.)
- Monster stat editing/customization
- Monster favorites/bookmarks
- Export functionality
- Monster comparison tools

## Milestones

### Milestone 1: Data Layer Setup

**Goal**: Import monster data into Convex and establish type-safe data access patterns

**Tasks**:

- **Define Monster Schema in Convex**
  - Description: Create Convex table schema for monsters with all required fields
  - Backend Requirements (Convex):
    - Add `monsters` table to `convex/schema.ts`
    - Define validators for all fields (name, slug, description, armor_class, etc.)
    - Create indexes: `by_name` (for search), `by_level` (for future filtering)
    - Include all fields from source JSON: name, slug, description, armor_class, armor_type, hit_points, attacks, movement, ability scores (str/dex/con/int/wis/cha), alignment, level, traits array
  - Acceptance Criteria:
    - [ ] Schema defined with proper validators
    - [ ] Indexes created for efficient querying
    - [ ] TypeScript types auto-generated from schema

- **Create Data Seeding Script**
  - Description: One-time script to import monsters.json data into Convex database
  - Backend Requirements (Convex):
    - Create `convex/seedMonsters.ts` with an action or mutation
    - Read from `/coreData/monsters.json`
    - Parse and validate each monster entry
    - Insert all 243 monsters into database
    - Handle potential duplicates (check by slug)
  - Acceptance Criteria:
    - [ ] Script successfully imports all 243 monsters
    - [ ] No duplicate entries created
    - [ ] Data validation passes for all entries
    - [ ] Script can be run safely multiple times (idempotent)

- **Create Monster Query Functions**
  - Description: Convex queries for fetching and searching monsters
  - Backend Requirements (Convex):
    - `listMonsters` query: Return all monsters (with optional limit/pagination)
    - `searchMonsters` query: Filter by name (case-insensitive partial match)
    - Use indexes for efficient querying
    - Return sorted results (alphabetical by name)
  - Acceptance Criteria:
    - [ ] `listMonsters` returns all monsters efficiently
    - [ ] `searchMonsters` filters correctly with case-insensitive matching
    - [ ] Queries use proper indexes (no full table scans)
    - [ ] Results sorted alphabetically

### Milestone 2: TypeScript Types & Utilities

**Goal**: Create type-safe interfaces and utility functions for working with monster data

**Tasks**:

- **Define Frontend Types**
  - Description: Create TypeScript types/interfaces for monster data used in UI
  - Frontend Requirements:
    - Create `src/types/monster.ts`
    - Export `Monster` type from Convex Doc type
    - Export `MonsterTrait` interface for trait objects
    - Create utility type for table row display data
  - Acceptance Criteria:
    - [ ] Types match Convex schema exactly
    - [ ] Types are reusable across components
    - [ ] No `any` types used

- **Create Utility Functions**
  - Description: Helper functions for formatting monster data for display
  - Frontend Requirements:
    - Create `src/utils/monsterHelpers.ts`
    - `formatAlignment(alignment: string)`: Convert "L"/"C"/"N" to full names
    - `formatMovement(movement: string)`: Clean display of movement
    - `formatAbilityScore(score: number)`: Display with +/- modifier
  - Acceptance Criteria:
    - [ ] All formatters handle edge cases
    - [ ] Functions are pure (no side effects)
    - [ ] Unit testable structure

### Milestone 3: UI Components

**Goal**: Build reusable, responsive components for displaying monster data

**Tasks**:

- **Create MonsterSearchInput Component**
  - Description: Debounced search input field with clear button
  - User Flow:
    - User types in search field
    - Results filter after 300ms debounce
    - User can clear search with X button
  - Frontend Requirements:
    - Create `src/components/monsters/MonsterSearchInput.tsx`
    - Controlled input with debouncing (use `useDebouncedValue` or similar)
    - Clear button appears when input has value
    - Accessible label and placeholder
    - TailwindCSS styling consistent with app theme
  - Acceptance Criteria:
    - [ ] Input debounces search after 300ms
    - [ ] Clear button removes all text and refocuses input
    - [ ] Accessible (proper labels, keyboard navigation)
    - [ ] Responsive design works on mobile

- **Create MonsterTableHeader Component**
  - Description: Table header row with column labels
  - Frontend Requirements:
    - Create `src/components/monsters/MonsterTableHeader.tsx`
    - Display columns: Name, Level, AC, HP, Alignment, Movement
    - Responsive: hide some columns on mobile (Alignment, Movement)
    - TailwindCSS grid layout matching table rows
  - Acceptance Criteria:
    - [ ] Header columns align with table rows
    - [ ] Responsive breakpoints match row breakpoints
    - [ ] Accessible table semantics

- **Create MonsterTableRow Component**
  - Description: Single table row displaying monster stats
  - Frontend Requirements:
    - Create `src/components/monsters/MonsterTableRow.tsx`
    - Accept `monster` prop (Monster type)
    - Display: name, level, AC, HP, alignment, movement
    - Hover state for interactivity
    - Responsive grid layout (hide columns on mobile)
    - Use utility functions for formatting
  - Acceptance Criteria:
    - [ ] All stats display correctly
    - [ ] Formatting functions applied properly
    - [ ] Hover state provides visual feedback
    - [ ] Mobile view shows essential stats only
    - [ ] Accessible (proper semantic HTML)

- **Create MonsterTable Component**
  - Description: Container component that orchestrates search and display
  - Frontend Requirements:
    - Create `src/components/monsters/MonsterTable.tsx`
    - Compose MonsterSearchInput, MonsterTableHeader, MonsterTableRow
    - Handle empty states (no results, no monsters)
    - Loading states during data fetch
    - Error boundary for graceful failures
  - Acceptance Criteria:
    - [ ] Shows loading spinner while fetching
    - [ ] Displays "No monsters found" when search returns empty
    - [ ] Renders all monster rows efficiently
    - [ ] Handles errors gracefully

### Milestone 4: Route Integration

**Goal**: Integrate monster table into existing route with proper data fetching

**Tasks**:

- **Update Monsters Route**
  - Description: Replace placeholder with functional monster search view
  - User Flow:
    - User navigates to /monsters
    - Page loads with all monsters displayed
    - User types in search to filter results
    - Results update in real-time
  - Frontend Requirements:
    - Update `src/routes/monsters/index.tsx`
    - Use `useSuspenseQuery` with `convexQuery` for data fetching
    - Integrate MonsterTable component
    - Add page title and description
    - Handle loading states with Suspense boundary
  - Backend Requirements (Convex):
    - Query uses `api.monsters.searchMonsters` or `api.monsters.listMonsters`
    - Efficient data fetching with proper indexing
  - State Management:
    - Search term in local component state
    - Debounced search triggers new query
    - TanStack Query handles caching and updates
  - Acceptance Criteria:
    - [ ] Route loads without errors
    - [ ] All monsters display on initial load
    - [ ] Search filters update query parameters
    - [ ] Loading states handled by Suspense
    - [ ] Page is responsive on all screen sizes

- **Add Navigation Link**
  - Description: Ensure monsters route is accessible from navigation
  - Frontend Requirements:
    - Verify link exists in main navigation (if applicable)
    - Add breadcrumb or back navigation if needed
  - Acceptance Criteria:
    - [ ] Route accessible from main navigation
    - [ ] Active state shows on monsters page

### Milestone 5: Polish & Optimization

**Goal**: Enhance performance, accessibility, and user experience

**Tasks**:

- **Performance Optimization**
  - Description: Ensure smooth performance with 243+ monsters
  - Frontend Requirements:
    - Implement virtualization if list scrolling is slow (consider react-virtual)
    - Optimize re-renders (React.memo on table rows)
    - Monitor bundle size impact
  - Acceptance Criteria:
    - [ ] Smooth scrolling with full monster list
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

- **Empty State Enhancement**
  - Description: Improve UX when no monsters match search
  - Frontend Requirements:
    - Add helpful message for no results
    - Suggest clearing search or trying different terms
    - Consider showing count of visible monsters
  - Acceptance Criteria:
    - [ ] Empty state is clear and helpful
    - [ ] User knows how to recover from no results

## Technical Requirements

### Frontend Stack

- React 19 + TypeScript
- TanStack Start (file-based routing at `src/routes/monsters/index.tsx`)
- TanStack Query with Convex integration (`useSuspenseQuery`, `convexQuery`)
- TailwindCSS 4 (responsive grid layout)
- Optional: `react-virtual` or `@tanstack/react-virtual` for list virtualization

### Backend Stack

- Convex (real-time database)
- Schema-driven data model
- Type-safe queries with validators

### Performance Targets

- Initial page load: < 2s
- Search filter response: < 100ms (perceived, with debouncing)
- Smooth 60fps scrolling

## Data Models

### Key Entities

**Monster**

- Purpose: Store comprehensive monster data for Shadowdark RPG
- Key Fields:
  - `name` (string): Display name (e.g., "Aboleth", "Angel, Domini")
  - `slug` (string): URL-friendly identifier (e.g., "aboleth", "angel_domini")
  - `description` (string): Flavor text describing the creature
  - `armor_class` (number): AC value for combat
  - `armor_type` (string, optional): Type of armor (e.g., "plate mail + shield")
  - `hit_points` (number): HP for the creature
  - `attacks` (string): Attack description (e.g., "2 tentacle (near) +5 (1d8)")
  - `movement` (string): Movement capabilities (e.g., "near (swim)", "double near (fly)")
  - `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma` (numbers): Ability score modifiers
  - `alignment` (string): "L" (Lawful), "C" (Chaotic), or "N" (Neutral)
  - `level` (number): Monster level (1-11+)
  - `traits` (array): Special abilities/features
- Relationships: None (standalone entity for now)
- Indexes Needed:
  - `by_name`: For efficient alphabetical sorting and name-based searching
  - `by_level`: For future level-based filtering
  - `by_slug`: For future detail page lookups

**MonsterTrait** (nested within Monster)

- Purpose: Store special abilities and features
- Key Fields:
  - `name` (string): Trait name (e.g., "Curse", "Telepathic")
  - `description` (string): Trait effect description

## User Experience

### Key User Flows

1. **Browse All Monsters**
   - Entry point: User navigates to /monsters route
   - Steps:
     1. Page loads with all monsters in alphabetical order
     2. User scrolls through table to browse
     3. User sees key stats at a glance
   - Success state: All 243 monsters visible, sorted alphabetically
   - Error states: Loading error shows retry button

2. **Search for Specific Monster**
   - Entry point: User focuses on search input
   - Steps:
     1. User types monster name (e.g., "dragon")
     2. Table filters after 300ms debounce
     3. Results update to show only matching monsters
     4. User continues typing to refine or clears search
   - Success state: Filtered list shows relevant monsters
   - Error states: "No monsters found" message with suggestion to clear search

3. **View Monster Stats**
   - Entry point: User finds monster in table
   - Steps:
     1. User locates monster row
     2. User reads stats directly from table row
   - Success state: All essential combat stats visible without additional clicks
   - Error states: N/A (future: clicking row navigates to detail page)

## File Structure

### New Files to Create

```
src/
├── components/
│   └── monsters/
│       ├── MonsterSearchInput.tsx        # Search input with debounce
│       ├── MonsterTableHeader.tsx        # Table header row
│       ├── MonsterTableRow.tsx           # Individual monster row
│       └── MonsterTable.tsx              # Container component
├── types/
│   └── monster.ts                        # TypeScript interfaces
└── utils/
    └── monsterHelpers.ts                 # Formatting utilities

convex/
├── schema.ts                             # (UPDATE) Add monsters table
├── monsters.ts                           # Monster queries
└── seedMonsters.ts                       # One-time data import script
```

### Files to Update

```
src/routes/monsters/index.tsx             # Replace placeholder with MonsterTable
```

## Integration Points

- **Data Source**: `/coreData/monsters.json` (one-time import to Convex)
- **Convex Database**: Schema, queries, and mutations for monster data
- **TanStack Query**: Client-side caching and real-time updates
- **TanStack Router**: File-based routing at `/monsters`

## Assumptions & Constraints

**Assumptions**:

- Monster data is static after initial import (no real-time editing needed)
- All 243 monsters can render efficiently without pagination initially
- Search is limited to name field (no advanced filtering in MVP)
- Mobile users primarily need Name, Level, AC, HP visible
- Users have modern browsers with ES2022 support

**Constraints**:

- Must use Convex for data storage (not static JSON querying)
- Must follow TanStack Start routing conventions
- Must use existing TailwindCSS 4 setup
- Must maintain type safety throughout stack
- 178KB JSON file needs one-time import (not runtime parsing)

**Technical Decisions**:

- **Data Strategy**: Import to Convex vs. query static file
  - **Decision**: Import to Convex
  - **Rationale**: Enables future features (favorites, custom monsters, real-time updates), consistent with app architecture, better query performance with indexes, type-safe schema validation
- **Pagination**: Implement now or later?
  - **Decision**: Skip pagination in MVP, add if performance issues arise
  - **Rationale**: 243 rows is manageable for modern browsers, virtualization can be added if needed
- **Search Strategy**: Client-side filter vs. server query
  - **Decision**: Server query with Convex
  - **Rationale**: Leverages Convex indexes, scalable for future filters, consistent data fetching pattern

## Success Metrics

**Functional Success**:

- All 243 monsters imported successfully
- Search filters results correctly (case-insensitive, partial match)
- Table displays all required columns
- Responsive layout works on mobile and desktop

**Performance Success**:

- Page load time < 2 seconds
- Search response feels instant (< 100ms perceived)
- Smooth scrolling (60fps)
- No layout shift during loading

**User Experience Success**:

- Zero-click stat viewing (no need to open modal for basic info)
- Intuitive search behavior (clear button, debounced updates)
- Accessible to keyboard and screen reader users
- Mobile-friendly with essential stats prioritized

## Open Questions

- [ ] Should we add sorting capability (by level, AC, HP)? - Scoped out for MVP, can add in future iteration
- [ ] Do we need pagination or is virtualization sufficient? - Start without, add if performance testing shows need
- [ ] Should clicking a row navigate to a detail page? - Out of scope for this feature, separate PRD needed
- [ ] What columns should be visible on mobile? - Decided: Name, Level, AC, HP (most critical for combat)
- [ ] Should we cache the search term in URL query params? - No for MVP (adds complexity), consider for future
- [ ] Do we need to handle missing data gracefully (null values)? - Yes, formatters should handle null/undefined

## Implementation Notes

### Data Import Strategy

The one-time seeding script should:

1. Be runnable via Convex dashboard or CLI
2. Check for existing monsters (by slug) to avoid duplicates
3. Log import progress and any validation errors
4. Be idempotent (safe to run multiple times)

### Search Implementation

Use Convex query with index scanning:

```typescript
// Pseudo-code example
export const searchMonsters = query({
  args: { searchTerm: v.optional(v.string()) },
  returns: v.array(
    v.object({
      /* monster schema */
    }),
  ),
  handler: async (ctx, args) => {
    if (!args.searchTerm) {
      return await ctx.db.query('monsters').withIndex('by_name').collect()
    }
    // Use index scan + filter for name matching
    const term = args.searchTerm.toLowerCase()
    return await ctx.db
      .query('monsters')
      .withIndex('by_name')
      .filter((q) => q.field('name').toLowerCase().includes(term))
      .collect()
  },
})
```

### Component Composition

```
MonstersPage (route)
└── MonsterTable (container)
    ├── MonsterSearchInput (controlled input)
    ├── MonsterTableHeader (header row)
    └── MonsterTableRow[] (list of rows)
```

### Responsive Breakpoints

- **Mobile (< 640px)**: Show Name, Level, AC, HP only
- **Tablet (640px - 1024px)**: Add Alignment
- **Desktop (> 1024px)**: Show all columns including Movement

## Next Steps After Completion

This feature sets the foundation for:

1. **Monster Detail Page**: Click row to see full stats, traits, description
2. **Advanced Filtering**: Filter by level range, alignment, traits
3. **Favorites System**: Bookmark frequently used monsters
4. **Custom Monsters**: Allow GMs to create/edit custom entries
5. **Encounter Builder**: Select monsters to build balanced encounters
