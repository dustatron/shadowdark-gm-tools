# Spell Details View - Product Requirements Document

## Overview

**Project Goal**: Enable users to view comprehensive details of individual spells by clicking on spell entries from the spell search page

**Target Users**: Game Masters running Shadowdark RPG sessions who need detailed information about specific spells for gameplay reference

**Key Value Proposition**: Provides quick access to full spell information in a clean, readable layout, improving the GM's ability to reference spells during gameplay without switching to external resources

## Project Scope

### In Scope

- Dedicated spell details page at `/spells/$slug` route
- Navigation from spell search table rows to details page
- Complete spell information display (name, tier, classes, range, duration, description)
- Breadcrumb navigation and back button
- 404 handling for non-existent spells
- Loading states with skeleton UI
- Mobile-responsive layout
- SEO metadata for spell pages

### Out of Scope

- Spell favoriting/bookmarking (future feature)
- Spell comparison view
- User notes or annotations on spells
- Spell filtering by multiple criteria on details page
- Print-friendly view (future enhancement)
- Sharing spell details via URL shortening

## Milestones

### Milestone 1: Backend Data Layer - Convex Query Function

**Goal**: Create the Convex query function to fetch individual spells by slug

**Features**:

- **getSpellBySlug Query Function**
  - Description: Convex query that retrieves a single spell document by its slug identifier
  - User Flow: Called automatically when user navigates to `/spells/$slug` URL
  - Frontend Requirements:
    - None (backend-only milestone)
  - Backend Requirements (Convex):
    - New query function in `convex/spells.ts`: `getSpellBySlug`
    - Function signature:
      - Args: `{ slug: v.string() }`
      - Returns: Spell object or null if not found
    - Query implementation:
      - Use the existing `by_slug` index (already defined in schema)
      - Query pattern: `.withIndex('by_slug', (q) => q.eq('slug', args.slug))`
      - Return first result or null
    - Type safety: Full validator for spell object shape
  - Acceptance Criteria:
    - [ ] Function `getSpellBySlug` exists in `convex/spells.ts`
    - [ ] Function uses modern syntax with `args` and `returns` validators
    - [ ] Function queries using `by_slug` index (not filter)
    - [ ] Function returns null when spell slug doesn't exist
    - [ ] Function returns complete spell object when slug exists
    - [ ] Return validator matches spell schema exactly
    - [ ] Function can be imported via `api.spells.getSpellBySlug`

### Milestone 2: Frontend Route and Basic Structure

**Goal**: Create the TanStack Start route file with basic page structure and navigation

**Features**:

- **Spell Details Route File**
  - Description: File-based route that handles `/spells/$slug` URLs and orchestrates the details view
  - User Flow:
    1. User clicks spell row in search table
    2. Router navigates to `/spells/[slug]`
    3. Page displays breadcrumbs, back button, and spell details
  - Frontend Requirements:
    - New route file: `src/routes/spells/$slug.tsx`
    - File structure following TanStack Start conventions
    - Export `Route` with `createFileRoute('/spells/$slug')`
    - Three component structure:
      1. `SpellDetailsPage` - container with navigation
      2. `SpellDetailsContent` - data fetching wrapper
      3. `SpellDetailsLoading` - skeleton UI
    - Use `Route.useParams()` to extract slug from URL
    - Suspense boundary around content for loading state
    - Breadcrumb navigation:
      - Home > Spells > [spell-name]
      - Uses TanStack Router `Link` component
      - Accessible with proper ARIA labels
    - Back button:
      - "Back to Spells" link to `/spells`
      - Icon + text (arrow icon)
      - Positioned above main content
    - 404 error state when spell is null
  - Backend Requirements (Convex):
    - None (uses query from Milestone 1)
  - Acceptance Criteria:
    - [ ] Route file created at `src/routes/spells/$slug.tsx`
    - [ ] Route exports `createFileRoute('/spells/$slug')`
    - [ ] Component extracts slug from `Route.useParams()`
    - [ ] Breadcrumb navigation renders correctly
    - [ ] Back button links to `/spells` route
    - [ ] Suspense boundary wraps content component
    - [ ] Loading skeleton displays during data fetch
    - [ ] 404 state shows when spell not found
    - [ ] 404 includes link back to spell search

