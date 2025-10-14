#!/usr/bin/env node

/**
 * Helper script to seed spells into Convex database
 *
 * Usage:
 *   node scripts/seedSpells.mjs
 *
 * This script reads the spells.json file and calls the Convex seedSpells action
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read spells data
const spellsPath = join(__dirname, '../coreData/spells.json')
const spellsData = JSON.parse(readFileSync(spellsPath, 'utf-8'))

console.log(`Loaded ${spellsData.length} spells from ${spellsPath}`)
console.log('\nTo seed the database, run the following command:')
console.log(
  "\nnpx convex run seedSpells:seedSpells --arg 'spells=" +
    JSON.stringify(spellsData) +
    "'",
)
console.log(
  '\nOr copy the data and paste it in the Convex dashboard when calling the action.',
)
console.log('\nSpell data is ready to be seeded!')
