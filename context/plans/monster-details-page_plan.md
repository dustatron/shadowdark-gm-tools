# Monster Details Page - Shadowdark GM Tools

## Overview

This document defines the comprehensive Monster Details page for the Shadowdark GM Tools application. The page provides GMs with all necessary information to run encounters, track monster state during combat, and quickly reference abilities and mechanics.

## Shadowdark Monster Information Architecture

### Priority 1: Critical Combat Information (Above the Fold)

These are the stats a GM needs instant access to during combat:

#### **Monster Header**
```typescript
interface MonsterHeader {
  name: string              // "Aboleth", "Goblin Scout"
  level: number             // Monster level (determines challenge)
  alignment: string         // "L" (Lawful), "N" (Neutral), "C" (Chaotic)
  description: string       // Brief flavor text
}
```

**UI Layout:**
- Large, bold monster name (h1)
- Level badge prominently displayed: "Level 8 Monster"
- Alignment indicator with icon
- Short description text (2-3 lines max)
- Quick actions toolbar: [Add to Encounter] [Roll Initiative] [Favorite]

---

#### **Defense Statistics**
```typescript
interface DefenseStats {
  armorClass: number        // AC (target number to hit)
  armorType: string | null  // "plate mail + shield", "natural"
  hitPoints: number         // Average HP (used as starting HP)
  hitDice?: string          // Underlying HD formula (e.g., "2d8+2")
}
```

**UI Layout:**
- Large AC value in shield icon
- Armor type notation below AC (if applicable)
- HP displayed as large number with "HP" label
- Optional HD formula in small text below HP

**Visual Design:**
```
┌─────────────────────────────────┐
│  AC: 16                HP: 39   │
│  (plate mail + shield)          │
│                                 │
│  [Current: 39 / 39] HP Tracker  │
│  [Apply Damage] [Heal]          │
└─────────────────────────────────┘
```

---

#### **Offense Statistics**
```typescript
interface OffenseStats {
  attacks: string           // Raw attack string from data
  // Parsed attack information:
  parsedAttacks: Array<{
    count: number          // Number of attacks (e.g., 2)
    name: string           // Attack name (e.g., "tentacle")
    range: string          // "near", "close", "far"
    attackBonus: number    // To-hit bonus (e.g., +5)
    damage: string         // Damage formula (e.g., "1d8+2")
    special?: string       // Special effects (e.g., "+ curse")
  }>
}
```

**Example Attack String Parsing:**
- Input: `"2 tentacle (near) +5 (1d8 + curse) or 1 tail +5 (3d6)"`
- Parsed:
  ```javascript
  [
    {
      count: 2,
      name: "tentacle",
      range: "near",
      attackBonus: 5,
      damage: "1d8",
      special: "+ curse"
    },
    {
      count: 1,
      name: "tail",
      range: "near",
      attackBonus: 5,
      damage: "3d6",
      special: null
    }
  ]
  ```

