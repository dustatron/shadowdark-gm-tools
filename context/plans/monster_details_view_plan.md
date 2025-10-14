# Monster Details View - Product Requirements Document

## Overview

**Project Goal**: Create a dedicated monster details page that displays comprehensive information about a single monster when selected from the monster search table.

**Target Users**: Shadowdark Game Masters who need quick access to detailed monster statistics, abilities, and traits during game sessions.

**Key Value Proposition**: Provides an organized, readable view of all monster information in one place, eliminating the need to reference physical books or scroll through search results during gameplay.

## Project Scope

### In Scope

- Dedicated route for viewing individual monster details
- Click navigation from monster table rows to details page
- Comprehensive display of all monster stats and traits
- Navigation controls (back button, breadcrumbs)
- Error handling for invalid or non-existent monster IDs
- Mobile-responsive layout
- SEO optimization for monster detail pages

### Out of Scope

- Editing or modifying monster data
- Comparing multiple monsters side-by-side
- Saving or favoriting monsters (future feature)
- Printing or PDF export functionality
- Custom monster creation
- Combat initiative tracking or dice rolling

## Milestones

### Milestone 1: Core Details Page - Route and Data Fetching

**Goal**: Establish the details page route structure and implement data fetching for a single monster.

**Features**:

- **Dynamic Route Setup**
  - Description: Create a dynamic route at `/monsters/$monsterId` that accepts a monster ID parameter
  - User Flow: User clicks monster row -> navigates to `/monsters/[id]` -> sees loading state -> views details
  - Frontend Requirements:
    - Create `src/routes/monsters/$monsterId.tsx` file following TanStack Start conventions
    - Use route params validation to ensure valid monster ID format
    - Implement loader function with proper error handling
    - Add Suspense boundary for loading states
  - Backend Requirements (Convex):
    - Create new query `getMonsterById` in `convex/monsters.ts`
    - Query args: `{ id: v.id('monsters') }`
    - Returns: Single monster object or null if not found
    - Use direct ID lookup (most efficient): `ctx.db.get(args.id)`
  - Acceptance Criteria:
    - [ ] Route `/monsters/$monsterId` properly loads with valid monster ID
    - [ ] Page shows loading skeleton during data fetch
    - [ ] Convex query efficiently fetches monster by ID
    - [ ] Invalid IDs are caught and handled gracefully

- **Monster Table Row Navigation**
  - Description: Make monster table rows clickable and navigate to details page
  - User Flow: User clicks anywhere on monster row -> navigates to details page with smooth transition
  - Frontend Requirements:
    - Modify `MonsterTableRow.tsx` to be a clickable element
    - Use TanStack Router's `Link` component or navigate function
    - Add appropriate cursor styling and hover states
    - Maintain accessibility with proper ARIA roles
    - Include visual feedback on click (optional ripple or press state)
  - Backend Requirements (Convex):
    - No additional backend changes needed
  - Acceptance Criteria:
    - [ ] Monster table rows are clickable with clear visual affordance
    - [ ] Clicking row navigates to correct details page
    - [ ] Navigation preserves browser history (back button works)
    - [ ] Keyboard navigation works (Enter key activates row)
    - [ ] Hover state provides clear visual feedback

### Milestone 2: Details Page UI - Stats Display

**Goal**: Design and implement the visual layout for displaying monster statistics in an organized, readable format.

**Features**:

- **Page Header Section**
  - Description: Display monster name, level, and key identity information prominently at the top
  - User Flow: User lands on page -> immediately sees monster name and level in large, clear typography
  - Frontend Requirements:
    - Large, bold monster name (text-3xl or text-4xl)
    - Level badge/pill displayed prominently near name
    - Alignment indicator with proper formatting (use existing `formatAlignment`)
    - Optional visual divider or hero section styling
    - Responsive sizing (smaller on mobile)
  - Backend Requirements (Convex):
    - No additional changes (data already fetched)
  - Acceptance Criteria:
    - [ ] Monster name is prominently displayed and readable
    - [ ] Level is clearly visible with proper formatting
    - [ ] Header section looks polished on all screen sizes
    - [ ] Typography hierarchy is clear and accessible

