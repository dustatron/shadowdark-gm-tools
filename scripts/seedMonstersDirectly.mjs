#!/usr/bin/env node

/**
 * Script to seed monsters into Convex database
 *
 * Usage:
 *   node scripts/seedMonstersDirectly.mjs
 *
 * Make sure you have CONVEX_URL set in your .env.local file
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { ConvexHttpClient } from 'convex/browser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = join(__dirname, '../.env.local')
    const envFile = readFileSync(envPath, 'utf-8')
    const envVars = {}

    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        envVars[key] = value
      }
    })

    return envVars
  } catch (error) {
    return {}
  }
}

const env = loadEnvFile()
const CONVEX_URL = env.VITE_CONVEX_URL || env.CONVEX_URL || process.env.VITE_CONVEX_URL || process.env.CONVEX_URL

if (!CONVEX_URL) {
  console.error(
    'Error: VITE_CONVEX_URL or CONVEX_URL must be set in .env.local',
  )
  process.exit(1)
}

console.log('Connecting to Convex at:', CONVEX_URL)

// Create Convex client
const client = new ConvexHttpClient(CONVEX_URL)

// Read monsters data
const monstersPath = join(__dirname, '../coreData/monsters.json')
const monstersData = JSON.parse(readFileSync(monstersPath, 'utf-8'))

console.log(`\nLoaded ${monstersData.length} monsters from ${monstersPath}`)
console.log('Starting seeding process...\n')

try {
  const result = await client.action('seedMonsters:seedMonsters', {
    monsters: monstersData,
  })

  console.log('\n✅ Seeding completed successfully!')
  console.log(`   Total monsters: ${result.total}`)
  console.log(`   Inserted: ${result.inserted}`)
  console.log(`   Skipped (already exist): ${result.skipped}`)

  if (result.errors.length > 0) {
    console.log(`\n⚠️  Errors: ${result.errors.length}`)
    result.errors.forEach((err) => console.error(`   - ${err}`))
  }

  process.exit(0)
} catch (error) {
  console.error('\n❌ Seeding failed:', error.message)
  console.error(error)
  process.exit(1)
}
