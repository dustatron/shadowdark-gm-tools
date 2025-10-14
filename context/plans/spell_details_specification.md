# Spell Details Page Specification

## Overview

This document defines the comprehensive information architecture and UI design for individual Spell Details pages in the Shadowdark GM Tools application. The specification is based on authentic Shadowdark RPG spell mechanics and builds upon patterns established in the Monster Details implementation.

## Shadowdark Spell System Reference

### Core Spell Mechanics

**Tier System**: Spells are organized by tiers 1-5 (not spell levels like D&D 5e)
- Tier 1: Cantrips and basic spells
- Tier 2-5: Progressively more powerful spells
- **Casting DC**: 10 + spell tier (Tier 1 = DC 11, Tier 2 = DC 12, etc.)

**Spell Classes**:
- **Wizard** (INT-based): Arcane magic, learned from spellbooks
- **Priest** (WIS-based): Divine magic, granted by deities

**Casting Roll**:
```
1d20 + casting modifier (INT for wizards, WIS for priests) ≥ (10 + spell tier)
```

**Duration Types**:
- Instant (one-time effect)
- Focus (requires concentration, ends if caster takes damage or casts another Focus spell)
- Rounds (e.g., "5 rounds", "10 rounds")
- Time periods (e.g., "1 hour", "24 hours", "Permanent")

**Range Categories**:
- Self (caster only)
- Near (30 feet)
- Far (120 feet)
- Touch
- Specific distances (e.g., "60 feet")

## Current Database Schema

From `/convex/schema.ts`:

```typescript
spells: defineTable({
  name: v.string(),           // Spell name (e.g., "Fireball")
  slug: v.string(),           // URL-friendly identifier
  description: v.string(),    // Full spell description and mechanics
  classes: v.array(v.string()), // ["wizard"] or ["priest"] or both
  duration: v.string(),       // Duration text (e.g., "Focus", "Instant", "10 rounds")
  range: v.string(),          // Range text (e.g., "Near", "Far", "Self")
  tier: v.string(),           // Tier level ("1" through "5")
})
```

## Information Architecture

### 1. Primary Information (Hero Section)

**Most Important - Always Visible Above the Fold**

- **Spell Name** (H1, large and prominent)
- **Tier Badge** (color-coded for quick visual recognition)
- **Classes** (badge(s) showing wizard/priest or both)
- **Quick Stats Bar** (Range, Duration, Casting DC)

```
╔═══════════════════════════════════════════════════════╗
║  Fireball                    [Tier 3] [Wizard]       ║
║  ─────────────────────────────────────────────────    ║
║  Range: Far  |  Duration: Instant  |  DC: 13         ║
╚═══════════════════════════════════════════════════════╝
```

### 2. Full Description Section

**Core Spell Mechanics**

- Full spell description text (formatted, preserving line breaks)
- Effect mechanics (what the spell does)
- Target information (if applicable)
- Damage/healing amounts (if applicable)
- Save information (if applicable)
- Special conditions or requirements

```
╔═══════════════════════════════════════════════════════╗
║  Description                                          ║
║  ─────────────────────────────────────────────────    ║
║  A roaring blast of flame erupts from your palm...   ║
║  All creatures in a 20-foot radius must make a...    ║
║  On a failed save, a target takes 6d6 fire damage... ║
╚═══════════════════════════════════════════════════════╝
```

### 3. Casting Information Section

**Technical Details for Spellcasters**

- **Casting DC**: Calculated value (10 + tier)
- **Tier**: Spell tier level
- **Classes**: Which class(es) can cast this spell
- **Range**: How far the spell can reach
- **Duration**: How long the spell lasts
- **Concentration**: Whether this is a Focus spell

```
╔═══════════════════════════════════════════════════════╗
║  Casting Information                                  ║
║  ─────────────────────────────────────────────────    ║
║  Casting DC:      13                                  ║
║  Tier:            3                                   ║
║  Classes:         Wizard                              ║
║  Range:           Far (120 ft)                        ║
║  Duration:        Instant                             ║
║  Concentration:   No                                  ║
╚═══════════════════════════════════════════════════════╝
```

### 4. Game Mechanic Helpers (Interactive Tools)

