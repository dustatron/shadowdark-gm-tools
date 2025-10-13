# Shadowdark GM Tools - Comprehensive Product Specification v2

## Overview

**Project Goal**: Create a fast, user-friendly web application for Shadowdark RPG Game Masters to browse, search, and organize monsters and spells during gameplay sessions.

**Target Users**:
- Game Masters running Shadowdark TTRPG sessions
- GMs who need quick reference during active play
- GMs preparing encounters and managing campaign content

**Key Value Proposition**: A streamlined, always-available reference tool that eliminates flipping through rulebooks during gameplay, with personal organization features to keep favorite content at your fingertips.

## Project Scope

### In Scope
- Monster database with full stat blocks and advanced filtering
- Spell database with complete spell information and search
- User authentication via Discord OAuth
- Personal favorites/collections system
- Responsive design for desktop, tablet, and mobile
- Fast search with sub-second results
- User profiles with display preferences
- Dark/light theme support

### Out of Scope (Future Phases)
- Encounter builder with CR calculation
- Dice roller functionality
- Custom monster/spell creation
- Session notes and campaign management
- Initiative tracker
- Sharing lists with other users
- Offline functionality

## Current Implementation Status

### Completed
- Discord OAuth authentication (Convex Auth)
- Responsive navigation bar with mobile menu
- shadcn/ui component library integration
- Dark/light theme toggle
- Basic user profile system (schema defined)
- TanStack Start routing infrastructure
- Convex backend infrastructure

### Available Data
- Complete monster database (`coreData/monsters.json`)
  - 100+ monsters with full stat blocks
  - All Shadowdark core content
- Complete spell database (`coreData/spells.json`)
  - 100+ spells for wizard and priest classes
  - Tiers 1-5 coverage

## Milestones

### Milestone 1: Monster Database (MVP Core Feature)
**Goal**: Implement a fully functional, searchable monster database that GMs can use during sessions.

**Features**:

#### 1.1 Monster Data Seeding
- **Description**: Load monster data from JSON into Convex database
- **User Flow**: Automatic on deployment/one-time seeding operation
- **Frontend Requirements**:
  - Admin page for triggering data import (optional)
- **Backend Requirements (Convex)**:
  - Schema:
    ```typescript
    monsters: defineTable({
      name: v.string(),
      slug: v.string(), // URL-friendly identifier
      description: v.string(),
      armor_class: v.number(),
      armor_type: v.union(v.string(), v.null()),
      hit_points: v.number(),
      attacks: v.string(),
      movement: v.string(),
      strength: v.number(),
      dexterity: v.number(),
      constitution: v.number(),
      intelligence: v.number(),
      wisdom: v.number(),
      charisma: v.number(),
      alignment: v.string(), // "L", "N", or "C"
      level: v.number(),
      traits: v.array(v.object({
        name: v.string(),
        description: v.string(),
      })),
    })
      .index("by_slug", ["slug"])
      .index("by_level", ["level"])
      .index("by_alignment", ["alignment"])
      .index("by_name", ["name"])
      .searchIndex("search_monsters", {
        searchField: "name",
        filterFields: ["level", "alignment"]
      })
    ```
  - Mutation: `seedMonsters` - Bulk import from JSON
  - Internal function to avoid accidental re-seeding
- **Acceptance Criteria**:
  - [ ] All monsters from `coreData/monsters.json` are loaded into Convex
  - [ ] Seeding is idempotent (can run multiple times safely)
  - [ ] All indexes are created and functional
  - [ ] Search index is configured for name-based searches

#### 1.2 Monster Browser Page
- **Description**: Main listing page showing all monsters with search and filters
- **User Flow**:
  1. User navigates to /monsters
  2. Sees grid/list of monster cards
  3. Can scroll through all monsters
  4. Can apply filters or search to narrow results
- **Frontend Requirements**:
  - Route: `src/routes/monsters/index.tsx`
  - Components:
    - `MonsterCard` - Displays monster preview (name, level, AC, HP, alignment)
    - `MonsterFilters` - Sidebar/collapsible filters
    - `SearchBar` - Prominent search input
    - `MonsterGrid` - Responsive grid layout (1 col mobile, 2 col tablet, 3+ col desktop)
  - State management:
    - Search query (URL param: `?q=`)
    - Selected filters (URL params: `?level=`, `?alignment=`)
    - View mode preference (grid/list - local storage)
  - TanStack Router search params for filtering
  - Infinite scroll or pagination for large result sets
- **Backend Requirements (Convex)**:
  - Query: `listMonsters`
    - Args: `{ search?: string, minLevel?: number, maxLevel?: number, alignment?: string, limit?: number, cursor?: string }`
    - Returns: `{ monsters: Monster[], nextCursor?: string }`
    - Uses search index for name queries
    - Filters by level range and alignment using indexes
  - Query: `getMonsterStats`
    - Returns: `{ totalCount: number, levelDistribution: Record<number, number>, alignmentDistribution: Record<string, number> }`
    - For displaying filter counts
- **Acceptance Criteria**:
  - [ ] Monsters display in responsive grid on /monsters
  - [ ] Each card shows key stats: name, level, AC, HP, alignment
  - [ ] Search by name returns results in < 1 second
  - [ ] Level filter narrows results to specific levels
  - [ ] Alignment filter (L/N/C) works correctly
  - [ ] Filter counts show number of matches
  - [ ] Search and filters work together (AND logic)
  - [ ] URL params persist filters for sharing/bookmarking
  - [ ] Mobile layout is usable on phone screens
  - [ ] Loading states display during data fetch