### Milestone 3: Spell Details Component and Display

**Goal**: Create the SpellDetails component to display all spell information in a structured, readable layout

**Features**:

- **SpellDetails Component**
  - Description: Presentational component that renders full spell information with visual hierarchy
  - User Flow: Automatically displays once spell data loads
  - Frontend Requirements:
    - New component file: `src/components/spells/SpellDetails.tsx`
    - Component accepts `spell: Spell` prop
    - Layout structure:
      1. **Header Section**:
         - Spell name (h1, large, bold)
         - Tier badge (colored pill, positioned inline)
         - Classes badges (multi-pill display)
      2. **Quick Stats Grid** (2-col on mobile, 4-col on desktop):
         - Range card
         - Duration card
         - Tier card (repeated from header for symmetry)
         - Classes card (repeated from header)
      3. **Description Section**:
         - Full spell description text
         - Bordered card with padding
         - Preserved whitespace for readability
    - Styling approach:
      - Reuse card patterns from MonsterDetails
      - TailwindCSS 4 utilities
      - Dark mode support
      - Consistent spacing (space-y-8 for sections)
    - Use utility formatters for consistent display:
      - `formatTier()` - capitalize tier display
      - `formatRange()` - format range text
      - `formatDuration()` - format duration text
      - `getTierColorClasses()` - tier badge color
      - `getClassBadgeColor()` - class badge color
  - Backend Requirements (Convex):
    - None (uses spell data from query)
  - Acceptance Criteria:
    - [ ] Component created at `src/components/spells/SpellDetails.tsx`
    - [ ] Component accepts typed `spell` prop
    - [ ] Spell name displays as h1 with proper styling
    - [ ] Tier badge shows with color coding (1=green, 5=pink)
    - [ ] Class badges render for all classes in array
    - [ ] Quick stats grid displays 4 cards
    - [ ] Description section shows full text with proper whitespace
    - [ ] All sections use consistent card styling
    - [ ] Component is responsive (mobile and desktop)
    - [ ] Dark mode styles work correctly
    - [ ] Uses spellHelpers utility formatters

### Milestone 4: Update Spell Table Row for Navigation

**Goal**: Make spell table rows clickable to navigate to detail pages

**Features**:

- **Clickable Spell Rows**
  - Description: Convert SpellTableRow to use Link component for navigation
  - User Flow:
    1. User hovers over spell row
    2. Row highlights to indicate clickability
    3. User clicks anywhere on row
    4. Router navigates to `/spells/[slug]`
  - Frontend Requirements:
    - Update `src/components/spells/SpellTableRow.tsx`
    - Replace root `div` with TanStack Router `Link` component
    - Set `to="/spells/$slug"` prop
    - Pass `params={{ slug: spell.slug }}` prop
    - Maintain all existing styling and grid layout
    - Ensure hover state indicates clickability
    - Add cursor-pointer if not already present
    - Preserve all ARIA roles for accessibility
  - Backend Requirements (Convex):
    - None (uses existing spell.slug field)
  - Acceptance Criteria:
    - [ ] SpellTableRow imports Link from @tanstack/react-router
    - [ ] Root element changed from div to Link
    - [ ] Link has `to="/spells/$slug"` prop
    - [ ] Link has `params={{ slug: spell.slug }}` prop
    - [ ] Hover state clearly indicates row is clickable
    - [ ] Clicking row navigates to spell details page
    - [ ] All existing styling preserved
    - [ ] Grid layout remains unchanged
    - [ ] Accessibility roles still present
    - [ ] No TypeScript errors

### Milestone 5: SEO Metadata and Finalization

**Goal**: Add SEO metadata for spell detail pages and perform final testing

**Features**:

