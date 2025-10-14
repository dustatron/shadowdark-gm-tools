# Spell Details Page - Quick Reference Summary

## What to Display (Information Hierarchy)

### 1. Hero Section (Above the Fold)
- **Spell Name** - Large H1, most prominent
- **Tier Badge** - Color-coded (Tier 1-5)
- **Class Badge(s)** - Wizard/Priest indicators
- **Quick Stats** - Range | Duration | Casting DC

### 2. Description Section
- **Full spell description** - The most important content
- **Formatted text** - Preserve line breaks, readable typography
- **Effect mechanics** - What the spell does

### 3. Casting Information Panel
- **Casting DC** - Calculated as 10 + tier
- **Tier** - Spell power level
- **Classes** - Which class(es) can cast it
- **Range** - Distance/area (Near/Far/Self/Touch)
- **Duration** - How long it lasts (Instant/Focus/Rounds/Time)
- **Concentration** - Whether it's a Focus spell

## Current Database Fields

From `/convex/schema.ts`:

```typescript
{
  name: string,           // "Fireball"
  slug: string,           // "fireball"
  description: string,    // Full spell text
  classes: string[],      // ["wizard"] or ["priest"]
  duration: string,       // "Instant" | "Focus" | "5 rounds" | etc.
  range: string,          // "Near" | "Far" | "Self" | "Touch"
  tier: string,           // "1" | "2" | "3" | "4" | "5"
}
```

**Note:** This is all the data we currently have. Everything else would need to be parsed from the description or added to the schema later.

## Shadowdark-Specific Mechanics

