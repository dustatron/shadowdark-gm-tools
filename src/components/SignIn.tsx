import { useAuthActions } from '@convex-dev/auth/react'

export function SignIn() {
  const { signIn } = useAuthActions()

  return (
    <button
      onClick={() => void signIn('discord')}
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
    >
      Sign in with Discord
    </button>
  )
}