**Optional - Enhanced Utility for Digital Play**

These are NOT in the current data but could be added as UI enhancements:

- **Roll Casting Check** button (auto-rolls d20, shows success/failure against DC)
- **Roll Damage** button (for damage-dealing spells, extracted from description)
- **Duration Tracker** button (for timed spells, adds to session tracker)
- **Calculate Targets** helper (for area effect spells)

Note: These would require parsing spell descriptions or expanding the database schema.

## UI Layout Design

### Desktop Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb: Home / Spells / Fireball                   │
│ ← Back to Spells                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ╔═══════════════════════════════════════════════════╗ │
│  ║ FIREBALL        [Tier 3] [Wizard]                ║ │
│  ║ ───────────────────────────────────────────────   ║ │
│  ║ Range: Far | Duration: Instant | DC: 13          ║ │
│  ╚═══════════════════════════════════════════════════╝ │
│                                                         │
│  ╔═══════════════════════════════════════════════════╗ │
│  ║ Description                                       ║ │
│  ║ ───────────────────────────────────────────────   ║ │
│  ║ A roaring blast of flame erupts from your palm,  ║ │
│  ║ streaking toward a point you choose within       ║ │
│  ║ range and exploding in a fiery burst...          ║ │
│  ║                                                   ║ │
│  ║ [Full description text continues...]             ║ │
│  ╚═══════════════════════════════════════════════════╝ │
│                                                         │
│  ┌─────────────────────┬────────────────────────────┐  │
│  │ Casting Information │ At a Glance                │  │
│  │ ─────────────────── │ ────────────────────────── │  │
│  │ Casting DC:    13   │ • Area: 20-ft radius       │  │
│  │ Tier:          3    │ • Damage: 6d6 fire         │  │
│  │ Classes:     Wizard │ • Save: DEX for half       │  │
│  │ Range:     Far      │ • Type: Evocation          │  │
│  │ Duration:  Instant  │                            │  │
│  └─────────────────────┴────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout (<768px)

Stack all sections vertically for optimal mobile viewing:

```
┌──────────────────────┐
│ ← Back to Spells     │
├──────────────────────┤
│ FIREBALL             │
│ [Tier 3] [Wizard]    │
│ ──────────────────── │
│ Range: Far           │
│ Duration: Instant    │
│ DC: 13               │
├──────────────────────┤
│ Description          │
│ ──────────────────── │
│ A roaring blast...   │
│ [continues...]       │
├──────────────────────┤
│ Casting Information  │
│ ──────────────────── │
│ Casting DC:    13    │
│ Tier:          3     │
│ [etc...]             │
└──────────────────────┘
```

## Visual Design Elements

### Tier Color Coding

Match the tier colors used in the spell table for consistency:

```typescript
const TIER_COLORS = {
  '1': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  '2': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  '3': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  '4': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  '5': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}
```

### Class Badges

```typescript
const CLASS_COLORS = {
  wizard: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  priest: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
}
```

### Range Icons/Indicators

- **Self**: User icon
- **Touch**: Hand icon
- **Near**: Target icon with small radius
- **Far**: Archery target or distant icon

### Duration Icons/Indicators

- **Instant**: Lightning bolt
- **Focus**: Eye or brain icon (concentration)
- **Rounds**: Clock icon with number
- **Permanent**: Infinity symbol

## Comparison: Spells vs Monsters

### Similarities (Reusable Patterns)

✓ **Page Structure**
- Breadcrumb navigation
- Back button
- Hero header with name and key badge (tier/level)
- Multiple content sections with clear headings
- Card-based UI for information grouping
- Loading skeletons for Suspense boundaries
- 404 handling for not found

✓ **Routing Pattern**
- Slug-based URLs: `/spells/[slug]` vs `/monsters/[slug]`
- Same route file structure
- Same Suspense + useSuspenseQuery pattern

✓ **Visual Design**
- Dark mode support throughout
- Consistent color theming
- Badge system for categories
- Responsive grid layouts
- Accessibility considerations (ARIA labels, semantic HTML)

✓ **Data Fetching**
- Convex query by slug
- TanStack Query integration
- Loading states
- Error handling

