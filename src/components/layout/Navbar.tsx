import { NavbarLogo } from './NavbarLogo'
import { NavbarLinks } from './NavbarLinks'
import { UserProfileMenu } from './UserProfileMenu'
import { MobileMenu } from './MobileMenu'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <NavbarLogo />
          </div>

          {/* Center/Left: Navigation Links (Desktop) */}
          <div className="hidden md:flex md:flex-1 md:justify-center md:ml-8">
            <NavbarLinks />
          </div>
          <div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
          {/* Right: User Profile Menu (Desktop) */}
          <div className="hidden md:flex md:items-center">
            <UserProfileMenu />
          </div>

          {/* Mobile: Hamburger Menu */}
          <div className="flex md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