- **Core Stats Grid**
  - Description: Display primary combat stats (AC, HP, Movement, Attacks) in a scannable grid layout
  - User Flow: User scrolls down from header -> sees all critical combat stats organized in a grid
  - Frontend Requirements:
    - Grid layout (2x2 on mobile, 4x1 or 2x2 on desktop)
    - Each stat in a card/section with label and value
    - Use existing utility formatters: `formatArmorClass`, `formatHitPoints`, `formatMovement`
    - Consistent spacing and visual hierarchy
    - Clear labels: "Armor Class", "Hit Points", "Movement", "Attacks"
    - Attacks field displayed as formatted text (may span multiple lines)
  - Backend Requirements (Convex):
    - No additional changes
  - Acceptance Criteria:
    - [ ] All core stats are displayed clearly and accurately
    - [ ] Grid layout is responsive and readable on mobile
    - [ ] Formatters apply consistent styling
    - [ ] Stats are scannable at a glance during gameplay

- **Ability Scores Section**
  - Description: Display all six D&D ability scores (STR, DEX, CON, INT, WIS, CHA) with modifiers
  - User Flow: User needs to reference a stat modifier -> finds ability scores below core stats
  - Frontend Requirements:
    - Horizontal row of 6 ability scores on desktop
    - Grid (2x3 or 3x2) on mobile
    - Each score shows: ability name, numeric value, and modifier
    - Modifier formatted as +X or -X (create helper if needed)
    - Compact but readable presentation
    - Consider using existing game-style formatting (e.g., stat blocks)
  - Backend Requirements (Convex):
    - No additional changes (ability scores already in monster schema)
  - Acceptance Criteria:
    - [ ] All six ability scores are displayed
    - [ ] Modifiers are calculated correctly from scores
    - [ ] Layout is compact and easy to scan
    - [ ] Formatting follows RPG stat block conventions

### Milestone 3: Traits and Description Display

**Goal**: Display monster traits, special abilities, and descriptive text in a clear, organized manner.

**Features**:

- **Description Section**
  - Description: Display the monster's flavor text and lore description
  - User Flow: User wants to learn about monster lore -> reads description section below stats
  - Frontend Requirements:
    - Full-width text section with comfortable line length (max-w-prose)
    - Readable typography (text-base or text-lg)
    - Proper paragraph spacing
    - Positioned after core stats but before traits
    - Consider italic or different styling to distinguish from mechanics
  - Backend Requirements (Convex):
    - No changes needed (description field exists)
  - Acceptance Criteria:
    - [ ] Description text is readable and well-formatted
    - [ ] Line length is comfortable for reading (not too wide)
    - [ ] Text styling distinguishes it as flavor/lore content

- **Traits List Display**
  - Description: Display all monster traits with names and descriptions in an organized list
  - User Flow: User needs to check special ability -> scrolls to traits section -> reads ability details
  - Frontend Requirements:
    - Section with "Special Traits" or "Abilities" heading
    - Each trait displayed as:
      - Bold trait name
      - Description text with proper formatting
    - List or card-based layout
    - Consider expandable/collapsible if many traits (optional enhancement)
    - Clear visual separation between traits
    - Empty state if no traits exist ("This monster has no special traits")
  - Backend Requirements (Convex):
    - No changes needed (traits array exists in schema)
  - Acceptance Criteria:
    - [ ] All traits are displayed with names and descriptions
    - [ ] Traits are visually separated and scannable
    - [ ] Empty state displays appropriately
    - [ ] Trait descriptions are readable with proper formatting

### Milestone 4: Navigation and Error Handling

**Goal**: Implement robust navigation controls and error handling for edge cases.

**Features**:

- **Back Navigation**
  - Description: Provide clear way to return to monster search results
  - User Flow: User finishes viewing monster -> clicks back button -> returns to search page
  - Frontend Requirements:
    - Back button in top-left or breadcrumb area
    - Use router's navigation history or explicit link to `/monsters`
    - Button styled consistently with app design system
    - Optional: preserve search state when returning (future enhancement)
    - Keyboard shortcut support (optional)
  - Backend Requirements (Convex):
    - No changes needed
  - Acceptance Criteria:
    - [ ] Back button is clearly visible
    - [ ] Clicking back returns to monster search page
    - [ ] Browser back button also works correctly
    - [ ] Navigation feels smooth and predictable