#### 1.3 Monster Detail Page
- **Description**: Full stat block view for individual monsters
- **User Flow**:
  1. User clicks monster card from browser
  2. Navigates to /monsters/[slug]
  3. Sees complete monster information
  4. Can add to favorites (if authenticated)
  5. Can navigate back or to next/previous monster
- **Frontend Requirements**:
  - Route: `src/routes/monsters/$slug.tsx`
  - Components:
    - `MonsterStatBlock` - Full stat display with Shadowdark styling
    - `TraitList` - Renders special abilities/traits
    - `FavoriteButton` - Heart icon to toggle favorite status
    - `MonsterNavigation` - Previous/Next monster buttons
  - Stat block sections:
    - Header: Name, level, alignment
    - Defense: AC (with armor type), HP
    - Offense: Attack string parsed and formatted
    - Abilities: STR, DEX, CON, INT, WIS, CHA modifiers
    - Movement: Speed with special types highlighted
    - Traits: Expandable list of special abilities
  - Print-friendly CSS
- **Backend Requirements (Convex)**:
  - Query: `getMonsterBySlug`
    - Args: `{ slug: string }`
    - Returns: `Monster | null`
    - Uses `by_slug` index for fast lookup
  - Query: `getAdjacentMonsters`
    - Args: `{ currentSlug: string, filters?: FilterOptions }`
    - Returns: `{ prev?: Monster, next?: Monster }`
    - For prev/next navigation within filtered context
- **Acceptance Criteria**:
  - [ ] Full monster stat block displays correctly
  - [ ] All fields from data model are shown
  - [ ] Traits are clearly formatted and readable
  - [ ] Ability modifiers display with +/- signs
  - [ ] Movement types are parsed and formatted (e.g., "near (swim)" displays clearly)
  - [ ] Page is print-friendly (clean layout, no nav bars)
  - [ ] Favorite button shows correct state (filled/unfilled)
  - [ ] Clicking favorite toggles state and updates immediately
  - [ ] Previous/next navigation works within filter context
  - [ ] 404 page shows for invalid slugs
  - [ ] Page loads in < 1 second

#### 1.4 Monster Search Functionality
- **Description**: Fast, intelligent search across monster names and descriptions
- **User Flow**:
  1. User types in search bar
  2. Results update in real-time (debounced)
  3. Search highlights matching terms
  4. Can combine search with filters
- **Frontend Requirements**:
  - Debounced input (300ms) to avoid excessive queries
  - Search term highlights in results
  - Clear button to reset search
  - Empty state with helpful message ("No monsters found. Try adjusting your filters.")
  - Recent searches stored in local storage (optional enhancement)
- **Backend Requirements (Convex)**:
  - Uses search index defined in schema
  - Full-text search on monster names
  - Optionally search in descriptions and trait names (if performance allows)
  - Query: `searchMonsters`
    - Args: `{ searchTerm: string, filters?: FilterOptions, limit?: number }`
    - Returns: `{ results: Monster[], count: number }`
- **Acceptance Criteria**:
  - [ ] Search updates as user types (debounced)
  - [ ] Search is case-insensitive
  - [ ] Partial matches work ("drag" finds "Dragon")
  - [ ] Search results load in < 500ms
  - [ ] Empty search shows all monsters
  - [ ] Search + filters work together
  - [ ] Clear button resets search
  - [ ] Helpful empty state message displays

---

### Milestone 2: Spell Database
**Goal**: Implement a fully functional, searchable spell database with all Shadowdark spells.

**Features**:

#### 2.1 Spell Data Seeding
- **Description**: Load spell data from JSON into Convex database
- **User Flow**: Automatic on deployment/one-time seeding operation
- **Frontend Requirements**:
  - Admin page for triggering data import (optional)
- **Backend Requirements (Convex)**:
  - Schema:
    ```typescript
    spells: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      classes: v.array(v.string()), // ["wizard", "priest"] or subset
      duration: v.string(), // "Instant", "Focus", "5 rounds", etc.
      range: v.string(), // "Self", "Close", "Near", "Far", "Unlimited"
      tier: v.string(), // "1" through "5"
    })
      .index("by_slug", ["slug"])
      .index("by_tier", ["tier"])
      .index("by_class", ["classes"])
      .searchIndex("search_spells", {
        searchField: "name",
        filterFields: ["tier", "classes", "range", "duration"]
      })
    ```
  - Mutation: `seedSpells` - Bulk import from JSON
  - Handle classes array properly for indexing
- **Acceptance Criteria**:
  - [ ] All spells from `coreData/spells.json` are loaded
  - [ ] Seeding is idempotent
  - [ ] All indexes are created
  - [ ] Search index is configured

#### 2.2 Spell Browser Page
- **Description**: Main listing page for browsing and filtering spells
- **User Flow**:
  1. User navigates to /spells
  2. Sees grid/list of spell cards
  3. Can filter by tier, class, range, duration
  4. Can search by name
