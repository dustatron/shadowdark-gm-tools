import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Authenticated, Unauthenticated } from 'convex/react'
import { LogOut, User, Heart } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { SignIn } from '~/components/SignIn'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from 'convex/_generated/api'

function AuthenticatedMenu() {
  const { signOut } = useAuthActions()
  const { data: profile } = useSuspenseQuery(
    convexQuery(api.userProfiles.getCurrentUserProfile, {}),
  )

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const displayName = profile?.displayName || 'User'
  const avatarUrl = profile?.avatarUrl

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 h-auto"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className="cursor-pointer flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/favorites"
            className="cursor-pointer flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void signOut()}
          className="cursor-pointer flex items-center gap-2 text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserProfileMenu() {
  return (
    <>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedMenu />
      </Authenticated>
    </>
  )
}
