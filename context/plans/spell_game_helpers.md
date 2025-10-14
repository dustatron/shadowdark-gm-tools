# Spell Details - Game Mechanic Helpers

## Overview

This document outlines interactive game mechanic helpers that would enhance the Spell Details page for active gameplay use. These helpers would make the digital tool more useful than a static spell reference.

## Phase 1 Helpers (Can Implement Now)

### 1. Casting Check Roller

**Purpose:** Help players determine if their spell casting succeeds.

**Shadowdark Mechanic:**
```
Roll 1d20 + casting modifier ≥ Casting DC (10 + spell tier)
- Wizards use INT modifier
- Priests use WIS modifier
```

**UI Component:**
```tsx
interface CastingCheckProps {
  castingDC: number
  spellTier: number
  spellName: string
}

function CastingCheckRoller({ castingDC, spellTier, spellName }: CastingCheckProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-semibold">Quick Casting Check</h3>
      <p className="text-sm text-gray-600">
        Target DC: {castingDC} (10 + {spellTier})
      </p>

      {/* Input for modifier */}
      <label className="text-sm">
        Your Casting Modifier:
        <input type="number" className="ml-2 w-16 rounded border" />
      </label>

      {/* Roll button */}
      <button className="mt-2 rounded bg-blue-600 px-4 py-2 text-white">
        Roll Casting Check
      </button>

      {/* Result display */}
      {result && (
        <div className={`mt-2 rounded p-2 ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="font-bold">
            {result.success ? '✓ Success!' : '✗ Failed!'}
          </p>
          <p className="text-sm">
            Roll: {result.d20} + {result.modifier} = {result.total} vs DC {castingDC}
          </p>
        </div>
      )}
    </div>
  )
}
```

**Implementation Notes:**
- Store casting modifier in local state
- Roll d20 on button click
- Calculate total = d20 + modifier
- Compare to casting DC
- Show success/failure with visual feedback
- Optional: Save modifier to session storage for quick reuse

**Future Enhancement:**
- Advantage/disadvantage toggle (roll 2d20, take higher/lower)
- Auto-fetch character's casting modifier from character sheet

---

### 2. Copy to Clipboard

**Purpose:** Quickly copy spell details for sharing in chat or notes.

**UI Component:**
```tsx
function CopySpellButton({ spell }: { spell: Spell }) {
  const [copied, setCopied] = useState(false)

  const copySpellToClipboard = () => {
    const text = formatSpellForCopy(spell)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copySpellToClipboard}
      className="flex items-center gap-2 rounded border px-3 py-1 text-sm"
    >
      {copied ? '✓ Copied!' : '📋 Copy Spell'}
    </button>
  )
}

function formatSpellForCopy(spell: Spell): string {
  return `
**${spell.name}** (Tier ${spell.tier} ${spell.classes.join('/')})
Range: ${spell.range} | Duration: ${spell.duration} | DC: ${10 + Number(spell.tier)}

${spell.description}
  `.trim()
}
```

**Use Cases:**
- Copy to VTT chat
- Paste into session notes
- Share with other players
- Quick reference during gameplay

---

### 3. Spell Tier Calculator Display

**Purpose:** Show spell slot requirements and tier progression.

**UI Component:**
```tsx
function SpellTierInfo({ tier }: { tier: string }) {
  const tierNum = Number(tier)

  return (
    <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-900/20">
      <h4 className="font-semibold">Tier {tier} Spell</h4>

      <div className="mt-2 space-y-1 text-sm">
        <p>
          <strong>Casting DC:</strong> {10 + tierNum}
        </p>
        <p>
          <strong>Minimum Level:</strong> {getMinimumLevelForTier(tierNum)}
        </p>
        <p>
          <strong>Spell Slots:</strong> Uses a Tier {tier} slot
        </p>
      </div>
    </div>
  )
}

