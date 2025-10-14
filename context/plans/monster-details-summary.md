# Monster Details Page - Quick Reference Summary

## Information Hierarchy (Priority Order)

### 1. Combat-Critical Information (Top Priority)

**Monster Header**
- Name, Level Badge, Alignment Icon
- Brief description (1-2 sentences)
- Quick actions: Add to Encounter, Roll Initiative, Favorite

**Defense Stats (Shield Card)**
- **AC**: Large number in shield icon
- **Armor Type**: "(plate mail + shield)" or "(natural)"
- **HP**: Large number with current/max tracker
- **Interactive HP Tracker**: Apply damage, heal, reset buttons

**Offense Stats (Sword Card)**
- **Attacks**: Parsed and formatted list
  - Number of attacks (2×, 1×)
  - Attack name (Tentacle, Bite, Claw)
  - Range (near, close, far)
  - Attack bonus (+5)
  - Damage formula (1d8+2)
  - Special effects (+ curse, + poison)
- **Quick Roll Buttons**: [Roll Attack] [Roll Damage]
- **OR** separator between attack options

**Movement (Boots Icon)**
- Speed (near, double near, far)
- Special movement types (fly, swim, burrow, climb)

---

### 2. Ability Scores & Modifiers

Six-column grid showing all ability modifiers:

```
STR    DEX    CON    INT    WIS    CHA
+4     -1     +3     +4     +2     +2
```

- Color-coded: positive (green), negative (red), zero (gray)
- Hover tooltips explain what each ability is used for
- Used for saving throws and skill checks

---

### 3. Special Abilities & Traits

Card-based layout for each trait:

**Example: Curse Trait**
```
┌─────────────────────────────────────────────┐
│ Curse                            [Ability] │
│                                             │
│ DC 15 CON or target gains a magical curse, │
│ turning into a deep one over 2d10 days.    │
│                                             │
│ [Roll CON Save DC 15]  [Roll Duration 2d10]│
└─────────────────────────────────────────────┘
```

**Trait Parsing Features:**
- Automatically detect saving throw DCs
- Highlight ability names (STR, DEX, CON, INT, WIS, CHA)
- Extract damage formulas
- Identify duration and range
- Generate appropriate quick-roll buttons

---

### 4. Additional Information (Lower Priority)

**Collapsible sections for:**
- Monster type (Aberration, Beast, Undead, etc.)
- Size classification (Tiny, Small, Medium, Large, Huge)
- Environment (Underground, Aquatic, Forest, etc.)
- Treasure information (loot tables, special items)
- Tactics and behavior notes
- Morale rating

---

## Interactive GM Tools

### 1. HP Tracker
```
Current HP: [    39    ] / 39

Quick Damage:  [-1]  [-5]  [-10]  [Custom]
Quick Heal:    [+1]  [+5]  [+10]  [Custom]

[━━━━━━━━━━━━━━━━━━━━] 100% HP

[Reset to Max]  [Undo Last]
```

**Features:**
- Real-time HP bar (green → yellow → red)
- Undo last change
- Custom damage/heal input
- Visual feedback on state changes

---

### 2. Attack Roller
```
2 × Tentacle (near)  Attack: +5  Damage: 1d8

[Roll Attack d20+5] ────→  🎲 Rolled 15 + 5 = 20
                          ✓ Hit! (vs AC 18)

[Roll Damage 1d8]   ────→  🎲 Rolled [6] = 6 damage
```

**Features:**
- Display individual die results
- Show total with breakdown
- Highlight critical hits (natural 20) in gold
- Highlight critical misses (natural 1) in red
- Optional target AC for hit/miss indication
- Roll history (last 3 rolls)

---

### 3. Damage Roller
```
Damage: 1d8+2

[Roll Damage] ────→  🎲 Rolled [6] + 2 = 8 damage

[Roll Critical] ───→  🎲 Rolled [6, 4] + 2 = 12 damage
                     (Double dice on crit)
```

**Shadowdark Critical Rule:**
- Critical hits double the number of dice rolled
- Do NOT double the modifier
- Example: 1d8+2 crit = 2d8+2 (not 2d8+4)

---

### 4. Saving Throw Helper
```
DC 15 CON Save

Player modifier: [+2 ▼]

[Roll Save] ────→  🎲 Rolled 14 + 2 = 16
                  ✓ Success! (DC 15)
```