- **SEO Metadata**
  - Description: Dynamic page titles and meta descriptions for spell pages
  - User Flow: Improves search engine discoverability and browser tab titles
  - Frontend Requirements:
    - Update route file `src/routes/spells/$slug.tsx`
    - Add dynamic document title: "Spell Name | Shadowdark GM Tools"
    - Add meta description using first 155 characters of spell description
    - Optional: Add Open Graph tags for social sharing
    - Use TanStack Start's head management pattern (if available)
  - Backend Requirements (Convex):
    - None
  - Acceptance Criteria:
    - [ ] Browser tab shows spell name in title
    - [ ] Title follows format: "[Spell Name] | Shadowdark GM Tools"
    - [ ] Meta description tag exists with spell description
    - [ ] Meta description truncated to 155 chars if needed
    - [ ] Page title updates when navigating between spells

- **Final Testing and Polish**
  - Description: Comprehensive testing across devices and browsers
  - User Flow: Ensures quality user experience
  - Frontend Requirements:
    - Test navigation flow: search -> details -> back -> search
    - Test direct URL access to spell detail pages
    - Test 404 behavior with invalid slugs
    - Test loading states on slow connections
    - Test mobile responsiveness (320px to 1920px)
    - Test dark mode on all pages
    - Verify accessibility with keyboard navigation
    - Check for console errors/warnings
    - Run TypeScript type checking: `npm run build`
  - Backend Requirements (Convex):
    - Verify query performance with by_slug index
  - Acceptance Criteria:
    - [ ] All navigation flows work correctly
    - [ ] Direct URL access works
    - [ ] 404 page displays for invalid slugs
    - [ ] Loading skeletons match content layout
    - [ ] Responsive design works on all screen sizes
    - [ ] Dark mode works consistently
    - [ ] Keyboard navigation is fully functional
    - [ ] No console errors or warnings
    - [ ] TypeScript compiles without errors
    - [ ] Query uses index (verified in Convex dashboard)

## Technical Requirements

### Frontend Stack

- React 19 + TypeScript
- TanStack Start (file-based routing)
- TanStack Query (via @convex-dev/react-query)
- TailwindCSS 4
- Existing utility libraries (spellHelpers)

### Backend Stack

- Convex (real-time database)
- Existing spells schema with by_slug index

### SEO Requirements

- Dynamic page titles showing spell names
- Meta descriptions from spell descriptions (truncated to 155 chars)
- Proper semantic HTML (h1, article structure)
- Fast page loads (Core Web Vitals target: LCP < 2.5s)
- Crawlable URLs (server-side rendering via TanStack Start)

## Data Models

### Key Entities

**Spell**

- Purpose: Stores spell information from Shadowdark RPG
- Key Fields:
  - `_id`: Document ID (auto-generated by Convex)
  - `name`: Spell display name (e.g., "Magic Missile")
  - `slug`: URL-safe identifier (e.g., "magic-missile")
  - `description`: Full spell description text
  - `tier`: Spell power level (string: "1", "2", "3", "4", "5")
  - `classes`: Array of classes that can use spell (["wizard", "priest"])
  - `range`: Spell range description (e.g., "60 feet", "Self", "Touch")
  - `duration`: Spell duration (e.g., "Instantaneous", "Concentration, 1 minute")
- Relationships: No direct relationships (standalone entity)
- Indexes Needed:
  - `by_slug`: Efficient lookup for detail pages (ALREADY EXISTS in schema)
  - `by_name`: For search functionality (ALREADY EXISTS in schema)

## User Experience

### Key User Flows

1. **Spell Search to Details Flow**
   - Entry point: User on `/spells` search page with results visible
   - Steps:
     1. User identifies spell of interest in table
     2. User clicks anywhere on spell row
     3. Page navigates to `/spells/[slug]`
     4. Loading skeleton displays briefly
     5. Full spell details render
   - Success state: User sees complete spell information with clear hierarchy
   - Error states:
     - Invalid slug: 404 page with link back to search
     - Network error: Error boundary catches and displays error message

2. **Direct URL Access Flow**
   - Entry point: User pastes or bookmarks spell detail URL
   - Steps:
     1. User navigates to `/spells/[slug]` directly
     2. Page loads with loading skeleton
     3. Spell details render (or 404 if invalid)
   - Success state: User sees spell details without needing to search
   - Error states: Same as above

