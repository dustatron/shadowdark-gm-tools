import { convexAuth } from '@convex-dev/auth/server'
import Discord from '@auth/core/providers/discord'
import Google from '@auth/core/providers/google'
import type { DataModel } from './_generated/dataModel'

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Discord, Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      // Check if user already has a profile
      const existingProfile = await (ctx.db as any)
        .query('userProfiles')
        .withIndex('by_userId', (q: any) => q.eq('userId', args.userId))
        .first()

      // Skip if profile already exists
      if (existingProfile) {
        return
      }

      // Get profile data from OAuth provider
      const displayName = (args.profile.name as string) || 'User'
      const avatarUrl = args.profile.image as string | undefined

      // Create user profile
      await (ctx.db as any).insert('userProfiles', {
        userId: args.userId,
        displayName,
        avatarUrl,
      })
    },
  },
})