- **Frontend Requirements**:
  - Route: `src/routes/spells/index.tsx`
  - Components:
    - `SpellCard` - Preview with name, tier, classes, range
    - `SpellFilters` - Sidebar filters
    - `SearchBar` - Reusable search component
    - `SpellGrid` - Responsive layout
  - Filters:
    - Tier: 1-5 (checkboxes or buttons)
    - Class: Wizard, Priest, Both (radio or toggle)
    - Range: Self, Close, Near, Far, Unlimited (checkboxes)
    - Duration: Instant, Focus, Rounds, Hours, Days (checkboxes)
  - URL params for filters and search
  - Color coding by class (wizard = purple/blue, priest = gold/white)
- **Backend Requirements (Convex)**:
  - Query: `listSpells`
    - Args: `{ search?: string, tiers?: string[], classes?: string[], ranges?: string[], durations?: string[], limit?: number }`
    - Returns: `{ spells: Spell[] }`
  - Query: `getSpellStats`
    - Returns distribution data for filter counts
- **Acceptance Criteria**:
  - [ ] Spells display in responsive grid
  - [ ] Cards show tier, name, classes, range
  - [ ] Visual distinction between wizard/priest spells
  - [ ] Tier filter works (1-5)
  - [ ] Class filter shows wizard-only, priest-only, or both
  - [ ] Range filter works correctly
  - [ ] Duration filter groups similar durations
  - [ ] Search by name works
  - [ ] Filters combine with AND logic
  - [ ] URL params persist state
  - [ ] Mobile-friendly layout

#### 2.3 Spell Detail Page
- **Description**: Full spell information display
- **User Flow**:
  1. User clicks spell card
  2. Navigates to /spells/[slug]
  3. Sees complete spell description
  4. Can add to favorites
- **Frontend Requirements**:
  - Route: `src/routes/spells/$slug.tsx`
  - Components:
    - `SpellDetailCard` - Full spell display
    - `FavoriteButton` - Toggle favorite
    - `SpellNavigation` - Prev/next within filtered context
  - Spell detail sections:
    - Header: Name, tier (styled), classes (icons/badges)
    - Metadata: Range, duration, casting type
    - Description: Full effect text, well-formatted
    - Notes: Special conditions, scaling info (if applicable)
  - Class-themed styling (wizard vs priest aesthetic)
  - Print-friendly layout
- **Backend Requirements (Convex)**:
  - Query: `getSpellBySlug`
    - Args: `{ slug: string }`
    - Returns: `Spell | null`
  - Query: `getAdjacentSpells`
    - For prev/next navigation
- **Acceptance Criteria**:
  - [ ] Full spell details display correctly
  - [ ] Tier prominently shown with visual indicator
  - [ ] Classes shown with icons/badges
  - [ ] Range and duration clearly formatted
  - [ ] Description text is readable and well-spaced
  - [ ] Print-friendly styling
  - [ ] Favorite button works
  - [ ] Prev/next navigation functional
  - [ ] 404 for invalid slugs

#### 2.4 Spell Search and Filtering
- **Description**: Fast search and intelligent filtering for spells
- **User Flow**:
  1. User searches by spell name
  2. Applies class filter (e.g., "wizard only")
  3. Narrows by tier range (e.g., tiers 1-3)
  4. Results update instantly
- **Frontend Requirements**:
  - Debounced search input
  - Multi-select filters with clear visual feedback
  - "Reset all filters" button
  - Filter count badges
  - Empty state with suggestions
- **Backend Requirements (Convex)**:
  - Query: `searchSpells`
    - Args: `{ searchTerm: string, filters: SpellFilters }`
    - Returns: `{ results: Spell[], count: number }`
  - Efficient index usage for filter combinations
- **Acceptance Criteria**:
  - [ ] Search works across spell names
  - [ ] Class filter correctly handles array field
  - [ ] Multiple filters work together
  - [ ] Results load in < 500ms
  - [ ] Filter counts update dynamically
  - [ ] Reset filters button clears all
  - [ ] Empty state is helpful

---

### Milestone 3: Favorites System
**Goal**: Allow authenticated users to save and organize their favorite monsters and spells.

**Features**:

#### 3.1 Favorites Data Model
- **Description**: Backend infrastructure for user favorites
- **Backend Requirements (Convex)**:
  - Schema:
    ```typescript
    favorites: defineTable({
      userId: v.id("users"),
      itemType: v.union(v.literal("monster"), v.literal("spell")),
      itemId: v.id("monsters" | "spells"), // Need to handle union types
      itemSlug: v.string(), // Denormalized for faster queries
      itemName: v.string(), // Denormalized for display
      addedAt: v.number(), // Timestamp
      notes: v.optional(v.string()), // User's personal notes
    })
      .index("by_userId_and_type", ["userId", "itemType"])
      .index("by_userId_and_itemSlug", ["userId", "itemSlug"])
      .index("by_userId", ["userId"])
    ```
  - Mutation: `addFavorite`
    - Args: `{ itemType: "monster" | "spell", itemSlug: string }`
    - Validates user is authenticated
    - Checks if already favorited
    - Adds with current timestamp
  - Mutation: `removeFavorite`
    - Args: `{ itemType: "monster" | "spell", itemSlug: string }`
    - Removes from favorites
  - Mutation: `updateFavoriteNotes`
    - Args: `{ favoriteId: Id<"favorites">, notes: string }`
    - Updates user notes on favorite
  - Query: `getFavorites`
    - Args: `{ itemType?: "monster" | "spell" }`
    - Returns: `{ favorites: Favorite[] }`
    - Sorted by addedAt (newest first)
  - Query: `isFavorite`
    - Args: `{ itemType: "monster" | "spell", itemSlug: string }`
    - Returns: `boolean`
    - Fast check for button state
