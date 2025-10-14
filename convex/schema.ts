import { defineSchema, defineTable } from 'convex/server'
import { authTables } from '@convex-dev/auth/server'
import { v } from 'convex/values'

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  userProfiles: defineTable({
    userId: v.id('users'),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    favoriteTablesPreferences: v.optional(v.any()), // Will store an object/array of preferences
    themePreference: v.optional(v.string()),
  }).index('by_userId', ['userId']),
  monsters: defineTable({
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
  })
    .index('by_name', ['name'])
    .index('by_level', ['level'])
    .index('by_slug', ['slug']),
  spells: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    classes: v.array(v.string()),
    duration: v.string(),
    range: v.string(),
    tier: v.string(),
  })
    .index('by_name', ['name'])
    .index('by_tier', ['tier'])
    .index('by_slug', ['slug']),
})
