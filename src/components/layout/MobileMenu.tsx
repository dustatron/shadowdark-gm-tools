import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { NavbarLinks } from './NavbarLinks'
import { UserProfileMenu } from './UserProfileMenu'

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
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-8 mt-8">
          <NavbarLinks isMobile onLinkClick={() => setOpen(false)} />
          <div className="pt-4 border-t">
            <UserProfileMenu />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