- **Acceptance Criteria**:
  - [ ] Favorites schema is defined
  - [ ] All indexes are created
  - [ ] Add/remove mutations work correctly
  - [ ] Favorites are user-specific (isolated)
  - [ ] Duplicate favorites are prevented
  - [ ] Timestamps are recorded correctly

#### 3.2 Favorite Button Component
- **Description**: Reusable button for toggling favorite status
- **User Flow**:
  1. User clicks heart icon on monster/spell
  2. If not authenticated, prompted to log in
  3. If authenticated, favorite is added/removed
  4. Visual feedback shows state change
- **Frontend Requirements**:
  - Component: `FavoriteButton.tsx`
  - Props: `{ itemType: "monster" | "spell", itemSlug: string, itemName: string }`
  - States:
    - Not authenticated: Outline heart, click prompts login
    - Not favorited: Outline heart, click adds
    - Favorited: Filled heart, click removes
    - Loading: Spinner during mutation
  - Optimistic updates for instant feedback
  - Tooltip showing "Add to favorites" or "Remove from favorites"
  - Error handling with toast notifications
- **Backend Integration**:
  - Uses `isFavorite` query for initial state
  - Uses `addFavorite` / `removeFavorite` mutations
- **Acceptance Criteria**:
  - [ ] Button displays correct state (filled/unfilled)
  - [ ] Click toggles favorite status
  - [ ] Optimistic update provides instant feedback
  - [ ] Non-authenticated users see login prompt
  - [ ] Error states are handled gracefully
  - [ ] Tooltip provides clear action description
  - [ ] Button is accessible (keyboard navigation)

#### 3.3 Favorites Page
- **Description**: Dedicated page showing user's saved favorites
- **User Flow**:
  1. User navigates to /favorites
  2. Sees tabs for "All", "Monsters", "Spells"
  3. Can view all favorites or filter by type
  4. Can remove favorites
  5. Can add personal notes to favorites
- **Frontend Requirements**:
  - Route: `src/routes/favorites/index.tsx`
  - Protected route (requires authentication)
  - Components:
    - `FavoritesList` - Grid/list of favorite items
    - `FavoriteItemCard` - Card showing item with remove button
    - `FavoriteNotes` - Expandable notes section
    - `EmptyFavoritesState` - Helpful message when no favorites
  - Tabs:
    - All (default)
    - Monsters
    - Spells
  - Each card shows:
    - Item name (linked to detail page)
    - Key stats (AC/HP for monsters, Tier/Range for spells)
    - Added date ("Added 3 days ago")
    - Remove button
    - Notes section (expandable)
  - Search within favorites (optional enhancement)
  - Sort options: Recently added, Name A-Z
- **Backend Requirements (Convex)**:
  - Query: `getFavoritesWithDetails`
    - Args: `{ itemType?: "monster" | "spell", sort?: "recent" | "alphabetical" }`
    - Returns: `{ favorites: Array<Favorite & { itemDetails: Monster | Spell }> }`
    - Joins favorites with actual item data
- **Acceptance Criteria**:
  - [ ] Favorites page requires authentication
  - [ ] Tabs work to filter by type
  - [ ] All favorites display with correct info
  - [ ] Links navigate to detail pages
  - [ ] Remove button deletes favorite
  - [ ] Notes can be added and edited
  - [ ] Empty state shows helpful message
  - [ ] Sort options work correctly
  - [ ] Recently added date is human-readable
  - [ ] Page is mobile-friendly

#### 3.4 Favorites Integration
- **Description**: Integrate favorite buttons throughout app
- **User Flow**:
  1. Favorite buttons appear on detail pages
  2. Visual indicator on browse cards for favorited items
  3. Quick access to favorites from nav bar
- **Frontend Requirements**:
  - Add FavoriteButton to monster detail page
  - Add FavoriteButton to spell detail page
  - Add favorite indicator (small filled heart) to cards in browse views
  - Add favorites link/icon to navbar
  - Badge showing favorite count in navbar (optional)
- **Acceptance Criteria**:
  - [ ] Favorite buttons on all detail pages
  - [ ] Browse cards show favorite status
  - [ ] Navbar has favorites link
  - [ ] Favorite count is visible (optional)
  - [ ] All integrations work seamlessly

---

### Milestone 4: Polish & Performance
**Goal**: Enhance user experience with performance optimizations, improved UX, and professional polish.

**Features**:

#### 4.1 Loading States & Skeleton Screens
- **Description**: Smooth loading experiences throughout the app
- **Frontend Requirements**:
  - Skeleton screens for:
    - Monster/spell browse grids
    - Detail pages
    - Favorites list
  - Loading spinners for:
    - Search results
    - Filter application
    - Mutations (favorites)
  - Progress indicators for long operations
  - Shimmer effect on skeletons (optional enhancement)
- **Acceptance Criteria**:
  - [ ] All data-loading views show skeletons
  - [ ] Skeletons match actual content layout
  - [ ] Loading states prevent layout shift
  - [ ] Spinners appear during mutations
  - [ ] No blank screens during navigation

#### 4.2 Error Handling & Empty States
- **Description**: Graceful error handling and helpful empty states
- **Frontend Requirements**:
  - Error boundaries for route-level errors
  - Toast notifications for mutation errors
  - Empty states for:
    - No search results
    - No favorites
    - Failed data loads
  - Retry buttons for failed queries
  - Friendly error messages (no technical jargon)
  - 404 page for invalid routes
  - Offline detection (optional)