### Tier System (Not Spell Levels)
- Tier 1-5 (not D&D's 9 spell levels)
- Casting DC = 10 + tier
  - Tier 1 spell = DC 11
  - Tier 3 spell = DC 13
  - Tier 5 spell = DC 15

### Casting Roll
```
1d20 + INT (wizard) or WIS (priest) ≥ Casting DC
```

### Duration Types
- **Instant** - Immediate effect, no tracking needed
- **Focus** - Requires concentration, ends if damaged or casting another Focus spell
- **Rounds** - Specific round count (e.g., "5 rounds", "10 rounds")
- **Time** - Specific time period (e.g., "1 hour", "24 hours")
- **Permanent** - Lasts indefinitely

### Range Categories
- **Self** - Caster only
- **Touch** - Must touch target
- **Near** - 30 feet
- **Far** - 120 feet

## Pattern Comparison: Spells vs Monsters

### What We Can Reuse ✓

| Pattern | Used in Monsters | Use for Spells |
|---------|-----------------|----------------|
| Route structure | `/monsters/$slug.tsx` | `/spells/$slug.tsx` |
| Data fetching | `getMonsterBySlug` query | `getSpellBySlug` query |
| Hero section | Name + level badge | Name + tier badge + class badges |
| Breadcrumb nav | Home / Monsters / [name] | Home / Spells / [name] |
| Back button | "Back to Monsters" | "Back to Spells" |
| Loading skeleton | Stats-based skeleton | Text-based skeleton |
| 404 handling | "Monster Not Found" | "Spell Not Found" |
| Card layout | White cards with borders | Same card styling |
| Dark mode | Throughout | Throughout |
| Responsive design | Grid layouts | Stack on mobile |

### What's Different ✗

| Aspect | Monsters | Spells |
|--------|----------|--------|
| **Primary content** | Numerical stats (AC, HP, STR, etc.) | Text description |
| **Complexity** | 6 ability scores + combat stats | Tier + range + duration |
| **Calculation** | Ability modifiers (score → modifier) | Casting DC (tier → DC) |
| **Grid layout** | 6-column ability scores | 2-column casting info |
| **Nested data** | Array of traits | Single description field |
| **Visual focus** | Stat cards with big numbers | Readable text blocks |
| **Helper buttons** | (Future) Roll attacks | (Future) Roll casting check |

## UI Layout Structure

```
┌─────────────────────────────────────────┐
│ Breadcrumb: Home / Spells / Fireball   │
│ ← Back to Spells                        │
├─────────────────────────────────────────┤
│                                         │
│ ╔═══════════════════════════════════╗  │
│ ║ FIREBALL    [Tier 3] [Wizard]    ║  │
│ ║ ──────────────────────────────    ║  │
│ ║ Far | Instant | DC: 13           ║  │
│ ╚═══════════════════════════════════╝  │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ Description                       │  │
│ │ ─────────────────────────────     │  │
│ │ A roaring blast of flame...       │  │
│ │ [Full description text]           │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ Casting Information               │  │
│ │ ─────────────────────────────     │  │
│ │ Casting DC:      13               │  │
│ │ Tier:            3                │  │
│ │ Classes:         Wizard           │  │
│ │ Range:           Far (120 ft)     │  │
│ │ Duration:        Instant          │  │
│ │ Concentration:   No               │  │
│ └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## Tier Color Coding

Use consistent colors across the app:

```typescript
const TIER_COLORS = {
  '1': 'blue',    // Tier 1 - Basic spells
  '2': 'green',   // Tier 2 - Intermediate
  '3': 'purple',  // Tier 3 - Advanced
  '4': 'orange',  // Tier 4 - Powerful
  '5': 'red',     // Tier 5 - Legendary
}
```

## Class Color Coding

```typescript
const CLASS_COLORS = {
  wizard: 'indigo',  // Arcane magic
  priest: 'amber',   // Divine magic
}
```

## Implementation Files Needed

### Phase 1 (MVP)

1. **`/src/routes/spells/$slug.tsx`**
   - Route component
   - Breadcrumb + back button
   - Suspense boundary
   - 404 handling

2. **`/src/components/spells/SpellDetails.tsx`**
   - Main spell display component
   - Hero section
   - Description section
   - Casting info panel

3. **`/src/utils/spellHelpers.ts`**
   - `formatTier(tier: string): string`
   - `formatRange(range: string): string`
   - `formatDuration(duration: string): string`
   - `calculateCastingDC(tier: number): number`
   - `getTierColor(tier: string): string`
   - `getClassColor(className: string): string`
   - `isFocusSpell(duration: string): boolean`

4. **`/convex/spells.ts`** (extend)
   - Add `getSpellBySlug` query

## Future Enhancements (Phase 2+)

### Interactive Helpers
- **Roll Casting Check** button
- **Roll Damage** button (if spell has damage)
- **Track Duration** button (adds to session tracker)

### Additional Data
Would require schema updates:
- Damage dice (e.g., "6d6")
- Damage type (e.g., "fire")
- Save ability (e.g., "DEX")
- Area of effect (e.g., "20-foot radius")
- Spell school (e.g., "Evocation")

### Related Content
- Similar spells by tier/class
- Spell upgrade paths
- Spell collections/favorites

## Key Design Principles

1. **Description-First Design**
   - Spell descriptions are the primary content
   - Make text readable and scannable
   - Use generous line height and margins

2. **Quick Reference Format**
   - All critical info visible without scrolling
   - Clear visual hierarchy
   - Easy to read during game sessions

3. **Shadowdark Authenticity**
   - Use "Tier" not "Level"
   - Show casting DC prominently
   - Highlight Focus spells (concentration)
   - Use Shadowdark range categories

4. **Mobile-First Responsive**
   - Stack sections vertically on mobile
   - Readable font sizes on small screens
   - Touch-friendly buttons and links

5. **Consistent with Existing Patterns**
   - Match Monster Details architecture
   - Reuse navigation patterns
   - Maintain dark mode theming
   - Use established card/badge components

## Accessibility Checklist

- [ ] Semantic HTML (h1, h2, h3 hierarchy)
- [ ] ARIA labels on badges and stats
- [ ] Keyboard navigation for all interactive elements
- [ ] Screen reader announcements for loading states
- [ ] Color-independent information (text + color)
- [ ] Sufficient color contrast (WCAG 2.1 AA)
- [ ] Visible focus indicators

## Success Metrics

A successful Spell Details page should:

1. Display all spell information clearly
2. Load quickly with appropriate skeletons
3. Work perfectly on mobile and desktop
4. Match Monster Details in quality and consistency
5. Be easy to read during active gameplay
6. Support dark mode throughout
7. Handle missing spells gracefully
8. Provide useful navigation (breadcrumb + back button)

## Next Steps

1. Create `/convex/spells.ts` - Add `getSpellBySlug` query
2. Create `/src/utils/spellHelpers.ts` - Format functions
3. Create `/src/components/spells/SpellDetails.tsx` - Main component
4. Create `/src/routes/spells/$slug.tsx` - Route page
5. Update `/src/components/spells/SpellTable.tsx` - Add links to spell details
6. Test thoroughly (responsive, dark mode, accessibility)
7. Deploy and iterate based on feedback