**UI Layout:**
- List of attacks with "OR" divider between alternatives
- Each attack shows: Name, Range, Attack Bonus, Damage
- Quick roll buttons: [Roll Attack] [Roll Damage]
- Special effects highlighted in accent color

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│ ATTACKS                                         │
│                                                 │
│ 2 × Tentacle (near)                             │
│ Attack: +5    Damage: 1d8 + curse               │
│ [Roll Attack d20+5] [Roll Damage 1d8]           │
│                                                 │
│ ─── OR ───                                      │
│                                                 │
│ 1 × Tail (near)                                 │
│ Attack: +5    Damage: 3d6                       │
│ [Roll Attack d20+5] [Roll Damage 3d6]           │
└─────────────────────────────────────────────────┘
```

---

#### **Movement**
```typescript
interface Movement {
  movement: string          // Raw movement string
  // Parsed:
  speed: string            // "near", "double near", "far"
  type?: string            // "fly", "swim", "climb", "burrow"
}
```

**Shadowdark Movement Ranges:**
- **close**: ~5 feet (melee range)
- **near**: ~30 feet (standard move)
- **far**: ~150 feet (ranged combat)
- **double near**: ~60 feet

**UI Layout:**
- Movement value with icon for movement type
- Clear indication of special movement (flying, swimming, etc.)

---

### Priority 2: Ability Scores & Modifiers

Shadowdark uses ability score modifiers extensively for saves and skill checks.

```typescript
interface AbilityScores {
  strength: number      // Modifier (not score)
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}
```

**Important Shadowdark Note:**
Monster stat blocks list **modifiers** (e.g., +4, -1), not ability scores (e.g., 18, 8).

**UI Layout:**
- 6-column grid showing all ability modifiers
- Color-coded: positive (green), negative (red), zero (gray)
- Format: "STR +4", "DEX -1", "CON +3"
- Include hover tooltip explaining what each ability is used for

**Visual Design:**
```
┌──────────────────────────────────────────────────┐
│ ABILITY MODIFIERS                                │
│                                                  │
│ STR    DEX    CON    INT    WIS    CHA          │
│ +4     -1     +3     +4     +2     +2           │
└──────────────────────────────────────────────────┘
```

---

### Priority 3: Special Abilities & Traits

The most important section for understanding how a monster fights.

```typescript
interface Trait {
  name: string              // "Curse", "Enslave", "Telepathic"
  description: string       // Full ability description
  // Parsed data for UI helpers:
  saveType?: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA"
  saveDC?: number          // DC for saving throw
  range?: string           // "close", "near", "far"
  duration?: string        // "1d4 rounds", "permanent"
  attackType?: "spell" | "ability" | "action"
}
```

**Common Trait Patterns in Shadowdark:**
1. **Saving Throw Abilities**: "DC 15 CON or [effect]"
2. **Attack Replacements**: "In place of attacks, [ability]"
3. **Passive Abilities**: "Immune to [condition]"
4. **Triggered Abilities**: "On hit, target must [save/effect]"
5. **Spellcasting**: "INT Spell" or "WIS Spell" with spell details

**UI Layout:**
- Card-based layout for each trait
- Trait name as header with icon for type
- Description with highlighted DC values and saving throw types
- Quick action button: [Roll Save DC X]
- Parse and highlight key mechanics: DC values, damage, duration

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│ SPECIAL ABILITIES                               │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ Curse                                       │ │
│ │                                             │ │
│ │ DC 15 CON or target gains a magical curse, │ │
│ │ turning into a deep one over 2d10 days.    │ │
│ │                                             │ │
│ │ [Roll CON Save DC 15]                       │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ Enslave                                     │ │
│ │                                             │ │
│ │ In place of attacks, one creature within   │ │
│ │ far DC 15 WIS or aboleth controls for      │ │
│ │ 1d4 rounds.                                 │ │
│ │                                             │ │
│ │ [Roll WIS Save DC 15] [Roll Duration 1d4]   │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

### Priority 4: Secondary Information

#### **Monster Type & Classification**
```typescript
interface Classification {
  type: MonsterType         // "Aberration", "Beast", "Undead", etc.
  size?: MonsterSize        // "Tiny", "Small", "Medium", "Large", "Huge"
  environment?: string[]    // ["Underground", "Aquatic"]
  rarity?: "Common" | "Uncommon" | "Rare" | "Legendary"
}
```

**Shadowdark Monster Types:**
- Aberration
- Beast
- Construct
- Dragon
- Elemental
- Fey
- Fiend
- Giant
- Humanoid
- Monstrosity
- Ooze
- Plant
- Undead

**Note:** The current data model doesn't include type or size. This should be added to the schema in the future.

---

#### **Treasure & Loot**
```typescript
interface Treasure {
  treasureType?: string     // "Type A", "Type B", etc.
  treasureRoll?: string     // "2d6×10 gold" or "1d4 gems"
  specialItems?: string[]   // Named items or special loot
}
```

**Shadowdark Treasure System:**
- Treasure is typically rolled randomly
- Some monsters have specific treasure types
- Special items may be listed for unique monsters

**Note:** The current data model doesn't include treasure information. Add to future schema.

---

#### **Tactics & Behavior Notes**
```typescript
interface TacticsInfo {
  tactics?: string          // How the monster fights
  behavior?: string         // Personality and roleplay notes
  morale?: number          // Morale rating for retreat
}
```

**Note:** Not in current data model. Consider adding for GM guidance.

---

## UI Layout Design

### Desktop Layout (≥1024px)

```
┌────────────────────────────────────────────────────────────┐
│ [← Back to Monsters]                    [Favorite] [Share] │
│                                                            │
│ ABOLETH                                     Level 8 | (C)  │
│ Enormous, antediluvian catfish covered in slime and       │
│ tentacles. They hate all intelligent beings.              │
│                                                            │
│ ┌──────────────────┬──────────────────┬──────────────────┐│
│ │ DEFENSE          │ OFFENSE          │ MOVEMENT         ││
│ │                  │                  │                  ││
│ │ AC: 16           │ 2 × Tentacle     │ near (swim)      ││
│ │ (natural)        │ Attack: +5       │                  ││
│ │                  │ Damage: 1d8      │                  ││
│ │ HP: 39           │ Special: + curse │                  ││
│ │ [HP Tracker]     │                  │                  ││
│ │                  │ [Roll Attack]    │                  ││
│ │                  │ [Roll Damage]    │                  ││
│ │                  │                  │                  ││
│ │                  │ ─── OR ───       │                  ││
│ │                  │                  │                  ││
│ │                  │ 1 × Tail         │                  ││
│ │                  │ Attack: +5       │                  ││
│ │                  │ Damage: 3d6      │                  ││
│ │                  │                  │                  ││
│ │                  │ [Roll Attack]    │                  ││
│ │                  │ [Roll Damage]    │                  ││
│ └──────────────────┴──────────────────┴──────────────────┘│
│                                                            │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ABILITY MODIFIERS                                    │  │
│ │                                                      │  │
│ │ STR    DEX    CON    INT    WIS    CHA              │  │
│ │ +4     -1     +3     +4     +2     +2               │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ SPECIAL ABILITIES                                    │  │
│ │                                                      │  │
│ │ [Trait Card 1]                                       │  │
│ │ [Trait Card 2]                                       │  │
│ │ [Trait Card 3]                                       │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ADDITIONAL INFORMATION                               │  │
│ │                                                      │  │
│ │ Type: Aberration                                     │  │
│ │ Environment: Aquatic, Underground                    │  │
│ │ Treasure: Type B (2d6×100 gold, 1d4 gems)           │  │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Mobile Layout (<768px)

