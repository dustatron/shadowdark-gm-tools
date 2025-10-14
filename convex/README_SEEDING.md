# Monster Data Seeding Instructions

This document explains how to seed the monster data into the Convex database.

## Prerequisites

1. Ensure your Convex dev server is running:

   ```bash
   npm run dev:convex
   ```

2. Ensure your `.env.local` file has the `VITE_CONVEX_URL` set:
   ```
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   ```

## Seeding Methods

### Method 1: Using the Node.js Script (Recommended)

This is the easiest method. Simply run:

```bash
node scripts/seedMonstersDirectly.mjs
```

This script will:

- Load all 243 monsters from `coreData/monsters.json`
- Call the `seedMonsters` action in Convex
- Display progress and results
- Skip any monsters that already exist (idempotent)

Expected output:

```
Connecting to Convex at: https://your-deployment.convex.cloud
Loaded 243 monsters from /path/to/coreData/monsters.json
Starting seeding process...

✅ Seeding completed successfully!
   Total monsters: 243
   Inserted: 243
   Skipped (already exist): 0
```

### Method 2: Using Convex Dashboard

1. Open your Convex dashboard
2. Navigate to the "Functions" tab
3. Find the `seedMonsters` action
4. Load the monsters data:
   ```javascript
   const monsters = await fetch('/coreData/monsters.json').then((r) => r.json())
   ```
5. Call the action with the loaded data

### Method 3: Using Convex CLI

```bash
npx convex run seedMonsters:seedMonsters --arg 'monsters=@coreData/monsters.json'
```

## Verification

After seeding, verify the data was imported correctly:

1. Open Convex dashboard
2. Navigate to "Data" tab
3. Check the "monsters" table
4. You should see 243 monster entries

Or query via code:

```typescript
const monsters = await ctx.db.query('monsters').collect()
console.log(`Total monsters: ${monsters.length}`)
```

## Re-running the Seeding

The seeding script is **idempotent** - it's safe to run multiple times. It will:

- Check for existing monsters by `slug` field
- Skip any monsters that already exist
- Only insert new monsters

This means you can safely re-run the script without creating duplicates.

## Troubleshooting

### Error: "VITE_CONVEX_URL must be set"

- Ensure your `.env.local` file exists and contains the Convex URL
- Restart your terminal/dev server after adding environment variables

### Error: "Cannot find module 'convex/browser'"

- Run `npm install` to ensure all dependencies are installed
- Make sure you're using Node.js 20.19+ or 22.12+

### TypeScript Error: "Property 'seedMonsters' does not exist"

- This is expected before the Convex dev server runs
- Start the Convex dev server: `npm run dev:convex`
- The types will be auto-generated after the schema is deployed

### No Monsters Inserted (all skipped)

- This means monsters already exist in the database
- This is normal and expected on subsequent runs
- To re-seed from scratch, delete the monsters table in the Convex dashboard first

## Schema Details

The monsters table includes:

- Basic info: name, slug, description
- Combat stats: armor_class, armor_type, hit_points, attacks, movement
- Ability scores: strength, dexterity, constitution, intelligence, wisdom, charisma
- Metadata: alignment, level
- Special abilities: traits (array of {name, description})

All fields match the structure in `coreData/monsters.json`.