**Features:**
- Extract DC and ability from trait text
- Dropdown for player modifier input
- Auto-calculate success/failure
- Natural 20 always succeeds
- Natural 1 always fails

---

### 5. Initiative Roller
```
Initiative: d20 + DEX (-1)

[Roll Initiative] ────→  🎲 Rolled 12 - 1 = 11

[Add to Combat Tracker] (future feature)
```

---

## Shadowdark Rules Reference

### Attack Resolution
```
Attack Roll = d20 + ability modifier + level
Hit if: Attack Roll ≥ Target AC
Critical Hit: Natural 20 (double weapon dice)
Critical Miss: Natural 1 (automatic miss)
```

### Damage Calculation
```
Normal Hit: Weapon dice + ability modifier
Critical Hit: (Weapon dice × 2) + ability modifier

Example:
- Normal: 1d8+2 = [6]+2 = 8 damage
- Critical: 2d8+2 = [6,4]+2 = 12 damage
```

### Saving Throws
```
Save = d20 + ability modifier
Success if: Save ≥ DC
Natural 20: Always succeeds
Natural 1: Always fails
```

### Movement Ranges
```
close:       ~5 feet (melee range)
near:        ~30 feet (standard move)
far:         ~150 feet (ranged combat)
double near: ~60 feet (fast creatures)
```

### Ability Modifiers
```
Score    Modifier
------   --------
3-4      -4
5-6      -3
7-8      -2
9-10     -1
11-12    +0
13-14    +1
15-16    +2
17-18    +3
19-20    +4
```

**Note:** Monster stat blocks show modifiers directly (not scores).

---

## Responsive Design

### Desktop (≥1024px)
- 3-column grid for Defense/Offense/Movement
- Side-by-side trait cards
- Full-width ability scores
- Toolbar with all actions visible

### Tablet (768px - 1023px)
- 2-column grid
- Trait cards in 2 columns
- Condensed toolbar
- Collapsible sections

### Mobile (<768px)
- Single column stack
- Full-width cards
- Compact ability scores (2×3 grid)
- Hamburger menu for secondary actions
- Sticky header on scroll

---

## Color Coding System

### Ability Modifiers
- **Positive (+1 to +4)**: Green (`text-green-600`)
- **Negative (-1 to -4)**: Red (`text-red-600`)
- **Zero (0)**: Gray (`text-gray-600`)

### HP Status
- **Healthy (>66%)**: Green bar
- **Wounded (33-66%)**: Yellow bar
- **Bloodied (<33%)**: Red bar

### Roll Results
- **Critical Hit (nat 20)**: Gold border and text
- **Critical Miss (nat 1)**: Red border and text
- **Normal Hit**: Blue accent
- **Normal Miss**: Gray

### Alignment
- **Lawful (L)**: Blue icon
- **Neutral (N)**: Gray icon
- **Chaotic (C)**: Red icon

---

## Accessibility Features

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Escape to close modals
   - Arrow keys for number inputs

2. **Screen Reader Support**
   - All buttons have descriptive aria-labels
   - Roll results announced with aria-live
   - Proper heading hierarchy (h1 → h2 → h3)
   - Alt text for all icons

3. **Visual Accessibility**
   - WCAG AA color contrast (4.5:1 minimum)
   - Focus indicators on all interactive elements
   - Text zoom support up to 200%
   - No color-only information

4. **Motion Preferences**
   - Respect `prefers-reduced-motion`
   - Disable animations if requested
   - Instant state changes instead of transitions

---

## Data Parsing Examples

### Attack String Parsing

**Input:**
```
"2 tentacle (near) +5 (1d8 + curse) or 1 tail +5 (3d6)"
```

**Parsed Output:**
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

---

### Trait DC Parsing

**Input:**
```
"DC 15 CON or target gains a magical curse, turning into a deep one over 2d10 days."
```

**Parsed Output:**
```javascript
{
  saveType: "CON",
  saveDC: 15,
  duration: "2d10 days",
  effect: "target gains a magical curse, turning into a deep one"
}
```

---

### Damage Formula Parsing

**Input:**
```
"1d8+2", "3d6", "2d10-1"
```

**Parsed Output:**
```javascript
{
  count: 1,
  die: 8,
  modifier: 2,
  formula: "1d8+2"
}
```

---

## Implementation Priority

