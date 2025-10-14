import { action, internalMutation } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'

/**
 * Internal mutation to insert a single spell
 * Checks for existing spell by slug to prevent duplicates
 */
export const insertSpell = internalMutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    classes: v.array(v.string()),
    duration: v.string(),
    range: v.string(),
    tier: v.string(),
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
  handler: async (ctx, spell) => {
    // Check if spell already exists by slug
    const existing = await ctx.db
      .query('spells')
      .withIndex('by_slug', (q) => q.eq('slug', spell.slug))
      .first()

    if (existing) {
      return { success: true, action: 'skipped' as const, slug: spell.slug }
    }

    // Insert the spell
    await ctx.db.insert('spells', spell)
    return { success: true, action: 'inserted' as const, slug: spell.slug }
  },
})

/**
 * Action to seed spells from JSON data
 * This should be called from the Convex dashboard or CLI with the spell data
 *
 * Example usage in Convex dashboard:
 * const spells = JSON.parse(await fetch('/coreData/spells.json').then(r => r.text()));
 * await runAction(api.seedSpells.seedSpells, { spells });
 *
 * Or via CLI after loading the file:
 * npx convex run seedSpells:seedSpells --arg spells="$(cat coreData/spells.json)"
 */
export const seedSpells = action({
  args: {
    spells: v.array(
      v.object({
        name: v.string(),
        slug: v.string(),
        description: v.string(),
        classes: v.array(v.string()),
        duration: v.string(),
        range: v.string(),
        tier: v.string(),
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
      total: args.spells.length,
      inserted: 0,
      skipped: 0,
      errors: [] as string[],
    }

    console.log(`Starting spell seeding: ${results.total} spells to process`)

    for (const spell of args.spells) {
      try {
        const result = await ctx.runMutation(
          internal.seedSpells.insertSpell,
          spell,
        )

        if (result.action === 'inserted') {
          results.inserted++
          if (results.inserted % 25 === 0) {
            console.log(`Progress: ${results.inserted} spells inserted...`)
          }
        } else {
          results.skipped++
        }
      } catch (error) {
        const errorMessage = `Failed to insert spell "${spell.name}" (${spell.slug}): ${error}`
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