function getMinimumLevelForTier(tier: number): number {
  // Shadowdark spell slot progression
  const minimumLevels: Record<number, number> = {
    1: 1,  // Tier 1 at level 1
    2: 3,  // Tier 2 at level 3
    3: 5,  // Tier 3 at level 5
    4: 7,  // Tier 4 at level 7
    5: 9,  // Tier 5 at level 9
  }
  return minimumLevels[tier] || 1
}
```

**Implementation Notes:**
- Display minimum character level to cast this tier
- Show casting DC calculation
- Explain spell slot usage

---

### 4. Focus Spell Indicator

**Purpose:** Highlight spells that require concentration (Focus).

**UI Component:**
```tsx
function FocusSpellAlert({ duration }: { duration: string }) {
  const isFocus = duration.toLowerCase() === 'focus'

  if (!isFocus) return null

  return (
    <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 dark:bg-amber-900/20">
      <div className="flex items-center gap-2">
        <span className="text-2xl">👁️</span>
        <div>
          <h4 className="font-bold text-amber-900 dark:text-amber-200">
            Focus Spell (Concentration Required)
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            This spell requires concentration. It ends if you take damage, cast
            another Focus spell, or choose to end it.
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Implementation Notes:**
- Parse duration field for "Focus"
- Display prominent warning/info box
- Explain concentration rules for Shadowdark
- Visual indicator (eye icon for concentration)

---

## Phase 2 Helpers (Require Additional Data)

These helpers would require parsing spell descriptions or extending the database schema.

### 5. Damage Dice Roller

**Purpose:** Roll spell damage automatically.

**Required Data:**
- `damage_dice: string` (e.g., "6d6", "3d8+3")
- `damage_type: string` (e.g., "fire", "radiant")

**UI Component:**
```tsx
function DamageRoller({ damageDice, damageType }: {
  damageDice: string
  damageType: string
}) {
  const [result, setResult] = useState<DamageRollResult | null>(null)

  const rollDamage = () => {
    const rolls = parseDiceString(damageDice)
    const total = rollDice(rolls)
    setResult({ rolls, total, type: damageType })
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h4 className="font-semibold">Damage Roll</h4>
      <p className="text-sm text-gray-600">
        {damageDice} {damageType} damage
      </p>

      <button
        onClick={rollDamage}
        className="mt-2 rounded bg-red-600 px-4 py-2 text-white"
      >
        🎲 Roll {damageDice}
      </button>

      {result && (
        <div className="mt-2 rounded bg-red-50 p-2">
          <p className="text-lg font-bold">
            {result.total} {result.type} damage
          </p>
          <p className="text-xs text-gray-600">
            Rolls: {result.rolls.join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
```

**Example:**
- Fireball: "Roll 6d6" button → Shows "23 fire damage"
- Magic Missile: "Roll 1d4+1" per missile

---

### 6. Saving Throw Helper

**Purpose:** Calculate and track saving throws for spell effects.

**Required Data:**
- `save_ability: string` (e.g., "DEX", "WIS", "CON")
- `save_effect: string` (e.g., "half damage", "negates")

**UI Component:**
```tsx
function SavingThrowHelper({ ability, effect, dc }: {
  ability: string
  effect: string
  dc: number
}) {
  return (
    <div className="rounded-lg border bg-purple-50 p-4">
      <h4 className="font-semibold">Saving Throw</h4>
      <p className="text-sm">
        <strong>{ability} Save DC {dc}</strong>
      </p>
      <p className="text-sm text-gray-600">
        {effect === 'half' ? 'Success: Half damage' : `Success: ${effect}`}
      </p>

      {/* Quick calculator */}
      <div className="mt-2 flex gap-2">
        <input
          type="number"
          placeholder="Target's modifier"
          className="w-24 rounded border px-2 py-1"
        />
        <button className="rounded bg-purple-600 px-3 py-1 text-white text-sm">
          Roll Save
        </button>
      </div>
    </div>
  )
}
```

**Example:**
- Fireball: "DEX Save DC 13 (half damage on success)"
- Hold Person: "WIS Save DC 12 (negates)"

---

### 7. Area of Effect Visualizer

**Purpose:** Show spell area for tactical planning.

**Required Data:**
- `area_of_effect: string` (e.g., "20-foot radius", "30-foot cone")

**UI Component:**
```tsx
function AreaOfEffectDisplay({ area }: { area: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h4 className="font-semibold">Area of Effect</h4>
      <p className="text-lg font-bold text-blue-600">{area}</p>

      {/* Visual representation */}
      <div className="mt-2 rounded bg-gray-100 p-4">
        {renderAreaShape(area)}
      </div>

      {/* Grid info */}
      <p className="mt-2 text-xs text-gray-600">
        {calculateGridSquares(area)} on a 5-foot grid
      </p>
    </div>
  )
}

function renderAreaShape(area: string): JSX.Element {
  // Simple SVG visualizations for common shapes
  if (area.includes('radius')) {
    return <CircleVisualization />
  }
  if (area.includes('cone')) {
    return <ConeVisualization />
  }
  if (area.includes('line')) {
    return <LineVisualization />
  }
  return <p>See description for area details</p>
}
```

**Example:**
- Fireball: "20-foot radius" → Shows circle diagram
- Lightning Bolt: "100-foot line" → Shows line diagram

---

### 8. Duration Tracker

**Purpose:** Track spell duration during encounters.

**Required Data:**
- `duration: string` (already have this)

**UI Component:**
```tsx
function DurationTracker({ spellName, duration }: {
  spellName: string
  duration: string
}) {
  const [tracking, setTracking] = useState(false)
  const [remainingRounds, setRemainingRounds] = useState(0)

  const startTracking = () => {
    const rounds = parseDurationToRounds(duration)
    if (rounds > 0) {
      setRemainingRounds(rounds)
      setTracking(true)
      // Optionally: Add to session tracker
    }
  }

  if (duration.toLowerCase() === 'instant') {
    return null // No tracking needed for instant spells
  }

  return (
    <div className="rounded-lg border bg-green-50 p-4">
      <h4 className="font-semibold">Duration Tracking</h4>
      <p className="text-sm text-gray-600">
        Duration: {duration}
      </p>

      {!tracking ? (
        <button
          onClick={startTracking}
          className="mt-2 rounded bg-green-600 px-4 py-2 text-white"
        >
          ⏱️ Track Duration
        </button>
      ) : (
        <div className="mt-2">
          <p className="text-lg font-bold">
            {remainingRounds} rounds remaining
          </p>
          <button
            onClick={() => setRemainingRounds(r => Math.max(0, r - 1))}
            className="mt-1 rounded bg-gray-600 px-3 py-1 text-white text-sm"
          >
            Next Round
          </button>
        </div>
      )}
    </div>
  )
}

function parseDurationToRounds(duration: string): number {
  // Parse common duration formats
  const match = duration.match(/(\d+)\s*round/i)
  return match ? Number(match[1]) : 0
}
```

**Example:**
- Bless: "5 rounds" → Track countdown
- Haste: "Focus" → Track until concentration broken
- Mage Armor: "8 hours" → Note end time

---

### 9. Spell Components Checker

**Purpose:** Remind players of required components.

**Required Data:**
- `components: string[]` (e.g., ["verbal", "somatic", "material"])
- `material_description: string` (e.g., "a pinch of sulfur")

**UI Component:**
```tsx
function ComponentsDisplay({ components, materialDesc }: {
  components: string[]
  materialDesc?: string
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h4 className="font-semibold">Components Required</h4>
      <div className="mt-2 flex gap-2">
        {components.includes('verbal') && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
            V (Verbal)
          </span>
        )}
        {components.includes('somatic') && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm">
            S (Somatic)
          </span>
        )}
        {components.includes('material') && (
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm">
            M (Material)
          </span>
        )}
      </div>
      {materialDesc && (
        <p className="mt-2 text-sm text-gray-600">
          Material: {materialDesc}
        </p>
      )}
    </div>
  )
}
```

**Note:** Shadowdark doesn't emphasize components as much as D&D 5e, so this may not be necessary unless we expand the rules.

---

### 10. Spell Scaling Display

**Purpose:** Show how spell changes when cast at higher tiers.

**Required Data:**
- `higher_tier_scaling: string` (e.g., "Add 1d6 damage per tier above 3rd")

**UI Component:**
```tsx
function SpellScalingInfo({ baseTier, scaling }: {
  baseTier: number
  scaling?: string
}) {
  if (!scaling) return null

  return (
    <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
      <h4 className="font-semibold text-blue-900">At Higher Tiers</h4>
      <p className="text-sm text-blue-800">{scaling}</p>

      {/* Example calculations */}
      <div className="mt-2 space-y-1 text-xs text-blue-700">
        <p><strong>Tier {baseTier + 1}:</strong> {calculateScaling(baseTier + 1)}</p>
        <p><strong>Tier {baseTier + 2}:</strong> {calculateScaling(baseTier + 2)}</p>
      </div>
    </div>
  )
}
```

**Example:**
- Magic Missile: "Create one additional dart for each tier above 1st"
- Cure Wounds: "Add 1d8 healing per tier above 1st"

---

## Phase 3 Helpers (Advanced Integration)

### 11. Character Sheet Integration

- Automatically populate casting modifier from linked character
- Check available spell slots
- Mark spell as prepared/known
- Track spell usage during session

### 12. Session Tracker Integration

- Add active spell effects to encounter tracker
- Countdown spell durations automatically during combat
- Track concentration effects
- Alert when spell expires

### 13. Encounter Builder Integration

- Add spell to encounter as NPC ability
- Include in enemy stat blocks
- Calculate encounter difficulty with spell effects

### 14. Spellbook Manager

- Create custom spellbooks
- Organize spells by character
- Mark favorites
- Filter available spells by character level/class

---

## Implementation Priority

### High Priority (Phase 1)
1. **Casting Check Roller** - Most useful for active play
2. **Focus Spell Indicator** - Important rule reminder
3. **Copy to Clipboard** - Simple utility, high value
4. **Spell Tier Info** - Educational and useful

### Medium Priority (Phase 2)
5. **Damage Roller** - Requires data parsing but very useful
6. **Saving Throw Helper** - Common spell mechanic
7. **Duration Tracker** - Useful for longer spells

### Low Priority (Phase 2+)
8. **Area of Effect Visualizer** - Nice to have, complex to implement
9. **Spell Scaling** - Only relevant for some spells
10. **Components Checker** - Less critical in Shadowdark

### Future (Phase 3)
11-14. All integration features

---

## Technical Considerations

### State Management
- Local component state for simple helpers (roll results)
- Session storage for user preferences (casting modifier)
- Context/Zustand for session tracking integration

### Data Requirements
- Phase 1 works with existing database schema
- Phase 2 requires schema extensions or description parsing
- Phase 3 requires character sheet and session tracker systems

### Accessibility
- All roll buttons keyboard accessible
- Screen reader announcements for roll results
- Clear visual feedback for all actions
- ARIA labels on all interactive elements

### Mobile Responsiveness
- Roll buttons should be touch-friendly (min 44px)
- Results display should be readable on small screens
- Helpers stack vertically on mobile

---

## Design Mockup: Helper Panel

```
┌─────────────────────────────────────────────┐
│ FIREBALL - Tier 3 Wizard                   │
│ Far | Instant | DC: 13                      │
├─────────────────────────────────────────────┤
│ Description: [Full text...]                │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ ⚡ Quick Casting Check                  │ │
│ │ Target DC: 13                           │ │
│ │ Your INT modifier: [+3] [Roll d20]     │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🎲 Damage Roll                          │ │
│ │ 6d6 fire damage [Roll Damage]          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🛡️ Saving Throw                         │ │
│ │ DEX Save DC 13 (half damage)            │ │
│ │ [Calculator]                            │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 📐 Area of Effect                       │ │
│ │ 20-foot radius [View Diagram]           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [📋 Copy Spell] [⭐ Add to Favorites]      │
└─────────────────────────────────────────────┘
```

---

## Summary

Game mechanic helpers transform the Spell Details page from a static reference into an active gameplay tool. Start with Phase 1 helpers that work with existing data, then gradually add Phase 2 helpers as you extend the database schema and parse spell descriptions.

**Most Valuable Helpers:**
1. Casting Check Roller
2. Focus Spell Indicator
3. Damage Roller
4. Saving Throw Helper
5. Copy to Clipboard

These five helpers would provide 80% of the value for active gameplay while being achievable with reasonable development effort.
