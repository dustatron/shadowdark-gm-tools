import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '~/lib/utils'

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
        isMobile ? 'flex flex-col gap-4' : 'flex items-center gap-6',
      )}
    >
      {navLinks.map((link) => {
        const isActive = currentPath.startsWith(link.to)

        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={onLinkClick}
            className={cn(
              'font-medium transition-colors',
              isMobile ? 'text-lg py-2' : 'text-sm',
              isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900',
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