### Phase 1: MVP (Week 1)
1. ✓ Basic page layout with header
2. ✓ Defense/Offense/Movement display
3. ✓ Ability scores grid
4. ✓ Traits list (read-only)
5. ✓ Routing from monster list

### Phase 2: Core Tools (Week 2)
1. HP Tracker with state management
2. Attack Roller with basic dice rolling
3. Damage Roller with critical support
4. Saving Throw helper

### Phase 3: Polish & Enhance (Week 3)
1. Advanced parsers (attack string, trait DC)
2. Roll history and undo
3. Responsive design refinements
4. Accessibility audit and fixes

### Phase 4: Advanced Features (Week 4+)
1. Session integration (add to encounters)
2. Multiple monster instance tracking
3. Condition and status effect tracking
4. Export stat block to PDF/print

---

## File Structure

```
src/
  routes/
    monsters/
      $slug/
        index.tsx                          # Main detail page route

  components/
    monsters/
      detail/
        MonsterDetailHeader.tsx            # Name, level, alignment
        MonsterDefenseCard.tsx             # AC, HP, armor
        MonsterOffenseCard.tsx             # Attacks
        MonsterMovementCard.tsx            # Speed and movement
        MonsterAbilityScores.tsx           # 6 ability modifiers
        MonsterTraits.tsx                  # Traits container
        MonsterTraitCard.tsx               # Individual trait

        tools/
          HPTracker.tsx                    # HP management
          AttackRoller.tsx                 # Attack rolls
          DamageRoller.tsx                 # Damage rolls
          SavingThrowRoller.tsx            # Save checks
          InitiativeRoller.tsx             # Initiative
          RollHistory.tsx                  # Recent rolls display

        utils/
          diceRoller.ts                    # Core dice logic
          attackParser.ts                  # Parse attack strings
          traitParser.ts                   # Parse trait text
          damageCalculator.ts              # Damage calculations
          abilityFormatter.ts              # Format modifiers

  types/
    monster.ts                             # Monster type definitions
    dice.ts                                # Dice roll types
    combat.ts                              # Combat helper types
```

---

## Testing Strategy

### Unit Tests (Jest + Vitest)
```typescript
// diceRoller.test.ts
describe('rollD20', () => {
  it('returns number between 1 and 20', () => {
    const result = rollD20()
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(20)
  })
})

// attackParser.test.ts
describe('parseAttackString', () => {
  it('parses multiple attacks with OR', () => {
    const input = '2 claw +3 (1d4+1) or 1 bite +5 (1d6)'
    const result = parseAttackString(input)
    expect(result).toHaveLength(2)
    expect(result[0].count).toBe(2)
  })
})

// damageCalculator.test.ts
describe('calculateCriticalDamage', () => {
  it('doubles dice but not modifier', () => {
    const result = rollDamage('1d8+2', true)
    // Should roll 2d8+2, not 2d8+4
    expect(result.diceRolls).toHaveLength(2)
  })
})
```

### Integration Tests (React Testing Library)
```typescript
// MonsterDetailPage.test.tsx
describe('MonsterDetailPage', () => {
  it('displays monster stats correctly', () => {
    render(<MonsterDetailPage />)
    expect(screen.getByText('Aboleth')).toBeInTheDocument()
    expect(screen.getByText('AC: 16')).toBeInTheDocument()
    expect(screen.getByText('HP: 39')).toBeInTheDocument()
  })

  it('allows HP tracking', async () => {
    render(<MonsterDetailPage />)
    const damageButton = screen.getByText('-5')
    await userEvent.click(damageButton)
    expect(screen.getByText('34 / 39')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)
```typescript
// monster-detail.spec.ts
test('complete monster detail workflow', async ({ page }) => {
  await page.goto('/monsters/aboleth')

  // Check basic info
  await expect(page.getByText('Aboleth')).toBeVisible()
  await expect(page.getByText('Level 8')).toBeVisible()

  // Roll an attack
  await page.click('text=Roll Attack')
  await expect(page.getByText(/Rolled \d+ \+/)).toBeVisible()

  // Apply damage
  await page.click('text=-10')
  await expect(page.getByText('29 / 39')).toBeVisible()
})
```

---

## Performance Optimization

### Code Splitting
```typescript
// Lazy load heavy components
const HPTracker = lazy(() => import('./tools/HPTracker'))
const AttackRoller = lazy(() => import('./tools/AttackRoller'))
```

### Memoization
```typescript
// Expensive parsers
const parsedAttacks = useMemo(
  () => parseAttackString(monster.attacks),
  [monster.attacks]
)

