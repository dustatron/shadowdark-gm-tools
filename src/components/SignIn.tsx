import { useAuthActions } from '@convex-dev/auth/react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { LogIn } from 'lucide-react'

export function SignIn() {
  const { signIn } = useAuthActions()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="default">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => void signIn('discord')}
        >
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 bg-[#5865F2] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            Sign in with Discord
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => void signIn('google')}
        >
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 bg-[#4285F4] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            Sign in with Google
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