Stack sections vertically:
1. Header (name, level, alignment)
2. Description
3. Defense stats
4. Offense stats
5. Movement
6. Ability modifiers (2×3 grid)
7. Special abilities (full width cards)
8. Additional info (collapsed accordion)

---

## Interactive GM Tools

### 1. HP Tracker

**Features:**
- Current HP / Max HP display
- Quick damage buttons: [-1] [-5] [-10] [Custom]
- Quick heal buttons: [+1] [+5] [+10] [Custom]
- Visual HP bar (green → yellow → red)
- Reset button to restore to max HP
- Undo last change button

**State Management:**
```typescript
interface MonsterInstanceState {
  monsterId: string
  currentHP: number
  maxHP: number
  conditions: string[]      // "poisoned", "stunned", etc.
  tempHP?: number
  initiative?: number
  notes?: string
}
```

**Implementation Note:**
This should be session-specific state, not modifying the base monster data.

---

### 2. Attack Roll Helper

**Features:**
- Click attack button to simulate d20 + attack bonus
- Display: "Rolled 15 + 5 = 20"
- Highlight critical hits (natural 20) in gold
- Highlight critical misses (natural 1) in red
- Show hit/miss based on optional target AC input
- Roll history (last 3 rolls)

**Shadowdark Attack Mechanics:**
```typescript
interface AttackRoll {
  d20Roll: number           // Raw d20 result (1-20)
  attackBonus: number       // Monster's attack bonus
  total: number             // d20 + bonus
  critical: boolean         // Natural 20
  fumble: boolean          // Natural 1
  targetAC?: number        // Optional target AC
  hit?: boolean            // If targetAC provided
}

function rollAttack(attackBonus: number, targetAC?: number): AttackRoll {
  const d20Roll = Math.floor(Math.random() * 20) + 1
  const total = d20Roll + attackBonus
  const critical = d20Roll === 20
  const fumble = d20Roll === 1

  return {
    d20Roll,
    attackBonus,
    total,
    critical,
    fumble,
    targetAC,
    hit: targetAC !== undefined ? total >= targetAC : undefined
  }
}
```

---

### 3. Damage Roll Helper

**Features:**
- Parse damage formula (e.g., "1d8+2", "3d6")
- Roll dice and display individual die results
- Show total damage
- Critical hit mode (double dice, not modifier)
- Roll history