### Differences (Spell-Specific Considerations)

✗ **Data Complexity**
- **Monsters**: Rich numerical stats (6 ability scores, AC, HP, attacks)
- **Spells**: Primarily text-based with a few categorical properties

✗ **Stat Presentation**
- **Monsters**: Need calculated modifiers for ability scores (formatAbilityScore)
- **Spells**: Simple display of string values (range, duration, tier)

✗ **Grid Layout**
- **Monsters**: 6-column ability score grid, 4-column combat stats
- **Spells**: 2-column casting info + "at a glance" panel (if we parse descriptions)

✗ **Interactive Elements**
- **Monsters**: Ability score calculations, damage roll helpers (future)
- **Spells**: Casting roll helpers, damage roll helpers, duration tracking (future)

✗ **Nested Data**
- **Monsters**: Array of traits with name + description
- **Spells**: Single description field (no nested traits)

✗ **Content Emphasis**
- **Monsters**: Stats-heavy, numerical focus for combat
- **Spells**: Description-heavy, effect mechanics focus

## Implementation Plan

### Phase 1: Core Spell Details Page (MVP)

**Files to Create:**

1. **`/src/routes/spells/$slug.tsx`**
   - Route component with breadcrumb and back button
   - Suspense boundary for loading state
   - 404 handling for spell not found
   - Convex query to fetch spell by slug

2. **`/src/components/spells/SpellDetails.tsx`**
   - Main spell details component
   - Hero section with name, tier badge, class badges
   - Quick stats bar (range, duration, DC)
   - Description section
   - Casting information card

3. **`/src/utils/spellHelpers.ts`**
   - `formatTier(tier: string): string` - Format tier display
   - `formatRange(range: string): string` - Format range with units
   - `formatDuration(duration: string): string` - Format duration text
   - `calculateCastingDC(tier: number): number` - Calculate DC (10 + tier)
   - `getTierColor(tier: string): string` - Get Tailwind classes for tier badge
   - `getClassColor(className: string): string` - Get Tailwind classes for class badge
   - `isFocusSpell(duration: string): boolean` - Check if concentration required

4. **`/convex/spells.ts`** (extend existing)
   - Add `getSpellBySlug` query function

**Acceptance Criteria:**
- [x] User can navigate from spell table to individual spell details page
- [x] Page displays all core spell information clearly
- [x] Page is responsive on mobile and desktop
- [x] Loading states show appropriate skeletons
- [x] 404 page handles missing spells gracefully
- [x] Breadcrumb navigation works correctly
- [x] Back button returns to spell search
- [x] Dark mode works throughout

### Phase 2: Enhanced Spell Information (Future)

**Database Schema Additions:**

```typescript
spells: defineTable({
  // ... existing fields ...

  // Optional parsed data for helpers
  damage_dice: v.optional(v.string()), // e.g., "6d6"
  damage_type: v.optional(v.string()), // e.g., "fire"
  save_ability: v.optional(v.string()), // e.g., "DEX"
  area_of_effect: v.optional(v.string()), // e.g., "20-foot radius"
  spell_school: v.optional(v.string()), // e.g., "Evocation"
  components: v.optional(v.array(v.string())), // e.g., ["verbal", "somatic"]
  casting_time: v.optional(v.string()), // Usually "1 action" in Shadowdark
  concentration: v.boolean(), // Derived from duration === "Focus"
  ritual: v.optional(v.boolean()), // If spell can be cast as ritual

  // Scaling information
  higher_tier_scaling: v.optional(v.string()), // How spell changes at higher tiers
})
```

**UI Enhancements:**

1. **"At a Glance" Panel**
   - Extract key mechanics from description
   - Display area, damage, save info visually

2. **Quick Roll Buttons**
   - "Roll Casting Check" - rolls d20, applies modifier, shows result
   - "Roll Damage" - rolls damage dice, shows result
   - Integrate with dice roller component

3. **Duration Tracker Integration**
   - "Track This Spell" button
   - Adds spell to active session tracker
   - Shows remaining rounds/time

4. **Related Spells Section**
   - "Similar Spells" based on tier and class
   - "Upgrade Path" showing higher tier versions