- **Acceptance Criteria**:
  - [ ] Errors don't crash the app
  - [ ] Error messages are user-friendly
  - [ ] Empty states provide guidance
  - [ ] Retry functionality works
  - [ ] 404 page is helpful
  - [ ] Network errors are handled

#### 4.3 Performance Optimization
- **Description**: Fast load times and smooth interactions
- **Backend Requirements (Convex)**:
  - Verify all queries use indexes
  - Implement pagination for large result sets
  - Cache expensive computations
  - Optimize search queries
- **Frontend Requirements**:
  - Code splitting by route
  - Lazy load images
  - Debounce search inputs
  - Optimize re-renders with React.memo
  - Use virtual scrolling for long lists (if needed)
  - Preload detail pages on hover (optional)
- **Performance Targets**:
  - First Contentful Paint < 1.5s
  - Search results < 500ms
  - Detail page navigation < 300ms
  - Lighthouse performance score > 90
- **Acceptance Criteria**:
  - [ ] Initial page load is fast
  - [ ] Search feels instant
  - [ ] No janky scrolling
  - [ ] Images load progressively
  - [ ] Mobile performance is good
  - [ ] Lighthouse scores meet targets

#### 4.4 Responsive Design Refinement
- **Description**: Perfect experience across all device sizes
- **Frontend Requirements**:
  - Test and refine on:
    - Mobile (320px - 767px)
    - Tablet (768px - 1023px)
    - Desktop (1024px+)
  - Touch targets minimum 44px
  - Readable font sizes on mobile
  - Collapsible filters on mobile
  - Sticky headers where appropriate
  - Horizontal scroll prevention
- **Acceptance Criteria**:
  - [ ] All pages work on small phones (320px)
  - [ ] Touch targets are appropriately sized
  - [ ] Text is readable without zooming
  - [ ] Filters work on mobile
  - [ ] No horizontal scroll issues
  - [ ] Tested on iOS and Android

#### 4.5 Accessibility (A11y)
- **Description**: Ensure app is usable by everyone
- **Frontend Requirements**:
  - Semantic HTML throughout
  - ARIA labels where needed
  - Keyboard navigation support
  - Focus indicators visible
  - Alt text for icons
  - Color contrast meets WCAG AA
  - Skip to content link
  - Screen reader testing
- **Acceptance Criteria**:
  - [ ] All interactive elements keyboard accessible
  - [ ] Focus states are visible
  - [ ] Color contrast passes WCAG AA
  - [ ] Screen reader can navigate app
  - [ ] ARIA labels are accurate
  - [ ] No accessibility errors in Lighthouse

---

### Milestone 5: Enhanced Features (Phase 2)
**Goal**: Add quality-of-life features and advanced functionality.

**Features**:

#### 5.1 Advanced Filtering
- **Description**: More sophisticated filtering options
- **Frontend Requirements**:
  - Monsters:
    - Filter by movement type (fly, swim, burrow, climb)
    - Filter by trait names (search within traits)
    - Filter by ability score ranges
  - Spells:
    - Filter by keyword in description
    - Combine duration types
  - Saved filter presets (local storage)
  - "Quick filters" for common searches
- **Backend Requirements (Convex)**:
  - Extended search index to include traits
  - Complex filter query support
- **Acceptance Criteria**:
  - [ ] Movement type filter works
  - [ ] Trait search finds relevant monsters
  - [ ] Ability score filters work correctly
  - [ ] Saved presets persist across sessions
  - [ ] Quick filters provide shortcuts

#### 5.2 Collections/Lists
- **Description**: Organize favorites into named collections
- **User Flow**:
  1. Create a collection (e.g., "Dungeon Level 1")
  2. Add monsters/spells to collection
  3. View collection contents
  4. Share collection URL (optional)
- **Backend Requirements (Convex)**:
  - Schema:
    ```typescript
    collections: defineTable({
      userId: v.id("users"),
      name: v.string(),
      description: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
      isPublic: v.boolean(),
    }).index("by_userId", ["userId"])

    collectionItems: defineTable({
      collectionId: v.id("collections"),
      itemType: v.union(v.literal("monster"), v.literal("spell")),
      itemSlug: v.string(),
      itemName: v.string(),
      addedAt: v.number(),
      order: v.number(),
    }).index("by_collectionId", ["collectionId"])
    ```
- **Frontend Requirements**:
  - Collection management page
  - Add to collection from detail pages
  - Reorder items in collection
  - View collection as a reference sheet
  - Print entire collection
- **Acceptance Criteria**:
  - [ ] Collections can be created
  - [ ] Items can be added to collections
  - [ ] Collections can be viewed and edited
  - [ ] Items can be reordered
  - [ ] Collections are printable

#### 5.3 Quick Reference Mode
- **Description**: Compact view for quick lookups during play
- **Frontend Requirements**:
  - Toggle to "Quick Reference" mode
  - Compact stat blocks
  - Side-by-side comparison view
  - Print-optimized layout
  - Minimal chrome (no nav bars)
- **Acceptance Criteria**:
  - [ ] Quick reference mode is accessible
  - [ ] Stat blocks are condensed but readable
  - [ ] Comparison view shows 2-3 items
  - [ ] Print layout is clean