- **Breadcrumb Navigation**
  - Description: Display breadcrumb trail showing current location in app hierarchy
  - User Flow: User wants context of where they are -> glances at breadcrumbs
  - Frontend Requirements:
    - Breadcrumb component showing: Home > Monsters > [Monster Name]
    - Each segment is clickable link (except current page)
    - Positioned at top of page above header
    - Responsive: may collapse on mobile
    - Use semantic HTML (nav + ol) for accessibility
  - Backend Requirements (Convex):
    - No changes needed
  - Acceptance Criteria:
    - [ ] Breadcrumbs display correct hierarchy
    - [ ] All links navigate to correct pages
    - [ ] Current page is indicated but not clickable
    - [ ] Works with screen readers

- **Error States**
  - Description: Handle cases where monster doesn't exist or ID is invalid
  - User Flow: User navigates to invalid URL -> sees helpful error message -> can navigate back
  - Frontend Requirements:
    - 404 error component for non-existent monsters
    - Clear error message: "Monster not found"
    - Suggestion to return to monster search
    - Link/button to navigate back to `/monsters`
    - Consistent error styling with rest of app
    - Log error to console for debugging
  - Backend Requirements (Convex):
    - `getMonsterById` should return null if not found (already handled)
    - No throwing errors for not-found case
  - Acceptance Criteria:
    - [ ] Non-existent monster IDs show 404 error
    - [ ] Invalid ID formats show appropriate error
    - [ ] Error messages are clear and helpful
    - [ ] User can easily navigate away from error state
    - [ ] Errors don't crash the application

### Milestone 5: SEO and Polish

**Goal**: Optimize for search engines and add final polish for production readiness.

**Features**:

- **SEO Optimization**
  - Description: Add proper meta tags and structured data for search engine visibility
  - User Flow: User searches "Shadowdark Aboleth" on Google -> finds direct link to monster page
  - Frontend Requirements:
    - Dynamic page title: "[Monster Name] - Shadowdark GM Tools"
    - Meta description: First 150 chars of monster description
    - Open Graph tags for social sharing:
      - og:title
      - og:description
      - og:type: "article"
    - Canonical URL
    - JSON-LD structured data (optional but recommended):
      - Schema.org Game content type or Article
      - Include monster name, description, level
    - Implement in route's `head` function or meta export
  - Backend Requirements (Convex):
    - No changes needed
  - Acceptance Criteria:
    - [ ] Page titles are dynamic and descriptive
    - [ ] Meta descriptions accurately describe monster
    - [ ] Open Graph tags display correctly in social preview
    - [ ] Structured data validates with Google's testing tool
    - [ ] Search engines can crawl and index pages

- **Mobile Responsiveness**
  - Description: Ensure excellent experience on all device sizes
  - User Flow: User opens details page on phone during game session -> all content is readable and usable
  - Frontend Requirements:
    - Test on multiple breakpoints: mobile (375px), tablet (768px), desktop (1024px+)
    - Stack sections vertically on mobile
    - Adjust font sizes for readability
    - Ensure touch targets are at least 44x44px
    - No horizontal scrolling required
    - Stats grid adapts to screen width
    - Ability scores wrap appropriately
  - Backend Requirements (Convex):
    - No changes needed
  - Acceptance Criteria:
    - [ ] All content is readable on 375px width
    - [ ] No horizontal scrolling on any screen size
    - [ ] Touch targets are appropriately sized
    - [ ] Layout adapts smoothly between breakpoints
    - [ ] Typography scales appropriately

- **Loading States and Polish**
  - Description: Add smooth loading transitions and final visual polish
  - User Flow: User navigates to details page -> sees skeleton loader -> content fades in smoothly
  - Frontend Requirements:
    - Skeleton loader matching page layout
    - Smooth content fade-in transition
    - Loading spinner or shimmer effect
    - Consistent spacing and padding throughout
    - Dark mode support (already in app, ensure compatibility)
    - Focus management on navigation
    - Polish hover states and transitions
  - Backend Requirements (Convex):
    - No changes needed
  - Acceptance Criteria:
    - [ ] Loading state matches page layout structure
    - [ ] Transitions are smooth and not jarring
    - [ ] Dark mode looks polished
    - [ ] Spacing is consistent throughout page
    - [ ] All interactive elements have hover states

## Technical Requirements

### Frontend Stack

