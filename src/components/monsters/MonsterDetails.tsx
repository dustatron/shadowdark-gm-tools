/**
 * MonsterDetails Component
 *
 * Displays the full details of a single monster including:
 * - Name, level, and description
 * - Combat stats (AC, HP, attacks, movement)
 * - All ability score modifiers
 * - Special traits and abilities
 */

import type { Monster } from '~/types/monster'
import {
  formatAlignment,
  formatArmorClass,
  formatHitPoints,
  formatLevel,
  formatMovement,
} from '~/utils/monsterHelpers'
import { AbilityScoreBox } from './AbilityScoreBox'
import { CombatStateBox } from './CombatStateBox'

const titleBarStyle =
  'mb-0 text-2xl font-semibold bg-primary text-primary-foreground py-1 pl-2'

interface MonsterDetailsProps {
  monster: Monster
}

export function MonsterDetails({ monster }: MonsterDetailsProps) {
  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex justify-between gap-3 bg-primary text-primary-foreground p-2 pl-4">
          <h1 className="text-4xl font-bold">{monster.name}</h1>
          <span className="inline-flex items-center bg-secondary text-secondary-foreground p-2 font-semibold text-md">
            Level {formatLevel(monster.level)}
          </span>
        </div>
        <p className="leading-relaxed text-xl">{monster.description}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="font-extrabold">Alignment:</span>
          <span>{formatAlignment(monster.alignment)}</span>
        </div>
      </div>

      {/* Core Combat Stats */}
      <div>
        <h2 className={titleBarStyle}>Combat Stats:</h2>
        <div className="grid gap sm:grid-cols-2 lg:grid-cols-4">
          <CombatStateBox
            label="Armor Class"
            stat={formatArmorClass(monster.armor_class, monster.armor_type)}
          />
          <CombatStateBox
            label="Hit Points"
            stat={formatHitPoints(monster.hit_points)}
          />
          <CombatStateBox
            label="Movement"
            stat={formatMovement(monster.movement)}
          />
          <CombatStateBox label="Level" stat={formatLevel(monster.level)} />
        </div>
      </div>
      {/* Ability Scores */}
      <div>
        <h2 className={titleBarStyle}>Ability Scores:</h2>
        <div className="grid gap-0 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <AbilityScoreBox label="STR" score={monster.strength} />
          <AbilityScoreBox label="DEX" score={monster.dexterity} />
          <AbilityScoreBox label="CON" score={monster.constitution} />
          <AbilityScoreBox label="INT" score={monster.intelligence} />
          <AbilityScoreBox label="WIS" score={monster.wisdom} />
          <AbilityScoreBox label="CHA" score={monster.charisma} />
        </div>
      </div>

      {/* Attacks */}
      <div className="border p-2">
        <h2 className="mb-1 text-2xl font-bold">Attacks:</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {monster.attacks}
        </p>
      </div>

      {/* Special Traits */}
      {monster.traits && monster.traits.length > 0 && (
        <div>
          <h2 className={titleBarStyle}>Special Traits</h2>
          <div className="space-y-0">
            {monster.traits.map((trait, index) => (
              <div
                key={index}
                className="border bg-card text-card-foreground p-6"
              >
                <h3 className="mb-1 text-lg font-semibold">{trait.name}</h3>
                <p className="text-muted-foreground">{trait.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
