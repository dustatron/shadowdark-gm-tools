import { Link } from '@tanstack/react-router'

export function NavbarLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-muted-foreground transition-colors"
    >
      {/* Optional: Add icon/logo image here */}
      <span>Shadowdark GM Tools</span>
    </Link>
  )
}
