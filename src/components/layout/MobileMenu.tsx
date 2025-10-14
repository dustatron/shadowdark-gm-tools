import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Authenticated, Unauthenticated } from 'convex/react'
import { LogOut, Heart, Menu } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { NavbarLinks } from './NavbarLinks'
import { SignIn } from '~/components/SignIn'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from 'convex/_generated/api'

// Helper to get initials from a name
const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function AuthenticatedMobileMenu({ onLinkClick }: { onLinkClick: () => void }) {
  const { signOut } = useAuthActions()
  const { data: profile } = useSuspenseQuery(
    convexQuery(api.userProfiles.getCurrentUserProfile, {}),
  )

  const handleSignOut = () => {
    onLinkClick()
    void signOut()
  }

  const displayName = profile?.displayName || 'User'
  const avatarUrl = profile?.avatarUrl

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/profile"
        onClick={onLinkClick}
        className="flex items-center gap-4"
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-lg">{displayName}</span>
          {profile?.email && (
            <span className="text-sm text-muted-foreground">
              {profile.email}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-col gap-2 text-lg">
        <Link
          to="/favorites"
          onClick={onLinkClick}
          className="flex items-center gap-3 py-2 rounded-md hover:bg-muted"
        >
          <Heart className="h-5 w-5" />
          <span>Favorites</span>
        </Link>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center justify-start gap-3 py-2 text-lg text-destructive hover:text-destructive h-auto p-0"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}

function MobileUserSection({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedMobileMenu onLinkClick={onLinkClick} />
      </Authenticated>
    </>
  )
}

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="mt-6 ml-2">
          <NavbarLinks isMobile onLinkClick={() => setOpen(false)} />
        </div>
        <div className="mt-auto pt-6 border-t">
          <MobileUserSection onLinkClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
