import { query } from './_generated/server'
import { v } from 'convex/values'

/**
 * List all spells sorted alphabetically by name
 */
export const listSpells = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('spells'),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      classes: v.array(v.string()),
      duration: v.string(),
      range: v.string(),
      tier: v.string(),
    }),
  ),
  handler: async (ctx) => {
    // Use the by_name index for efficient sorted retrieval
    const spells = await ctx.db.query('spells').withIndex('by_name').collect()

    return spells
  },
})

/**
 * Search spells by name with case-insensitive partial matching
 * If no searchTerm is provided, returns all spells
 */
export const searchSpells = query({
  args: {
    searchTerm: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id('spells'),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      classes: v.array(v.string()),
      duration: v.string(),
      range: v.string(),
      tier: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    // If no search term, return all spells sorted by name
    if (!args.searchTerm || args.searchTerm.trim() === '') {
      return await ctx.db.query('spells').withIndex('by_name').collect()
    }

    // Get all spells and filter in memory for case-insensitive matching
    // Note: Convex doesn't support toLowerCase() in filters, so we do it client-side
    const searchTermLower = args.searchTerm.toLowerCase()
    const allSpells = await ctx.db
      .query('spells')
      .withIndex('by_name')
      .collect()

    // Filter for case-insensitive partial match on name
    const filteredSpells = allSpells.filter((spell) =>
      spell.name.toLowerCase().includes(searchTermLower),
    )

    return filteredSpells
  },
})
