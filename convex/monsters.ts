import { query } from './_generated/server'
import { v } from 'convex/values'

/**
 * List all monsters sorted alphabetically by name
 */
export const listMonsters = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('monsters'),
      _creationTime: v.number(),
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
  handler: async (ctx) => {
    // Use the by_name index for efficient sorted retrieval
    const monsters = await ctx.db
      .query('monsters')
      .withIndex('by_name')
      .collect()

    return monsters
  },
})

/**
 * Search monsters by name with case-insensitive partial matching
 * If no searchTerm is provided, returns all monsters
 */
export const searchMonsters = query({
  args: {
    searchTerm: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id('monsters'),
      _creationTime: v.number(),
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
  handler: async (ctx, args) => {
    // If no search term, return all monsters sorted by name
    if (!args.searchTerm || args.searchTerm.trim() === '') {
      return await ctx.db.query('monsters').withIndex('by_name').collect()
    }

    // Get all monsters and filter in memory for case-insensitive matching
    // Note: Convex doesn't support toLowerCase() in filters, so we do it client-side
    const searchTermLower = args.searchTerm.toLowerCase()
    const allMonsters = await ctx.db
      .query('monsters')
      .withIndex('by_name')
      .collect()

    // Filter for case-insensitive partial match on name
    const filteredMonsters = allMonsters.filter((monster) =>
      monster.name.toLowerCase().includes(searchTermLower),
    )

    return filteredMonsters
  },
})
