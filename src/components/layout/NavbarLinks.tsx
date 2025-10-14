import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '~/lib/utils'
import { Button } from '../ui/button'

interface NavLink {
  to: string
  label: string
}

const navLinks: NavLink[] = [
  { to: '/monsters', label: 'Monsters' },
  { to: '/spells', label: 'Spells' },
  { to: '/about', label: 'About' },
]

interface NavbarLinksProps {
  isMobile?: boolean
  onLinkClick?: () => void
}

export function NavbarLinks({
  isMobile = false,
  onLinkClick,
}: NavbarLinksProps) {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <nav
      className={cn(
        isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-2',
      )}
    >
      {navLinks.map((link) => {
        const isActive = currentPath.startsWith(link.to)

        return (
          <Button variant={isActive ? 'ghost' : 'outline'}>
            <Link
              key={link.to}
              to={link.to}
              onClick={onLinkClick}
              className={cn(
                'font-medium transition-colors',
                isMobile ? 'text-lg py-2' : 'text-lg',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
