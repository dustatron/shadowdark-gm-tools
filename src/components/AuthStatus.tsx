import { Authenticated, Unauthenticated } from 'convex/react'
import { SignIn } from './SignIn'
import { SignOut } from './SignOut'

export function AuthStatus() {
  return (
    <>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">You are signed in</p>
          <SignOut />
        </div>
      </Authenticated>
    </>
  )
}