#### 5.4 Recent Views & History
- **Description**: Track recently viewed monsters and spells
- **Backend Requirements (Convex)**:
  - Schema:
    ```typescript
    recentViews: defineTable({
      userId: v.id("users"),
      itemType: v.union(v.literal("monster"), v.literal("spell")),
      itemSlug: v.string(),
      viewedAt: v.number(),
    }).index("by_userId", ["userId"])
    ```
  - Mutation: `recordView` - Automatically called on detail page views
  - Query: `getRecentViews` - Returns last 20 views
- **Frontend Requirements**:
  - "Recently Viewed" section on home page
  - Quick access dropdown in navbar
  - Clear history option
- **Acceptance Criteria**:
  - [ ] Views are recorded automatically
  - [ ] Recent views show on home page
  - [ ] History can be cleared
  - [ ] Duplicate recent views update timestamp

---

## Technical Requirements

### Frontend Stack
- **Framework**: TanStack Start (React 19)
- **Styling**: TailwindCSS 4
- **Components**: shadcn/ui
- **State Management**:
  - Server state: Convex React hooks + TanStack Query
  - Client state: React hooks (useState, useReducer)
  - URL state: TanStack Router search params
  - Local storage: Preferences, theme, recent searches
- **Routing**: TanStack Router (file-based)
- **Icons**: lucide-react
- **Forms**: React Hook Form + Zod validation (if complex forms needed)

### Backend Stack
- **Database & Backend**: Convex
- **Authentication**: Convex Auth (Discord OAuth)
- **Functions**: Convex queries, mutations, actions
- **Real-time**: Convex subscriptions (automatic)

### Build & Deploy
- **Build Tool**: Vite
- **Package Manager**: npm
- **Deployment**: (TBD - likely Vercel for frontend, Convex Cloud for backend)
- **Environment Variables**: `.env.local` for `VITE_CONVEX_URL`

## Data Models

### Key Entities

#### Monster
- **Purpose**: Store complete monster stat blocks for reference
- **Key Fields**:
  - Identity: `name`, `slug`, `level`, `alignment`
  - Combat: `armor_class`, `hit_points`, `attacks`
  - Stats: `strength` through `charisma` (ability modifiers)
  - Special: `traits` array, `movement`
- **Relationships**: Referenced by `favorites`, `collectionItems`, `recentViews`
- **Indexes Needed**:
  - `by_slug` - Detail page lookups
  - `by_level` - Level filtering
  - `by_alignment` - Alignment filtering
  - `by_name` - Alphabetical sorting
  - `search_monsters` - Full-text search

#### Spell
- **Purpose**: Store complete spell descriptions and metadata
- **Key Fields**:
  - Identity: `name`, `slug`, `tier`
  - Metadata: `classes`, `range`, `duration`
  - Content: `description`
- **Relationships**: Referenced by `favorites`, `collectionItems`, `recentViews`
- **Indexes Needed**:
  - `by_slug` - Detail page lookups
  - `by_tier` - Tier filtering
  - `by_class` - Class filtering (array field)
  - `search_spells` - Full-text search

#### Favorite
- **Purpose**: Track user-saved monsters and spells
- **Key Fields**:
  - Reference: `userId`, `itemType`, `itemSlug`, `itemName`
  - Metadata: `addedAt`, `notes`
- **Relationships**: Belongs to `users`, references `monsters` or `spells` by slug
- **Indexes Needed**:
  - `by_userId` - All user favorites
  - `by_userId_and_type` - Filtered by type
  - `by_userId_and_itemSlug` - Check if item is favorited

#### UserProfile
- **Purpose**: Store user preferences and display information
- **Key Fields**:
  - Identity: `userId`, `displayName`, `avatarUrl`
  - Preferences: `themePreference`, `viewModePreference`, `favoriteFilters`
- **Relationships**: Belongs to `users` (Convex Auth)
- **Indexes Needed**:
  - `by_userId` - Single user lookup

## User Experience

### Key User Flows

#### 1. Quick Monster Lookup During Session
- **Entry point**: GM needs to reference a monster during play
- **Steps**:
  1. Open app on phone/tablet
  2. Tap search bar, type monster name
  3. See results immediately
  4. Tap monster card
  5. View full stat block
  6. Return to game
- **Success state**: GM has info within 5 seconds
- **Error states**:
  - No internet: Show cached/recent views
  - Not found: Suggest similar names

#### 2. Preparing an Encounter
- **Entry point**: GM is planning next session
- **Steps**:
  1. Navigate to monsters browser
  2. Filter by level range (party appropriate)
  3. Browse results
  4. Open several monsters in tabs
  5. Add promising ones to favorites or collection
  6. Add notes about how to use each
- **Success state**: GM has curated list for session
- **Error states**: No monsters in level range (suggest expanding range)

#### 3. Building a Spell List
- **Entry point**: Player leveled up, GM helping choose spells
- **Steps**:
  1. Navigate to spells browser
  2. Filter by tier (available to player)
  3. Filter by class (wizard or priest)
  4. Browse and compare options
  5. Favorite interesting spells
  6. Print or share list with player
