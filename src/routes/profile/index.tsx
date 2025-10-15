import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from 'convex/_generated/api'
import { SignIn } from '~/components/SignIn'
import { SignOut } from '~/components/SignOut'
import { Authenticated, Unauthenticated } from 'convex/react'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: profile } = useSuspenseQuery(
    convexQuery(api.userProfiles.getCurrentUserProfile, {}),
  )
  console.log('user', profile)
  return (
    <>
      <Unauthenticated>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <p className="text-gray-600">Please sign in to view your profile.</p>
          <SignIn />
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              {profile?.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-2xl font-semibold">
                  {profile?.displayName}
                </h2>
                <p className="text-gray-500">User ID: {profile?.userId}</p>
              </div>
            </div>
          </div>
          <SignOut />
        </div>
      </Authenticated>
    </>
  )
}
