import { useAuthActions } from '@convex-dev/auth/react'

export function SignOut() {
  const { signOut } = useAuthActions()

  return (
    <button
      onClick={() => void signOut()}
      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
    >
      Sign out
    </button>
  )
}
