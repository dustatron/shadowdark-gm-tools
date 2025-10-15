#!/usr/bin/env node

/**
 * Seeds the production Convex database with monsters and spells.
 *
 * Usage:
 *   node scripts/run-prod-seed.mjs
 *
 * This script requires the CONVEX_DEPLOY_KEY environment variable to be set.
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execa } from 'execa'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Function to run a command and stream its output
const runCommand = async (command, args) => {
  console.log(`\nRunning: ${command} ${args.join(' ')}\n`)
  try {
    const subprocess = execa(command, args)
    subprocess.stdout.pipe(process.stdout)
    subprocess.stderr.pipe(process.stderr)
    await subprocess
  } catch (error) {
    console.error(`\nError running command: ${error.message}`)
    process.exit(1)
  }
}

// --- Main Seeding Logic ---

async function main() {
  // Check for CONVEX_DEPLOY_KEY
  if (!process.env.CONVEX_DEPLOY_KEY) {
    console.error('Error: CONVEX_DEPLOY_KEY environment variable is not set.')
    console.error('Please set it to your production deployment key.')
    process.exit(1)
  }

  // --- Seed Monsters ---
  console.log('--- Seeding Monsters ---')
  const monstersPath = join(__dirname, '../coreData/monsters.json')
  const monstersData = JSON.parse(readFileSync(monstersPath, 'utf-8'))
  console.log(`Loaded ${monstersData.length} monsters.`)

  const monstersArg = JSON.stringify({ monsters: monstersData })
  await runCommand('npx', [
    'convex',
    'run',
    'seedMonsters:seedMonsters',
    monstersArg,
    '--prod',
  ])

  console.log('\n--- Monsters seeded successfully! ---')

  // --- Seed Spells ---
  console.log('\n--- Seeding Spells ---')
  const spellsPath = join(__dirname, '../coreData/spells.json')
  const spellsData = JSON.parse(readFileSync(spellsPath, 'utf-8'))
  console.log(`Loaded ${spellsData.length} spells.`)

  const spellsArg = JSON.stringify({ spells: spellsData })
  await runCommand('npx', [
    'convex',
    'run',
    'seedSpells:seedSpells',
    spellsArg,
    '--prod',
  ])

  console.log('\n--- Spells seeded successfully! ---')
  console.log('\nDatabase seeding complete.')
}

main().catch((error) => {
  console.error('\nAn unexpected error occurred:', error)
  process.exit(1)
})
