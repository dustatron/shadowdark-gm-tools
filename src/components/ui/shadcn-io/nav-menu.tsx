import { Link } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../navigation-menu'
import type { ComponentProps } from 'react'

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/">Home</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/monsters">monsters</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/spells">Spells</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/about">About</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
)