const parsedTraits = useMemo(
  () => monster.traits.map(trait => parseTraitForDC(trait)),
  [monster.traits]
)
```

### Debounced State
```typescript
// HP tracker updates
const [pendingHP, setPendingHP] = useState(currentHP)
const debouncedHP = useDebouncedValue(pendingHP, 300)

useEffect(() => {
  saveHPToSession(debouncedHP)
}, [debouncedHP])
```

---

## Example: Complete Aboleth Detail Page

### Header Section
```
┌────────────────────────────────────────────────┐
│ [← Back to Monsters]        [⭐ Favorite] [⚙️] │
│                                                │
│ ABOLETH                Level 8        (C)      │
│                                                │
│ Enormous, antediluvian catfish covered in     │
│ slime and tentacles. They hate all            │
│ intelligent beings.                            │
│                                                │
│ [Add to Encounter] [Roll Initiative]           │
└────────────────────────────────────────────────┘
```

### Stats Grid
```
┌──────────────┬──────────────┬──────────────┐
│ DEFENSE      │ OFFENSE      │ MOVEMENT     │
│              │              │              │
│ 🛡️ AC: 16    │ ⚔️ Attacks:  │ 👟 Speed:    │
│              │              │              │
│ ❤️ HP: 39    │ 2× Tentacle  │ near (swim)  │
│              │ (near)       │              │
│ [━━━━━━━]    │ +5 / 1d8     │              │
│ 100%         │ + curse      │              │
│              │              │              │
│ [-1] [-5]    │ [Roll Atk]   │              │
│ [+1] [+5]    │ [Roll Dmg]   │              │
│              │              │              │
│              │ ─── OR ───   │              │
│              │              │              │
│              │ 1× Tail      │              │
│              │ (near)       │              │
│              │ +5 / 3d6     │              │
│              │              │              │
│              │ [Roll Atk]   │              │
│              │ [Roll Dmg]   │              │
└──────────────┴──────────────┴──────────────┘
```

### Ability Scores
```
┌────────────────────────────────────────────────┐
│ ABILITY MODIFIERS                              │
│                                                │
│ STR    DEX    CON    INT    WIS    CHA        │
│ +4     -1     +3     +4     +2     +2         │
└────────────────────────────────────────────────┘
```

### Special Abilities
```
┌────────────────────────────────────────────────┐
│ SPECIAL ABILITIES                              │
│                                                │
│ ┌──────────────────────────────────────────┐   │
│ │ ⚡ Curse                                 │   │
│ │                                          │   │
│ │ DC 15 CON or target gains a magical     │   │
│ │ curse, turning into a deep one over     │   │
│ │ 2d10 days.                               │   │
│ │                                          │   │
│ │ [Roll CON Save DC 15] [Duration 2d10]   │   │
│ └──────────────────────────────────────────┘   │
│                                                │
│ ┌──────────────────────────────────────────┐   │
│ │ 🧠 Enslave                               │   │
│ │                                          │   │
│ │ In place of attacks, one creature       │   │
│ │ within far DC 15 WIS or aboleth         │   │
│ │ controls for 1d4 rounds.                │   │
│ │                                          │   │
│ │ [Roll WIS Save DC 15] [Duration 1d4]    │   │
│ └──────────────────────────────────────────┘   │
│                                                │
│ ┌──────────────────────────────────────────┐   │
│ │ 💭 Telepathic                            │   │
│ │                                          │   │
│ │ Read the thoughts of all creatures      │   │
│ │ within far.                              │   │
│ └──────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
```

---

## Conclusion

This Monster Details page transforms raw monster data into an interactive, GM-friendly reference tool that accelerates combat resolution and reduces rules lookup time. By following Shadowdark's design philosophy of streamlined, fast-paced gameplay, these tools help GMs focus on storytelling rather than mechanics.

Key success metrics:
- ✓ Reduce time to look up monster stats from ~30s to <5s
- ✓ Enable one-click attack and damage resolution
- ✓ Provide visual HP tracking without paper notes
- ✓ Parse and present complex abilities in digestible format
- ✓ Maintain mobile-friendly experience for tablet users at table

The modular component architecture ensures maintainability and allows for incremental feature additions as the app evolves.
