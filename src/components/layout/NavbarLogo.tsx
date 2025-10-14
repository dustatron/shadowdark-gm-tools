import { Link } from '@tanstack/react-router'

export function NavbarLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      {/* Optional: Add icon/logo image here */}
      <span>Shadowdark GM Tools</span>
    </Link>
  )
}