- **Success state**: Player has spell options to review
- **Error states**: None in tier (shouldn't happen with full data)

#### 4. First-Time User Experience
- **Entry point**: New GM discovers the app
- **Steps**:
  1. Land on home page
  2. See clear description and main features
  3. Browse monsters without account
  4. Try to favorite, prompted to log in
  5. Log in with Discord
  6. Add favorites
  7. Return to app during next session
- **Success state**: User understands app value and creates account
- **Error states**:
  - Discord auth fails: Show clear error, retry button
  - Confused about features: Onboarding tooltips (optional)

## Integration Points

### Discord OAuth (Convex Auth)
- Already implemented
- Provides: `userId`, `displayName`, `avatarUrl`
- Used for: Authentication, user profiles, favorites ownership

### Convex Backend
- Real-time database and functions
- Handles: Data storage, queries, mutations, auth
- Configuration: `VITE_CONVEX_URL` environment variable

### shadcn/ui Components
- Already integrated
- Provides: Pre-built accessible components
- Customized with: Tailwind theme, dark mode support

## Assumptions & Constraints

### Assumptions
- Users have internet access during sessions (no offline mode in MVP)
- Discord OAuth is acceptable auth method for target users
- Monster and spell data from `coreData` is complete and accurate
- Users primarily access on tablets/phones at game table
- Search can be implemented efficiently with Convex search indexes

### Constraints
- Must comply with Shadowdark third-party license
- Must attribute original data source (open-shadowdark)
- Cannot modify or sell core Shadowdark content
- Performance must support real-time use during sessions
- Must be free for users (monetization out of scope)

### Technical Constraints
- Convex free tier limits (if applicable)
- Search index limitations in Convex
- Array field indexing complexity (for spell classes)
- Cannot use Convex HTTP actions for OAuth (using Convex Auth instead)

## Success Metrics

### Primary KPIs
- **Active Users**: Weekly active GMs using the app
- **Session Usage**: % of users who return during session (within 2-7 days)
- **Search Performance**: Average search result time < 500ms
- **Favorites Adoption**: % of authenticated users who add favorites

### Secondary KPIs
- **Repeat Usage**: Users returning 2+ times per week
- **Favorites Per User**: Average # of favorited items
- **Browse vs Search**: % of traffic to browse pages vs search
- **Mobile vs Desktop**: Device breakdown (expect 70%+ mobile)

### User Satisfaction
- Page load time < 2 seconds (measured)
- Zero critical bugs in production
- Positive user feedback (if feedback mechanism added)
- Lighthouse scores: Performance > 90, Accessibility > 95

## SEO Requirements

### Page-Specific SEO

#### Monster Detail Pages
- **Title**: `{Monster Name} - Level {X} Monster | Shadowdark GM Tools`
- **Meta Description**: First 150 chars of monster description
- **Open Graph**: Monster name, level, AC, HP
- **Structured Data**: JSON-LD for Game content type
- **Canonical URL**: `/monsters/{slug}`

#### Spell Detail Pages
- **Title**: `{Spell Name} - Tier {X} Spell | Shadowdark GM Tools`
- **Meta Description**: First 150 chars of spell description
- **Open Graph**: Spell name, tier, classes, range
- **Structured Data**: JSON-LD for Article/Guide
- **Canonical URL**: `/spells/{slug}`

#### Browse Pages
- **Title**: `Browse {Monsters|Spells} | Shadowdark GM Tools`
- **Meta Description**: "Browse and search all Shadowdark {monsters|spells}. Filter by level, class, and more. Free tool for Game Masters."
- **Canonical URL**: `/monsters` or `/spells` (ignore query params)

### Technical SEO
- Server-side rendering with TanStack Start
- Sitemap.xml with all monsters and spells
- Robots.txt allowing all crawlers
- Mobile-friendly (responsive design)
- Fast page loads (< 2s)
- No broken links

### Performance for SEO
- **Core Web Vitals Targets**:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1
- Optimize images (lazy loading, WebP format)
- Minimize JavaScript bundle size
- Use CDN for static assets (if applicable)

## Open Questions

### Product Questions
- [ ] Should favorites have folders/categories beyond collections?
- [ ] Should we support exporting favorites as PDF or text?
- [ ] Do we need print-optimized stat blocks or is standard view sufficient?
- [ ] Should collections be shareable via public URLs in MVP or Phase 2?
- [ ] Do users want to sort favorites by different criteria (alphabetical, level, recently added)?

### Technical Questions
- [ ] What's the best approach for handling the spell `classes` array field in Convex indexes?
- [ ] Should we implement pagination or infinite scroll for browse pages?
- [ ] Do we need a separate seeding script or can we use a one-time mutation?
- [ ] Should we denormalize data (store full monster/spell in favorites) or always join?
- [ ] What's the performance impact of full-text search on descriptions vs names only?
- [ ] Should we implement optimistic updates for all mutations or just favorites?

### Design Questions
- [ ] What visual theme best represents Shadowdark aesthetic (dark, gritty, minimalist)?
- [ ] Should stat blocks use traditional D&D layout or a custom Shadowdark-specific format?
- [ ] How should we differentiate wizard vs priest spells visually (color, icons, both)?
- [ ] What's the best mobile layout for filters (drawer, accordion, tabs)?
- [ ] Should we use card or table layout for browse views (or toggle between them)?

### Deployment Questions
- [ ] What's the deployment strategy (Vercel, Netlify, other)?
- [ ] Do we need staging environment before production?
- [ ] How do we handle database migrations in Convex?
- [ ] What monitoring/analytics should we set up (Vercel Analytics, PostHog, etc.)?
- [ ] Do we need error tracking (Sentry, LogRocket)?

---

## Implementation Priorities

### Must Have (MVP - Milestones 1-3)
1. Monster database with search and filters
2. Spell database with search and filters
3. Favorites system for authenticated users
4. Basic responsive design
5. Discord OAuth authentication (done)
6. Fast search (< 1s results)

### Should Have (Post-MVP - Milestone 4)
1. Loading states and skeleton screens
2. Error handling and empty states
3. Performance optimization (< 500ms search)
4. Accessibility compliance (WCAG AA)
5. Responsive design refinement
6. SEO optimization

### Nice to Have (Future - Milestone 5)
1. Collections/lists organization
2. Advanced filtering (traits, movement types)
3. Recent views history
4. Quick reference mode
5. Saved filter presets
6. Social sharing features

---

## Development Timeline Estimates

### Milestone 1: Monster Database
- **Estimated Time**: 5-7 days
- **Breakdown**:
  - Data seeding: 1 day
  - Browser page: 2 days
  - Detail page: 1.5 days
  - Search functionality: 1.5 days
  - Testing & refinement: 1 day

### Milestone 2: Spell Database
- **Estimated Time**: 4-6 days
- **Breakdown**:
  - Data seeding: 0.5 days
  - Browser page: 1.5 days
  - Detail page: 1 day
  - Search & filters: 1.5 days
  - Testing & refinement: 1 day

### Milestone 3: Favorites System
- **Estimated Time**: 4-5 days
- **Breakdown**:
  - Backend schema & functions: 1 day
  - Favorite button component: 1 day
  - Favorites page: 1.5 days
  - Integration throughout app: 0.5 days
  - Testing: 1 day

### Milestone 4: Polish & Performance
- **Estimated Time**: 5-7 days
- **Breakdown**:
  - Loading states: 1 day
  - Error handling: 1 day
  - Performance optimization: 2 days
  - Responsive refinement: 1.5 days
  - Accessibility: 1.5 days

### Milestone 5: Enhanced Features (Phase 2)
- **Estimated Time**: 8-10 days
- **Breakdown**:
  - Advanced filtering: 2 days
  - Collections system: 3 days
  - Quick reference mode: 1.5 days
  - Recent views: 1 day
  - Testing & polish: 2 days

**Total MVP (M1-M3)**: 13-18 days
**Total with Polish (M1-M4)**: 18-25 days
**Total with Enhancements (M1-M5)**: 26-35 days

---

## Notes for Implementation

### Code Organization
- **Components**: Organize by feature (monsters/, spells/, favorites/, shared/ui/)
- **Hooks**: Custom hooks in `src/hooks/` (useDebounce, useFavorites, etc.)
- **Utils**: Helper functions in `src/utils/` (formatting, parsing, etc.)
- **Types**: Shared types in `src/types/` or use Convex-generated types

### Testing Strategy
- **Manual Testing**: Each feature tested across devices before marking complete
- **Browser Testing**: Chrome, Safari, Firefox (mobile and desktop)
- **Device Testing**: iPhone, iPad, Android phone
- **Performance Testing**: Lighthouse CI on each milestone

### Documentation Needs
- README with setup instructions
- Environment variable configuration
- Deployment guide
- Convex schema documentation
- Component props documentation (for complex components)

### Future Considerations
- Analytics integration (user behavior, popular monsters/spells)
- User feedback mechanism (ratings, comments)
- Encounter builder (calculate CR, balance encounters)
- Dice roller integration
- Initiative tracker
- Session notes
- Campaign management
- Custom content creation (homebrew monsters/spells)
- Multi-user collaboration (shared collections)
- Mobile app (React Native or PWA)

---

## Appendix

### Shadowdark License & Attribution
- **License**: Third-Party License
- **Attribution Required**: "Shadowdark RPG content used under license"
- **Source**: open-shadowdark repository (GitHub)
- **Restrictions**: Cannot modify core content, cannot charge for access to core content
- **Implementation**: Display attribution in footer, about page, and any documentation

### Data Source Details
- **Monsters**: `coreData/monsters.json` (~100 monsters)
- **Spells**: `coreData/spells.json` (~100 spells)
- **Format**: JSON arrays with consistent schema
- **Completeness**: All core Shadowdark content included
- **Updates**: Manual updates when new content released (not in scope for MVP)

### Design Assets Needed
- Logo for Shadowdark GM Tools (custom or text-based)
- Favicon
- Social media preview image (Open Graph)
- Icons for classes (wizard hat, holy symbol)
- Icons for spell ranges (close, near, far, etc.)
- Empty state illustrations (optional)
- Loading animations (optional)

### Browser Support
- **Target**: Modern browsers (last 2 versions)
- **Chrome**: Full support
- **Safari**: Full support (iOS Safari crucial for mobile)
- **Firefox**: Full support
- **Edge**: Full support
- **IE**: Not supported

---

## Conclusion

This specification provides a comprehensive roadmap for building the Shadowdark GM Tools application. The phased approach allows for iterative development and early user feedback while maintaining a clear vision for the complete product.

**Next Steps**:
1. Review and validate this specification with stakeholders
2. Clarify open questions
3. Begin implementation with Milestone 1 (Monster Database)
4. Set up project tracking (tickets for each feature)
5. Establish regular review cadence

**Success Definition**: The application successfully reduces the time GMs spend searching for monster and spell information during sessions, improving gameplay flow and GM confidence.
