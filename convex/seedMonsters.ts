import { action, internalMutation } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'

/**
 * Internal mutation to insert a single monster
 * Checks for existing monster by slug to prevent duplicates
 */
export const insertMonster = internalMutation({
  args: {
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
  },
  returns: v.union(
    v.object({
      success: v.boolean(),
      action: v.literal('inserted'),
      slug: v.string(),
    }),
    v.object({
      success: v.boolean(),
      action: v.literal('skipped'),
      slug: v.string(),
    }),
  ),
  handler: async (ctx, monster) => {
    // Check if monster already exists by slug
    const existing = await ctx.db
      .query('monsters')
      .withIndex('by_slug', (q) => q.eq('slug', monster.slug))
      .first()

    if (existing) {
      return { success: true, action: 'skipped' as const, slug: monster.slug }
    }

    // Insert the monster
    await ctx.db.insert('monsters', monster)
    return { success: true, action: 'inserted' as const, slug: monster.slug }
  },
})

/**
 * Action to seed monsters from JSON data
 * This should be called from the Convex dashboard or CLI with the monster data
 *
 * Example usage in Convex dashboard:
 * const monsters = JSON.parse(await fetch('/coreData/monsters.json').then(r => r.text()));
 * await runAction(api.seedMonsters.seedMonsters, { monsters });
 *
 * Or via CLI after loading the file:
 * npx convex run seedMonsters:seedMonsters --arg monsters="$(cat coreData/monsters.json)"
 */
export const seedMonsters = action({
  args: {
    monsters: v.array(
      v.object({
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
      }),
    ),
  },
  returns: v.object({
    total: v.number(),
    inserted: v.number(),
    skipped: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const results = {
      total: args.monsters.length,
      inserted: 0,
      skipped: 0,
      errors: [] as string[],
    }

    console.log(
      `Starting monster seeding: ${results.total} monsters to process`,
    )

    for (const monster of args.monsters) {
      try {
        const result = await ctx.runMutation(
          internal.seedMonsters.insertMonster,
          monster,
        )

        if (result.action === 'inserted') {
          results.inserted++
          if (results.inserted % 50 === 0) {
            console.log(`Progress: ${results.inserted} monsters inserted...`)
          }
        } else {
          results.skipped++
        }
      } catch (error) {
        const errorMessage = `Failed to insert monster "${monster.name}" (${monster.slug}): ${error}`
        console.error(errorMessage)
        results.errors.push(errorMessage)
      }
    }

    console.log(
      `Seeding complete: ${results.inserted} inserted, ${results.skipped} skipped, ${results.errors.length} errors`,
    )

    return results
  },
})