**Shadowdark Damage Mechanics:**
```typescript
interface DamageRoll {
  formula: string           // "1d8+2"
  diceRolls: number[]      // [6] for 1d8
  diceTotal: number        // 6
  modifier: number         // +2
  total: number            // 8
  critical: boolean        // If doubling dice
}

function rollDamage(formula: string, critical: boolean = false): DamageRoll {
  // Parse formula: "1d8+2" → { count: 1, die: 8, modifier: 2 }
  const parsed = parseDiceFormula(formula)

  let diceRolls = []
  for (let i = 0; i < parsed.count; i++) {
    diceRolls.push(Math.floor(Math.random() * parsed.die) + 1)
  }

  // Critical hits: double the dice rolled (not the modifier)
  if (critical) {
    for (let i = 0; i < parsed.count; i++) {
      diceRolls.push(Math.floor(Math.random() * parsed.die) + 1)
    }
  }

  const diceTotal = diceRolls.reduce((sum, roll) => sum + roll, 0)
  const total = diceTotal + parsed.modifier

  return {
    formula,
    diceRolls,
    diceTotal,
    modifier: parsed.modifier,
    total,
    critical
  }
}
```

---

### 4. Saving Throw DC Helper

**Features:**
- Extract DC and ability from trait description
- Quick button: "Roll WIS Save DC 15"
- Display: "Rolled 12 + [player enters modifier] = [total]"
- Show Success/Failure based on DC
- Natural 1 and Natural 20 handling per Shadowdark rules

**Shadowdark Saving Throw Mechanics:**
```typescript
interface SavingThrow {
  ability: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA"
  dc: number
  d20Roll: number
  abilityModifier: number
  total: number
  success: boolean
  natural20: boolean       // Auto-success
  natural1: boolean        // Auto-fail
}

function rollSavingThrow(
  ability: string,
  dc: number,
  abilityModifier: number
): SavingThrow {
  const d20Roll = Math.floor(Math.random() * 20) + 1
  const total = d20Roll + abilityModifier

  // Natural 20 always succeeds, Natural 1 always fails
  const success = d20Roll === 20 || (d20Roll !== 1 && total >= dc)

  return {
    ability,
    dc,
    d20Roll,
    abilityModifier,
    total,
    success,
    natural20: d20Roll === 20,
    natural1: d20Roll === 1
  }
}
```

---

### 5. Initiative Roller

**Features:**
- Roll initiative for the monster
- Formula: d20 + DEX modifier
- Option to roll for multiple instances
- Quick add to combat tracker (future feature)

---

### 6. Morale Check (Future Feature)

**Features:**
- Roll 2d6 morale check
- Compare to monster's morale rating
- Shadowdark morale system: 2d6 vs morale rating
- Result: "Fights on" or "Flees/Surrenders"

---

## Data Model Enhancements

### Current Schema
```typescript
// convex/schema.ts
monsters: defineTable({
  name: v.string(),
  slug: v.string(),
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
  alignment: v.string(),
  level: v.number(),
  traits: v.array(
    v.object({
      name: v.string(),
      description: v.string(),
    }),
  ),
})
```

### Recommended Future Additions
```typescript
monsters: defineTable({
  // ... existing fields ...

  // Add these fields:
  type: v.optional(v.string()),              // "Aberration", "Beast", etc.
  size: v.optional(v.string()),              // "Small", "Medium", "Large", etc.
  environment: v.optional(v.array(v.string())), // ["Underground", "Aquatic"]
  treasure: v.optional(v.string()),          // "Type B" or custom description
  hitDice: v.optional(v.string()),           // "2d8+2" formula
  morale: v.optional(v.number()),            // Morale rating (2-12)
  tactics: v.optional(v.string()),           // How the monster fights
  specialMovement: v.optional(v.array(       // Parsed movement types
    v.object({
      type: v.string(),                      // "fly", "swim", "burrow"
      speed: v.string(),                     // "near", "far", "double near"
    })
  )),
  parsedAttacks: v.optional(v.array(         // Parsed attack data
    v.object({
      count: v.number(),
      name: v.string(),
      range: v.string(),
      attackBonus: v.number(),
      damage: v.string(),
      special: v.optional(v.string()),
    })
  )),
})
```

---

## Routing & Navigation

### Route Structure
```
/monsters                   → Monster list/search page (existing)
/monsters/:slug             → Monster detail page (new)
```