3. **Navigation Back to Search Flow**
   - Entry point: User on spell details page
   - Steps:
     1. User clicks "Back to Spells" button OR breadcrumb "Spells" link
     2. Router navigates to `/spells`
     3. Search results still visible (if state preserved)
   - Success state: User returns to search without losing context
   - Error states: None (navigation always succeeds)

## Integration Points

- TanStack Router for file-based routing and navigation
- Convex Query via @convex-dev/react-query for data fetching
- Existing spellHelpers utility functions for formatting
- Existing Spell TypeScript types from `~/types/spell`

## Assumptions & Constraints

### Technical Assumptions

- The `by_slug` index already exists in Convex schema (verified)
- All spells have unique slugs (enforced at data seeding)
- Spell slugs are URL-safe (lowercase, hyphenated)
- TanStack Start handles SSR automatically
- Convex queries are fast enough that loading states are brief

### Business Constraints

- Must maintain design consistency with monster details view
- Must work offline if Convex has cached data
- Must be accessible (WCAG 2.1 AA compliance)

### Timeline Considerations

- Milestone 1-2: 1 hour (backend + route setup)
- Milestone 3-4: 2 hours (component + navigation)
- Milestone 5: 1 hour (SEO + testing)
- Total estimated time: 4 hours of focused development

## Success Metrics

- Users can navigate from search to details in < 2 clicks
- Page loads in under 2 seconds on typical connections
- Zero console errors in production
- 100% of spells are accessible via details pages
- Mobile users report same quality experience as desktop

## Open Questions

- [ ] Should spell details pages include "Next/Previous Spell" navigation?
- [ ] Do we need to track analytics on which spells are viewed most?
- [ ] Should we add a "Copy spell to clipboard" feature for quick reference?
- [ ] Do we want to add spell tags/categories beyond classes for filtering?

## Implementation Notes

### Pattern Consistency with Monster Details

This feature closely mirrors the monster details implementation:

**Similarities**:
- Same route pattern (`/monsters/$slug` -> `/spells/$slug`)
- Same Convex query pattern (`getMonsterBySlug` -> `getSpellBySlug`)
- Same component structure (Page -> Content -> Loading)
- Same navigation elements (breadcrumbs + back button)
- Same 404 handling approach
- Same TanStack Router Link pattern for clickable rows

**Differences**:
- Spell data structure is simpler (no ability scores, traits, etc.)
- Spell details layout will be simpler (fewer sections)
- Spell badges use different colors (tier-based vs alignment)
- Spells have multiple classes (array) vs monsters have single alignment

### Utility Functions to Create

New utility functions needed in `src/utils/spellHelpers.ts`:

```typescript
// These formatters should already exist from spell search implementation
// If not, create them:

export function formatTier(tier: string): string
export function formatRange(range: string): string
export function formatDuration(duration: string): string
export function getTierColorClasses(tierNum: number): string
export function getClassBadgeColor(className: string): string
```

### Responsive Design Breakpoints

Following TailwindCSS defaults:
- Mobile: < 640px (sm breakpoint)
- Tablet: 640px - 1024px (sm to lg)
- Desktop: > 1024px (lg+)

Quick stats grid:
- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 4 columns

### Accessibility Checklist

- [ ] All interactive elements keyboard navigable
- [ ] Breadcrumbs use proper semantic nav structure
- [ ] Headings follow proper hierarchy (h1 -> h2)
- [ ] Loading states announce to screen readers
- [ ] Link purposes are clear from text alone
- [ ] Color is not the only means of conveying information
- [ ] Focus indicators are visible and clear

### Performance Considerations

- Use Suspense for loading states (already implemented in pattern)
- Leverage Convex's automatic caching
- Use by_slug index for O(log n) lookups
- Lazy load route component (TanStack Start default)
- Minimize component re-renders (React 19 optimizations)

## Reference Implementation

See `/Users/dusty/Code/shadowdark/gm-tools/src/routes/monsters/$slug.tsx` for the monster details implementation that this feature should closely follow.

## Post-Implementation Tasks

1. Update any documentation referencing spell pages
2. Consider adding spell details to favorites feature (future)
3. Gather user feedback on layout and information hierarchy
4. Monitor Convex query performance in production
5. Consider adding related spells suggestions (future enhancement)
