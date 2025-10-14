#!/usr/bin/env node

/**
 * Helper script to seed monsters into Convex database
 *
 * Usage:
 *   node scripts/seedMonsters.mjs
 *
 * This script reads the monsters.json file and calls the Convex seedMonsters action
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read monsters data
const monstersPath = join(__dirname, '../coreData/monsters.json')
const monstersData = JSON.parse(readFileSync(monstersPath, 'utf-8'))

console.log(`Loaded ${monstersData.length} monsters from ${monstersPath}`)
console.log('\nTo seed the database, run the following command:')
console.log(
  "\nnpx convex run seedMonsters:seedMonsters --arg 'monsters=" +
    JSON.stringify(monstersData) +
    "'",
)
console.log(
  '\nOr copy the data and paste it in the Convex dashboard when calling the action.',
)
console.log('\nMonster data is ready to be seeded!')