### Route Configuration
```typescript
// src/routes/monsters/$slug/index.tsx
export const Route = createFileRoute('/monsters/$slug/')({
  component: MonsterDetailPage,
  loader: async ({ params }) => {
    // Pre-fetch monster data for the slug
    return { slug: params.slug }
  },
})
```

### Convex Query
```typescript
// convex/monsters.ts
export const getMonsterBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      // ... full monster schema
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const monster = await ctx.db
      .query('monsters')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()

    return monster ?? null
  },
})
```

---

## Component Architecture

### File Structure
```
src/
  routes/
    monsters/
      $slug/
        index.tsx                    → Monster detail route
  components/
    monsters/
      detail/
        MonsterDetailHeader.tsx      → Name, level, alignment
        MonsterDefenseCard.tsx       → AC, HP, HP tracker
        MonsterOffenseCard.tsx       → Attacks with roll buttons
        MonsterMovementCard.tsx      → Movement info
        MonsterAbilityScores.tsx     → 6 ability modifiers grid
        MonsterTraits.tsx            → Special abilities list
        MonsterTraitCard.tsx         → Individual trait with parser
        MonsterAdditionalInfo.tsx    → Type, environment, treasure

        tools/
          HPTracker.tsx              → Interactive HP management
          AttackRoller.tsx           → Attack roll helper
          DamageRoller.tsx           → Damage roll helper
          SavingThrowRoller.tsx      → Save DC helper
          InitiativeRoller.tsx       → Initiative roller

        utils/
          diceRoller.ts              → Core dice rolling logic
          attackParser.ts            → Parse attack strings
          traitParser.ts             → Parse trait abilities
          abilityFormatter.ts        → Format ability modifiers
```

### Component Composition
```tsx
// src/routes/monsters/$slug/index.tsx
function MonsterDetailPage() {
  const { slug } = Route.useParams()
  const { data: monster } = useSuspenseQuery(
    convexQuery(api.monsters.getMonsterBySlug, { slug })
  )

  if (!monster) {
    return <MonsterNotFound slug={slug} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MonsterDetailHeader monster={monster} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <MonsterDefenseCard monster={monster} />
        <MonsterOffenseCard monster={monster} />
        <MonsterMovementCard monster={monster} />
      </div>

      <MonsterAbilityScores monster={monster} />

      <MonsterTraits traits={monster.traits} />

      <MonsterAdditionalInfo monster={monster} />
    </div>
  )
}
```

---

## Accessibility Considerations

1. **Semantic HTML**: Use appropriate heading hierarchy (h1 → h2 → h3)
2. **ARIA Labels**: All interactive buttons have descriptive labels
3. **Keyboard Navigation**: All tools accessible via keyboard
4. **Screen Reader Support**:
   - Announce roll results with `aria-live="polite"`
   - Provide alternative text for icons
   - Use proper table semantics for stat blocks
5. **Focus Management**: Maintain logical tab order
6. **Color Contrast**: All text meets WCAG AA standards
7. **Motion Preferences**: Respect `prefers-reduced-motion`

---

## Performance Considerations

1. **Code Splitting**: Monster detail route loads separately
2. **Image Optimization**: Monster portraits (future) use lazy loading
3. **Memoization**: Expensive parsers use React.useMemo()
4. **Virtual Scrolling**: For very long trait lists (rare)
5. **Debounced State**: HP tracker updates debounced to prevent excessive re-renders

---

## Testing Strategy

### Unit Tests
- Dice rolling functions (accurate distribution)
- Attack string parser (handles all formats)
- Trait parser (extracts DC and ability)
- Damage calculation (including criticals)
- Saving throw logic (natural 1/20 handling)

### Integration Tests
- Monster detail page loads correctly
- HP tracker updates state
- Roll buttons produce valid results
- Navigation between monster list and detail

### E2E Tests
- User can search and select a monster
- User can track HP during combat simulation
- User can roll attacks and damage
- Roll results are displayed correctly

---

## Future Enhancements

### Phase 2: Session Integration
- Add monster instances to active combat encounters
- Track multiple copies of same monster with individual HP
- Link to initiative tracker
- Apply conditions and status effects

### Phase 3: Homebrew Support
- Allow GMs to create custom monsters
- Monster template system
- Import/export monster data
- Share homebrew monsters with community

### Phase 4: Advanced Tools
- Monster generator (random encounters)
- Encounter difficulty calculator
- Print-friendly stat block format
- Monster comparison tool