- React 19 + TypeScript
- TanStack Start (file-based routing)
- TanStack Router (dynamic routes with params)
- TanStack Query + Convex React hooks
- TailwindCSS 4

### Backend Stack

- Convex (real-time database)
- No external APIs required

### SEO Requirements

- Dynamic page titles with monster names
- Meta descriptions from monster descriptions (150 char limit)
- Open Graph tags for social sharing
- Canonical URLs for all monster pages
- Structured data (JSON-LD) for rich search results
- Server-side rendering support (TanStack Start provides this)
- Target Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

## Data Models

### Key Entities

**Monster** (existing)
- Purpose: Store all monster data for the Shadowdark RPG system
- Key Fields:
  - `_id`: Unique identifier used for routing
  - `name`: Display name for monster
  - `slug`: URL-friendly identifier (currently indexed, may use for future SEO URLs)
  - `description`: Lore and flavor text
  - `armor_class`, `armor_type`, `hit_points`: Defense stats
  - `attacks`: Attack patterns and damage
  - `movement`: Movement types and speeds
  - `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`: Ability scores
  - `alignment`: Moral alignment (L/C/N)
  - `level`: Challenge/threat level
  - `traits`: Array of special abilities
- Relationships: None (standalone entity)
- Indexes Needed:
  - `by_slug`: Existing index (may use in future for slug-based URLs)
  - No new indexes required (ID lookup is direct)

## User Experience

### Key User Flows

1. **View Monster from Search**
   - Entry point: User is on `/monsters` page viewing search results
   - Steps:
     1. User clicks on monster row in table
     2. App navigates to `/monsters/[monsterId]`
     3. Loading skeleton displays immediately
     4. Monster data loads from Convex
     5. Details page renders with all information
   - Success state: User sees comprehensive monster details with all stats, abilities, and description
   - Error states:
     - Monster not found: Show 404 with link back to search
     - Network error: Show retry message with refresh button

2. **Direct Navigation to Monster**
   - Entry point: User has bookmarked or shared a monster URL
   - Steps:
     1. User navigates directly to `/monsters/[monsterId]` URL
     2. Loading state displays
     3. Monster data loads
     4. Page renders
   - Success state: Page loads successfully with all content
   - Error states: Same as Flow 1

3. **Return to Search**
   - Entry point: User is viewing monster details
   - Steps:
     1. User clicks back button or breadcrumb link
     2. App navigates to `/monsters`
     3. Search page loads (may need to refetch)
   - Success state: Returns to monster search page
   - Error states: Minimal (navigation should always work)

## Integration Points

- TanStack Router: For dynamic routing and navigation
- Convex React Hooks: For data fetching with suspense
- TanStack Query: For caching and query management
- TailwindCSS: For styling and responsive design

## Assumptions & Constraints

### Technical Assumptions
- Monster IDs in URLs are Convex IDs (format: `k_xxxxx`)
- All monsters have required fields (name, level, core stats)
- Traits array may be empty for some monsters
- Description field is always present (may be empty string)
- Existing utility formatters work correctly

### Business Constraints
- Must maintain existing monster search functionality
- Should not slow down overall app performance
- Monster data is read-only (no editing)

### Timeline Considerations
- Milestone 1-2: Day 1 (routing and basic display)
- Milestone 3: Day 2 (traits and description)
- Milestone 4: Day 2-3 (navigation and errors)
- Milestone 5: Day 3 (SEO and polish)
- Total estimated time: 3 days for complete implementation

## Success Metrics

- Page load time < 2 seconds on 3G connection
- Zero navigation errors in production
- 100% of monsters accessible via details page
- Mobile usability score > 90 (Lighthouse)
- SEO score > 90 (Lighthouse)
- Zero accessibility violations (WAVE tool)

## Open Questions

- [ ] Should we use slug-based URLs (`/monsters/aboleth`) instead of ID-based (`/monsters/k_xxx`)? Pros: Better SEO, readable URLs. Cons: Requires slug uniqueness validation, more complex routing.
- [ ] Do we need to preserve search state when returning from details page? (e.g., search term, scroll position)
- [ ] Should traits be collapsible on mobile to save screen space?
- [ ] Do we want to add "previous/next monster" navigation within details page?
- [ ] Should we implement a share button for copying monster URLs?
- [ ] Do we need print-friendly styling for physical reference sheets?