### Phase 3: GM Tools Integration (Future)

1. **Add to Spellbook**
   - Save spells to character spellbooks
   - Track prepared spells vs known spells

2. **Session Integration**
   - Track active spell effects during encounters
   - Duration countdown integration

3. **Spell Slot Tracking**
   - Visual spell slot management by tier
   - Integration with character sheet

## Design Rationale

### Why This Structure?

1. **Shadowdark-First Design**
   - Emphasizes the tier system (not D&D spell levels)
   - Shows casting DC prominently (core mechanic)
   - Highlights Focus spells (concentration)
   - Displays range categories as Shadowdark defines them

2. **GM Usability**
   - Quick reference format (one-page view)
   - All critical info visible without scrolling
   - Easy to read during game sessions
   - Mobile-friendly for digital GMing

3. **Progressive Enhancement**
   - Phase 1 delivers core functionality with existing data
   - Phase 2+ adds helpers without breaking existing pages
   - Database schema can be extended gradually
   - UI remains simple until advanced features are needed

4. **Consistency with Existing Patterns**
   - Matches Monster Details architecture
   - Reuses established UI components and patterns
   - Maintains site-wide navigation consistency
   - Uses same loading/error handling approaches

## Accessibility Considerations

- **Semantic HTML**: Use proper heading hierarchy (h1, h2, h3)
- **ARIA Labels**: Label all interactive elements clearly
- **Keyboard Navigation**: All buttons and links keyboard accessible
- **Screen Readers**: Announce loading states and page transitions
- **Color Independence**: Don't rely solely on color for tier/class (use text too)
- **Focus Management**: Proper focus indicators on all interactive elements

## Performance Considerations

- **Lazy Loading**: Use Suspense boundaries for async data
- **Image Optimization**: If we add spell icons, use optimized formats
- **Code Splitting**: Route-level splitting via TanStack Router
- **Caching**: Leverage TanStack Query caching for frequently accessed spells
- **Debouncing**: Search input debouncing (already implemented)

## Testing Strategy

### Unit Tests
- Spell helper functions (format tier, calculate DC, etc.)
- Type guards for spell classes and tiers

### Integration Tests
- Spell details page renders correctly
- Navigation from spell table to details works
- 404 handling for missing spells
- Breadcrumb navigation functions

### Accessibility Tests
- Keyboard navigation works throughout
- Screen reader announcements are clear
- Color contrast meets WCAG 2.1 AA standards
- Focus indicators are visible

### Manual Testing Checklist
- [ ] Spell displays all information correctly
- [ ] Tier badge shows correct color
- [ ] Class badges display properly
- [ ] Range and duration format correctly
- [ ] Description text is readable and formatted
- [ ] Casting DC calculation is accurate
- [ ] Responsive design works on mobile
- [ ] Dark mode looks good
- [ ] Back button returns to search with preserved state
- [ ] Breadcrumb navigation is accurate

## Future Considerations

### Spell Collections
- User-created spell lists
- Favorite spells
- Class-specific spellbooks
- Campaign-specific spell collections

### Spell Variants
- Homebrew spell support
- Spell modifications/variants
- Scaling options for different tiers

### Integration with Other Tools
- Character sheet spell management
- Encounter builder spell selection
- Session tracker spell effect management
- Dice roller integration for casting and damage

### Content Expansion
- Add spell lore and flavor text
- Include spell source information (core rules, supplements)
- Add spell artist credits if images are added
- Community comments/ratings for homebrew

## Summary

The Spell Details page will provide a comprehensive, easy-to-use reference for Shadowdark RPG spells. By following the established Monster Details pattern and respecting the unique characteristics of spell data, we can create a consistent, accessible, and useful tool for GMs and players.

**Key Takeaways:**

1. **Reuse Monster Details patterns** for routing, data fetching, and layout structure
2. **Focus on description content** since spells are more text-heavy than monsters
3. **Emphasize Shadowdark mechanics** like tier system and casting DC
4. **Design for quick reference** during active gameplay
5. **Plan for progressive enhancement** with helper tools in future phases

This specification provides a solid foundation for implementing the Spell Details page while maintaining consistency with the existing application architecture and Shadowdark RPG rules.