### Phase 5: Lore & Enrichment
- Monster lore tabs with extended descriptions
- Tactics and roleplay suggestions
- Monster variants and templates
- Historical appearances in campaigns

---

## Implementation Checklist

### Step 1: Backend
- [ ] Add `getMonsterBySlug` query to `convex/monsters.ts`
- [ ] Verify slug index exists in schema
- [ ] Test query with various monster slugs

### Step 2: Routing
- [ ] Create `src/routes/monsters/$slug/index.tsx`
- [ ] Configure route with loader
- [ ] Add 404 handling for invalid slugs
- [ ] Link from monster table rows to detail pages

### Step 3: Core Components
- [ ] `MonsterDetailHeader` - name, level, alignment
- [ ] `MonsterDefenseCard` - AC, HP display
- [ ] `MonsterOffenseCard` - attacks list
- [ ] `MonsterMovementCard` - movement display
- [ ] `MonsterAbilityScores` - 6 ability grid
- [ ] `MonsterTraits` - traits list container
- [ ] `MonsterTraitCard` - individual trait display

### Step 4: Parser Utilities
- [ ] `parseDiceFormula()` - parse "1d8+2" format
- [ ] `parseAttackString()` - parse full attack string
- [ ] `parseTraitForDC()` - extract DC and ability from traits
- [ ] `formatAbilityModifier()` - format "+4" vs "-1"

### Step 5: Interactive Tools
- [ ] `HPTracker` - damage/heal with state
- [ ] `AttackRoller` - d20 + bonus roller
- [ ] `DamageRoller` - dice formula roller
- [ ] `SavingThrowRoller` - DC check helper
- [ ] Dice rolling utility functions

### Step 6: Styling & Polish
- [ ] Responsive layout (mobile → desktop)
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error boundaries
- [ ] Animations (subtle, respect motion preferences)

### Step 7: Testing
- [ ] Unit tests for parsers and dice rollers
- [ ] Component tests for UI elements
- [ ] E2E test for full page flow
- [ ] Accessibility audit

---

## Example Monster: Aboleth (Complete Detail Page)

**Header:**
- Name: "Aboleth"
- Level: 8 (displayed as badge)
- Alignment: Chaotic (C)
- Description: "Enormous, antediluvian catfish covered in slime and tentacles. They hate all intelligent beings."

**Defense Card:**
- AC: 16 (no armor type listed)
- HP: 39
- HP Tracker: [Current: 39 / 39] with damage/heal buttons

**Offense Card:**
- Attack Option 1:
  - 2 × Tentacle (near)
  - Attack: +5
  - Damage: 1d8
  - Special: + curse
  - [Roll Attack d20+5] [Roll Damage 1d8]
- OR
- Attack Option 2:
  - 1 × Tail (near)
  - Attack: +5
  - Damage: 3d6
  - [Roll Attack d20+5] [Roll Damage 3d6]

**Movement Card:**
- Speed: near (swim)
- Aquatic creature

**Ability Scores:**
```
STR: +4  DEX: -1  CON: +3
INT: +4  WIS: +2  CHA: +2
```

**Special Abilities:**

1. **Curse**
   - Description: "DC 15 CON or target gains a magical curse, turning into a deep one over 2d10 days."
   - [Roll CON Save DC 15] [Roll Duration 2d10]

2. **Enslave**
   - Description: "In place of attacks, one creature within far DC 15 WIS or aboleth controls for 1d4 rounds."
   - [Roll WIS Save DC 15] [Roll Duration 1d4]

3. **Telepathic**
   - Description: "Read the thoughts of all creatures within far."
   - No rolls needed (passive ability)

**Additional Info:**
- Type: Aberration (not in current data, but should be added)
- Environment: Aquatic, Underground
- Treasure: Type B (not in current data)

---

## Conclusion

This Monster Details page provides GMs with a comprehensive, interactive reference for running monsters in Shadowdark RPG sessions. The design prioritizes combat-critical information while providing powerful tools for quick dice rolls, HP tracking, and rules reference.

The modular component architecture allows for easy extension and enhancement, while the parser utilities ensure that raw text data is transformed into interactive, GM-friendly interfaces.

By following Shadowdark's design philosophy of fast, deadly, and engaging gameplay, these tools help GMs run encounters smoothly without interrupting the flow of the game.
