import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'

// Get the current authenticated user's profile
export const getCurrentUserProfile = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('userProfiles'),
      _creationTime: v.number(),
      userId: v.id('users'),
      displayName: v.string(),
      avatarUrl: v.optional(v.string()),
      email: v.optional(v.string()),
      favoriteTablesPreferences: v.optional(v.any()),
      themePreference: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    const userId = identity.subject as Id<'users'>
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()

    if (profile) {
      return {
        ...profile,
        email: identity.email,
      }
    }
    return null
  },
})

// Create or update user profile (called after first sign-in)
export const upsertUserProfile = mutation({
  args: {
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  returns: v.id('userProfiles'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Must be authenticated')
    }

    const userId = identity.subject as Id<'users'>
    const existingProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
      })
      return existingProfile._id
    } else {
      // Create new profile
      const profileId = await ctx.db.insert('userProfiles', {
        userId: userId,
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
      })
      return profileId
    }
  },
})

// Update user preferences
export const updateUserPreferences = mutation({
  args: {
    favoriteTablesPreferences: v.optional(v.any()),
    themePreference: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Must be authenticated')
    }

    const userId = identity.subject as Id<'users'>
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()

    if (!profile) {
      throw new Error('User profile not found')
    }

    await ctx.db.patch(profile._id, {
      favoriteTablesPreferences: args.favoriteTablesPreferences,
      themePreference: args.themePreference,
    })

    return null
  },
})

// Get current authenticated user ID (helper)
export const getCurrentUserId = query({
  args: {},
  returns: v.union(v.id('users'), v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    return identity.subject as Id<'users'>
  },
})
